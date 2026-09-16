import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp, AccentEdge, useContentEdges } from "./SlideFrame";

/**
 * The course's signature slide: one sentence, given the whole frame.
 *
 * `variant: "split"` is the gold-panel look from the existing course design — a solid gold
 * column on the left with the kicker sitting in it, headline on the navy to its right.
 * `"bar"` is the quieter everyday version (thin gold rule, left-aligned) and `"centred"`
 * sits the line in the middle under a gold rule, for the biggest moments.
 *
 * Words arrive in a wave rather than the whole line fading at once, so a statement that sits
 * on screen for eight seconds has something happening in its first second.
 */
export function StatementSlide({
  window,
  headline,
  kicker = "",
  lessonLabel,
  variant = "bar",
  emphasize = [],
}: {
  window: GraphicWindow;
  headline: string;
  kicker?: string;
  lessonLabel?: string;
  variant?: "bar" | "split" | "centred";
  emphasize?: string[];
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  const edges = useContentEdges();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  const words = headline.split(" ");
  const hot = new Set(emphasize.map((w) => w.toLowerCase().replace(/[.,!?—]/g, "")));

  const headlineEl = (
    <div
      style={{
        fontFamily: theme.headingFamily,
        fontWeight: theme.headingWeight,
        fontSize: variant === "centred" ? 66 : 58,
        lineHeight: 1.2,
        color: theme.colors.cream,
        textAlign: variant === "centred" ? "center" : "left",
      }}
    >
      {words.map((w, i) => {
        const bare = w.toLowerCase().replace(/[.,!?—]/g, "");
        const st = fadeUp(local, 8 + i * 1.6, 10);
        return (
          <span
            key={i}
            style={{ ...st, display: "inline-block", marginRight: "0.28em", color: hot.has(bare) ? theme.colors.goldLight : undefined }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );

  if (variant === "split") {
    return (
      <div style={{ opacity: slideOpacity }}>
        <SlideFrame bg={theme.colors.surface} lessonLabel={lessonLabel} hideChrome>
          {/* solid gold column */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 420,
              background: `linear-gradient(160deg, ${theme.colors.gold} 0%, ${theme.colors.goldLight} 100%)`,
            }}
          />
          {kicker ? (
            <div
              style={{
                position: "absolute",
                left: 84,
                top: 56,
                width: 270,
                fontSize: 31,
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: 2.2,
                color: theme.colors.deep,
                textShadow: "0 1px 0 rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                ...fadeUp(local, 0, 8),
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 520, right: edges.right, top: "50%", transform: "translateY(-50%)" }}>
            {headlineEl}
          </div>
          {lessonLabel ? (
            <div
              style={{
                position: "absolute",
                left: 520,
                bottom: 26,
                fontSize: 21,
                letterSpacing: 1,
                color: "rgba(250,247,238,0.45)",
              }}
            >
              {lessonLabel}
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: theme.colors.gold }} />
        </SlideFrame>
      </div>
    );
  }

  if (variant === "centred") {
    return (
      <div style={{ opacity: slideOpacity }}>
        <SlideFrame kicker={kicker} lessonLabel={lessonLabel}>
          <div
            style={{
              position: "absolute",
              left: edges.left,
              right: edges.right,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 96,
                height: 6,
                background: theme.colors.gold,
                marginBottom: 40,
                transform: `scaleX(${Math.min(1, Math.max(0, local / 12))})`,
              }}
            />
            {headlineEl}
          </div>
        </SlideFrame>
      </div>
    );
  }

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame kicker={kicker} lessonLabel={lessonLabel}>
        <AccentEdge />
        <SlideBody>{headlineEl}</SlideBody>
      </SlideFrame>
    </div>
  );
}
