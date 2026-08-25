import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, BG, FONT_HEAD, FONT_BODY } from "../lib/theme";
import { Backdrop, Kicker, BrandFooter, Ornament, gutters } from "../components/Frame";
import type { SceneComponentProps } from "./registry";

/**
 * ConceptCardScene — visualises the MEANING of an important idea.
 *
 * This is deliberately NOT a subtitle. Subtitles reproduce the spoken words; a
 * concept card distils the idea into keywords, relationships and motion so the
 * learner remembers it. Reserved for definitions, principles, key distinctions,
 * warnings and main takeaways — roughly 5-10 per lesson.
 *
 * data: {
 *   main_message: string
 *   visual_structure: "progression" | "contrast" | "equation" | "pillars" | "cause-effect"
 *   items: (string | {label, note?, icon?})[]
 *   negative?: string           // contrast: the rejected idea
 *   positive?: string           // contrast: the accepted idea
 *   caption?: string
 * }
 */

type Item = { label: string; note?: string };

const asItems = (raw: unknown): Item[] =>
  Array.isArray(raw)
    ? raw.map((i) => (typeof i === "string" ? { label: i } : (i as Item)))
    : [];

const useReveal = (index: number, stagger = 12, delay = 8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - (delay + index * stagger),
    fps,
    config: { damping: 16, stiffness: 110 },
    durationInFrames: 24,
  });
};

const Chip: React.FC<{ item: Item; i: number; accent?: boolean; big?: boolean; density?: number }> = ({
  item, i, accent, big, density = 1,
}) => {
  const p = useReveal(i);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        background: accent ? COLORS.gold : "rgba(255,255,255,0.07)",
        border: accent ? "none" : "2px solid rgba(255,255,255,0.16)",
        color: accent ? COLORS.navy : "white",
        borderRadius: 18,
        padding: big ? `${30 * density}px ${52 * density}px` : `${22 * density}px ${40 * density}px`,
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: (big ? 54 : 42) * density,
        textAlign: "center",
        boxShadow: accent ? "0 16px 36px rgba(207,173,58,0.30)" : "none",
      }}
    >
      {item.label}
      {item.note && (
        <div style={{ fontFamily: FONT_BODY, fontWeight: 400, fontSize: 24 * density, opacity: 0.75, marginTop: 8 * density }}>
          {item.note}
        </div>
      )}
    </div>
  );
};

const Arrow: React.FC<{ i: number; vertical?: boolean; density?: number }> = ({ i, vertical, density = 1 }) => {
  const p = useReveal(i, 12, 14);
  const len = interpolate(p, [0, 1], [0, 1]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: interpolate(p, [0, 1], [0, 1]),
        height: vertical ? 58 * density : "auto",
        width: vertical ? "auto" : 78,
      }}
    >
      <svg width={vertical ? 34 : 78} height={vertical ? 58 * density : 34} viewBox={vertical ? "0 0 34 58" : "0 0 78 34"}>
        {vertical ? (
          <>
            <line x1="17" y1="2" x2="17" y2={2 + 40 * len} stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <polygon points={`17,${8 + 48 * len} 9,${44 * len} 25,${44 * len}`} fill={COLORS.gold} opacity={len} />
          </>
        ) : (
          <>
            <line x1="2" y1="17" x2={2 + 56 * len} y2="17" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <polygon points={`${10 + 64 * len},17 ${60 * len},9 ${60 * len},25`} fill={COLORS.gold} opacity={len} />
          </>
        )}
      </svg>
    </div>
  );
};

export const ConceptCardScene: React.FC<SceneComponentProps> = ({ scene, side }) => {
  const frame = useCurrentFrame();
  const d = (scene.data ?? {}) as Record<string, unknown>;
  const structure = (d.visual_structure as string) ?? "progression";
  const items = asItems(d.items);
  const message = (d.main_message as string) ?? scene.on_screen_text ?? "";
  const kicker = scene.section.replace(/-/g, " ");

  const headline = (
    <div
      style={{
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: (items.length >= 4 ? 42 : message.length > 54 ? 46 : 56),
        color: "white",
        lineHeight: 1.18,
        opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [0, 14], [18, 0], { extrapolateRight: "clamp" })}px)`,
      }}
    >
      {message}
    </div>
  );

  let body: React.ReactNode = null;

  if (structure === "contrast") {
    const neg = (d.negative as string) ?? items[0]?.label ?? "";
    const pos = (d.positive as string) ?? items[1]?.label ?? "";
    const p0 = useReveal(0);
    const p1 = useReveal(1);
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: interpolate(p0, [0, 1], [0, 1]) }}>
          <span style={{ fontSize: 46, color: COLORS.pain, fontFamily: FONT_HEAD }}>✕</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 21, letterSpacing: 3, color: "rgba(255,255,255,0.5)" }}>NOT</span>
          <span style={{ fontFamily: FONT_HEAD, fontSize: 44, color: "rgba(255,255,255,0.62)", textDecoration: "line-through" }}>
            {neg}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: interpolate(p1, [0, 1], [0, 1]), transform: `translateX(${interpolate(p1, [0, 1], [-16, 0])}px)` }}>
          <span style={{ fontSize: 46, color: COLORS.green, fontFamily: FONT_HEAD }}>✓</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 21, letterSpacing: 3, color: COLORS.gold }}>BUT</span>
          <span style={{ fontFamily: FONT_HEAD, fontSize: 52, color: "white", fontWeight: 800 }}>{pos}</span>
        </div>
      </div>
    );
  } else if (structure === "progression" || structure === "cause-effect") {
    // 3 items fit comfortably; tighten as the list grows so it never runs past
    // the footer (a 4-step progression overflowed before this).
    const density = items.length >= 5 ? 0.62 : items.length === 4 ? 0.74 : 1;
    body = (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
        {items.map((it, i) => (
          <React.Fragment key={it.label}>
            {i > 0 && <Arrow i={i} vertical density={density} />}
            <Chip item={it} i={i} accent={i === items.length - 1} big={i === items.length - 1} density={density} />
          </React.Fragment>
        ))}
      </div>
    );
  } else {
    // pillars / equation — laid out horizontally
    body = (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {items.map((it, i) => (
          <React.Fragment key={it.label}>
            {i > 0 && <Arrow i={i} />}
            <Chip item={it} i={i} accent={structure === "equation" && i === items.length - 1} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <Backdrop bg={BG.navyGradAlt}>
      <Ornament kind={2} />
      <Kicker text={kicker} />
      <div style={{ position: "absolute", ...gutters(side), top: 170, bottom: 130, display: "flex", flexDirection: "column", justifyContent: "center", gap: items.length >= 4 ? 26 : 46, overflow: "hidden" }}>
        {headline}
        {body}
      </div>
      <BrandFooter />
    </Backdrop>
  );
};
