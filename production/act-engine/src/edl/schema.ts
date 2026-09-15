/**
 * Edit Decision List (EDL) schema.
 *
 * This is the ONLY interface between the AI planner (Claude, acting as director/editor —
 * see rule 17 of the production rules) and the deterministic Remotion renderer. The planner
 * never emits frames, JSX, or pixel-level instructions — only this structured JSON. See
 * `claude/video-engine-production-rules.md` section 17-18 and the "Core Engineering
 * Principle" at the bottom of that doc.
 *
 * Timing lives in two forms, and both resolve to seconds before the renderer sees them:
 *  - `atSeconds`: an already-known timestamp (used once anchors are resolved, or for
 *    lesson-generic beats like a fixed intro).
 *  - `atPhrase` / `emphasizeAtPhrase`: a snippet of the ACTUAL spoken text (not the old
 *    approved script) that `resolveAnchors.ts` looks up against the real per-word timing
 *    extracted from the footage. Prefer phrase anchors — see rule 2. Never hand-type a
 *    timestamp for a cue that could instead be anchored to text; footage gets re-cut and
 *    timestamps drift, anchors don't.
 */
import { z } from "zod";

export const PresenterLayout = z.enum([
  "PresenterFull",
  "PresenterMedium",
  "PresenterClose",
  "PresenterLeft",
  "PresenterRight",
  "PresenterCornerLeft",
  "PresenterCornerRight",
  "PresenterPictureInPicture",
  "PresenterHidden",
  "GraphicFull",
  "WorksheetFocus",
  "KeyStatementFocus",
]);
export type PresenterLayout = z.infer<typeof PresenterLayout>;

export const TransitionPreset = z.enum([
  "clean-cut",
  "crossfade",
  "soft-push-left",
  "soft-push-right",
  "scale-through",
  "mask-wipe",
  "dip-to-brand",
  "section-reveal",
]);
export type TransitionPreset = z.infer<typeof TransitionPreset>;

export const MotionPreset = z.enum([
  "fade",
  "fade-rise",
  "fade-scale",
  "slide-left",
  "slide-right",
  "stagger-list",
  "word-emphasis",
  "underline-reveal",
  "line-draw",
  "arrow-draw",
  "diagram-build",
  "highlight-pulse",
  "image-parallax",
  "shrink-to-corner",
  "return-to-full",
]);
export type MotionPreset = z.infer<typeof MotionPreset>;

// The reusable component vocabulary from rule 4 + rule 5's KeyStatement cards.
export const GraphicComponent = z.enum([
  "ThreeZoneDiagram",
  "FourStepJourney",
  "Timeline",
  "ProcessFlow",
  "ComparisonCards",
  "BeforeAfter",
  "CycleDiagram",
  "NumberedSteps",
  "ScenarioSequence",
  "DefinitionCard",
  "QuestionCard",
  "QuoteCard",
  "KeyStatement",
  "BigNumber",
  "Checklist",
  "WorksheetViewer",
  "LessonSummary",
  // Full-frame slide vocabulary. The rule-4 list above is about diagrams that explain a
  // concept; these are the slides that carry the beats between them — the opening title, a
  // statement, an activity instruction, a checklist, a question, a video hand-off, the
  // close. Without them a lesson has nothing on screen for most of its runtime.
  "TitleSlide",
  "StatementSlide",
  "ActivitySlide",
  "ChecklistSlide",
  "QuestionSlide",
  "VideoLinkSlide",
  "OutroSlide",
  "PhotoGridSlide",
]);
export type GraphicComponent = z.infer<typeof GraphicComponent>;

const TimeAnchor = z.object({
  atSeconds: z.number().nonnegative().optional(),
  atPhrase: z.string().min(1).optional(),
}).refine((v) => v.atSeconds !== undefined || v.atPhrase !== undefined, {
  message: "Every timed thing needs atSeconds or atPhrase.",
});

export const EdlEvent = z.object({
  id: z.string(),
  // when the event fires
  anchor: TimeAnchor,
  // optional explicit end; if omitted, renderer uses component's natural HOLD length
  endAnchor: TimeAnchor.optional(),
  action: z.enum(["show", "hide", "highlight", "emphasize"]),
  component: GraphicComponent.optional(),
  target: z.string().optional(), // e.g. which item inside a shown component to highlight
  animation: MotionPreset.optional(),
  position: z.enum(["left", "right", "center", "full"]).optional(),
  // free-form data passed straight into the component (headline, items, image ids, etc.)
  props: z.record(z.string(), z.unknown()).optional(),
  // rule 6-9: any asset referenced by id here must resolve through the AnimationProvider's
  // licensing gate. Omit if the event needs no external animation asset.
  animationAssetId: z.string().optional(),
});
export type EdlEvent = z.infer<typeof EdlEvent>;

export const EdlScene = z.object({
  sceneId: z.string(),
  // resolved at build time by resolveAnchors; authoring can pass phrase anchors instead
  start: TimeAnchor,
  end: TimeAnchor,
  avatar: z.object({
    layout: PresenterLayout,
    camera: z.enum(["wide", "medium", "close"]).default("medium"),
    mirror: z.boolean().optional(), // face into the slide, per production-log v5 note
  }),
  events: z.array(EdlEvent).default([]),
  transitionIn: TransitionPreset.default("clean-cut"),
  transitionOut: TransitionPreset.default("clean-cut"),
  // rule 15: subtitle text for this scene, taken from the ACTUAL spoken script, never from
  // production notes / group-option brackets.
  subtitleText: z.string().optional(),
  reviewRequired: z.string().optional(), // carries forward [REVIEW REQUIRED] flags, rule 20
});
export type EdlScene = z.infer<typeof EdlScene>;

export const Edl = z.object({
  lessonId: z.string(),
  title: z.string(),
  fps: z.number().int().positive().default(30),
  width: z.number().int().positive().default(1920),
  height: z.number().int().positive().default(1080),
  avatarVideoSrc: z.string(), // provider-independent: any file path/URL, staging-agnostic
  /** Hard picture cuts detected in the source footage itself (ffmpeg scene detection),
   * in seconds. The avatar tool generates one clip per script scene and joins them, so the
   * presenter's pose and energy jump at these seams. The renderer covers each one with a
   * transition even when no EDL scene boundary lines up with it — see
   * transitions/SceneTransitionLayer.tsx. */
  sourceCutSeconds: z.array(z.number().nonnegative()).default([]),
  scenes: z.array(EdlScene),
});
export type Edl = z.infer<typeof Edl>;

export function parseEdl(json: unknown): Edl {
  return Edl.parse(json);
}

/** Input shape (pre-defaults) — what hand-authored EDL data files should be typed as,
 * since fields like transitionIn/transitionOut are optional until parseEdl() fills them. */
export type EdlInput = z.input<typeof Edl>;
