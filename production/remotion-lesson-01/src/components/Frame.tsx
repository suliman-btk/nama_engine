import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig, spring, Img } from "remotion";
import { COLORS, FONT_BODY, FONT_HEAD } from "../lib/theme";

/** A slow-moving light wash so flat backgrounds still feel alive. */
export const AmbientWash: React.FC<{ tint?: string }> = ({ tint = "255,255,255" }) => {
  const frame = useCurrentFrame();
  const x = 30 + Math.sin(frame / 130) * 18;
  const y = 24 + Math.cos(frame / 160) * 14;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(${tint},0.075) 0%, rgba(${tint},0) 58%)`,
      }}
    />
  );
};

export const Backdrop: React.FC<{ bg: string; children: React.ReactNode; light?: boolean }> = ({
  bg,
  children,
  light,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: bg,
      position: "relative",
      overflow: "hidden",
      fontFamily: FONT_BODY,
    }}
  >
    <AmbientWash tint={light ? "40,44,110" : "255,255,255"} />
    {children}
  </div>
);

export const Kicker: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, 14], [-14, 0], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: 84,
        opacity: o,
        transform: `translateX(${x}px)`,
        fontFamily: FONT_BODY,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 4,
        color: dark ? COLORS.navy2 : COLORS.gold,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

export const BrandFooter: React.FC<{ dark?: boolean; label?: string }> = ({ dark, label = "ACT · Lesson 1" }) => (
  <>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: COLORS.gold }} />
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 84,
        fontFamily: FONT_BODY,
        fontSize: 22,
        letterSpacing: 1,
        color: dark ? "rgba(20,20,40,0.45)" : "rgba(255,255,255,0.45)",
      }}
    >
      {label}
    </div>
  </>
);

/** Soft decorative shapes — varied per scene, and always gently in motion so a
 *  slide never sits completely still. */
export const Ornament: React.FC<{ kind: number; color?: string }> = ({ kind, color = COLORS.gold }) => {
  const frame = useCurrentFrame();
  const k = kind % 4;
  const drift = Math.sin(frame / 90) * 14;
  const drift2 = Math.cos(frame / 110) * 10;
  const spin = frame * 0.06;

  if (k === 0)
    return (
      <svg
        width={760}
        height={760}
        style={{ position: "absolute", top: -240, right: -220, opacity: 0.35, transform: `translate(${drift}px, ${drift2}px)` }}
      >
        <g transform={`rotate(${spin} 380 380)`}>
          <circle cx={380} cy={380} r={270} fill="none" stroke={color} strokeWidth={5} strokeDasharray="1400 260" />
        </g>
        <circle cx={330 + drift2} cy={410} r={200} fill="none" stroke={color} strokeWidth={2} />
      </svg>
    );
  if (k === 1)
    return (
      <svg
        width={620}
        height={620}
        style={{ position: "absolute", bottom: -200, left: -160, opacity: 0.18, transform: `translate(${drift2}px, ${-drift}px)` }}
      >
        <rect
          x={120}
          y={120}
          width={380}
          height={380}
          rx={54}
          fill="none"
          stroke={color}
          strokeWidth={6}
          transform={`rotate(${18 + spin * 0.5} 310 310)`}
        />
      </svg>
    );
  if (k === 2)
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 26,
          height: "100%",
          background: `linear-gradient(180deg, ${color} 0%, transparent 85%)`,
          opacity: 0.35 + Math.sin(frame / 70) * 0.15,
        }}
      />
    );
  return (
    <svg width={900} height={340} style={{ position: "absolute", top: 0, right: 0, opacity: 0.12 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={300 + i * 120 + Math.sin((frame + i * 30) / 80) * 12}
          y1={-40}
          x2={520 + i * 120 + Math.sin((frame + i * 30) / 80) * 12}
          y2={360}
          stroke={color}
          strokeWidth={3}
        />
      ))}
    </svg>
  );
};


export const fadeInUp = (frame: number, delay = 0, dist = 26): React.CSSProperties => {
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

export const useSpringIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 110 }, durationInFrames: 22 });
};

/**
 * Renders an image at (or near) its native pixel size so low-resolution source
 * art never gets scaled up into a blurry mess. `maxScale` caps enlargement.
 */
export const CrispImg: React.FC<{
  src: string;
  natural: [number, number];
  boxW: number;
  boxH: number;
  maxScale?: number;
  style?: React.CSSProperties;
}> = ({ src, natural, boxW, boxH, maxScale = 1.15, style }) => {
  const [nw, nh] = natural;
  const fit = Math.min(boxW / nw, boxH / nh);
  const scale = Math.min(fit, maxScale);
  return <Img src={src} style={{ width: nw * scale, height: nh * scale, objectFit: "contain", ...style }} />;
};

export const Headline: React.FC<{
  text: string;
  size?: number;
  color?: string;
  align?: "left" | "center";
  delay?: number;
  maxWidth?: number;
}> = ({ text, size, color = "white", align = "left", delay = 2, maxWidth }) => {
  const frame = useCurrentFrame();
  const auto = text.length > 78 ? 52 : text.length > 46 ? 62 : 76;
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: size ?? auto,
        lineHeight: 1.16,
        color,
        textAlign: align,
        maxWidth,
      }}
    >
      {words.map((w, i) => {
        // words arrive in sequence rather than the whole block appearing at once
        const t = delay + i * 2.2;
        const p = interpolate(frame, [t, t + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 22}px)`,
              marginRight: "0.28em",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Scene-level polish: a gentle settle as each scene arrives, plus a very slow
 * push so nothing sits perfectly still.
 *
 * Deliberately NO opacity fade. Scenes run back to back with no overlap, so
 * fading out to transparent and the next one fading in from transparent puts a
 * black flash on every single cut.
 */
export const SceneMotion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const settle = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(settle, [0, 1], [1.02, 1]) + drift * 0.012;
  return (
    <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
      {children}
    </div>
  );
};

/** Thin progress bar so there is always something moving on screen. */
export const LessonProgress: React.FC<{ elapsed: number; total: number }> = ({ elapsed, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = Math.min(1, (elapsed + frame / fps) / total);
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.10)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: COLORS.gold }} />
    </div>
  );
};

/** Horizontal gutters that keep card content clear of the presenter, whichever
 *  side he is standing on this scene. */
export const GUTTER = 640;
export const EDGE = 110;
export const gutters = (side: "left" | "right") =>
  side === "left" ? { left: GUTTER, right: EDGE } : { left: EDGE, right: GUTTER };
