import React from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../course/CourseContext";
import { CardShell } from "./CardShell";
import type { GraphicWindow } from "./useWindow";

export type ScenarioItem = { n: number; text: string };

/**
 * A numbered list that reveals one item at a time as the narration reaches it, and marks the
 * one being spoken about right now. Used for Lesson 1's five zone-check scenarios.
 *
 * Reveal timing comes from `revealAtSeconds` — the REAL per-item timestamps from the
 * footage (rule 2), not an even split, because scenario 1 is spoken slower than scenario 4.
 * Items not yet reached are held at low opacity rather than hidden, so the viewer can see
 * how many are coming — but never so faint they read as broken.
 */
export function ScenarioSequence({
  window,
  items,
  activeIndex,
  revealAtSeconds,
  fps = 30,
  side = "left",
  eyebrow = "Which zone?",
}: {
  window: GraphicWindow;
  items: ScenarioItem[];
  activeIndex?: number;
  revealAtSeconds?: number[];
  fps?: number;
  side?: "left" | "right" | "center";
  eyebrow?: string;
}) {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const nowSeconds = frame / fps;
  const effectiveActiveIndex = revealAtSeconds
    ? Math.max(0, revealAtSeconds.filter((t) => nowSeconds >= t).length - 1)
    : activeIndex ?? items.length - 1;

  return (
    <CardShell window={window} side={side} animation="fade" eyebrow={eyebrow}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => {
          const revealed = i <= effectiveActiveIndex;
          const active = i === effectiveActiveIndex;
          const revealFrame = revealAtSeconds ? revealAtSeconds[i] * fps : window.startFrame;
          const settleRaw = Math.min(1, Math.max(0, (frame - revealFrame) / 11));
          const settle = revealed ? 1 - Math.pow(1 - settleRaw, 3) : 0;

          return (
            <div
              key={item.n}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: theme.radius.chip,
                background: active ? "rgba(207,173,58,0.13)" : "transparent",
                border: `1px solid ${active ? "rgba(207,173,58,0.4)" : "transparent"}`,
                opacity: revealed ? 0.35 + settle * 0.65 : 0.26,
                transform: `translateY(${(1 - (revealed ? settle : 1)) * 12}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: active ? theme.colors.gold : "rgba(250,247,238,0.10)",
                  border: active ? "none" : "1px solid rgba(250,247,238,0.22)",
                  color: active ? theme.colors.deep : theme.colors.sand,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.headingFamily,
                  fontWeight: theme.headingWeight,
                  fontSize: 19,
                  transform: `scale(${active ? 1 + (1 - settle) * 0.18 : 1})`,
                }}
              >
                {item.n}
              </div>
              <div
                style={{
                  color: active ? theme.colors.cream : theme.colors.inkDim,
                  fontSize: 26,
                  lineHeight: 1.35,
                }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
