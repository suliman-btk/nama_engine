import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../components/theme";

/**
 * The chrome every slide shares: background, a slow light wash so flat colour never sits
 * dead, the top-left kicker, the ACT mark, the lesson label and the gold baseline.
 *
 * This is the piece the first pass was missing entirely. Graphics used to be floating
 * panels over the footage, which is why long stretches had nothing to look at but the
 * presenter's face — there was no *slide* to be on. Now a beat either has a slide (with the
 * presenter down in the corner on top of it) or it is a full-bleed presenter moment, and
 * the lesson spends most of its time in the former.
 *
 * Layout rule: content lives in the left ~62% of frame. The presenter's corner card sits
 * bottom-right, so anything wider than that collides with it.
 */

export const PRESENTER_SAFE_RIGHT = "38%";

/** Lesson label shown bottom-left on every slide. Supplied once by the composition rather
 * than repeated in every EDL event's props. */
export const LessonLabelContext = React.createContext<string>("");

/** Set by the composition each frame: true while the presenter sits in the bottom-right
 * corner. Slides inset their content when it is on. */
export const CornerPresenterContext = React.createContext<boolean>(false);

/** Right inset a slide should use for its content, given the presenter's current state. */
export function useContentRightInset(): string {
  const corner = React.useContext(CornerPresenterContext);
  return corner ? PRESENTER_SAFE_RIGHT : "8%";
}

export function SlideFrame({
  kicker,
  bg,
  light,
  lessonLabel,
  children,
  hideChrome,
}: {
  kicker?: string;
  bg?: string;
  light?: boolean;
  lessonLabel?: string;
  children: React.ReactNode;
  hideChrome?: boolean;
}) {
  const frame = useCurrentFrame();
  const contextLabel = React.useContext(LessonLabelContext);
  const label = lessonLabel ?? contextLabel;
  const background = bg ?? `linear-gradient(155deg, ${theme.colors.mid} 0%, ${theme.colors.deep} 72%)`;

  // slow drifting wash — the reference engine's AmbientWash, same idea
  const wx = 30 + Math.sin(frame / 130) * 18;
  const wy = 24 + Math.cos(frame / 160) * 14;
  const washTint = light ? "40,44,110" : "255,255,255";

  const ink = light ? theme.colors.deep : theme.colors.cream;

  return (
    <AbsoluteFill style={{ background, overflow: "hidden", fontFamily: theme.bodyFamily }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${wx}% ${wy}%, rgba(${washTint},0.075) 0%, rgba(${washTint},0) 58%)`,
        }}
      />

      {children}

      {!hideChrome ? (
        <>
          {kicker ? <Kicker text={kicker} light={light} /> : null}
          <ActMark light={light} />
          {label ? (
            <div
              style={{
                position: "absolute",
                left: 84,
                bottom: 26,
                fontSize: 21,
                letterSpacing: 1,
                color: light ? "rgba(20,20,40,0.45)" : "rgba(250,247,238,0.45)",
              }}
            >
              {label}
            </div>
          ) : null}
          <div
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: theme.colors.gold }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
}

export function Kicker({ text, light }: { text: string; light?: boolean }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const x = interpolate(frame, [0, 14], [-14, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 84,
        opacity: o,
        transform: `translateX(${x}px)`,
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: 4,
        color: light ? theme.colors.mid : theme.colors.gold,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
}

/**
 * The ACT mark, top-right on every slide.
 *
 * The supplied artwork is green-and-navy on a solid white plate. The plate is stripped in
 * `act-logo-trimmed.png`, but the navy half of the mark then disappears against a navy
 * slide, and recolouring the whole thing to cream throws away the brand green. So it sits on
 * a small cream chip instead: the mark keeps its own colours, and the chip reads as
 * deliberate on both the navy slides and the gold panel.
 */
export function ActMark({ size = 186 }: { light?: boolean; size?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 38,
        right: 66,
        width: size,
        padding: "12px 16px",
        borderRadius: 12,
        background: theme.colors.cream,
        boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
      }}
    >
      <Img src={staticFile("brand/act-logo-trimmed.png")} style={{ width: "100%", display: "block" }} />
    </div>
  );
}

/** Shared content column. Keeps every slide's text on the same left margin and clear of the
 * presenter's corner. */
export function SlideBody({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "top";
}) {
  const rightInset = useContentRightInset();
  return (
    <div
      style={{
        position: "absolute",
        left: 84,
        right: rightInset,
        top: 132,
        bottom: 116,
        display: "flex",
        flexDirection: "column",
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      {children}
    </div>
  );
}

/** Entrance helper: fade + rise, clamped so it holds once it has landed. */
export function fadeUp(frame: number, delay = 0, dur = 12) {
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - p, 3);
  return { opacity: eased, transform: `translateY(${(1 - eased) * 22}px)` };
}
