import React from "react";
import { Composition } from "remotion";
import { Lesson08 } from "./compositions/Lesson08";
import { Lesson05 } from "./compositions/Lesson05";

const LESSON_08_DURATION_SECONDS = 371.031655; // full source video length (ffprobe)
const LESSON_05_DURATION_SECONDS = 356.961; // full source video length (ffprobe)
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Lesson08"
        component={Lesson08}
        durationInFrames={Math.round(LESSON_08_DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson05"
        component={Lesson05}
        durationInFrames={Math.round(LESSON_05_DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
