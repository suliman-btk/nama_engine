import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { resolveEdlAnchors } from "../edl/resolveAnchors";
import { enforceLayoutRules } from "../edl/enforceLayoutRules";
import { lesson09Edl } from "../data/lesson-09-edl";
import wordTimingRaw from "../data/lesson-09-word-timing.json";
import { PresenterLayer, StageLayer, usePresenterContentEdges } from "../presenter/PresenterLayer";
import { EventRenderer } from "./EventRenderer";
import { theme } from "../components/theme";
import { LessonLabelContext, ContentEdgesContext } from "../slides/SlideFrame";
import { BrandWatermark } from "../brand/BrandWatermark";
import { GoldBaseline } from "../brand/FrameChrome";

export function Lesson09() {
  const edl = useMemo(() => {
    const resolved = resolveEdlAnchors(lesson09Edl, wordTimingRaw as {
      words: { t0: number; t1: number; w: string }[];
    });
    const { edl: safe, corrections } = enforceLayoutRules(resolved);
    if (corrections.length > 0) {
      console.warn(`[EDL] ${corrections.length} layout correction(s):\n - ${corrections.join("\n - ")}`);
    }
    return safe;
  }, []);

  const src = staticFile(edl.avatarVideoSrc);
  const edges = usePresenterContentEdges(edl.scenes);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.surface }}>
      <Audio src={src} />
      <StageLayer scenes={edl.scenes} videoSrc={src} coveredBySlide />
      <LessonLabelContext.Provider value="ACT · Lesson 9">
        <ContentEdgesContext.Provider value={edges}>
          <EventRenderer edl={edl} />
        </ContentEdgesContext.Provider>
      </LessonLabelContext.Provider>
      <PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds} />
      <BrandWatermark />
      <GoldBaseline />
    </AbsoluteFill>
  );
}
