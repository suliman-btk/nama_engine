import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";

/**
 * The "pause and do this" beat, which the lesson has five of and which the first pass left
 * as nothing but the presenter's face — the worst offender, because these are the moments
 * the learner is meant to act on and needs to SEE the instruction.
 *
 * Steps arrive one at a time, and the pause marker pulses gently so it reads as a live
 * instruction rather than a static bullet.
 */
export function ActivitySlide({
  window,
  title,
  steps,
  pauseNote,
  kicker = "Your turn",
  lessonLabel,
}: {
  window: GraphicWindow;
  title: string;
  steps: string[];
  pauseNote?: string;
  kicker?: string;
  lessonLabel?: string;
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;
  const pulse = 0.72 + Math.sin(local / 9) * 0.28;

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame
        kicker={kicker}
        lessonLabel={lessonLabel}
      >
        <SlideBody>
          <div
            style={{
              ...fadeUp(local, 0, 12),
              fontFamily: theme.headingFamily,
              fontWeight: theme.headingWeight,
              fontSize: 46,
              lineHeight: 1.15,
              color: theme.colors.cream,
              marginBottom: 34,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {steps.map((s, i) => {
              const st = fadeUp(local, 14 + i * 9, 12);
              return (
                <div key={i} style={{ ...st, display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: theme.colors.gold,
                      color: theme.colors.deep,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.headingFamily,
                      fontWeight: theme.headingWeight,
                      fontSize: 21,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ color: theme.colors.cream, fontSize: 27, lineHeight: 1.4, paddingTop: 5 }}>{s}</div>
                </div>
              );
            })}
          </div>

          {pauseNote ? (
            <div
              style={{
                ...fadeUp(local, 14 + steps.length * 9 + 6, 12),
                marginTop: 38,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: `3px solid ${theme.colors.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pulse,
                  flexShrink: 0,
                }}
              >
                {/* pause glyph */}
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 6, height: 20, background: theme.colors.gold, borderRadius: 2 }} />
                  <div style={{ width: 6, height: 20, background: theme.colors.gold, borderRadius: 2 }} />
                </div>
              </div>
              <div
                style={{
                  color: theme.colors.goldLight,
                  fontFamily: theme.headingFamily,
                  fontWeight: theme.headingWeight,
                  fontSize: 25,
                  letterSpacing: 0.5,
                }}
              >
                {pauseNote}
              </div>
            </div>
          ) : null}
        </SlideBody>
      </SlideFrame>
    </div>
  );
}
