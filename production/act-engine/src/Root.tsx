import React from "react";
import { Composition } from "remotion";
import { Lesson08 } from "./compositions/Lesson08";
import { Lesson13 } from "./compositions/Lesson13";

const LESSON_08_DURATION_SECONDS = 371.031655; // full source video length (ffprobe)
const LESSON_13_DURATION_SECONDS = 255.489161;
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
      <Composition id="Lesson13" component={Lesson13} durationInFrames={Math.round(LESSON_13_DURATION_SECONDS * FPS)} fps={FPS} width={1920} height={1080} />
    </>
  );
};
