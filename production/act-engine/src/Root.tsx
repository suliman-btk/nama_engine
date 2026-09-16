import React from "react";
import { Composition } from "remotion";
import { Lesson08 } from "./compositions/Lesson08";
import { Lesson12 } from "./compositions/Lesson12";

const LESSON_08_DURATION_SECONDS = 371.031655; // full source video length (ffprobe)
const LESSON_12_DURATION_SECONDS = 455.552290;
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
      <Composition id="Lesson12" component={Lesson12} durationInFrames={Math.round(LESSON_12_DURATION_SECONDS * FPS)} fps={FPS} width={1920} height={1080} />
    </>
  );
};
