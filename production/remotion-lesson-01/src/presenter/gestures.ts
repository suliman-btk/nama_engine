// Arm poses, keyed to the `gesture` field in scenes.json.
// Coordinate system: origin at neck base, +x screen-right, +y down.
// Arms are drawn as thick round-capped/joined strokes from shoulder -> elbow -> hand
// (a "pipe-cleaner limb" look), which reads as clean and consistent rather than
// hand-drawn anatomy. handShape selects a small end-cap glyph (see Presenter.tsx).

export type ArmPose = {
  shoulder: [number, number];
  elbow: [number, number];
  hand: [number, number];
  handShape: "fist" | "open" | "point" | "wave";
};

export type GesturePose = {
  left: ArmPose;
  right: ArmPose;
  headTilt: number; // degrees
  headNod: boolean; // adds an oscillating nod animation
};

const IDLE_LEFT: ArmPose = { shoulder: [-34, 10], elbow: [-44, 46], hand: [-36, 80], handShape: "fist" };
const IDLE_RIGHT: ArmPose = { shoulder: [34, 10], elbow: [44, 46], hand: [36, 80], handShape: "fist" };

const idle: GesturePose = { left: IDLE_LEFT, right: IDLE_RIGHT, headTilt: 0, headNod: false };

export const GESTURES: Record<string, GesturePose> = {
  none: idle,
  idle: idle,

  welcome: {
    left: IDLE_LEFT,
    right: { shoulder: [34, 8], elbow: [58, -18], hand: [46, -52], handShape: "wave" },
    headTilt: -3,
    headNod: false,
  },

  "open-hands": {
    left: { shoulder: [-34, 10], elbow: [-56, 22], hand: [-70, 10], handShape: "open" },
    right: { shoulder: [34, 10], elbow: [56, 22], hand: [70, 10], handShape: "open" },
    headTilt: 0,
    headNod: false,
  },

  "point-left": {
    left: { shoulder: [-34, 8], elbow: [-62, 4], hand: [-92, -2], handShape: "point" },
    right: IDLE_RIGHT,
    headTilt: -4,
    headNod: false,
  },

  "point-right": {
    left: IDLE_LEFT,
    right: { shoulder: [34, 8], elbow: [62, 4], hand: [92, -2], handShape: "point" },
    headTilt: 4,
    headNod: false,
  },

  "raise-hand": {
    left: IDLE_LEFT,
    right: { shoulder: [34, 8], elbow: [50, -30], hand: [40, -68], handShape: "open" },
    headTilt: 0,
    headNod: false,
  },

  counting: {
    left: IDLE_LEFT,
    right: { shoulder: [34, 8], elbow: [48, -10], hand: [26, -34], handShape: "open" },
    headTilt: 0,
    headNod: false,
  },

  nod: { left: IDLE_LEFT, right: IDLE_RIGHT, headTilt: 0, headNod: true },

  thinking: {
    left: IDLE_LEFT,
    right: { shoulder: [34, 8], elbow: [46, -18], hand: [14, -40], handShape: "fist" },
    headTilt: 6,
    headNod: false,
  },

  encouraging: {
    left: { shoulder: [-34, 10], elbow: [-50, 30], hand: [-52, 4], handShape: "open" },
    right: { shoulder: [34, 10], elbow: [50, 30], hand: [52, 4], handShape: "open" },
    headTilt: -2,
    headNod: false,
  },

  concerned: {
    left: { shoulder: [-34, 10], elbow: [-38, 44], hand: [-14, 58], handShape: "fist" },
    right: { shoulder: [34, 10], elbow: [38, 44], hand: [14, 58], handShape: "fist" },
    headTilt: 3,
    headNod: false,
  },

  closing: {
    left: { shoulder: [-34, 10], elbow: [-52, 20], hand: [-58, -4], handShape: "open" },
    right: { shoulder: [34, 8], elbow: [56, -14], hand: [44, -48], handShape: "wave" },
    headTilt: -3,
    headNod: false,
  },
};

export const DEFAULT_GESTURE = "none";
