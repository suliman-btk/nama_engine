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
          <div style={{ ...fadeUp(local, 0, 12), color: theme.colors.cream, fontFamily: theme.headingFamily, fontWeight: theme.headingWeight, fontSize: 38, lineHeight: 1.1, marginBottom: 60, paddingRight: 230 }}>
            {title}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: images.length === 1 ? "1fr" : "1fr 1fr", gap: 16, height: 650 }}>
            {images.slice(0, 4).map((image, index) => {
              const arrive = fadeUp(local, 8 + index * 7, 12);
              // Diagram SVGs are exact, precise content (labels, numbers, drawn edges) with
              // nothing to spare at the margins — cropping them the way a photo is cropped
              // cuts real text off (e.g. a wheel's outer label). Real curriculum photos, by
              // contrast, read fine cropped and benefit from the slow Ken-Burns zoom. So only
              // photos get cover+zoom; a diagram is shown whole with `contain` and no zoom.
              const isDiagram = image.src.toLowerCase().endsWith(".svg");
              const scale = isDiagram
                ? 1
                : interpolate(local, [0, Math.max(1, window.durationInFrames)], [1.02, 1.075], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={`${image.src}-${index}`} style={{ ...arrive, position: "relative", overflow: "hidden", borderRadius: 16, border: "1px solid rgba(228,200,98,0.32)", background: theme.colors.deep }}>
                  <Img
                    src={staticFile(image.src)}
                    alt={image.alt ?? image.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: isDiagram ? "contain" : "cover",
                      padding: isDiagram ? 10 : 0,
                      boxSizing: "border-box",
                      transform: `scale(${scale})`,
                    }}
                  />
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
