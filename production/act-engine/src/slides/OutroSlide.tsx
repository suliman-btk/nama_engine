import React from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../course/CourseContext";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";

/** Lesson close: what was covered, and what comes next. */
export function OutroSlide({
  window,
  title,
  points = [],
  next,
  kicker = "That's lesson one",
  lessonLabel,
}: {
  window: GraphicWindow;
  title: string;
  points?: string[];
  next?: string;
  kicker?: string;
  lessonLabel?: string;
}) {
  const theme = useTheme();
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame kicker={kicker} lessonLabel={lessonLabel}>
        <SlideBody>
          <div
            style={{
              ...fadeUp(local, 0, 12),
              fontFamily: theme.headingFamily,
              fontWeight: theme.headingWeight,
              fontSize: 46,
              lineHeight: 1.15,
              color: theme.colors.cream,
              marginBottom: 28,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {points.map((p, i) => (
              <div key={i} style={{ ...fadeUp(local, 14 + i * 8, 12), display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: theme.colors.gold, marginTop: 12, flexShrink: 0 }} />
                <div style={{ color: theme.colors.inkDim, fontSize: 26, lineHeight: 1.4 }}>{p}</div>
              </div>
            ))}
          </div>
          {next ? (
            <div
              style={{
                ...fadeUp(local, 20 + points.length * 8, 14),
                marginTop: 38,
                paddingTop: 26,
                borderTop: `2px solid rgba(228,200,98,0.28)`,
              }}
            >
              <div style={{ color: theme.colors.gold, fontSize: 20, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                Next lesson
              </div>
              <div style={{ color: theme.colors.cream, fontFamily: theme.headingFamily, fontWeight: theme.headingWeight, fontSize: 34 }}>
                {next}
              </div>
            </div>
          ) : null}
        </SlideBody>
      </SlideFrame>
    </div>
  );
}
