import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";

/**
 * The opening title. The lesson previously started cold on a talking head — no branding, no
 * title, nothing to say what this is.
 *
 * Built as a sequence rather than a static card: the gold column wipes in, the ACT mark
 * lands, the title and unit line follow, and the whole thing lifts away into the lesson. It
 * runs over the first seconds of narration, so nothing is added to the runtime.
 */
export function TitleSlide({
  window,
  title,
  unitLabel,
  lessonLabel,
}: {
  window: GraphicWindow;
  title: string;
  unitLabel?: string;
  lessonLabel?: string;
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;

  const e = (delay: number, dur = 14) => {
    const p = interpolate(local, [delay, delay + dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return 1 - Math.pow(1 - p, 3);
  };

  // the whole card lifts and fades as it hands over to the lesson
  const out = phase === "exit" ? progress : 0;
  const outEase = out * out;

  const columnW = interpolate(e(0, 18), [0, 1], [0, 46]);

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.surface,
        opacity: 1 - outEase,
        transform: `translateY(${-outEase * 40}px)`,
        fontFamily: theme.bodyFamily,
        overflow: "hidden",
      }}
    >
      {/* gold column wipes in from the left */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${columnW}%`,
          background: `linear-gradient(160deg, ${theme.colors.gold} 0%, ${theme.colors.goldLight} 100%)`,
        }}
      />

      {/* mark sits on the gold */}
      <div
        style={{
          position: "absolute",
          left: "4.5%",
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - e(14, 16)) * -40}px)`,
          opacity: e(14, 16),
          width: 620,
          background: theme.colors.cream,
          padding: "34px 40px",
          borderRadius: 24,
          boxShadow: "0 22px 60px rgba(0,0,0,0.26)",
        }}
      >
        <Img src={staticFile("brand/nama-logo.png")} style={{ width: "100%", display: "block" }} />
      </div>

      {/* title block on the navy */}
      <div style={{ position: "absolute", left: "52%", right: "8%", top: "42%", transform: "translateY(-50%)" }}>
        {unitLabel ? (
          <div
            style={{
              opacity: e(26, 14),
              transform: `translateY(${(1 - e(26, 14)) * 16}px)`,
              color: theme.colors.gold,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {unitLabel}
          </div>
        ) : null}
        <div
          style={{
            opacity: e(32, 16),
            transform: `translateY(${(1 - e(32, 16)) * 22}px)`,
            fontFamily: theme.headingFamily,
            fontWeight: theme.headingWeight,
            fontSize: 62,
            lineHeight: 1.14,
            color: theme.colors.cream,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: interpolate(e(44, 18), [0, 1], [0, 140]),
            height: 6,
            background: theme.colors.gold,
            marginTop: 30,
          }}
        />
      </div>

      {lessonLabel ? (
        <div
          style={{
            position: "absolute",
            left: "52%",
            bottom: 40,
            opacity: e(50, 14),
            color: "rgba(250,247,238,0.5)",
            fontSize: 21,
            letterSpacing: 1,
          }}
        >
          {lessonLabel}
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: theme.colors.gold }} />
    </AbsoluteFill>
  );
}
