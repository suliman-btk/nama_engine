import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, continueRender, delayRender, staticFile } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import type { Presenter as PresenterData } from "../lib/types";

export const PRESENTER_SIZE = 660;

/**
 * The presenter is the artist-drawn Lottie character, pre-built per scene by
 * production/scripts/build_avatar_lottie.py with a full viseme mouth set keyed to
 * that scene's real Rhubarb phoneme cues. This component only places it.
 *
 * `side` alternates through the lesson so the character isn't parked in one
 * corner for 16 minutes; he is mirrored to face into the slide content.
 */
export const Presenter: React.FC<{
  presenter: PresenterData;
  sceneId: string;
  side: "left" | "right";
}> = ({ presenter, sceneId, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [handle] = React.useState(() => delayRender(`lottie-${sceneId}`));
  const [data, setData] = React.useState<LottieAnimationData | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(staticFile(`lottie/scenes/${sceneId}.json`))
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setData(json);
          continueRender(handle);
        }
      })
      .catch(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
  }, [sceneId, handle]);

  if (!presenter.visible || !data) return null;

  const entrance = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  // slide in from his own edge
  const slide = interpolate(entrance, [0, 1], [side === "left" ? -70 : 70, 0]);
  const rise = interpolate(entrance, [0, 1], [30, 0]);
  const sway = Math.sin(frame / 46) * 5;

  // no arms on this character, so `gesture` reads as a subtle lean
  const leanBy: Record<string, number> = {
    "point-left": -4,
    "point-right": 4,
    thinking: 5,
    welcome: -3,
    closing: -3,
  };
  const lean = leanBy[presenter.gesture] ?? 0;
  const nod = presenter.gesture === "nod" ? Math.sin(frame / 9) * 3 : 0;

  // face into the slide: art is drawn facing forward-left, so flip when on the left
  const faceFlip = side === "left" ? -1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -46,
        ...(side === "left" ? { left: 0 } : { right: 0 }),
        width: PRESENTER_SIZE,
        height: PRESENTER_SIZE,
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
          width: 330,
          height: 28,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.22)",
          filter: "blur(16px)",
        }}
      />
      {/* drop shadow rather than a light halo: the cream knit needs an edge on
          light slides as much as it needs lift on dark ones */}
      <Lottie
        animationData={data}
        loop={false}
        style={{
          width: PRESENTER_SIZE,
          height: PRESENTER_SIZE,
          transform: `scaleX(${faceFlip})`,
          filter: "drop-shadow(0 8px 22px rgba(12,14,40,0.40))",
        }}
      />
    </div>
  );
};
