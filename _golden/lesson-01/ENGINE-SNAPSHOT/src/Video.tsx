import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import scenesData from "./data/scenes.json";
import durationsData from "./data/durations.json";
import type { Scene } from "./lib/types";
import { SceneRenderer } from "./components/SceneRenderer";
import { SceneMotion, LessonProgress } from "./components/Frame";
import { Presenter } from "./presenter/Presenter";

const scenes = scenesData as unknown as Scene[];
const durations = durationsData as Record<string, number>;

export const LessonOneVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const items = useMemo(() => {
    let cursor = 0;
    return scenes.map((scene, index) => {
      const dur = durations[scene.id] ?? 3;
      const from = Math.round(cursor * fps);
      const durationInFrames = Math.max(1, Math.round(dur * fps));
      cursor += dur;
      // alternate which side the presenter stands on so he isn't parked in one
      // corner for the whole lesson; cards lay their content out on the far side
      const side: "left" | "right" = index % 2 === 0 ? "right" : "left";
      const elapsed = cursor - dur;
      return { scene, index, from, durationInFrames, side, elapsed };
    });
  }, [fps]);

  const totalSeconds = items.reduce((a, b) => a + (durations[b.scene.id] ?? 3), 0);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {items.map(({ scene, index, from, durationInFrames, side, elapsed }) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={scene.id}>
          <SceneMotion>
            <SceneRenderer scene={scene} index={index} side={side} />
          </SceneMotion>
          <Audio src={staticFile(`audio/${scene.id}.wav`)} />
          <Presenter presenter={scene.presenter} sceneId={scene.id} side={side} />
          <LessonProgress elapsed={elapsed} total={totalSeconds} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
