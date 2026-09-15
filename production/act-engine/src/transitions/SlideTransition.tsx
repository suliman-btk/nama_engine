import React from "react";
import { AbsoluteFill, useVideoConfig, useCurrentFrame } from "remotion";
import type { TransitionPreset } from "../edl/schema";
import { theme } from "../components/theme";

/**
 * How a slide ENTERS and LEAVES the frame.
 *
 * The first version of this engine did transitions as an opaque veil drawn over everything:
 * the frame dipped to near-black at the midpoint of every cut, held, and came back. Watched
 * frame by frame it was obvious why that felt bolted on — nothing was moving, the picture
 * was just being hidden, and every transition looked like the same blackout regardless of
 * which preset was named.
 *
 * So transitions now move the CONTENT. The outgoing slide leaves in the direction the
 * incoming one arrives from, the presenter stays visible throughout, and the frame is never
 * blanked. Each preset has its own geometry, so a section change genuinely doesn't look like
 * an ordinary cut.
 */
export function SlideTransition({
  preset,
  outPreset,
  startFrame,
  durationInFrames,
  children,
}: {
  preset: TransitionPreset;
  outPreset?: TransitionPreset;
  startFrame: number;
  durationInFrames: number;
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inFrames = Math.round(fps * (preset === "section-reveal" ? 0.62 : 0.48));
  // The exit is now LONGER than it was, and eased-in rather than linear-out. Watched frame
  // by frame, the old 0.34s exit made the outgoing slide sit perfectly still and then snap
  // into motion — the transition looked like it started late and abruptly, because there was
  // no anticipation: the first thing the eye saw was already the fastest part of the move.
  // A longer window with an accelerating curve means it begins as an almost imperceptible
  // drift and builds, so the cut feels led-into rather than sprung.
  const outFrames = Math.round(fps * 0.6);

  const local = frame - startFrame;
  const toEnd = startFrame + durationInFrames - frame;

  let style: React.CSSProperties = {};
  let accent: React.ReactNode = null;

  if (local < inFrames) {
    // easeInOut on the way in as well. An ease-OUT curve is fastest in its opening frames,
    // which for a transition centred on a cut means the incoming slide bursts exactly at the
    // seam — the frame that already carries the outgoing slide's disappearance. Spreading the
    // entry evenly is what finally flattens the spike at the join.
    const p = easeInOut(clamp01(local / inFrames));
    style = enterStyle(preset, p);
    accent = enterAccent(preset, p);
  } else if (toEnd < outFrames) {
    const p = easeInOut(clamp01(1 - toEnd / outFrames));
    style = exitStyle(outPreset ?? preset, p);
  }

  return (
    <AbsoluteFill style={{ ...style, willChange: "transform, opacity" }}>
      {children}
      {accent}
    </AbsoluteFill>
  );
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
// Smoothstep, NOT a cubic ease-in. Measuring frame-to-frame pixel change across a cut showed
// p*p*p pushed almost all of the movement into the final three or four frames: the slide sat
// still, then lurched. Smoothstep spreads the motion evenly across the window, which is what
// makes the exit readable as a move rather than a snap.
const easeInOut = (p: number) => p * p * (3 - 2 * p);

function enterStyle(preset: TransitionPreset, p: number): React.CSSProperties {
  switch (preset) {
    case "soft-push-left":
      // arrives from the right, travelling left
      return { opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 26}%)` };
    case "soft-push-right":
      return { opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -26}%)` };
    case "section-reveal":
      // opens from the centre band outward — the strongest move, reserved for section changes
      return {
        clipPath: `inset(${(1 - p) * 50}% 0% ${(1 - p) * 50}% 0%)`,
        transform: `scale(${0.985 + p * 0.015})`,
      };
    case "mask-wipe":
      return { clipPath: `inset(0% ${(1 - p) * 100}% 0% 0%)` };
    case "scale-through":
      return { opacity: p, transform: `scale(${1.05 - p * 0.05})` };
    case "dip-to-brand":
      return { opacity: p, transform: `translateY(${(1 - p) * -3}%)` };
    case "crossfade":
      return { opacity: p };
    default:
      return { opacity: p };
  }
}

function exitStyle(preset: TransitionPreset, p: number): React.CSSProperties {
  switch (preset) {
    case "soft-push-left":
      return { opacity: 1 - p, transform: `translateX(${p * -22}%)` };
    case "soft-push-right":
      return { opacity: 1 - p, transform: `translateX(${p * 22}%)` };
    case "section-reveal":
      // opacity must reach 0 by p=1: the component unmounts the frame after, and anything
      // still visible at that point vanishes instantly — which measured as the single
      // largest jump in the whole transition.
      return { clipPath: `inset(${p * 50}% 0% ${p * 50}% 0%)`, opacity: 1 - p };
    case "mask-wipe":
      return { clipPath: `inset(0% 0% 0% ${p * 100}%)`, opacity: 1 - p * p };
    case "scale-through":
      return { opacity: 1 - p, transform: `scale(${1 + p * 0.04})` };
    default:
      return { opacity: 1 - p };
  }
}

/** A single travelling gold edge on the moves that have a direction. It rides with the slide
 * rather than sitting over the whole frame, which is what stops these reading as a veil. */
function enterAccent(preset: TransitionPreset, p: number): React.ReactNode {
  if (p >= 0.999) return null;

  if (preset === "soft-push-left" || preset === "soft-push-right") {
    const dir = preset === "soft-push-left" ? -1 : 1;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [dir < 0 ? "left" : "right"]: 0,
          width: 5,
          background: `linear-gradient(180deg, ${theme.colors.goldLight}, ${theme.colors.gold})`,
          opacity: 1 - p,
        } as React.CSSProperties}
      />
    );
  }

  if (preset === "section-reveal") {
    // the two edges of the opening band, drawn as gold seams that part
    return (
      <>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(1 - p) * 50}%`,
            height: 3,
            background: theme.colors.gold,
            opacity: 1 - p,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `${(1 - p) * 50}%`,
            height: 3,
            background: theme.colors.gold,
            opacity: 1 - p,
          }}
        />
      </>
    );
  }

  if (preset === "mask-wipe") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${p * 100}%`,
          width: 4,
          background: theme.colors.gold,
          opacity: 1 - p * 0.3,
        }}
      />
    );
  }

  return null;
}
