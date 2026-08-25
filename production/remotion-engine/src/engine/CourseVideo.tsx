import React from "react";
import { AbsoluteFill, Sequence, Audio } from "remotion";
import { useLesson, buildTimeline, resolveSide, lessonFile } from "./lesson";
import { SceneRenderer } from "../scenes/registry";
import { SceneMotion, LessonProgress, BrandContext } from "../components/Frame";
import { Presenter } from "../presenter/Presenter";

/** Renders any lesson from its JSON. The only input is a lesson id. */
export const CourseVideo: React.FC<{ lesson: string }> = ({ lesson }) => {
  const bundle = useLesson(lesson);
  if (!bundle) return <AbsoluteFill style={{ background: "#000" }} />;

  const { items, totalSeconds } = buildTimeline(bundle, 30);
  const brandLabel =
    bundle.meta.brand_label ?? `ACT · Lesson ${String(bundle.meta.lesson).padStart(2, "0")}`;

  const assetUrl = (id: string) => {
    const a = bundle.assets[id];
    return a ? lessonFile(bundle.id, `assets/${a.file}`) : null;
  };

  return (
    <BrandContext.Provider value={{ label: brandLabel }}>
      <AbsoluteFill style={{ background: "#000" }}>
        {items.map(({ scene, index, from, durationInFrames, elapsed }) => {
          const side = resolveSide(scene, index);
          return (
            <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={scene.id}>
              <SceneMotion>
                <SceneRenderer
                  scene={scene}
                  index={index}
                  side={side}
                  assets={bundle.assets}
                  assetUrl={assetUrl}
                />
              </SceneMotion>
              <Audio src={lessonFile(bundle.id, `audio/${scene.id}.wav`)} />
              <Presenter presenter={scene.presenter} lessonId={bundle.id} sceneId={scene.id} side={side} />
              <LessonProgress elapsed={elapsed} total={totalSeconds} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </BrandContext.Provider>
  );
};
