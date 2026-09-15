import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, fadeUp, useContentEdges } from "./SlideFrame";

type PhotoItem = { src: string; label: string; alt?: string };

/** A reusable evidence-first photo layout for official or licensed source imagery. */
export function PhotoGridSlide({
  window,
  title,
  images,
  kicker = "Look closely",
  lessonLabel,
}: {
  window: GraphicWindow;
  title: string;
  images: PhotoItem[];
  kicker?: string;
  lessonLabel?: string;
}) {
  const frame = useCurrentFrame();
  const { phase, progress } = useWindowPhase(window);
  const edges = useContentEdges();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const opacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  return (
    <div style={{ opacity }}>
      <SlideFrame kicker={kicker} lessonLabel={lessonLabel}>
        <div style={{ position: "absolute", left: edges.left, right: edges.right, top: 118, bottom: 70 }}>
          <div style={{ ...fadeUp(local, 0, 12), color: theme.colors.cream, fontFamily: theme.headingFamily, fontWeight: theme.headingWeight, fontSize: 38, lineHeight: 1.1, marginBottom: 22 }}>
            {title}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: 690 }}>
            {images.slice(0, 4).map((image, index) => {
              const arrive = fadeUp(local, 8 + index * 7, 12);
              const scale = interpolate(local, [0, Math.max(1, window.durationInFrames)], [1.02, 1.075], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={`${image.src}-${index}`} style={{ ...arrive, position: "relative", overflow: "hidden", borderRadius: 16, border: "1px solid rgba(228,200,98,0.32)", background: theme.colors.deep }}>
                  <Img src={staticFile(image.src)} alt={image.alt ?? image.label} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "34px 16px 13px", background: "linear-gradient(transparent, rgba(18,20,47,0.92))", color: theme.colors.cream, fontFamily: theme.headingFamily, fontWeight: theme.headingWeight, fontSize: 24 }}>
                    {image.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SlideFrame>
    </div>
  );
}
