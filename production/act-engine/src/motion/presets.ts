import type { CSSProperties } from "react";
import type { MotionPreset } from "../edl/schema";
import type { Phase } from "./timeline";

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInCubic = (p: number) => p * p * p;

/** Turns a motion preset + phase + 0..1 progress into a style patch. `enter` and `exit`
 * are mirror images of each other by default (fade in / fade out, rise in / settle out);
 * presets that only make sense on entry (diagram-build, arrow-draw, stagger-list handled
 * per-item by the component itself) just hold at the resting state on exit unless the
 * component overrides it. Kept intentionally restrained — rule 19 explicitly warns against
 * a "social-media template" feel. */
export function motionStyle(preset: MotionPreset, phase: Phase, progress: number): CSSProperties {
  if (phase === "before") return { opacity: 0 };
  // NB: no `transform` key at all on hold — returning "none" here used to clobber the
  // caller's own positioning transform when the two were composed into one string.
  if (phase === "hold") return { opacity: 1 };
  if (phase === "after") return { opacity: 0 };

  const entering = phase === "enter";
  const p = entering ? easeOutCubic(progress) : 1 - easeInCubic(progress);

  switch (preset) {
    case "fade":
      return { opacity: p };
    case "fade-rise":
      return { opacity: p, transform: `translateY(${(1 - p) * 28}px)` };
    case "fade-scale":
      return { opacity: p, transform: `scale(${0.92 + p * 0.08})` };
    case "slide-left":
      return { opacity: p, transform: `translateX(${(1 - p) * 60}px)` };
    case "slide-right":
      return { opacity: p, transform: `translateX(${(1 - p) * -60}px)` };
    case "highlight-pulse":
      return { opacity: 1, filter: `brightness(${1 + Math.sin(progress * Math.PI) * 0.25})` };
    case "shrink-to-corner":
      return { opacity: p, transform: `scale(${entering ? 0.85 + p * 0.15 : 1})` };
    case "return-to-full":
      return { opacity: p, transform: `scale(${entering ? 1.06 - p * 0.06 : 1})` };
    // Structural presets (diagram-build, arrow-draw, line-draw, word-emphasis,
    // underline-reveal, stagger-list, image-parallax) are driven per-item inside the
    // component that uses them (see components/*.tsx) — at the container level they
    // behave as a plain fade so nothing pops in unanimated before its own reveal starts.
    default:
      return { opacity: p };
  }
}
