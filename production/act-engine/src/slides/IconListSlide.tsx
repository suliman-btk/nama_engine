import React from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../course/CourseContext";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";
import { FormalIcon } from "../components/icons";

export type IconListItem = {
  icon?: string;
  tag?: string;
  label: string;
  sublabel?: string;
};

/**
 * An executive timeline and stage roadmap slide with progressive sequential reveal.
 * Uses a connected vertical progression track, milestone sequence nodes,
 * and structured briefing panels that highlight as each stage is spoken.
 */
export function IconListSlide({
  window,
  kicker = "",
  title,
  subtitle,
  lessonLabel,
  items,
  numbered = false,
  revealTimes,
}: {
  window: GraphicWindow;
  kicker?: string;
  title?: string;
  subtitle?: string;
  lessonLabel?: string;
  items: IconListItem[];
  numbered?: boolean;
  revealTimes?: number[];
}) {
  const theme = useTheme();
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  const cardBg = "#EEF2F7";
  const edgeColor = "rgba(26,27,61,0.12)";
  const primeRed = theme.colors.navy;

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame kicker={kicker} light lessonLabel={lessonLabel}>
        <SlideBody align="center">
          {title ? (
            <div
              style={{
                ...fadeUp(local, 0, 10),
                fontFamily: theme.headingFamily,
                fontWeight: theme.headingWeight,
                fontSize: 46,
                color: theme.colors.navy,
                marginBottom: subtitle ? 6 : 26,
                lineHeight: 1.18,
              }}
            >
              {title}
            </div>
          ) : null}

          {subtitle ? (
            <div
              style={{
                ...fadeUp(local, 4, 10),
                fontFamily: theme.bodyFamily,
                fontSize: 22,
                color: theme.colors.inkDim,
                marginBottom: 26,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          ) : null}

          {/* Timeline & Roadmap Container */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Vertical timeline spine */}
            <div
              style={{
                position: "absolute",
                left: 27,
                top: 24,
                bottom: 24,
                width: 3,
                background: "rgba(2, 1, 129, 0.20)",
                zIndex: 0,
              }}
            />

            {items.map((item, i) => {
              // Progressive activation timing
              let activateFrame = 6;
              if (revealTimes && revealTimes[i] !== undefined) {
                activateFrame = Math.round(revealTimes[i] * 30);
              } else if (items.length > 1) {
                const activeWindow = Math.max(30, window.durationInFrames * 0.72);
                const step = activeWindow / items.length;
                activateFrame = Math.round(6 + i * step);
              }

              let nextActivateFrame = Infinity;
              if (revealTimes && revealTimes[i + 1] !== undefined) {
                nextActivateFrame = Math.round(revealTimes[i + 1] * 30);
              } else if (items.length > 1 && i < items.length - 1) {
                const activeWindow = Math.max(30, window.durationInFrames * 0.72);
                const step = activeWindow / items.length;
                nextActivateFrame = Math.round(6 + (i + 1) * step);
              }

              const isUpcoming = local < activateFrame;
              const isCurrent = local >= activateFrame && local < nextActivateFrame;
              const isCompleted = local >= nextActivateFrame;

              const activateProgress = Math.min(1, Math.max(0, (local - activateFrame) / 10));
              const itemOpacity = isUpcoming ? 0.35 : isCurrent ? 0.35 + activateProgress * 0.65 : 0.96;
              const itemScale = isUpcoming ? 0.985 : isCurrent ? 0.985 + activateProgress * 0.015 : 1.0;
              const nodeNumber = numbered ? `${i + 1}` : `0${i + 1}`;

              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    zIndex: 1,
                    opacity: itemOpacity,
                    transform: `scale(${itemScale})`,
                    /* no CSS transition — Remotion renders frame-by-frame */
                  }}
                >
                  {/* Timeline Milestone Node */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: isCurrent ? primeRed : "#FFFFFF",
                      border: isCurrent ? `3px solid #FFFFFF` : `3px solid ${edgeColor}`,
                      boxShadow: isCurrent
                        ? "0 4px 16px rgba(2, 1, 129, 0.35)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCurrent ? "#FFFFFF" : primeRed,
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {item.icon ? (
                      <FormalIcon name={item.icon} size={24} color={isCurrent ? "#FFFFFF" : primeRed} />
                    ) : (
                      <span>{nodeNumber}</span>
                    )}
                  </div>

                  {/* Stage Briefing Panel */}
                  <div
                    style={{
                      flex: 1,
                      background: cardBg,
                      borderRadius: 16,
                      border: isCurrent ? `2.5px solid ${primeRed}` : `1.5px solid ${edgeColor}`,
                      boxShadow: isCurrent
                        ? "0 12px 30px rgba(2, 1, 129, 0.16)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                      padding: "18px 26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 20,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: theme.headingFamily,
                          fontWeight: 700,
                          fontSize: 24,
                          color: theme.colors.navy,
                          lineHeight: 1.25,
                        }}
                      >
                        {item.label}
                      </div>
                      {item.sublabel ? (
                        <div
                          style={{
                            fontFamily: theme.bodyFamily,
                            fontSize: 18,
                            color: "rgba(26,27,61,0.74)",
                            lineHeight: 1.35,
                            marginTop: 4,
                          }}
                        >
                          {item.sublabel}
                        </div>
                      ) : null}
                    </div>

                    {/* Step indicator tag on right */}
                    <div
                      style={{
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 2,
                        color: isCurrent ? "#FFFFFF" : primeRed,
                        background: isCurrent ? primeRed : "rgba(2, 1, 129, 0.08)",
                        padding: "6px 14px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.tag ? item.tag : `Phase ${i + 1}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SlideBody>
      </SlideFrame>
    </div>
  );
}
