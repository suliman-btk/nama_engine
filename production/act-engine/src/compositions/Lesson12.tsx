import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { resolveEdlAnchors } from "../edl/resolveAnchors";
import { enforceLayoutRules } from "../edl/enforceLayoutRules";
import { lesson12Edl } from "../data/lesson-12-edl";
import wordTimingRaw from "../data/lesson-12-word-timing.json";
import { PresenterLayer, StageLayer, usePresenterContentEdges } from "../presenter/PresenterLayer";
import { EventRenderer } from "./EventRenderer";
import { theme } from "../components/theme";
import { LessonLabelContext, ContentEdgesContext } from "../slides/SlideFrame";
import { BrandWatermark } from "../brand/BrandWatermark";
import { GoldBaseline } from "../brand/FrameChrome";

export function Lesson12() {
  const edl = useMemo(() => {
    const resolved = resolveEdlAnchors(lesson12Edl, wordTimingRaw as { words: { t0: number; t1: number; w: string }[] });
    const { edl: safe, corrections } = enforceLayoutRules(resolved);
    if (corrections.length) console.warn(`[EDL] ${corrections.length} correction(s):\n - ${corrections.join("\n - ")}`);
    return safe;
  }, []);
  const src = staticFile(edl.avatarVideoSrc); const edges = usePresenterContentEdges(edl.scenes);
  return <AbsoluteFill style={{ backgroundColor: theme.colors.surface }}><Audio src={src}/><StageLayer scenes={edl.scenes} videoSrc={src} coveredBySlide/><LessonLabelContext.Provider value={LABEL}><ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider></LessonLabelContext.Provider><PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/><BrandWatermark/><GoldBaseline/></AbsoluteFill>;
}
const LABEL = "ACT · Lesson 12";
