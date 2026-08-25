import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CourseVideo } from "./engine/CourseVideo";
import manifest from "./data/render-manifest.json";

/**
 * One composition renders any lesson. render_lesson.py stages the lesson into
 * public/lessons/<id>/ and writes render-manifest.json with its id and length,
 * so Remotion knows the duration before the async lesson data has loaded.
 */
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Lesson"
    component={CourseVideo}
    durationInFrames={Math.max(1, Math.round(manifest.totalSeconds * 30))}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ lesson: manifest.lesson }}
  />
);
