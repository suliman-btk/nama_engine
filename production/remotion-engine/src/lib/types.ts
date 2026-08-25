/** Data contract between a lesson's JSON and the rendering engine. */

/** Layouts the engine can render. A scene names one; the engine never infers
 *  anything from scene ids. Adding a lesson never means editing the renderer. */
export type SceneLayout =
  | "title"
  | "section-divider"
  | "statement"
  | "quote"
  | "question"
  | "concept-card"
  | "definition"
  | "objectives"
  | "full-image"
  | "inset-image"
  | "logo-showcase"
  | "diagram"
  | "process"
  | "roadmap"
  | "spotlight"
  | "comparison"
  | "table"
  | "scenario"
  | "activity"
  | "worksheet"
  | "quiz"
  | "external-video"
  | "summary"
  | "closing";

export type PresenterAction =
  | "idle" | "talking" | "explain" | "welcome"
  | "point-left" | "point-right" | "thinking"
  | "nod" | "encouraging" | "concerned" | "closing";

export type PresenterConfig = {
  enabled: boolean;
  action?: PresenterAction;
  position?: "left" | "right" | "auto";
  scale?: number;
  expression?: string;
  target?: string | null;
};

/** Free-form per-layout payload. Each scene component declares what it reads. */
export type SceneData = Record<string, unknown>;

export type SceneVisual = {
  /** asset id resolved against the lesson's asset-manifest.json */
  asset?: string | null;
  assets?: string[];
  treatment?: "full-bleed" | "inset" | "auto";
  focal?: string;
};

export type Scene = {
  id: string;
  section: string;
  /** editorial intent, kept for content tooling + review notes */
  type?: string;
  layout: SceneLayout;
  narration: string;
  on_screen_text?: string | null;
  data?: SceneData;
  visual?: SceneVisual | null;
  presenter?: PresenterConfig;
  activity?: { type: string; pause_video?: boolean; estimated_minutes?: number } | null;
  /** optional per-scene override; otherwise the engine alternates */
  emphasis?: "normal" | "high";
};

export type LessonMeta = {
  lesson: number | string;
  unit?: number | string;
  title: string;
  video_title?: string;
  brand_label?: string;
  target_video_minutes?: number;
};

/** Rhubarb output, produced at build time. Kept for tooling/QA; the renderer
 *  itself consumes pre-baked presenter Lotties rather than raw cues. */
export type MouthCue = { start: number; end: number; value: string };
export type VisemeData = { metadata: { soundFile: string; duration: number }; mouthCues: MouthCue[] };

export type AssetEntry = {
  id: string;
  file: string;
  width: number;
  height: number;
  credit?: string;
  license?: string;
  source?: string;
};
