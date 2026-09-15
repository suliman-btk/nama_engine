import type { Edl, EdlScene } from "./schema";
import { REQUIRES_GRAPHIC } from "../presenter/layoutConfig";

/**
 * The rule the first lesson-1 pass violated, now enforced by the engine instead of trusted
 * to the EDL author: **the presenter only shrinks when something takes the space it left.**
 *
 * A scene that shrinks the presenter to a corner, or hides it entirely, but has no graphic
 * on screen produces exactly what it sounds like — a small video in the corner of an empty
 * frame. That is never a deliberate edit, so rather than review for it by eye, any such
 * scene is promoted back to a full-bleed layout here, and the substitution is reported.
 *
 * Returns the corrected EDL plus a list of what it changed, so the planner can see that its
 * intent didn't survive and fix the EDL properly (usually by adding the graphic it forgot,
 * not by accepting the fallback).
 */
export function enforceLayoutRules(edl: Edl): { edl: Edl; corrections: string[] } {
  const corrections: string[] = [];

  const scenes: EdlScene[] = edl.scenes.map((scene) => {
    const needsGraphic = REQUIRES_GRAPHIC.includes(scene.avatar.layout);
    if (!needsGraphic) return scene;

    if (sceneHasVisibleGraphic(scene, edl)) return scene;

    // Nothing fills the space. Fall back to a full-bleed shot: PresenterMedium rather than
    // PresenterFull, so the intended "we are looking closer at something now" beat survives
    // as a gentle punch-in instead of disappearing entirely.
    corrections.push(
      `${scene.sceneId}: layout "${scene.avatar.layout}" would leave the frame empty (no graphic on screen) — using PresenterMedium instead. Add the graphic this scene was meant to show, or set a full-bleed layout deliberately.`
    );
    return { ...scene, avatar: { ...scene.avatar, layout: "PresenterMedium" as const } };
  });

  return { edl: { ...edl, scenes }, corrections };
}

/** A scene counts as covered if a graphic is on screen for essentially all of it — either
 * its own event, or one from an earlier scene whose window runs through this one. */
function sceneHasVisibleGraphic(scene: EdlScene, edl: Edl): boolean {
  const start = scene.start.atSeconds;
  const end = scene.end.atSeconds;
  if (start === undefined || end === undefined) return true; // unresolved: don't second-guess

  const sceneLength = end - start;
  if (sceneLength <= 0) return true;

  let covered = 0;
  for (const other of edl.scenes) {
    for (const ev of other.events) {
      if (!ev.component || ev.action === "hide") continue;
      const evStart = ev.anchor.atSeconds;
      const evEnd = ev.endAnchor?.atSeconds ?? other.end.atSeconds;
      if (evStart === undefined || evEnd === undefined) continue;
      covered += Math.max(0, Math.min(end, evEnd) - Math.max(start, evStart));
    }
  }

  // Allow a brief uncovered head/tail (the graphic animating in), but not a scene that is
  // mostly empty.
  return covered / sceneLength > 0.6;
}
