import React from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../course/CourseContext";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";
import { FormalIcon } from "../components/icons";

export type CardItem = {
  tag?: string;
  icon?: string;
  title: string;
  body?: string;
  highlights?: string[];
  activeFromSeconds?: number;
};

/*
 * Minimum font sizes (at 1920×1080):
 *   Tag / kicker labels:  18 px
 *   Body / description:   24 px
 *   Card title:           32 px
 *   Slide title:          48 px
 *
 * No highlight badges — keep the viewer focused on one clear message per card.
 */

export function CardGridSlide({
  window,
  kicker = "",
  title,
  subtitle,
  lessonLabel,
  cards,
  columns = 2,
  themeMode = "light",
  bg,
  revealTimes,
  variant = "default",
}: {
  window: GraphicWindow;
  kicker?: string;
  title?: string;
  subtitle?: string;
  lessonLabel?: string;
  cards: CardItem[];
  columns?: 1 | 2 | 3 | 4;
  themeMode?: "light" | "brand";
  bg?: string;
  revealTimes?: number[];
  variant?: "default" | "horizontal" | "comparison" | "pill" | "icon-top" | "glass" | "accent";
}) {
  const theme = useTheme();
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;

  const isBrand = themeMode === "brand" || variant === "glass" || (Boolean(bg) && (bg === "#A02828" || bg === theme.colors.navy || bg === theme.colors.mid || bg === theme.colors.gold));
  const slideBg = isBrand ? (bg === "#A02828" ? theme.colors.navy : (bg || theme.colors.navy)) : undefined;
  const primeRed = isBrand ? theme.colors.gold : theme.colors.navy;

  const titleColor = isBrand ? "#FFFFFF" : theme.colors.navy;
  const subtitleColor = isBrand ? "rgba(255, 255, 255, 0.92)" : theme.colors.inkDim;

  const effectiveColumns =
    variant === "comparison" ? 2
    : variant === "horizontal" ? Math.min(cards.length, 4)
    : variant === "icon-top" ? Math.min(cards.length, 4)
    : variant === "pill" ? 1
    : Math.min(columns, 2);

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame kicker={kicker} bg={slideBg} light={!isBrand} lessonLabel={lessonLabel}>
        <SlideBody align="center">
          {title ? (
            <div
              style={{
                ...fadeUp(local, 0, 10),
                fontFamily: theme.headingFamily,
                fontWeight: theme.headingWeight,
                fontSize: 48,
                color: titleColor,
                marginBottom: subtitle ? 6 : 20,
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
                fontSize: 26,
                color: subtitleColor,
                marginBottom: 22,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </div>
          ) : null}

          <div
            style={{
              display: variant === "pill" ? "flex" : "grid",
              ...(variant === "pill"
                ? { flexDirection: "column" as const, gap: 18 }
                : {
                    gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
                    gap: 18,
                    alignItems: "stretch",
                  }),
            }}
          >
            {cards.map((card, i) => {
              const timing = computeTiming(i, cards.length, local, revealTimes, window.durationInFrames);

              switch (variant) {
                case "pill":
                  return <PillCard key={i} card={card} i={i} timing={timing} theme={theme} primeRed={primeRed} isBrand={isBrand} />;
                case "icon-top":
                  return <IconTopCard key={i} card={card} i={i} timing={timing} theme={theme} primeRed={primeRed} isBrand={isBrand} effectiveColumns={effectiveColumns} />;
                case "glass":
                  return <GlassCard key={i} card={card} i={i} timing={timing} theme={theme} primeRed={primeRed} />;
                case "accent":
                  return <AccentCard key={i} card={card} i={i} timing={timing} theme={theme} primeRed={primeRed} totalCards={cards.length} effectiveColumns={effectiveColumns} />;
                case "comparison":
                  return <ComparisonCard key={i} card={card} i={i} timing={timing} theme={theme} primeRed={primeRed} isBrand={isBrand} />;
                default:
                  return (
                    <DefaultCard
                      key={i}
                      card={card}
                      i={i}
                      timing={timing}
                      theme={theme}
                      primeRed={primeRed}
                      isBrand={isBrand}
                      variant={variant}
                      effectiveColumns={effectiveColumns}
                      totalCards={cards.length}
                    />
                  );
              }
            })}
          </div>
        </SlideBody>
      </SlideFrame>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

type Timing = {
  isUpcoming: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
  activateProgress: number;
  opacity: number;
  scale: number;
};

function computeTiming(
  i: number, count: number, local: number,
  revealTimes: number[] | undefined, durationInFrames: number,
): Timing {
  let activateFrame = 6;
  if (revealTimes && revealTimes[i] !== undefined) {
    activateFrame = Math.round(revealTimes[i] * 30);
  } else if (count > 1) {
    const aw = Math.max(30, durationInFrames * 0.72);
    activateFrame = Math.round(6 + i * (aw / count));
  }
  let nextActivateFrame = Infinity;
  if (revealTimes && revealTimes[i + 1] !== undefined) {
    nextActivateFrame = Math.round(revealTimes[i + 1] * 30);
  } else if (count > 1 && i < count - 1) {
    const aw = Math.max(30, durationInFrames * 0.72);
    nextActivateFrame = Math.round(6 + (i + 1) * (aw / count));
  }
  const isUpcoming = local < activateFrame;
  const isCurrent = local >= activateFrame && local < nextActivateFrame;
  const isCompleted = local >= nextActivateFrame;
  const activateProgress = Math.min(1, Math.max(0, (local - activateFrame) / 10));
  const opacity = isUpcoming ? 0.32 : isCurrent ? 0.32 + activateProgress * 0.68 : 0.96;
  // No scale — sub-pixel scale causes text/icon vibration in Remotion.
  return { isUpcoming, isCurrent, isCompleted, activateProgress, opacity, scale: 1 };
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 1 — Default (executive header band)
   ═══════════════════════════════════════════════════════════════════════════ */

function DefaultCard({
  card, i, timing, theme, primeRed, isBrand, variant, effectiveColumns, totalCards,
}: {
  card: CardItem; i: number; timing: Timing; theme: any; primeRed: string; isBrand: boolean;
  variant: string; effectiveColumns: number; totalCards: number;
}) {
  const cardBg = isBrand ? "#FFFFFF" : "#EEF2F7";
  const edgeColor = isBrand ? "rgba(255,255,255,0.90)" : "rgba(26,27,61,0.12)";
  const cardShadow = isBrand ? "0 14px 36px rgba(0,0,0,0.22)" : "0 4px 16px rgba(0,0,0,0.04)";
  const cardTag = card.tag || `0${i + 1}`;
  const isCenteredThird = variant === "default" && effectiveColumns === 2 && totalCards === 3 && i === 2;

  const border = timing.isCurrent
    ? isBrand ? "1.5px solid rgba(255,255,255,0.6)" : `1.5px solid ${primeRed}`
    : `1.5px solid ${edgeColor}`;
  const shadow = timing.isCurrent
    ? isBrand ? "0 20px 48px rgba(0,0,0,0.40)" : "0 14px 36px rgba(2,1,129,0.18)"
    : cardShadow;

  return (
    <div
      style={{
        ...(isCenteredThird ? { gridColumn: "1 / -1", justifySelf: "center", width: "calc((100% - 18px) / 2)" } : {}),
        opacity: timing.opacity,
        /* no scale — prevents sub-pixel jitter */
        background: cardBg,
        borderRadius: 18,
        border,
        boxShadow: shadow,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {timing.isCurrent ? (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: isBrand ? "#FFFFFF" : primeRed, zIndex: 2 }} />
      ) : null}

      {/* Header band */}
      <div
        style={{
          background: timing.isCurrent
            ? isBrand ? "rgba(205,172,59,0.12)" : "rgba(2,1,129,0.07)"
            : "rgba(26,27,61,0.04)",
          borderBottom: `1px solid ${edgeColor}`,
          padding: "16px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: timing.isCurrent ? primeRed : "rgba(26,27,61,0.70)", textTransform: "uppercase" as const, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: timing.isCurrent ? primeRed : "rgba(26,27,61,0.35)", display: "inline-block" }} />
          {cardTag}
        </div>
        {card.icon ? (
          <div style={{ width: 56, height: 56, borderRadius: 14, background: timing.isCurrent ? primeRed : "#FFFFFF", border: "1.5px solid rgba(26,27,61,0.12)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FormalIcon name={card.icon} size={36} color={timing.isCurrent ? "#FFFFFF" : primeRed} />
          </div>
        ) : null}
      </div>

      {/* Body — title + body only, no badges */}
      <div style={{ padding: "22px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontFamily: theme.headingFamily, fontWeight: 700, fontSize: 32, color: theme.colors.navy, lineHeight: 1.25 }}>{card.title}</div>
        {card.body ? <div style={{ fontFamily: theme.bodyFamily, fontSize: 24, color: "rgba(26,27,61,0.78)", lineHeight: 1.40, marginTop: 10 }}>{card.body}</div> : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 2 — Pill (horizontal: circle icon left, text right — NO badges)
   ═══════════════════════════════════════════════════════════════════════════ */

function PillCard({
  card, i, timing, theme, primeRed, isBrand,
}: {
  card: CardItem; i: number; timing: Timing; theme: any; primeRed: string; isBrand: boolean;
}) {
  const bg = isBrand ? "rgba(255,255,255,0.12)" : "#EEF2F7";
  const border = timing.isCurrent
    ? `1.5px solid ${isBrand ? "rgba(255,255,255,0.5)" : primeRed}`
    : `1.5px solid ${isBrand ? "rgba(255,255,255,0.15)" : "rgba(26,27,61,0.10)"}`;
  const shadow = timing.isCurrent ? "0 8px 28px rgba(2,1,129,0.14)" : "0 2px 10px rgba(0,0,0,0.04)";
  const textColor = isBrand ? "#FFFFFF" : theme.colors.navy;
  const bodyColor = isBrand ? "rgba(255,255,255,0.82)" : "rgba(26,27,61,0.72)";

  return (
    <div
      style={{
        opacity: timing.opacity,
        /* no scale — prevents sub-pixel jitter */
        background: bg,
        borderRadius: 60,
        border,
        boxShadow: shadow,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "20px 36px 20px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Circular icon */}
      <div
        style={{
          flexShrink: 0,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: timing.isCurrent ? primeRed : isBrand ? "rgba(255,255,255,0.15)" : "#FFFFFF",
          border: `1.5px solid ${timing.isCurrent ? primeRed : "rgba(26,27,61,0.08)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: timing.isCurrent ? "0 4px 16px rgba(2,1,129,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {card.icon ? <FormalIcon name={card.icon} size={44} color={timing.isCurrent ? "#FFFFFF" : primeRed} /> : null}
      </div>

      {/* Text only — clean, no badges */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {card.tag ? (
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: timing.isCurrent ? primeRed : "rgba(26,27,61,0.5)", textTransform: "uppercase" as const, marginBottom: 4 }}>
            {card.tag}
          </div>
        ) : null}
        <div style={{ fontFamily: theme.headingFamily, fontWeight: 700, fontSize: 32, color: textColor, lineHeight: 1.25 }}>{card.title}</div>
        {card.body ? <div style={{ fontFamily: theme.bodyFamily, fontSize: 24, color: bodyColor, lineHeight: 1.35, marginTop: 6 }}>{card.body}</div> : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 3 — Icon-top (centered circle icon, label below)
   ═══════════════════════════════════════════════════════════════════════════ */

function IconTopCard({
  card, i, timing, theme, primeRed, isBrand, effectiveColumns,
}: {
  card: CardItem; i: number; timing: Timing; theme: any; primeRed: string; isBrand: boolean; effectiveColumns: number;
}) {
  const bg = isBrand ? "#FFFFFF" : "#F6F7FB";
  const size = effectiveColumns >= 4 ? 100 : 110;

  return (
    <div
      style={{
        opacity: timing.opacity,
        /* no scale — prevents sub-pixel jitter */
        background: bg,
        borderRadius: 20,
        border: timing.isCurrent ? `1.5px solid ${primeRed}` : "1.5px solid rgba(26,27,61,0.08)",
        boxShadow: timing.isCurrent ? "0 10px 30px rgba(2,1,129,0.15)" : "0 3px 14px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: effectiveColumns >= 4 ? "30px 18px 26px" : "36px 24px 30px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: timing.isCurrent ? primeRed : "#FFFFFF",
          border: `1.5px solid ${timing.isCurrent ? primeRed : "rgba(26,27,61,0.10)"}`,
          boxShadow: timing.isCurrent ? "0 6px 20px rgba(2,1,129,0.22)" : "0 3px 12px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        {card.icon ? <FormalIcon name={card.icon} size={effectiveColumns >= 4 ? 46 : 52} color={timing.isCurrent ? "#FFFFFF" : primeRed} /> : null}
      </div>

      {card.tag ? (
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: timing.isCurrent ? primeRed : "rgba(26,27,61,0.45)", textTransform: "uppercase" as const, marginBottom: 6 }}>
          {card.tag}
        </div>
      ) : null}

      <div style={{ fontFamily: theme.headingFamily, fontWeight: 700, fontSize: effectiveColumns >= 4 ? 28 : 32, color: theme.colors.navy, lineHeight: 1.25, marginBottom: 6 }}>
        {card.title}
      </div>

      {card.body ? (
        <div style={{ fontFamily: theme.bodyFamily, fontSize: effectiveColumns >= 4 ? 20 : 24, color: "rgba(26,27,61,0.72)", lineHeight: 1.35 }}>
          {card.body}
        </div>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 4 — Glass (glassmorphism on brand backgrounds)
   ═══════════════════════════════════════════════════════════════════════════ */

function GlassCard({
  card, i, timing, theme, primeRed,
}: {
  card: CardItem; i: number; timing: Timing; theme: any; primeRed: string;
}) {
  return (
    <div
      style={{
        opacity: timing.opacity,
        /* no scale — prevents sub-pixel jitter */
        background: timing.isCurrent ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.10)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: 22,
        border: timing.isCurrent ? "1.5px solid rgba(255,255,255,0.50)" : "1.5px solid rgba(255,255,255,0.18)",
        boxShadow: timing.isCurrent ? "0 16px 40px rgba(0,0,0,0.30)" : "0 6px 20px rgba(0,0,0,0.15)",
        padding: "28px 30px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {timing.isCurrent ? (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.7)", zIndex: 2 }} />
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
        {card.icon ? (
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: timing.isCurrent ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormalIcon name={card.icon} size={36} color="#FFFFFF" />
          </div>
        ) : null}
        <div>
          {card.tag ? (
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: "rgba(255,255,255,0.65)", textTransform: "uppercase" as const, marginBottom: 4 }}>
              {card.tag}
            </div>
          ) : null}
          <div style={{ fontFamily: theme.headingFamily, fontWeight: 700, fontSize: 32, color: "#FFFFFF", lineHeight: 1.25 }}>{card.title}</div>
        </div>
      </div>

      {card.body ? <div style={{ fontFamily: theme.bodyFamily, fontSize: 24, color: "rgba(255,255,255,0.90)", lineHeight: 1.40 }}>{card.body}</div> : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 5 — Accent (left coloured strip, clean body)
   ═══════════════════════════════════════════════════════════════════════════ */

function AccentCard({
  card, i, timing, theme, primeRed, totalCards, effectiveColumns,
}: {
  card: CardItem; i: number; timing: Timing; theme: any; primeRed: string; totalCards: number; effectiveColumns: number;
}) {
  const isCenteredThird = effectiveColumns === 2 && totalCards === 3 && i === 2;
  const accentColors = [theme.colors.gold, theme.colors.navy, theme.colors.goldLight, theme.colors.mid];
  const accent = timing.isCurrent ? primeRed : accentColors[i % accentColors.length];

  return (
    <div
      style={{
        ...(isCenteredThird ? { gridColumn: "1 / -1", justifySelf: "center", width: "calc((100% - 18px) / 2)" } : {}),
        opacity: timing.opacity,
        /* no scale — prevents sub-pixel jitter */
        background: "#FFFFFF",
        borderRadius: 16,
        border: timing.isCurrent ? `1.5px solid ${primeRed}` : "1.5px solid rgba(26,27,61,0.08)",
        boxShadow: timing.isCurrent ? "0 10px 32px rgba(2,1,129,0.15)" : "0 3px 14px rgba(0,0,0,0.04)",
        display: "flex",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Left accent strip */}
      <div style={{ width: 7, flexShrink: 0, background: accent, borderRadius: "16px 0 0 16px" }} />

      <div style={{ padding: "22px 26px", display: "flex", flex: 1, gap: 20, alignItems: "flex-start" }}>
        {card.icon ? (
          <div
            style={{
              flexShrink: 0,
              width: 64,
              height: 64,
              borderRadius: 14,
              background: timing.isCurrent ? primeRed : `${accent}15`,
              border: `1.5px solid ${timing.isCurrent ? primeRed : accent}25`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormalIcon name={card.icon} size={34} color={timing.isCurrent ? "#FFFFFF" : accent} />
          </div>
        ) : null}

        <div style={{ flex: 1, minWidth: 0 }}>
          {card.tag ? (
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: accent, textTransform: "uppercase" as const, marginBottom: 4 }}>
              {card.tag}
            </div>
          ) : null}
          <div style={{ fontFamily: theme.headingFamily, fontWeight: 700, fontSize: 30, color: theme.colors.navy, lineHeight: 1.25 }}>{card.title}</div>
          {card.body ? <div style={{ fontFamily: theme.bodyFamily, fontSize: 24, color: "rgba(26,27,61,0.75)", lineHeight: 1.40, marginTop: 8 }}>{card.body}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 6 — Comparison (side-by-side duel)
   ═══════════════════════════════════════════════════════════════════════════ */

function ComparisonCard({
  card, i, timing, theme, primeRed, isBrand,
}: {
  card: CardItem; i: number; timing: Timing; theme: any; primeRed: string; isBrand: boolean;
}) {
  const cardBg = isBrand ? "#FFFFFF" : (i === 0 ? "#F0F4F8" : "#FFF8F4");
  const edgeColor = isBrand ? "rgba(255,255,255,0.90)" : "rgba(26,27,61,0.10)";
  const accentColor = i === 0 ? "#1B6B93" : primeRed;

  return (
    <div
      style={{
        opacity: timing.opacity,
        /* no scale — prevents sub-pixel jitter */
        background: cardBg,
        borderRadius: 20,
        border: timing.isCurrent ? `1.5px solid ${accentColor}` : `1.5px solid ${edgeColor}`,
        boxShadow: timing.isCurrent ? `0 14px 36px ${accentColor}28` : "0 4px 16px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 5, background: accentColor }} />

      {/* Header with icon */}
      <div style={{ padding: "24px 30px 0", display: "flex", alignItems: "center", gap: 18 }}>
        {card.icon ? (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: timing.isCurrent ? accentColor : "#FFFFFF",
              border: `1.5px solid ${accentColor}30`,
              boxShadow: `0 4px 14px ${accentColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormalIcon name={card.icon} size={38} color={timing.isCurrent ? "#FFFFFF" : accentColor} />
          </div>
        ) : null}
        <div>
          {card.tag ? (
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: accentColor, textTransform: "uppercase" as const, marginBottom: 4 }}>{card.tag}</div>
          ) : null}
          <div style={{ fontFamily: theme.headingFamily, fontWeight: 700, fontSize: 34, color: theme.colors.navy, lineHeight: 1.2 }}>{card.title}</div>
        </div>
      </div>

      {/* Body — clean, no bullets */}
      <div style={{ padding: "16px 30px 28px" }}>
        {card.body ? <div style={{ fontFamily: theme.bodyFamily, fontSize: 24, color: "rgba(26,27,61,0.78)", lineHeight: 1.40 }}>{card.body}</div> : null}
      </div>
    </div>
  );
}
