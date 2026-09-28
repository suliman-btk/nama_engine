import React from "react";
import { Composition } from "remotion";
import { Lesson01 } from "./compositions/Lesson01";
import { Lesson08 } from "./compositions/Lesson08";

const LESSON_01_DURATION_SECONDS = 490.73; // PRIME lesson 01 (ffprobe)
const LESSON_08_DURATION_SECONDS = 371.031655; // full source video length (ffprobe)
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Lesson01"
        component={Lesson01}
        durationInFrames={Math.round(LESSON_01_DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson08"
        component={Lesson08}
        durationInFrames={Math.round(LESSON_08_DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
