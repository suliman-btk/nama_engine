import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../course/CourseContext";
import { useBrand } from "../course/CourseContext";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";

/**
 * The opening title. The lesson previously started cold on a talking head — no branding, no
 * title, nothing to say what this is.
 *
 * Built as a sequence rather than a static card: the gold column wipes in, the course mark
 * lands, the title and unit line follow, and the whole thing lifts away into the lesson. It
 * runs over the first seconds of narration, so nothing is added to the runtime.
 *
 * The logo filename is read from the course config (`brand.titleLogo`), so different courses
 * can use different logos without editing engine code.
 */
export function TitleSlide({
  window,
  title,
  subtitle,
  unitLabel,
  lessonLabel,
}: {
  window: GraphicWindow;
  title: string;
  subtitle?: string;
  unitLabel?: string;
  lessonLabel?: string;
}) {
  const theme = useTheme();
  const brand = useBrand();
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

  const columnW = interpolate(e(0, 18), [0, 1], [0, 47]);
  const logoFile = brand.titleLogo ?? brand.watermarkLogo;
  const namaLogo = brand.watermarkLogoColored ?? brand.watermarkLogo;

  return (
    <AbsoluteFill
      style={{
        background: "#FFFFFF",
        opacity: 1 - outEase,
        transform: `translateY(${-outEase * 40}px)`,
        fontFamily: theme.bodyFamily,
        overflow: "hidden",
      }}
    >
      {/* accent column wipes in from the left */}
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

      {/* Co-branded mark sits on the accent column - enlarged for maximum impact */}
      <div
        style={{
          position: "absolute",
          left: "3.5%",
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - e(14, 16)) * -40}px)`,
          opacity: e(14, 16),
          width: 660,
          background: "#FFFFFF",
          padding: "42px 46px 36px",
          borderRadius: 26,
          boxShadow: "0 26px 70px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        {/* PRIME HERO LOGO - Maximum size and clarity */}
        <Img
          src={staticFile(`brand/${logoFile}`)}
          style={{
            width: "96%",
            maxHeight: 230,
            objectFit: "contain",
            display: "block",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))",
          }}
        />

        {/* NAMA FOUNDATION PRESENTED BY - Large, prominent and crisp */}
        {namaLogo ? (
          <div
            style={{
              width: "100%",
              paddingTop: 22,
              borderTop: "2px solid rgba(26,27,61,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 3.5,
                color: theme.colors.gold,
                textTransform: "uppercase",
              }}
            >
              Presented By
            </div>
            <Img
              src={staticFile(`brand/${namaLogo}`)}
              style={{
                height: 96,
                maxWidth: "90%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        ) : null}
      </div>

      {/* title block */}
      <div style={{ position: "absolute", left: "52%", right: "8%", top: "44%", transform: "translateY(-50%)" }}>
        {unitLabel ? (
          <div
            style={{
              opacity: e(24, 14),
              transform: `translateY(${(1 - e(24, 14)) * 16}px)`,
              color: theme.colors.gold,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 3.5,
              textTransform: "uppercase",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: theme.colors.gold,
                display: "inline-block",
              }}
            />
            {unitLabel}
          </div>
        ) : null}

        <div
          style={{
            opacity: e(30, 16),
            transform: `translateY(${(1 - e(30, 16)) * 22}px)`,
            fontFamily: theme.headingFamily,
            fontWeight: theme.headingWeight,
            fontSize: 58,
            lineHeight: 1.15,
            color: theme.colors.navy,
            marginBottom: 18,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              opacity: e(38, 14),
              transform: `translateY(${(1 - e(38, 14)) * 14}px)`,
              fontFamily: theme.bodyFamily,
              fontSize: 24,
              color: theme.colors.inkDim,
              lineHeight: 1.4,
              maxWidth: 780,
            }}
          >
            {subtitle}
          </div>
        ) : null}

        <div
          style={{
            width: interpolate(e(44, 18), [0, 1], [0, 140]),
            height: 6,
            background: theme.colors.gold,
            marginTop: 26,
            borderRadius: 3,
          }}
        />
      </div>

      {lessonLabel ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 44,
            opacity: e(48, 14),
            color: "rgba(26,27,61,0.55)",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 1.5,
          }}
        >
          {lessonLabel}
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: theme.colors.gold }} />
    </AbsoluteFill>
  );
}
