import { staticFile, continueRender, delayRender } from "remotion";
import React from "react";
import type { Scene, LessonMeta, AssetEntry } from "../lib/types";

/**
 * A lesson is loaded from public/lessons/<id>/ at render time, so ONE engine
 * renders any lesson. production/scripts/render_lesson.py stages the requested
 * lesson into that folder before invoking Remotion.
 */
export type LessonBundle = {
  id: string;
  meta: LessonMeta;
  scenes: Scene[];
  durations: Record<string, number>;
  assets: Record<string, AssetEntry>;
};

export const lessonFile = (lessonId: string, rel: string) =>
  staticFile(`lessons/${lessonId}/${rel}`);

const fetchJson = async <T,>(url: string): Promise<T> => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return (await r.json()) as T;
};

/** Loads every file a lesson needs, blocking the render until they land. */
export const useLesson = (lessonId: string): LessonBundle | null => {
  const [handle] = React.useState(() => delayRender(`lesson:${lessonId}`));
  const [bundle, setBundle] = React.useState<LessonBundle | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meta, scenes, durations, assetList] = await Promise.all([
          fetchJson<LessonMeta>(lessonFile(lessonId, "lesson.json")),
          fetchJson<Scene[]>(lessonFile(lessonId, "scenes.json")),
          fetchJson<Record<string, number>>(lessonFile(lessonId, "durations.json")),
          fetchJson<AssetEntry[]>(lessonFile(lessonId, "assets.json")).catch(() => [] as AssetEntry[]),
        ]);
        if (cancelled) return;
        const assets: Record<string, AssetEntry> = {};
        for (const a of assetList) assets[a.id] = a;
        setBundle({ id: lessonId, meta, scenes, durations, assets });
      } catch (e) {
        // surface the real reason instead of a silent black render
        // eslint-disable-next-line no-console
        console.error(`[engine] failed to load lesson "${lessonId}":`, e);
      } finally {
        continueRender(handle);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, handle]);

  return bundle;
};

/** Timeline positions derived from real audio durations. */
export const buildTimeline = (bundle: LessonBundle, fps: number) => {
  let cursor = 0;
  const items = bundle.scenes.map((scene, index) => {
    const dur = bundle.durations[scene.id] ?? 3;
    const from = Math.round(cursor * fps);
    const durationInFrames = Math.max(1, Math.round(dur * fps));
    const elapsed = cursor;
    cursor += dur;
    return { scene, index, from, durationInFrames, elapsed };
  });
  return { items, totalSeconds: cursor };
};

/**
 * Which side the presenter stands on. A scene may pin it; otherwise alternate so
 * the character isn't parked in one corner for the whole lesson.
 */
export const resolveSide = (scene: Scene, index: number): "left" | "right" => {
  const p = scene.presenter?.position;
  if (p === "left" || p === "right") return p;
  return index % 2 === 0 ? "right" : "left";
};
