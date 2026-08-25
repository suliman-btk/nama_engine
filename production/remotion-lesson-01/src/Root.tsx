import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { LessonOneVideo } from "./Video";
import durationsData from "./data/durations.json";

const durations = durationsData as Record<string, number>;
const FPS = 30;
const totalSeconds = Object.values(durations).reduce((a, b) => a + b, 0);
const durationInFrames = Math.round(totalSeconds * FPS);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Lesson01"
    component={LessonOneVideo}
    durationInFrames={durationInFrames}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
