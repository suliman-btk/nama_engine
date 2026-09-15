import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";

/** Ground rules, the pre-workshop survey, any "here are the things" beat. Items tick in one
 * by one; when `revealAtSeconds` is supplied they tick on the words that name them. */
export function ChecklistSlide({
  window,
  title,
  items,
  kicker = "Checklist",
  lessonLabel,
  revealAtSeconds,
  fps = 30,
  rating,
}: {
  window: GraphicWindow;
  title: string;
  items: string[];
  kicker?: string;
  lessonLabel?: string;
  revealAtSeconds?: number[];
  fps?: number;
  /** Renders a 1-5 scale beside each row — used for the self-rating survey. */
  rating?: boolean;
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const now = frame / fps;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

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
              fontSize: 44,
              lineHeight: 1.15,
              color: theme.colors.cream,
              marginBottom: 30,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {items.map((item, i) => {
              const reached = revealAtSeconds ? now >= revealAtSeconds[i] : true;
              const st = revealAtSeconds
                ? { opacity: reached ? 1 : 0.3, transform: `translateY(${reached ? 0 : 8}px)` }
                : fadeUp(local, 14 + i * 8, 12);
              return (
                <div
                  key={i}
                  style={{
                    ...st,
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                    padding: "12px 18px",
                    borderRadius: 12,
                    background: reached ? "rgba(250,247,238,0.06)" : "transparent",
                    border: `1px solid ${reached ? "rgba(228,200,98,0.22)" : "transparent"}`,
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      border: `2px solid ${reached ? theme.colors.gold : "rgba(250,247,238,0.28)"}`,
                      background: reached ? theme.colors.gold : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {reached ? (
                      <svg width="18" height="14" viewBox="0 0 18 14">
                        <path
                          d="M2 7 L7 12 L16 2"
                          fill="none"
                          stroke={theme.colors.deep}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <div style={{ color: theme.colors.cream, fontSize: 25, lineHeight: 1.35, flex: 1 }}>{item}</div>
                  {rating ? (
                    <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: `2px solid ${reached ? "rgba(228,200,98,0.55)" : "rgba(250,247,238,0.2)"}`,
                          }}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </SlideBody>
      </SlideFrame>
    </div>
  );
}
