import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../course/CourseContext";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";
import { FormalIcon } from "../components/icons";

/**
 * A diagram of connected concept cards with progressive sequential illumination.
 * Supports:
 *  - "triangle": 3 cards in a triangle formation with connecting lines
 *  - "row": cards in a horizontal row with arrows (supports up to 7 items!)
 *  - "grid": 2x2 grid
 */
export function DiagramSlide({
  window,
  kicker = "",
  title,
  subtitle,
  lessonLabel,
  cards,
  layout = "triangle",
  connections,
  revealTimes,
}: {
  window: GraphicWindow;
  kicker?: string;
  title?: string;
  subtitle?: string;
  lessonLabel?: string;
  cards: { label: string; detail?: string; icon?: string; tag?: string }[];
  layout?: "triangle" | "row" | "grid";
  connections?: [number, number][];
  revealTimes?: number[];
}) {
  const theme = useTheme();
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  const positions = getPositions(layout, cards.length);
  const conns = connections ?? getDefaultConnections(layout, cards.length);
  const cardBg = "#EEF2F7";
  const edgeColor = "rgba(26,27,61,0.12)";
  const primeRed = "#A02828";

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
                marginBottom: subtitle ? 6 : 24,
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
                marginBottom: 24,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          ) : null}

          <div style={{ position: "relative", width: "100%", height: 580 }}>
            {/* Connection lines (z-index 0, behind nodes) */}
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
            >
              {conns.map(([from, to], ci) => {
                const lineDelay = 8 + Math.max(from, to) * 8;
                const lineProgress = interpolate(local, [lineDelay, lineDelay + 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const f = positions[from];
                const t = positions[to];
                if (!f || !t) return null;

                let toActivateFrame = 6;
                if (revealTimes && revealTimes[to] !== undefined) {
                  toActivateFrame = Math.round(revealTimes[to] * 30);
                } else if (cards.length > 1) {
                  toActivateFrame = Math.round(6 + (to / cards.length) * Math.max(30, window.durationInFrames * 0.7));
                }
                const isLineActive = local >= toActivateFrame;

                // For row layout, circles sit at 50% height with labels below.
                // The negative marginTop on the column pushes the circle center
                // to exactly the anchor Y so the line passes through it.
                const yFrom = layout === "row" ? 50 : f.y;
                const yTo = layout === "row" ? 50 : t.y;

                return (
                  <g key={ci}>
                    <line
                      x1={`${f.x}%`}
                      y1={`${yFrom}%`}
                      x2={`${f.x + (t.x - f.x) * lineProgress}%`}
                      y2={`${yFrom + (yTo - yFrom) * lineProgress}%`}
                      stroke={isLineActive ? primeRed : "rgba(26,27,61,0.12)"}
                      strokeWidth={isLineActive ? 2.5 : 1.5}
                      strokeDasharray={layout === "triangle" ? "6 6" : undefined}
                    />
                    {/* Arrow head for row layout */}
                    {layout === "row" && lineProgress > 0.9 ? (
                      <polygon
                        points={`${(f.x + (t.x - f.x) * lineProgress) - 0.4}% ${yTo - 0.8}%, ${f.x + (t.x - f.x) * lineProgress}% ${yTo}%, ${(f.x + (t.x - f.x) * lineProgress) - 0.4}% ${yTo + 0.8}%`}
                        fill={isLineActive ? primeRed : "rgba(26,27,61,0.12)"}
                      />
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {/* Cards / Nodes */}
            {cards.map((card, i) => {
              const pos = positions[i];
              if (!pos) return null;

              let activateFrame = 6;
              if (revealTimes && revealTimes[i] !== undefined) {
                activateFrame = Math.round(revealTimes[i] * 30);
              } else if (cards.length > 1) {
                const activeWindow = Math.max(30, window.durationInFrames * 0.72);
                const step = activeWindow / cards.length;
                activateFrame = Math.round(6 + i * step);
              }

              let nextActivateFrame = Infinity;
              if (revealTimes && revealTimes[i + 1] !== undefined) {
                nextActivateFrame = Math.round(revealTimes[i + 1] * 30);
              } else if (cards.length > 1 && i < cards.length - 1) {
                const activeWindow = Math.max(30, window.durationInFrames * 0.72);
                const step = activeWindow / cards.length;
                nextActivateFrame = Math.round(6 + (i + 1) * step);
              }

              const isUpcoming = local < activateFrame;
              const isCurrent = local >= activateFrame && local < nextActivateFrame;

              const activateProgress = Math.min(1, Math.max(0, (local - activateFrame) / 10));
              const itemOpacity = isUpcoming ? 0.35 : isCurrent ? 0.35 + activateProgress * 0.65 : 0.96;
              // No scale — sub-pixel scale causes text/icon vibration in Remotion.
              const itemScale = 1.0;

              const isCircular = layout === "row";
              const nodeSize = isCircular
                ? (cards.length > 5 ? 110 : 150)
                : undefined;

              const itemBorder = isCurrent ? `1.5px solid ${primeRed}` : `1.5px solid ${edgeColor}`;
              const itemShadow = isCurrent
                ? "0 8px 28px rgba(160, 40, 40, 0.18)"
                : "0 4px 14px rgba(0,0,0,0.04)";

              const cardTag = card.tag || `0${i + 1}`;

              if (isCircular) {
                // ─── Circular node for row layout ───
                // The column is positioned at top:50% with translateX(-50%) only.
                // A negative marginTop of nodeSize/2 shifts the circle center
                // to exactly 50%, matching the connection line Y.
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`,
                      top: "50%",
                      transform: `translateX(-50%)`,
                      marginTop: -(nodeSize! / 2),
                      /* no CSS transition — Remotion renders frame-by-frame */
                      opacity: itemOpacity,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      zIndex: 2,
                    }}
                  >
                    {/* Circular icon node — its center is at exactly top:50% */}
                    <div
                      style={{
                        width: nodeSize,
                        height: nodeSize,
                        borderRadius: "50%",
                        background: isCurrent ? primeRed : cardBg,
                        border: itemBorder,
                        boxShadow: itemShadow,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Numbering badge */}
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          letterSpacing: 1.5,
                          color: isCurrent ? "rgba(255,255,255,0.8)" : "rgba(26,27,61,0.45)",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        {cardTag}
                      </div>

                      {card.icon ? (
                        <FormalIcon
                          name={card.icon}
                          size={cards.length > 5 ? 38 : 46}
                          color={isCurrent ? "#FFFFFF" : primeRed}
                        />
                      ) : null}
                    </div>

                    {/* Label below the circle */}
                    <div
                      style={{
                        fontFamily: theme.headingFamily,
                        fontWeight: 700,
                        fontSize: cards.length > 5 ? 22 : 26,
                        color: isCurrent ? primeRed : theme.colors.navy,
                        textAlign: "center",
                        lineHeight: 1.25,
                        maxWidth: nodeSize! + 30,
                      }}
                    >
                      {card.label}
                    </div>

                    {card.detail ? (
                      <div
                        style={{
                          fontFamily: theme.bodyFamily,
                          fontSize: cards.length > 5 ? 18 : 20,
                          color: "rgba(26,27,61,0.65)",
                          textAlign: "center",
                          lineHeight: 1.3,
                          maxWidth: nodeSize! + 20,
                          marginTop: -4,
                        }}
                      >
                        {card.detail}
                      </div>
                    ) : null}
                  </div>
                );
              }

              // ─── Rectangular card for triangle / grid layouts ───
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${pos.x - pos.w / 2}%`,
                    top: `${pos.y - pos.h / 2}%`,
                    width: `${pos.w}%`,
                    height: `${pos.h}%`,
                    background: cardBg,
                    borderRadius: 18,
                    border: itemBorder,
                    boxShadow: itemShadow,
                    opacity: itemOpacity,
                    /* no scale — prevents sub-pixel jitter */
                    /* no CSS transition — Remotion renders frame-by-frame */
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "22px 28px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    zIndex: 1,
                  }}
                >
                  {cardTag ? (
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 2,
                        color: isCurrent ? primeRed : "rgba(26,27,61,0.50)",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      {cardTag}
                    </div>
                  ) : null}

                  {card.icon ? (
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: isCurrent ? primeRed : "#FFFFFF",
                        border: `1px solid rgba(26,27,61,0.10)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isCurrent ? "#FFFFFF" : primeRed,
                        marginBottom: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      <FormalIcon
                        name={card.icon}
                        size={26}
                        color={isCurrent ? "#FFFFFF" : primeRed}
                      />
                    </div>
                  ) : null}

                  <div
                    style={{
                      fontFamily: theme.headingFamily,
                      fontWeight: 700,
                      fontSize: 25,
                      color: theme.colors.navy,
                      textAlign: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    {card.label}
                  </div>

                  {card.detail ? (
                    <div
                      style={{
                        fontFamily: theme.bodyFamily,
                        fontSize: 18,
                        color: "rgba(26,27,61,0.75)",
                        textAlign: "center",
                        marginTop: 6,
                        lineHeight: 1.35,
                      }}
                    >
                      {card.detail}
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

function getPositions(layout: string, count: number) {
  if (layout === "triangle" && count === 3) {
    return [
      { x: 50, y: 18, w: 42, h: 33 },
      { x: 22, y: 76, w: 42, h: 33 },
      { x: 78, y: 76, w: 42, h: 33 },
    ];
  }
  if (layout === "row") {
    // For circular nodes, we only need x-center positions; height is handled by flexbox
    const margin = 4;
    const usable = 100 - margin * 2;
    const step = usable / (count - 1 || 1);
    return Array.from({ length: count }, (_, i) => ({
      x: count === 1 ? 50 : margin + step * i,
      y: 50,
      w: 0, // unused for circular
      h: 0, // unused for circular
    }));
  }
  return [
    { x: 28, y: 28, w: 42, h: 36 },
    { x: 72, y: 28, w: 42, h: 36 },
    { x: 28, y: 72, w: 42, h: 36 },
    { x: 72, y: 72, w: 42, h: 36 },
  ].slice(0, count);
}

function getDefaultConnections(layout: string, count: number): [number, number][] {
  if (layout === "triangle" && count === 3) {
    return [[0, 1], [0, 2], [1, 2]];
  }
  if (layout === "row") {
    return Array.from({ length: count - 1 }, (_, i) => [i, i + 1] as [number, number]);
  }
  return [[0, 1], [2, 3], [0, 2], [1, 3]].filter(([a, b]) => a < count && b < count) as [number, number][];
}

