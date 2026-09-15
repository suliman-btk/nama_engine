import type { PresenterLayout } from "../edl/schema";

/**
 * Where the presenter sits, in percent-of-frame units.
 *
 * The rule that matters here, learned the hard way on the first lesson-1 pass: the source
 * is a full 1920x1080 shot of a real room, so ANY layout that puts the video in a box
 * smaller than the frame must have something deliberate filling the rest — otherwise the
 * viewer just sees the shot shrink and the room get replaced by a void. So:
 *
 *  - PresenterFull / Medium / Close are all FULL BLEED. "Medium" and "close" are camera
 *    distance, expressed as a punch-in on the same shot (rule 3's camera vocabulary), never
 *    as a smaller picture. Nothing is cropped away except by the zoom itself.
 *  - Left / Right fill their half completely and hand the other half to a content panel.
 *  - Corner / PiP are the only true "small presenter" states, and they are only legal while
 *    a graphic is on screen (enforced in enforceLayoutRules()).
 *
 * `stageIntensity` says how much of the blurred-footage stage shows behind: 0 while the
 * presenter covers the frame, up to 1 once it has moved aside.
 */
export type LayoutBox = {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  /** Zoom applied to the video inside its box. 1 = the shot as delivered. */
  objectScale: number;
  /** Vertical framing bias while zoomed, so a punch-in stays on the face, not the chest. */
  objectPosY: number;
  hidden: boolean;
  radiusPx: number;
  shadow: boolean;
  stageIntensity: number;
  fullBleed: boolean;
  /** Softens the inner edge of a split layout so the video blends into the stage instead of
   * ending on a hard vertical line. 0 = hard edge (correct for full bleed and for corner
   * cards, which want a crisp rounded frame). */
  featherLeft: number;
  featherRight: number;
};

const fullBleed = {
  xPct: 0,
  yPct: 0,
  wPct: 100,
  hPct: 100,
  objectPosY: 50,
  hidden: false,
  radiusPx: 0,
  shadow: false,
  stageIntensity: 0,
  fullBleed: true,
  featherLeft: 0,
  featherRight: 0,
};

export const LAYOUTS: Record<PresenterLayout, LayoutBox> = {
  // --- full-bleed family: the default state of the video, and where it spends most of its time
  PresenterFull: { ...fullBleed, objectScale: 1 },
  PresenterMedium: { ...fullBleed, objectScale: 1.14, objectPosY: 42 },
  PresenterClose: { ...fullBleed, objectScale: 1.4, objectPosY: 34 },

  // --- split family: video fills its half edge-to-edge, content panel takes the other half
  PresenterLeft: {
    ...fullBleed,
    wPct: 52,
    objectScale: 1.22,
    objectPosY: 42,
    stageIntensity: 1,
    fullBleed: false,
    featherRight: 1,
  },
  PresenterRight: {
    ...fullBleed,
    xPct: 48,
    wPct: 52,
    objectScale: 1.22,
    objectPosY: 42,
    stageIntensity: 1,
    fullBleed: false,
    featherLeft: 1,
  },

  // --- corner family: only legal with a graphic on screen
  PresenterCornerLeft: {
    xPct: 4,
    yPct: 52,
    wPct: 28,
    hPct: 43,
    objectScale: 1.15,
    objectPosY: 38,
    hidden: false,
    radiusPx: 20,
    shadow: true,
    stageIntensity: 1,
    fullBleed: false,
    featherLeft: 0,
    featherRight: 0,
  },
  PresenterCornerRight: {
    xPct: 68,
    yPct: 52,
    wPct: 28,
    hPct: 43,
    objectScale: 1.15,
    objectPosY: 38,
    hidden: false,
    radiusPx: 20,
    shadow: true,
    stageIntensity: 1,
    fullBleed: false,
    featherLeft: 0,
    featherRight: 0,
  },
  PresenterPictureInPicture: {
    xPct: 74,
    yPct: 64,
    wPct: 21,
    hPct: 31,
    objectScale: 1.12,
    objectPosY: 36,
    hidden: false,
    radiusPx: 16,
    shadow: true,
    stageIntensity: 1,
    fullBleed: false,
    featherLeft: 0,
    featherRight: 0,
  },
  WorksheetFocus: {
    xPct: 4.5,
    yPct: 58,
    wPct: 23,
    hPct: 36,
    objectScale: 1.12,
    objectPosY: 36,
    hidden: false,
    radiusPx: 18,
    shadow: true,
    stageIntensity: 1,
    fullBleed: false,
    featherLeft: 0,
    featherRight: 0,
  },

  // --- presenter off screen: the graphic owns the frame
  PresenterHidden: { ...fullBleed, objectScale: 1, hidden: true, stageIntensity: 1, fullBleed: false },
  GraphicFull: { ...fullBleed, objectScale: 1, hidden: true, stageIntensity: 1, fullBleed: false },
  KeyStatementFocus: { ...fullBleed, objectScale: 1, hidden: true, stageIntensity: 1, fullBleed: false },
};

/** Layouts that leave the frame with no presenter and no obvious subject. Only valid while
 * a graphic is actually on screen — see enforceLayoutRules(). */
export const REQUIRES_GRAPHIC: PresenterLayout[] = [
  "PresenterLeft",
  "PresenterRight",
  "PresenterCornerLeft",
  "PresenterCornerRight",
  "PresenterPictureInPicture",
  "PresenterHidden",
  "GraphicFull",
  "WorksheetFocus",
  "KeyStatementFocus",
];

/**
 * NOTE ON MIRRORING. The layout vocabulary supports a `mirror` flag, inherited from the
 * previous engine where the presenter was an illustrated character and flipping it to face
 * the slide was free. It must NOT be used with real footage:
 *
 *  - it flips the actual room, the window light and anything written behind the presenter;
 *  - and because a horizontal flip cannot be interpolated, it lands as an instant
 *    left-right swap on one frame. Measured against the surrounding frames it was a 6.7x
 *    spike in pixel change — by far the largest discontinuity at any cut in the lesson, and
 *    the thing that kept reading as "the transition is broken".
 *
 * Face direction on real footage is a shooting decision, not an edit one.
 */

/** Which side of frame the presenter occupies, so cards lay out on the opposite side. */
export function presenterSide(layout: PresenterLayout): "left" | "right" | "none" {
  if (layout === "PresenterCornerRight" || layout === "PresenterRight" || layout === "PresenterPictureInPicture") {
    return "right";
  }
  if (layout === "PresenterCornerLeft" || layout === "PresenterLeft" || layout === "WorksheetFocus") {
    return "left";
  }
  return "none";
}
