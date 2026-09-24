import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Edl, TransitionPreset } from "../edl/schema";
import { useTheme } from "../course/CourseContext";

/**
 * Draws the transition that sits ON a cut. This is the layer the first pass was missing:
 * `transitionIn`/`transitionOut` were in the EDL schema and the preset library existed, but
 * nothing ever rendered them, so every scene change was a raw jump.
 *
 * Two things get covered here:
 *
 * 1. **Scene boundaries** — where the presenter layout changes and, more importantly, where
 *    the avatar tool generated a NEW clip. Those clips are generated per scene, so the
 *    presenter's pose, energy and micro-framing don't carry across the seam (the project's
 *    own script rules call this out: generation "does not preserve speech pacing/rhythm
 *    across scene boundaries"). A transition centred on the seam is what makes that read as
 *    an edit instead of a glitch.
 *
 * 2. **Hard cuts detected in the source itself** (`sourceCutSeconds`) — found by running
 *    ffmpeg scene detection over the footage. Those are real picture jumps that may not line
 *    up with any narration boundary, and they need covering regardless of what the EDL says.
 *
 * Each transition is centred on its cut: half of it plays before, half after, so the seam
 * lands under the busiest part of the effect.
 */
export function SceneTransitionLayer({ edl }: { edl: Edl }) {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cuts: { at: number; preset: TransitionPreset; key: string }[] = [];

  // Scene changes are NOT handled here any more. They are motion applied to the slide
  // itself (see transitions/SlideTransition.tsx) — drawing a veil over the frame for every
  // scene change is what made the first cut feel like it blacked out on every edit.
  //
  // What is left is the one case a veil genuinely suits: a hard cut inside the SOURCE
  // footage, where the presenter's pose jumps mid-sentence and there is nothing to move,
  // only something to hide.
  (edl.sourceCutSeconds ?? []).forEach((at, i) => {
    cuts.push({ at, preset: "dip-to-brand", key: `source-cut-${i}` });
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {cuts.map((cut) => (
        <Transition key={cut.key} preset={cut.preset} atFrame={cut.at * fps} frame={frame} fps={fps} />
      ))}
    </AbsoluteFill>
  );
}

const DURATIONS: Record<TransitionPreset, number> = {
  "clean-cut": 0,
  crossfade: 0.5,
  "soft-push-left": 0.62,
  "soft-push-right": 0.62,
  "scale-through": 0.55,
  "mask-wipe": 0.7,
  "dip-to-brand": 0.42,
  "section-reveal": 0.95,
};

function Transition({
  preset,
  atFrame,
  frame,
  fps,
}: {
  preset: TransitionPreset;
  atFrame: number;
  frame: number;
  fps: number;
}) {
  const theme = useTheme();
  const durationFrames = DURATIONS[preset] * fps;
  if (durationFrames <= 0) return null;

  const start = atFrame - durationFrames / 2;
  const local = frame - start;
  if (local < 0 || local > durationFrames) return null;

  const p = local / durationFrames; // 0..1 across the whole transition
  // 0 -> 1 -> 0: how "covered" the frame is at this instant, peaking exactly on the cut.
  const cover = Math.sin(p * Math.PI);
  const eased = cover * cover * (3 - 2 * cover);

  switch (preset) {
    case "crossfade":
      return <Veil opacity={eased * 0.92} color={theme.colors.deep} />;

    case "dip-to-brand":
      return (
        <>
          {/* partial, not opaque: enough to disguise the pose jump, not enough to read as
              the video cutting out */}
          <Veil opacity={eased * 0.82} color={theme.colors.deep} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 3,
              transform: `translateY(-50%) scaleX(${eased})`,
              background: `linear-gradient(90deg, rgba(207,173,58,0) 0%, ${theme.colors.gold} 50%, rgba(207,173,58,0) 100%)`,
              opacity: eased,
            }}
          />
        </>
      );

    case "soft-push-left":
    case "soft-push-right": {
      const dir = preset === "soft-push-left" ? -1 : 1;
      // A brand panel sweeps across the frame and continues off the far side.
      const x = interpolateLinear(p, -100 * dir, 100 * dir);
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${x}%)`,
            background: `linear-gradient(${dir > 0 ? 90 : 270}deg, ${theme.colors.deep} 0%, ${theme.colors.navy} 55%, ${theme.colors.mid} 100%)`,
            boxShadow: `0 0 90px rgba(0,0,0,0.6)`,
            borderLeft: `4px solid ${theme.colors.gold}`,
            borderRight: `4px solid ${theme.colors.gold}`,
          }}
        />
      );
    }

    case "scale-through":
      return (
        <AbsoluteFill
          style={{
            background: theme.colors.deep,
            opacity: eased * 0.95,
            transform: `scale(${1 + eased * 0.06})`,
          }}
        />
      );

    case "mask-wipe": {
      // A gold-edged wipe travelling left to right, revealing the new shot behind it.
      const edge = p * 130 - 15;
      return (
        <AbsoluteFill
          style={{
            background: `linear-gradient(100deg,
              rgba(18,20,47,0) ${edge - 16}%,
              ${theme.colors.deep} ${edge - 8}%,
              ${theme.colors.deep} ${edge}%,
              ${theme.colors.gold} ${edge + 0.7}%,
              rgba(18,20,47,0) ${edge + 2}%)`,
          }}
        />
      );
    }

    case "section-reveal": {
      // Two bands close over the seam and reopen — the strongest move in the set, so it is
      // reserved for section changes and the lesson close (rule 11).
      const closed = eased;
      return (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: `${closed * 50}%`,
              background: `linear-gradient(180deg, ${theme.colors.deep} 0%, ${theme.colors.navy} 100%)`,
              borderBottom: `3px solid ${theme.colors.gold}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: `${closed * 50}%`,
              background: `linear-gradient(0deg, ${theme.colors.deep} 0%, ${theme.colors.navy} 100%)`,
              borderTop: `3px solid ${theme.colors.gold}`,
            }}
          />
        </>
      );
    }

    default:
      return <Veil opacity={eased * 0.9} color={theme.colors.deep} />;
  }
}

function Veil({ opacity, color }: { opacity: number; color: string }) {
  return <AbsoluteFill style={{ background: color, opacity }} />;
}

function interpolateLinear(p: number, from: number, to: number): number {
  return from + (to - from) * p;
}
