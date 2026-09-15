import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { useWindowPhase, type GraphicWindow } from "./useWindow";
import { motionStyle } from "../motion/presets";
import { useContentEdges } from "../slides/SlideFrame";

export function LessonSummary({
  window,
  title,
  points,
}: {
  window: GraphicWindow;
  title: string;
  points: string[];
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // See KeyStatement: this one drew full-width too.
  const edges = useContentEdges();
  if (phase === "before" || phase === "after") return null;
  const containerStyle = motionStyle("fade", phase, progress);
  const enterFrames = window.enterFrames ?? Math.round(fps * 0.45);

  return (
    <>
    {/* see KeyStatement: this one paints no frame either */}
    <AbsoluteFill style={{ background: theme.colors.surface }} />
    <AbsoluteFill
      style={{
        paddingLeft: edges.left,
        paddingRight: edges.right,
        paddingTop: "10%",
        paddingBottom: "10%",
        justifyContent: "center",
        ...containerStyle,
      }}
    >
      <div
        style={{
          fontFamily: theme.headingFamily,
          fontWeight: theme.headingWeight,
          fontSize: theme.type.title,
          color: theme.colors.goldLight,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          height: 4,
          width: 100,
          background: theme.colors.gold,
          margin: "20px 0 34px",
          transform: `scaleX(${Math.min(1, Math.max(0, (frame - window.startFrame) / (fps * 0.45)))})`,
          transformOrigin: "left",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {points.map((pt, i) => {
          const itemStart = window.startFrame + enterFrames + i * 9;
          const p = Math.min(1, Math.max(0, (frame - itemStart) / 12));
          const eased = 1 - Math.pow(1 - p, 3);
          return (
            <div
              key={i}
              style={{
                opacity: eased,
                transform: `translateX(${(1 - eased) * -22}px)`,
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: theme.colors.gold,
                  marginTop: 12,
                  flexShrink: 0,
                }}
              />
              <div style={{ color: theme.colors.cream, fontSize: 27, lineHeight: 1.4 }}>{pt}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
    </>
  );
}
