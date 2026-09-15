import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { useWindowPhase, type GraphicWindow } from "./useWindow";
import { motionStyle } from "../motion/presets";

/**
 * The prominent "important sentence" card — rule 5, and only 3-6 of these per lesson. The
 * planner picks the sentence; this makes it land.
 *
 * It renders over the blurred stage rather than on flat colour, so the room is still faintly
 * there and the moment reads as the video pushing in on an idea rather than cutting to a
 * slide. Words arrive in a quick wave, and any word listed in `emphasize` lifts to gold as
 * the line settles.
 */
export function KeyStatement({
  window,
  text,
  emphasize = [],
}: {
  window: GraphicWindow;
  text: string;
  emphasize?: string[];
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (phase === "before" || phase === "after") return null;

  const style = motionStyle("fade-scale", phase, progress);
  const words = text.split(" ");
  const emphasizeSet = new Set(emphasize.map((w) => w.toLowerCase().replace(/[.,!?—]/g, "")));

  const enterFrames = window.enterFrames ?? Math.round(fps * 0.45);
  const local = frame - window.startFrame;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 11%" }}>
      <div style={{ ...style, textAlign: "center", maxWidth: 1500 }}>
        <div
          style={{
            width: 78,
            height: 4,
            background: theme.colors.gold,
            margin: "0 auto 40px",
            transform: `scaleX(${Math.min(1, Math.max(0, local / (fps * 0.4)))})`,
          }}
        />
        <div
          style={{
            fontFamily: theme.headingFamily,
            fontWeight: theme.headingWeight,
            fontSize: theme.type.hero,
            lineHeight: 1.24,
            color: theme.colors.cream,
            textShadow: "0 6px 34px rgba(0,0,0,0.6)",
          }}
        >
          {words.map((w, i) => {
            const bare = w.toLowerCase().replace(/[.,!?—]/g, "");
            const hot = emphasizeSet.has(bare);
            // word wave: each word arrives a beat after the one before it
            const wordStart = enterFrames + i * 1.8;
            const p = Math.min(1, Math.max(0, (local - wordStart) / 9));
            const eased = 1 - Math.pow(1 - p, 3);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: eased,
                  transform: `translateY(${(1 - eased) * 16}px)`,
                  color: hot && phase === "hold" ? theme.colors.goldLight : undefined,
                  marginRight: "0.28em",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
