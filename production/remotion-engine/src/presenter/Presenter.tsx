import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, continueRender, delayRender } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import type { PresenterConfig } from "../lib/types";
import { lessonFile } from "../engine/lesson";

export const PRESENTER_SIZE = 660;

/**
 * Plays the per-scene presenter animation that was baked at BUILD time by
 * production/scripts/build_presenter_lottie.py, which injects the scene's real
 * Rhubarb viseme cues into the character described by shared/presenter/rig.json.
 *
 * Deliberately dumb: lip-sync is a build-time concern, so this component only
 * places, scales, mirrors and animates entrance/exit. Swapping in a different
 * character means editing rig.json, not this file.
 */
export const Presenter: React.FC<{
  presenter?: PresenterConfig;
  lessonId: string;
  sceneId: string;
  side: "left" | "right";
}> = ({ presenter, lessonId, sceneId, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enabled = presenter?.enabled !== false;

  const [handle] = React.useState(() => delayRender(`presenter:${sceneId}`));
  const [data, setData] = React.useState<LottieAnimationData | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      continueRender(handle);
      return;
    }
    fetch(lessonFile(lessonId, `presenter/${sceneId}.json`))
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => undefined)
      .finally(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
  }, [lessonId, sceneId, handle, enabled]);

  if (!enabled || !data) return null;

  const size = PRESENTER_SIZE * (presenter?.scale ?? 1);

  const entrance = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slide = interpolate(entrance, [0, 1], [side === "left" ? -70 : 70, 0]);
  const rise = interpolate(entrance, [0, 1], [30, 0]);
  const sway = Math.sin(frame / 46) * 5;

  // This character has no arms, so an action resolves to a head lean. A rigged
  // asset would instead select a different clip at build time (see rig.json).
  const LEAN: Record<string, number> = {
    "point-left": -4, "point-right": 4, thinking: 5,
    welcome: -3, closing: -3, encouraging: -2, concerned: 3,
  };
  const action = presenter?.action ?? "talking";
  const lean = LEAN[action] ?? 0;
  const nod = action === "nod" ? Math.sin(frame / 9) * 3 : 0;
  const faceFlip = side === "left" ? -1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -46,
        ...(side === "left" ? { left: 0 } : { right: 0 }),
        width: size,
        height: size,
        opacity,
        transform: `translate(${slide}px, ${rise + sway}px) rotate(${lean + nod}deg)`,
        transformOrigin: "50% 92%",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 88,
          transform: "translateX(-50%)",
          width: size * 0.5,
          height: 28,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.22)",
          filter: "blur(16px)",
        }}
      />
      <Lottie
        animationData={data}
        loop={false}
        style={{
          width: size,
          height: size,
          transform: `scaleX(${faceFlip})`,
          filter: "drop-shadow(0 8px 22px rgba(12,14,40,0.40))",
        }}
      />
    </div>
  );
};
