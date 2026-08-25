// Expression presets: eyebrow shape + eye openness/shape, keyed to the `emotion`
// field already present in scenes.json. Mouth is driven separately by the viseme system.
export type Expression = {
  browPath: string; // single brow shape, mirrored for the other side
  browY: number; // vertical offset (negative = raised)
  eyeScaleY: number; // 1 = normal, <1 = squinted, >1 = wide
  eyeTilt: number; // degrees, tilts the eye shape (thoughtful/concerned)
};

export const EXPRESSIONS: Record<string, Expression> = {
  neutral: { browPath: "M -20 -18 Q -12 -20 -4 -18", browY: 0, eyeScaleY: 1, eyeTilt: 0 },
  friendly: { browPath: "M -20 -19 Q -12 -23 -4 -19", browY: -1, eyeScaleY: 1.05, eyeTilt: 0 },
  confident: { browPath: "M -20 -20 Q -12 -23 -4 -19", browY: -2, eyeScaleY: 1, eyeTilt: 0 },
  encouraging: { browPath: "M -20 -20 Q -12 -24 -4 -19", browY: -2, eyeScaleY: 1.1, eyeTilt: 0 },
  thoughtful: { browPath: "M -20 -16 Q -12 -19 -4 -17", browY: 1, eyeScaleY: 0.85, eyeTilt: -4 },
  serious: { browPath: "M -20 -15 Q -12 -16 -4 -16", browY: 2, eyeScaleY: 0.9, eyeTilt: 0 },
  respectful: { browPath: "M -20 -17 Q -12 -19 -4 -18", browY: 0, eyeScaleY: 0.92, eyeTilt: 0 },
  excited: { browPath: "M -20 -22 Q -12 -26 -4 -21", browY: -4, eyeScaleY: 1.2, eyeTilt: 0 },
};

export const DEFAULT_EXPRESSION = "neutral";
