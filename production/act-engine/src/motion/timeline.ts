/** Every animated element follows ENTER -> HOLD -> (OPTIONAL EMPHASIS) -> EXIT, per rule 12.
 * This is the one place that phase math lives, so every component times consistently. */
export type Phase = "before" | "enter" | "hold" | "exit" | "after";

export function phaseAt(
  localFrame: number,
  totalFrames: number,
  enterFrames: number,
  exitFrames: number
): { phase: Phase; progress: number } {
  if (localFrame < 0) return { phase: "before", progress: 0 };
  if (localFrame < enterFrames) {
    return { phase: "enter", progress: clamp01(localFrame / Math.max(enterFrames, 1)) };
  }
  const exitStart = totalFrames - exitFrames;
  if (localFrame < exitStart) {
    return { phase: "hold", progress: 1 };
  }
  if (localFrame < totalFrames) {
    return { phase: "exit", progress: clamp01((localFrame - exitStart) / Math.max(exitFrames, 1)) };
  }
  return { phase: "after", progress: 1 };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
