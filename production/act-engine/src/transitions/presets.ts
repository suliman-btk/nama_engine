import type { CSSProperties } from "react";
import type { TransitionPreset } from "../edl/schema";
import type { Phase } from "../motion/timeline";

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

/** Whole-scene / full-bleed transitions, distinct from per-element motion presets. Used on
 * GraphicFull scenes (section dividers, big statement cards) — rule 11's guidance: mostly
 * clean-cut, transitions reserved for section changes and lesson open/close. */
export function transitionStyle(preset: TransitionPreset, phase: Phase, progress: number): CSSProperties {
  if (preset === "clean-cut") {
    return phase === "before" || phase === "after" ? { opacity: 0 } : { opacity: 1 };
  }
  if (phase === "hold") return { opacity: 1, transform: "none", clipPath: "none" };
  if (phase === "before") return { opacity: 0 };
  if (phase === "after") return { opacity: 0 };

  const entering = phase === "enter";
  const p = easeInOut(entering ? progress : 1 - progress);

  switch (preset) {
    case "crossfade":
      return { opacity: p };
    case "soft-push-left":
      return { opacity: p, transform: `translateX(${(1 - p) * 6}%)` };
    case "soft-push-right":
      return { opacity: p, transform: `translateX(${(1 - p) * -6}%)` };
    case "scale-through":
      return { opacity: p, transform: `scale(${0.94 + p * 0.06})` };
    case "mask-wipe":
      return { opacity: 1, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` };
    case "dip-to-brand":
      // caller composites this over a solid navy card behind the content
      return { opacity: p };
    case "section-reveal":
      return { opacity: p, transform: `translateY(${(1 - p) * 3}%)` };
    default:
      return { opacity: p };
  }
}

/** rule 11's suggested mix, exposed as a helper so the EDL author (Claude) can spot-check
 * a lesson's transition distribution rather than eyeballing it. */
export function summarizeTransitionMix(transitions: TransitionPreset[]): Record<TransitionPreset, number> {
  const counts = Object.fromEntries(
    ["clean-cut", "crossfade", "soft-push-left", "soft-push-right", "scale-through", "mask-wipe", "dip-to-brand", "section-reveal"].map(
      (k) => [k, 0]
    )
  ) as Record<TransitionPreset, number>;
  for (const t of transitions) counts[t]++;
  return counts;
}
