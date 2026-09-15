import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";

/**
 * The reflective-discussion beats, where the narration fires a run of questions at the
 * viewer. Rather than dumping all of them at once, each one takes the frame on the words
 * that ask it, so the slide moves with the voice instead of standing still for a minute.
 */
export function QuestionSlide({
  window,
  questions,
  askAtSeconds,
  fps = 30,
  kicker = "Think about it",
  lessonLabel,
}: {
  window: GraphicWindow;
  questions: string[];
  askAtSeconds?: number[];
  fps?: number;
  kicker?: string;
  lessonLabel?: string;
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const now = frame / fps;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  const activeIndex = askAtSeconds
    ? Math.max(0, askAtSeconds.filter((t) => now >= t).length - 1)
    : 0;
  const activeSince = askAtSeconds ? (now - askAtSeconds[activeIndex]) * fps : local;

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame
        kicker={kicker}
        lessonLabel={lessonLabel}
        bg={`linear-gradient(160deg, ${theme.colors.plumSafe} 0%, ${theme.colors.deep} 100%)`}
      >
        <SlideBody>
          <div style={{ ...fadeUp(local, 0, 10), fontSize: 92, lineHeight: 0.8, color: theme.colors.gold, marginBottom: 8 }}>
            ?
          </div>
          <div
            key={activeIndex}
            style={{
              ...fadeUp(activeSince, 0, 12),
              fontFamily: theme.headingFamily,
              fontWeight: theme.headingWeight,
              fontSize: 50,
              lineHeight: 1.25,
              color: theme.colors.cream,
            }}
          >
            {questions[activeIndex]}
          </div>

          {questions.length > 1 ? (
            <div style={{ display: "flex", gap: 10, marginTop: 40 }}>
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeIndex ? 34 : 12,
                    height: 6,
                    borderRadius: 3,
                    background: i === activeIndex ? theme.colors.gold : "rgba(250,247,238,0.22)",
                  }}
                />
              ))}
            </div>
          ) : null}
        </SlideBody>
      </SlideFrame>
    </div>
  );
}
