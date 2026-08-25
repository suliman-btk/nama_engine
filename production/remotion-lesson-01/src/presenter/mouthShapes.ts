// Rhubarb Lip Sync's standard 9-shape viseme set (A-H, X).
// Reference: https://github.com/DanielSWolf/rhubarb-lip-sync (mouth shape docs)
// Each path is drawn in a local -22..22 x -14..18 coordinate space, mouth center at origin.
export const MOUTH_SHAPES: Record<string, { path: string; teeth?: string; fill: string }> = {
  // X: idle/silence - closed, relaxed
  X: { path: "M -15 2 Q 0 5 15 2 Q 0 3 -15 2", fill: "#8A4A38" },
  // A: closed for M, B, P
  A: { path: "M -14 3 Q 0 7 14 3 Q 0 1 -14 3", fill: "#8A4A38" },
  // B: slightly open, tense (most consonants, "ee")
  B: { path: "M -15 0 Q 0 6 15 0 Q 0 4 -15 0", teeth: "M -10 1 L 10 1 L 10 3 L -10 3 Z", fill: "#5A231A" },
  // C: open, mid ("eh", "ay")
  C: { path: "M -13 -2 Q 0 10 13 -2 Q 0 5 -13 -2", teeth: "M -9 0 L 9 0 L 9 2 L -9 2 Z", fill: "#5A231A" },
  // D: wide open ("ah")
  D: { path: "M -14 -6 Q 0 18 14 -6 Q 0 6 -14 -6", teeth: "M -10 -3 L 10 -3 L 10 -1 L -10 -1 Z", fill: "#3D1712" },
  // E: rounded open ("oh")
  E: { path: "M -9 -3 Q 0 12 9 -3 Q 0 4 -9 -3", fill: "#3D1712" },
  // F: puckered/rounded ("oo", "w")
  F: { path: "M -6 0 Q 0 9 6 0 Q 0 -3 -6 0", fill: "#5A231A" },
  // G: F/V - teeth touch lower lip
  G: { path: "M -13 1 Q 0 4 13 1 Q 0 -3 -13 1", teeth: "M -10 -1 L 10 -1 L 10 1 L -10 1 Z", fill: "#8A4A38" },
  // H: L - tongue visible behind slightly open mouth
  H: { path: "M -12 -1 Q 0 8 12 -1 Q 0 3 -12 -1", teeth: "M -3 1 Q 0 6 3 1 Z", fill: "#5A231A" },
};

export const DEFAULT_SHAPE = "X";
