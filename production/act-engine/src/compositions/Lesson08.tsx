import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { resolveEdlAnchors } from "../edl/resolveAnchors";
import { enforceLayoutRules } from "../edl/enforceLayoutRules";
import { lesson08Edl } from "../../../../lessons/lesson-08/generated/lesson-08-edl";
import wordTimingRaw from "../../../../lessons/lesson-08/generated/word-timing/lesson-08-word-timing.json";
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

export function Lesson08() {
  const edl = useMemo(() => {
    const resolved = resolveEdlAnchors(lesson08Edl, wordTimingRaw as {
      words: { t0: number; t1: number; w: string }[];
    });
    // Layout sanity runs AFTER anchors resolve, since it needs real times to know whether a
    // graphic is actually covering a scene. Corrections are logged rather than thrown: a
    // render should still complete, but the planner needs to see what it got wrong.
    const { edl: safe, corrections } = enforceLayoutRules(resolved);
    if (corrections.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(`[EDL] ${corrections.length} layout correction(s):\n - ${corrections.join("\n - ")}`);
    }
    return safe;
  }, []);

  const src = staticFile(edl.avatarVideoSrc);
  const edges = usePresenterContentEdges(edl.scenes);
  const lessonLabel = courseConfig.lessonLabelTemplate.replace("{lesson}", "8");

  return (
    <CourseConfigContext.Provider value={courseConfig}>
      <AbsoluteFill style={{ backgroundColor: courseConfig.theme.colors.surface }}>
        {/* Narration is decoupled from the presenter picture and always plays at full volume,
            even while the presenter is off frame (GraphicFull) — only the PICTURE changes with
            layout, never the timeline. */}
        <Audio src={src} />
        {/* Stage off. It is a blurred copy of the footage at brightness(0.62), and since every
            split scene is fully covered by an opaque slide, the only moment it can ever be seen
            is through a slide that is mid-fade - which is exactly the dark flash between slides.
            The flat surface colour sits behind everything instead. */}
        <StageLayer scenes={edl.scenes} videoSrc={src} coveredBySlide />
        {/* Slides sit between the stage and the presenter: a corner presenter renders on top
            of a full-frame slide, a full-bleed presenter covers the slide entirely. */}
        <LessonLabelContext.Provider value={lessonLabel}>
          <ContentEdgesContext.Provider value={edges}>
            <EventRenderer edl={edl} />
          </ContentEdgesContext.Provider>
        </LessonLabelContext.Provider>
        <PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds} />
        {/* Above everything, always on: the mark and the baseline frame the whole picture,
            presenter included. */}
        <BrandWatermark />
        <GoldBaseline />
      </AbsoluteFill>
    </CourseConfigContext.Provider>
  );
}
