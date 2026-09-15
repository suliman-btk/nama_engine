import React, { useMemo } from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { EdlScene } from "../edl/schema";
import { LAYOUTS, type LayoutBox } from "./layoutConfig";
import { Stage } from "./Stage";
import { theme } from "../components/theme";

/**
 * The avatar footage as ONE continuous video layer spanning the whole lesson — never re-cut
 * into per-scene clips — moving between layouts with a spring, per rule 3 ("transitions
 * between these states must feel smooth and intentional").
 *
 * A single <OffthreadVideo> for the entire composition, transformed with CSS rather than
 * re-encoded per scene, is a deliberate departure from the old ffmpeg zoompan+overlay
 * pipeline (see video-editing-engine-spec.md "A/V drift"): there is no second pass, no
 * frame-rate reconciliation and no dropped frames to audit, so picture cannot drift from
 * audio.
 *
 * Behind it sits the <Stage> — the blurred, brand-washed copy of the same footage that
 * fills whatever the presenter vacates, so the frame is never empty black.
 */
export function PresenterLayer({
  scenes,
  videoSrc,
  sourceCutSeconds = [],
}: {
  scenes: EdlScene[]; // resolved (atSeconds) start/end + avatar.layout
  videoSrc: string;
  /** Hard cuts inside the footage itself, where the presenter's pose jumps mid-sentence. */
  sourceCutSeconds?: number[];
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const box = useCurrentLayoutBox(scenes, t, fps);
  const transitionMotion = usePresenterTransition(scenes, t, fps);
  const sourceWipe = getSourceCutWipe(sourceCutSeconds, t, fps);
  const outgoingBox = useCurrentLayoutBox(
    scenes,
    sourceWipe ? Math.max(0, sourceWipe.cut - 1 / fps) : t,
    fps,
  );

  return (
    <AbsoluteFill>

      {/* Outer wrapper carries the transition move, inner carries the layout box — kept
          apart so the two transforms compose instead of overwriting each other. */}
      <AbsoluteFill style={{ ...transitionMotion, willChange: "transform, opacity" }}>
        <PresenterVideoBox box={box} videoSrc={videoSrc} />
      </AbsoluteFill>

      {sourceWipe ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            maskImage: sourceWipe.mask,
            WebkitMaskImage: sourceWipe.mask,
          }}
        >
          <Freeze frame={sourceWipe.outgoingFrame}>
            <PresenterVideoBox box={outgoingBox} videoSrc={videoSrc} />
          </Freeze>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}

function PresenterVideoBox({ box, videoSrc }: { box: AnimatedBox; videoSrc: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${box.xPct}%`,
        top: `${box.yPct}%`,
        width: `${box.wPct}%`,
        height: `${box.hPct}%`,
        borderRadius: box.radiusPx,
        overflow: "hidden",
        boxShadow: box.shadow ? "0 26px 70px rgba(0,0,0,0.55)" : undefined,
        outline: box.radiusPx > 0 ? `2px solid ${theme.colors.panelEdge}` : undefined,
        outlineOffset: -2,
        transform: box.mirror ? "scaleX(-1)" : undefined,
        opacity: box.opacity,
        ...featherMask(box),
      }}
    >
      <OffthreadVideo
        src={videoSrc}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${box.objectPosY}%`,
          transform: `scale(${box.objectScale})`,
        }}
      />
    </div>
  );
}

/** The stage renders BELOW the slides, the presenter ABOVE them — so a corner presenter sits
 * on top of a full-frame slide, which is the look this course uses for most of its runtime.
 * They share one layout calculation, hence two exports rather than one component. */
/** True while the presenter occupies the bottom-right corner, so slides can inset their
 * content out of its way. Published rather than assumed: a slide has no other way to know
 * what the presenter is doing on the frame above it, and guessing is what put a headline
 * underneath the avatar. */
export function usePresenterContentEdges(scenes: EdlScene[]): {
  left: string;
  right: string;
  side: "left" | "right" | "none";
} {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = scenes[findSceneIndex(scenes, frame / fps)];
  // Deliberately the scene's TARGET layout, not the animated box.
  //
  // This used to follow the presenter frame by frame so the column "narrowed with him". That
  // was wrong: the column width is what the text lays out into, so animating it re-wrapped the
  // paragraph on every frame and words visibly hopped between lines for the whole 0.85s move.
  // Text needs one fixed box per scene; the presenter animates over it, not against it.
  const target = LAYOUTS[scene.avatar.layout];
  const MARGIN = "4.4%";
  const GUTTER = 4;

  if (target.hidden || target.wPct >= 99) {
    return { left: MARGIN, right: "8%", side: "none" };
  }
  const clamp = (v: number) => Math.min(72, Math.max(4.4, Math.round(v)));
  const centre = target.xPct + target.wPct / 2;
  if (centre > 50) {
    return { left: MARGIN, right: `${clamp(100 - target.xPct + GUTTER)}%`, side: "right" };
  }
  return { left: `${clamp(target.xPct + target.wPct + GUTTER)}%`, right: "8%", side: "left" };
}

/** True while the presenter is small enough that a full-width graphic would collide with it.
 * Used by the layout rules to reject text components that ignore the safe area. */
export function presenterCoversFrame(layoutWPct: number): boolean {
  return layoutWPct >= 99;
}

export function StageLayer({
  scenes,
  videoSrc,
  coveredBySlide,
}: {
  scenes: EdlScene[];
  videoSrc: string;
  /** True while an opaque full-frame slide is covering the stage completely. */
  coveredBySlide?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useCurrentLayoutBox(scenes, frame / fps, fps);
  // Now that slides are opaque and full-frame, the stage is invisible for most of the lesson
  // — but it would still decode and blur a second copy of the 1080p video on every one of
  // those frames. Skipping it while it is covered is the single biggest saving in the render.
  const intensity = coveredBySlide ? 0 : box.stageIntensity;
  return <Stage videoSrc={videoSrc} intensity={intensity} />;
}

/**
 * The presenter's share of the transition.
 *
 * A transition that moves only the slide reads as two unrelated things happening: the
 * graphic changes, the avatar sits there untouched. So the presenter card takes the same
 * move as the slide it sits on — travelling with a push, opening with a section-reveal,
 * settling with a dip.
 *
 * Deliberately smaller in amplitude than the slide's move, and never fading below a floor:
 * the presenter is continuous footage of a person talking, and dropping it out entirely is
 * how the old veil-based transitions ended up blanking the frame. It should feel like the
 * whole composition re-seats, not like the presenter disappears and comes back.
 */
function usePresenterTransition(scenes: EdlScene[], t: number, fps: number): React.CSSProperties {
  const idx = findSceneIndex(scenes, t);
  const scene = scenes[idx];
  if (idx === 0) return {};

  const preset = scene.transitionIn;
  if (preset === "clean-cut") return {};

  const durations: Record<string, number> = {
    "section-reveal": 0.62,
    "soft-push-left": 0.48,
    "soft-push-right": 0.48,
    crossfade: 0.42,
    "dip-to-brand": 0.42,
    "scale-through": 0.45,
    "mask-wipe": 0.55,
  };
  const dur = durations[preset] ?? 0.45;

  // Starts fractionally before the cut, matching the slide's lead-in, so the presenter is
  // already moving when the new slide arrives rather than reacting to it.
  const lead = 0.36;
  const since = t - (scene.start.atSeconds ?? 0) + lead;
  if (since < 0 || since > dur + lead) return {};

  const p = 1 - Math.pow(1 - Math.min(1, Math.max(0, since / (dur + lead))), 3);
  const fade = 0.4 + p * 0.6; // never below 0.4 — the presenter stays legible throughout

  switch (preset) {
    // Amplitude is a share of the FULL FRAME width, not of the panel, so it briefly pulls the
    // presenter off its screen edge and opens a gap onto the stage behind. At 14% that gap read
    // as the presenter floating mid-frame - the exact thing the client objected to - so the
    // push is now half that: still a move, no longer a hole.
    case "soft-push-left":
      return { transform: `translateX(${(1 - p) * 7}%)`, opacity: fade };
    case "soft-push-right":
      return { transform: `translateX(${(1 - p) * -7}%)`, opacity: fade };
    case "section-reveal":
      // matches the slide's centre-band open
      return {
        clipPath: `inset(${(1 - p) * 50}% 0% ${(1 - p) * 50}% 0%)`,
        transform: `scale(${0.96 + p * 0.04})`,
      };
    case "mask-wipe":
      return { clipPath: `inset(0% ${(1 - p) * 100}% 0% 0%)` };
    case "scale-through":
      return { transform: `scale(${1.06 - p * 0.06})`, opacity: fade };
    case "dip-to-brand":
      return { transform: `scale(${0.94 + p * 0.06})`, opacity: fade };
    case "crossfade":
      return { opacity: fade };
    default:
      return { opacity: fade };
  }
}

type AnimatedBox = LayoutBox & { opacity: number; mirror: boolean };

/** How long the presenter takes to travel between two layouts. Long enough to read as a
 * move rather than a jump; short enough not to hold up the narration. */
const TRANSITION_SECONDS = 0.85;

function useCurrentLayoutBox(scenes: EdlScene[], t: number, fps: number): AnimatedBox {
  return useMemo(() => {
    const idx = findSceneIndex(scenes, t);
    const scene = scenes[idx];
    const prevScene = idx > 0 ? scenes[idx - 1] : undefined;

    const target = LAYOUTS[scene.avatar.layout];
    const targetMirror = !!scene.avatar.mirror;

    const sceneStart = scene.start.atSeconds ?? 0;
    const timeIntoScene = t - sceneStart;

    if (!prevScene || timeIntoScene > TRANSITION_SECONDS || prevScene.avatar.layout === scene.avatar.layout) {
      return { ...target, opacity: target.hidden ? 0 : 1, mirror: targetMirror };
    }

    const prev = LAYOUTS[prevScene.avatar.layout];
    const progress = spring({
      frame: Math.round(timeIntoScene * fps),
      fps,
      config: { damping: 200, mass: 0.9 },
      durationInFrames: Math.round(TRANSITION_SECONDS * fps),
    });

    const lerp = (a: number, b: number) => interpolate(progress, [0, 1], [a, b]);

    return {
      xPct: lerp(prev.xPct, target.xPct),
      yPct: lerp(prev.yPct, target.yPct),
      wPct: lerp(prev.wPct, target.wPct),
      hPct: lerp(prev.hPct, target.hPct),
      objectScale: lerp(prev.objectScale, target.objectScale),
      objectPosY: lerp(prev.objectPosY, target.objectPosY),
      radiusPx: lerp(prev.radiusPx, target.radiusPx),
      featherLeft: lerp(prev.featherLeft, target.featherLeft),
      featherRight: lerp(prev.featherRight, target.featherRight),
      stageIntensity: lerp(prev.stageIntensity, target.stageIntensity),
      shadow: target.shadow || prev.shadow,
      opacity: lerp(prev.hidden ? 0 : 1, target.hidden ? 0 : 1),
      hidden: false,
      fullBleed: target.fullBleed && prev.fullBleed,
      mirror: targetMirror,
    };
  }, [scenes, t, fps]);
}

/** A clean post-cut picture wipe. The last outgoing frame covers the new shot, then a soft
 * vertical boundary travels left to right to reveal it. There is no tint, decoration, or
 * double-image blend, and the separately mounted narration audio remains continuous. */
function getSourceCutWipe(
  cuts: number[],
  t: number,
  fps: number,
): { cut: number; outgoingFrame: number; mask: string } | null {
  const DUR = 0.45;
  for (const cut of cuts) {
    const d = t - cut;
    if (d >= 0 && d < DUR) {
      const p = d / DUR;
      const eased = 1 - Math.pow(1 - p, 3);
      const edge = eased * 108 - 4;
      const mask = `linear-gradient(to right, transparent 0%, transparent ${edge - 2}%, rgba(0,0,0,0.45) ${edge}%, black ${edge + 2}%, black 100%)`;
      return { cut, outgoingFrame: Math.max(0, Math.floor(cut * fps) - 1), mask };
    }
  }
  return null;
}

/** Feathers the inner edge of a split layout. Without this the video ends on a hard vertical
 * line against the stage, which reads as a crop rather than a composition. */
function featherMask(box: AnimatedBox): React.CSSProperties {
  const l = box.featherLeft;
  const r = box.featherRight;
  if (l < 0.02 && r < 0.02) return {};
  const stops = [
    l > 0.02 ? `rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${(l * 9).toFixed(2)}%` : "rgba(0,0,0,1) 0%",
    r > 0.02 ? `rgba(0,0,0,1) ${(100 - r * 9).toFixed(2)}%, rgba(0,0,0,0) 100%` : "rgba(0,0,0,1) 100%",
  ].join(", ");
  const mask = `linear-gradient(to right, ${stops})`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

function findSceneIndex(scenes: EdlScene[], t: number): number {
  for (let i = scenes.length - 1; i >= 0; i--) {
    if ((scenes[i].start.atSeconds ?? 0) <= t) return i;
  }
  return 0;
}
