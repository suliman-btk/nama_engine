import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { resolveEdlAnchors } from "../edl/resolveAnchors";
import { enforceLayoutRules } from "../edl/enforceLayoutRules";
import { lesson01Edl } from "../../../../lessons/lesson-01/generated/lesson-01-edl";
import wordTimingRaw from "../../../../lessons/lesson-01/generated/word-timing/lesson-01-word-timing.json";
import { PresenterLayer, StageLayer, usePresenterContentEdges } from "../presenter/PresenterLayer";
import { EventRenderer } from "./EventRenderer";
import { useTheme } from "../course/CourseContext";
import { CourseConfigContext, useCourseConfig } from "../course/CourseContext";
import { LessonLabelContext, ContentEdgesContext } from "../slides/SlideFrame";
import { BrandWatermark } from "../brand/BrandWatermark";
import { GoldBaseline } from "../brand/FrameChrome";
import { parseCourseConfig } from "../course/schema";
import courseConfigRaw from "../../../../course-config.json";

const courseConfig = parseCourseConfig(courseConfigRaw);

export function Lesson01() {
  const edl = useMemo(() => {
    const resolved = resolveEdlAnchors(lesson01Edl, wordTimingRaw as {
      words: { t0: number; t1: number; w: string }[];
    });
    const { edl: safe, corrections } = enforceLayoutRules(resolved);
    if (corrections.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(`[EDL] ${corrections.length} layout correction(s):\n - ${corrections.join("\n - ")}`);
    }
    return safe;
  }, []);

  const src = staticFile(edl.avatarVideoSrc);
  const edges = usePresenterContentEdges(edl.scenes);
  const lessonLabel = courseConfig.lessonLabelTemplate.replace("{lesson}", "1");

  return (
    <CourseConfigContext.Provider value={courseConfig}>
      <AbsoluteFill style={{ backgroundColor: courseConfig.theme.colors.surface }}>
        <Audio src={src} />
        <StageLayer scenes={edl.scenes} videoSrc={src} coveredBySlide />
        <LessonLabelContext.Provider value={lessonLabel}>
          <ContentEdgesContext.Provider value={edges}>
            <EventRenderer edl={edl} />
          </ContentEdgesContext.Provider>
        </LessonLabelContext.Provider>
        <PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds} />
        <BrandWatermark scenes={edl.scenes} />
        <GoldBaseline />
      </AbsoluteFill>
    </CourseConfigContext.Provider>
  );
}
