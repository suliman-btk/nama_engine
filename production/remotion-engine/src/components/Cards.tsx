import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img } from "remotion";
import { COLORS, BG, FONT_HEAD, FONT_BODY } from "../lib/theme";
import { Backdrop, Kicker, BrandFooter, Ornament, fadeInUp, CrispImg, Headline, gutters } from "./Frame";
import { UNIT_ICONS } from "./Icons";

export type Side = "left" | "right";

const springAt = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 115 }, durationInFrames: 22 });

/* ------------------------------------------------------------------ *
 * 1. Statement — three visually distinct variants
 * ------------------------------------------------------------------ */
export const StatementCard: React.FC<{
  headline: string;
  kicker: string;
  side: Side;
  variant?: 0 | 1 | 2;
  bg?: string;
  ornament?: number;
}> = ({ headline, kicker, side, variant = 0, bg = BG.navyGrad, ornament = 0 }) => {
  const frame = useCurrentFrame();

  if (variant === 1) {
    // Centred, with a gold rule above the text
    return (
      <Backdrop bg={bg}>
        <Ornament kind={ornament} />
        <Kicker text={kicker} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 340px 150px",
          }}
        >
          <div style={{ width: 96, height: 6, background: COLORS.gold, marginBottom: 42, ...fadeInUp(frame, 0, 10) }} />
          <Headline text={headline} align="center" maxWidth={1340} />
        </div>
        <BrandFooter />
      </Backdrop>
    );
  }

  if (variant === 2) {
    // Split: gold panel on the left, headline on the right
    return (
      <Backdrop bg={BG.navyDeep}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 420, background: BG.goldGrad }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 420, opacity: 0.22 }}>
          <Ornament kind={1} color={COLORS.navy} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 84,
            top: 58,
            fontFamily: FONT_BODY,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            color: COLORS.navy,
            textTransform: "uppercase",
            ...fadeInUp(frame, 0, 8),
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            position: "absolute",
            ...(side === "left" ? { left: 700, right: 110 } : { left: 520, right: 640 }),
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Headline text={headline} />
        </div>
        <BrandFooter />
      </Backdrop>
    );
  }

  // Default: left accent bar, left-aligned headline
  return (
    <Backdrop bg={bg}>
      <Ornament kind={ornament} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: COLORS.gold }} />
      <Kicker text={kicker} />
      <div style={{ position: "absolute", ...gutters(side), top: "50%", transform: "translateY(-50%)" }}>
        <Headline text={headline} />
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 2. Quote — distinct plum treatment with a large quote mark
 * ------------------------------------------------------------------ */
export const QuoteCard: React.FC<{ text: string; kicker: string; side: Side }> = ({ text, kicker, side }) => {
  const frame = useCurrentFrame();
  return (
    <Backdrop bg={BG.plum}>
      <Ornament kind={3} color={COLORS.goldLight} />
      <Kicker text={kicker} />
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: 620 } : { left: 120 }),
          top: 190,
          fontFamily: FONT_HEAD,
          fontSize: 260,
          lineHeight: 0.8,
          color: COLORS.gold,
          opacity: 0.35,
          ...fadeInUp(frame, 0, 12),
        }}
      >
        “
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 700, right: 140 } : { left: 230, right: 640 }), top: "50%", transform: "translateY(-50%)" }}>
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: text.length > 70 ? 54 : 66,
            lineHeight: 1.24,
            color: "white",
            ...fadeInUp(frame, 4),
          }}
        >
          {text}
        </div>
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 3. Question / reflection prompt
 * ------------------------------------------------------------------ */
export const QuestionCard: React.FC<{ text: string; kicker: string; side: Side }> = ({ text, kicker, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, fps, 2);
  return (
    <Backdrop bg={BG.teal}>
      <Ornament kind={2} />
      <Kicker text={kicker} />
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: 660 } : { left: 120 }),
          top: 200,
          width: 108,
          height: 108,
          borderRadius: 28,
          background: COLORS.gold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${interpolate(s, [0, 1], [-14, 0])}deg)`,
          boxShadow: "0 16px 34px rgba(207,173,58,0.28)",
        }}
      >
        <span style={{ fontFamily: FONT_HEAD, fontSize: 68, color: COLORS.navy, lineHeight: 1 }}>?</span>
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 660, right: 110 } : { left: 120, right: 640 }), top: 360 }}>
        <Headline text={text} delay={6} />
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 4. Photo — full-bleed only for genuinely high-resolution art
 * ------------------------------------------------------------------ */
export const PhotoCard: React.FC<{ src: string; caption: string; kicker: string; side: Side; objectPosition?: string }> = ({
  src,
  caption,
  kicker,
  side,
  objectPosition = "center",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Gentle drift only — heavy zoom amplifies softness.
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05]);
  return (
    <Backdrop bg={COLORS.navyDeep}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: `scale(${zoom})` }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,11,30,0.55) 0%, rgba(10,11,30,0.05) 38%, rgba(8,9,26,0.94) 88%)",
        }}
      />
      <Kicker text={kicker} />
      <div style={{ position: "absolute", ...(side === "left" ? { left: 700, right: 110 } : { left: 84, right: 640 }), bottom: 112, ...fadeInUp(frame, 4) }}>
        <div style={{ width: 64, height: 6, background: COLORS.gold, marginBottom: 22 }} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: caption.length > 52 ? 48 : 56, fontWeight: 800, color: "white", lineHeight: 1.18 }}>
          {caption}
        </div>
      </div>
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 5. Inset photo — low-resolution art shown near native size, stays sharp
 * ------------------------------------------------------------------ */
export const InsetPhotoCard: React.FC<{
  src: string;
  natural: [number, number];
  caption: string;
  kicker: string;
  side: Side;
}> = ({ src, natural, caption, kicker, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, fps, 2);
  return (
    <Backdrop bg={BG.navyGradAlt}>
      <Ornament kind={0} />
      <Kicker text={kicker} />
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { right: 96 } : { left: 96 }),
          top: 176,
          width: 1020,
          height: 660,
          borderRadius: 26,
          overflow: "hidden",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`,
          opacity: interpolate(s, [0, 1], [0, 1]),
          boxShadow: "0 26px 60px rgba(0,0,0,0.38)",
        }}
      >
        <CrispImg src={src} natural={natural} boxW={980} boxH={620} maxScale={1.15} />
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 120, right: 1170 } : { left: 1160, right: 130 }), top: "50%", transform: "translateY(-50%)" }}>
        <div style={{ width: 56, height: 6, background: COLORS.gold, marginBottom: 24, ...fadeInUp(frame, 6, 8) }} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: 44, fontWeight: 800, color: "white", lineHeight: 1.2, ...fadeInUp(frame, 8) }}>
          {caption}
        </div>
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 6. Logo showcase — logos at native size on light cards
 * ------------------------------------------------------------------ */
export const LogoShowcase: React.FC<{
  logos: { src: string; natural: [number, number] }[];
  caption: string;
  kicker: string;
  side: Side;
}> = ({ logos, caption, kicker, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Backdrop bg={BG.cream} light>
      <Kicker text={kicker} dark />
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 56 }}>
        {logos.map((logo, i) => {
          const s = springAt(frame, fps, i * 6 + 4);
          return (
            <div
              key={logo.src}
              style={{
                width: 400,
                height: 440,
                background: "white",
                borderRadius: 26,
                boxShadow: "0 22px 46px rgba(20,20,50,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 34,
                transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
                opacity: interpolate(s, [0, 1], [0, 1]),
              }}
            >
              <CrispImg src={logo.src} natural={logo.natural} boxW={330} boxH={370} maxScale={1.0} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 196,
          background: COLORS.navy,
          display: "flex",
          alignItems: "center",
          paddingLeft: side === "left" ? 660 : 84,
          paddingRight: side === "left" ? 84 : 660,
        }}
      >
        <div style={{ fontFamily: FONT_HEAD, fontSize: 44, color: "white", fontWeight: 800, ...fadeInUp(frame, 12, 10) }}>{caption}</div>
      </div>
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 7. Title card — brand mark shown crisply at native size
 * ------------------------------------------------------------------ */
export const TitleCard: React.FC<{ logoSrc: string; natural: [number, number]; caption: string; kicker: string; side: Side }> = ({
  logoSrc,
  natural,
  caption,
  kicker,
  side,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, fps, 2);
  return (
    <Backdrop bg={BG.navyGrad}>
      <Ornament kind={0} />
      <Kicker text={kicker} />
      <div
        style={{
          position: "absolute",
          left: side === "left" ? "58%" : "42%",
          top: 372,
          transform: `translate(-50%,-50%) scale(${interpolate(s, [0, 1], [0.88, 1])})`,
          opacity: interpolate(s, [0, 1], [0, 1]),
          background: "white",
          borderRadius: 28,
          padding: "44px 62px",
          boxShadow: "0 26px 60px rgba(0,0,0,0.36)",
        }}
      >
        <CrispImg src={logoSrc} natural={natural} boxW={720} boxH={340} maxScale={1.1} />
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 640, right: 110 } : { left: 110, right: 640 }), top: 640, textAlign: "center" }}>
        <Headline text={caption} align="center" delay={10} />
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 8. Unit spotlight — replaces the low-res divider images entirely
 * ------------------------------------------------------------------ */
/** A step on a roadmap/process diagram. Supplied by the lesson, never hardcoded. */
export type RoadmapStep = { n?: string; title: string; q?: string };

export const UnitSpotlight: React.FC<{
  kicker: string;
  side: Side;
  number?: string;
  title?: string;
  subtitle?: string;
  iconIndex?: number;
}> = ({ kicker, side, number = "", title = "", subtitle = "", iconIndex = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = { n: number, title, q: subtitle };
  const Icon = UNIT_ICONS[iconIndex % UNIT_ICONS.length];
  const s = springAt(frame, fps, 2);
  return (
    <Backdrop bg={BG.navyGradAlt}>
      <Ornament kind={iconIndex} />
      <Kicker text={kicker} />
      {/* oversized unit numeral as a watermark, kept clear of the copy */}
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: 150 } : { right: 150 }),
          top: 150,
          fontFamily: FONT_HEAD,
          fontSize: 460,
          lineHeight: 0.82,
          color: COLORS.goldLight,
          opacity: 0.13,
          transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
        }}
      >
        {u.n}
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 700, right: 110 } : { left: 130, right: 620 }), top: 292 }}>
        <div
          style={{
            width: 122,
            height: 122,
            borderRadius: 30,
            background: COLORS.gold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-10, 0])}deg)`,
            boxShadow: "0 16px 34px rgba(207,173,58,0.3)",
          }}
        >
          <Icon color={COLORS.navy} size={62} />
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 23, fontWeight: 700, letterSpacing: 5, color: COLORS.gold, ...fadeInUp(frame, 6, 10) }}>
          UNIT {u.n}
        </div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 76, fontWeight: 800, color: "white", marginTop: 10, lineHeight: 1.08, ...fadeInUp(frame, 8) }}>
          {u.title}
        </div>
        <div style={{ width: 84, height: 5, background: COLORS.gold, margin: "26px 0", ...fadeInUp(frame, 12, 8) }} />
        <div style={{ fontFamily: FONT_BODY, fontSize: 36, color: "rgba(255,255,255,0.74)", fontStyle: "italic", ...fadeInUp(frame, 14) }}>
          {u.q}
        </div>
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 9. Learning-zones table
 * ------------------------------------------------------------------ */
/** A row of a comparison table. Supplied by the lesson, never hardcoded. */
export type TableRow = { name: string; tag?: string; color?: string; cells: string[] };

const ROW_COLORS = [COLORS.comfort, COLORS.challenge, COLORS.pain, COLORS.navy2, COLORS.teal];

export const ThreeZonesTable: React.FC<{
  caption: string;
  kicker: string;
  side: Side;
  rows?: TableRow[];
  columns?: string[];
  highlight?: number;
}> = ({ caption, kicker, side, rows = [], columns = [], highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ZONES = rows.map((r, i) => ({
    name: r.name,
    tag: r.tag ?? "",
    color: r.color ?? ROW_COLORS[i % ROW_COLORS.length],
    cells: r.cells ?? [],
  }));
  const COLS = columns.length ? columns : ["", "", ""];
  const head = { background: "rgba(255,255,255,0.06)", padding: "20px 26px", fontFamily: FONT_BODY, fontWeight: 700, color: COLORS.gold, fontSize: 24, letterSpacing: 1 };
  return (
    <Backdrop bg={BG.navyDeep}>
      <Kicker text={kicker} />
      <div style={{ position: "absolute", top: 158, left: 84, right: 84 }}>
        <div style={{ display: "grid", gridTemplateColumns: `290px ${COLS.slice(1).map((_, i) => (i === COLS.length - 2 ? "1.25fr" : "1fr")).join(" ")}`, gap: 3, borderRadius: 18, overflow: "hidden" }}>
          {COLS.map((c) => (
            <div key={c} style={head}>
              {c}
            </div>
          ))}
          {ZONES.map((z, i) => {
            const s = springAt(frame, fps, i * 6 + 4);
            const dim = highlight !== undefined && highlight !== i;
            const cell: React.CSSProperties = {
              background: "rgba(255,255,255,0.04)",
              opacity: dim ? 0.3 : interpolate(s, [0, 1], [0, 1]),
              padding: "24px 26px",
              display: "flex",
              alignItems: "center",
              fontFamily: FONT_BODY,
              fontSize: 25,
              color: "white",
            };
            return (
              <React.Fragment key={z.name}>
                <div
                  style={{
                    background: z.color,
                    opacity: dim ? 0.3 : interpolate(s, [0, 1], [0, 1]),
                    padding: "24px 26px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    transform: `translateX(${interpolate(s, [0, 1], [-22, 0])}px)`,
                    boxShadow: !dim && highlight === i ? `0 0 0 4px ${COLORS.goldLight}` : "none",
                  }}
                >
                  <div style={{ fontFamily: FONT_HEAD, fontSize: 32, color: "white", fontWeight: 800 }}>{z.name}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 21, color: "rgba(255,255,255,0.85)" }}>{z.tag}</div>
                </div>
                {z.cells.map((c, ci) => (
                  <div key={ci} style={cell}>
                    {c}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 40, marginLeft: side === "left" ? 560 : 0, marginRight: side === "left" ? 0 : 560, ...fadeInUp(frame, 26), fontFamily: FONT_HEAD, fontSize: 40, color: "white", fontWeight: 800, textAlign: "center" }}>
          {caption}
        </div>
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 10. Four-unit roadmap
 * ------------------------------------------------------------------ */
export const FourUnitsRoadmap: React.FC<{
  caption: string;
  kicker: string;
  side: Side;
  steps?: RoadmapStep[];
  highlight?: number;
}> = ({ caption, kicker, side, steps = [], highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const UNITS = steps;
  const line = interpolate(frame, [6, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Backdrop bg={BG.navyGrad}>
      <Kicker text={kicker} />
      <div style={{ position: "absolute", top: 300, left: 110, right: 110, height: 4, background: "rgba(255,255,255,0.14)" }}>
        <div style={{ width: `${line * 100}%`, height: "100%", background: COLORS.gold }} />
      </div>
      <div style={{ position: "absolute", top: 228, left: 110, right: 110, display: "flex", justifyContent: "space-between" }}>
        {UNITS.map((u, i) => {
          const s = springAt(frame, fps, i * 8 + 6);
          const dim = highlight !== undefined && highlight !== i;
          const Icon = UNIT_ICONS[i];
          return (
            <div key={u.n} style={{ width: 360, opacity: dim ? 0.3 : interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [22, 0])}px)` }}>
              <div
                style={{
                  width: 144,
                  height: 144,
                  borderRadius: "50%",
                  background: dim ? "rgba(255,255,255,0.07)" : COLORS.gold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 26px",
                  boxShadow: dim ? "none" : "0 14px 30px rgba(207,173,58,0.32)",
                }}
              >
                <Icon color={dim ? "rgba(255,255,255,0.55)" : COLORS.navy} size={64} />
              </div>
              <div style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 21, color: COLORS.gold, fontWeight: 700, letterSpacing: 2 }}>UNIT {u.n}</div>
              <div style={{ textAlign: "center", fontFamily: FONT_HEAD, fontSize: 30, color: "white", fontWeight: 800, marginTop: 6 }}>{u.title}</div>
              <div style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 21, color: "rgba(255,255,255,0.62)", marginTop: 10, fontStyle: "italic" }}>{u.q}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 620, right: 110 } : { left: 110, right: 620 }), bottom: 128, textAlign: "center", ...fadeInUp(frame, 42), fontFamily: FONT_HEAD, fontSize: 44, color: "white", fontWeight: 800 }}>
        {caption}
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 11. Pause / activity
 * ------------------------------------------------------------------ */
export const ActivityPauseCard: React.FC<{ caption: string; sub: string; kicker: string; side: Side }> = ({ caption, sub, kicker, side }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 11) * 0.05;
  return (
    <Backdrop bg={BG.goldGrad} light>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 142, background: COLORS.navy, display: "flex", alignItems: "center", paddingLeft: 84 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 26, fontWeight: 700, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase" }}>{kicker}</div>
      </div>
      <div style={{ position: "absolute", left: side === "left" ? "60%" : "40%", top: 300, transform: `translateX(-50%) scale(${pulse})`, display: "flex", gap: 24 }}>
        <div style={{ width: 58, height: 176, background: COLORS.navy, borderRadius: 14 }} />
        <div style={{ width: 58, height: 176, background: COLORS.navy, borderRadius: 14 }} />
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 640, right: 140 } : { left: 140, right: 640 }), top: 560, textAlign: "center", ...fadeInUp(frame, 6) }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 54, color: COLORS.navy, fontWeight: 800, lineHeight: 1.2 }}>{caption}</div>
        <div style={{ marginTop: 24, fontFamily: FONT_BODY, fontSize: 29, color: "#4A3D10" }}>{sub}</div>
      </div>
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 12. Worksheet / checklist
 * ------------------------------------------------------------------ */
export const WorksheetCard: React.FC<{ caption: string; kicker: string; items: string[]; side: Side }> = ({ caption, kicker, items, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Backdrop bg={BG.sand} light>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 156, background: COLORS.navy }}>
        <div style={{ padding: "52px 84px 0", fontFamily: FONT_BODY, fontSize: 26, fontWeight: 700, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase" }}>
          {kicker}
        </div>
      </div>
      <div style={{ position: "absolute", top: 202, left: side === "left" ? 660 : 84, fontFamily: FONT_HEAD, fontSize: 46, color: COLORS.navy, fontWeight: 800 }}>{caption}</div>
      <div style={{ position: "absolute", top: 310, ...(side === "left" ? { left: 660, right: 84 } : { left: 84, right: 620 }), display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((it, i) => {
          const s = springAt(frame, fps, i * 5 + 6);
          return (
            <div
              key={it}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: "white",
                borderRadius: 14,
                padding: "16px 22px",
                boxShadow: "0 8px 20px rgba(20,20,50,0.07)",
                opacity: interpolate(s, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(s, [0, 1], [-18, 0])}px)`,
              }}
            >
              <div style={{ display: "flex", gap: 7 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${COLORS.navy2}` }} />
                ))}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: COLORS.ink }}>{it}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: COLORS.gold }} />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 13. External video hand-off
 * ------------------------------------------------------------------ */
export const VideoLinkCard: React.FC<{ caption: string; kicker: string; url: string; side: Side }> = ({ caption, kicker, url, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, fps, 3);
  const pulse = 1 + Math.sin(frame / 13) * 0.05;
  return (
    <Backdrop bg={BG.navyDeep}>
      <Ornament kind={3} />
      <Kicker text={kicker} />
      <div
        style={{
          position: "absolute",
          left: side === "left" ? "60%" : "40%",
          top: 330,
          transform: `translate(-50%,-50%) scale(${interpolate(s, [0, 1], [0.6, 1]) * pulse})`,
          width: 230,
          height: 230,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${COLORS.goldLight}, ${COLORS.gold})`,
          boxShadow: "0 20px 58px rgba(207,173,58,0.38)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 0, height: 0, borderTop: "46px solid transparent", borderBottom: "46px solid transparent", borderLeft: `74px solid ${COLORS.navy}`, marginLeft: 16 }} />
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 640, right: 140 } : { left: 140, right: 640 }), top: 552, textAlign: "center", ...fadeInUp(frame, 10) }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 48, color: "white", fontWeight: 800 }}>{caption}</div>
        <div style={{ marginTop: 26, fontFamily: FONT_BODY, fontSize: 27, color: COLORS.goldLight }}>{url}</div>
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 14. Summary — numbered recap
 * ------------------------------------------------------------------ */
export const SummaryCard: React.FC<{ caption: string; kicker: string; points: string[]; side: Side }> = ({ caption, kicker, points, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Backdrop bg={BG.navyGrad}>
      <Ornament kind={1} />
      <Kicker text={kicker} />
      <div style={{ position: "absolute", left: side === "left" ? 660 : 110, top: 178, fontFamily: FONT_HEAD, fontSize: 56, fontWeight: 800, color: "white", ...fadeInUp(frame, 2) }}>
        {caption}
      </div>
      <div style={{ position: "absolute", ...(side === "left" ? { left: 660, right: 110 } : { left: 110, right: 620 }), top: 300, display: "flex", flexDirection: "column", gap: 22 }}>
        {points.map((p, i) => {
          const s = springAt(frame, fps, i * 7 + 8);
          return (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 26, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${interpolate(s, [0, 1], [-20, 0])}px)` }}>
              <div style={{ minWidth: 56, height: 56, borderRadius: 14, background: COLORS.gold, color: COLORS.navy, fontFamily: FONT_HEAD, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: "white", lineHeight: 1.32 }}>{p}</div>
            </div>
          );
        })}
      </div>
      <BrandFooter />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ *
 * 15. Outro
 * ------------------------------------------------------------------ */
export const OutroCard: React.FC<{ caption: string; kicker: string; next: string; side: Side }> = ({ caption, kicker, next, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, fps, 4);
  return (
    <Backdrop bg={BG.navyGradAlt}>
      <Ornament kind={0} />
      <Kicker text={kicker} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", transform: "translateY(-50%)", textAlign: "center", padding: side === "left" ? "0 160px 0 640px" : "0 640px 0 160px" }}>
        <Headline text={caption} align="center" />
      </div>
      <div
        style={{
          position: "absolute",
          left: side === "left" ? "62%" : "38%",
          bottom: 240,
          transform: `translateX(-50%) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
          opacity: interpolate(s, [0, 1], [0, 1]),
          background: COLORS.gold,
          color: COLORS.navy,
          fontFamily: FONT_HEAD,
          fontSize: 30,
          padding: "18px 42px",
          borderRadius: 999,
        }}
      >
        {next}
      </div>
      <BrandFooter />
    </Backdrop>
  );
};
