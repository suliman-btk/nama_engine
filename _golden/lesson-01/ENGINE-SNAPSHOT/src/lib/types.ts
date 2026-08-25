export type Presenter = {
  visible: boolean;
  position: "left" | "right" | "center" | "off-screen";
  base_motion: string;
  gesture: string;
  emotion: string;
  gaze_target: string | null;
};

export type Activity = {
  type: string;
  pause_video?: boolean;
  estimated_minutes?: number;
} | null;

export type Scene = {
  id: string;
  section: string;
  type: string;
  narration: string;
  visual_type: string;
  visual_source: string;
  visual_description: string | null;
  asset_id: string | null;
  on_screen_text: string | null;
  activity: Activity;
  presenter: Presenter;
};

export type MouthCue = { start: number; end: number; value: string };
export type VisemeData = { metadata: { soundFile: string; duration: number }; mouthCues: MouthCue[] };
