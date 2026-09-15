import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { CardShell } from "./CardShell";
import type { GraphicWindow } from "./useWindow";

export type JourneyStep = { n: number; title: string; question: string };

/**
 * The course's four units as a journey with a spine running through them, rather than four
 * separate bullets. The spine is the point: this is one path with an order, each unit
 * answering the next question, and the line drawing downward between the nodes is what says
 * so.
 *
 * Nodes light up on the real timestamp where the narration names that unit
 * (`revealAtSeconds`), so the diagram tracks what is being said instead of running on its
 * own clock — rule 2.
 */
export function FourStepJourney({
  window,
  steps,
  revealAtSeconds,
  fps = 30,
  side = "left",
  eyebrow = "The journey",
}: {
  window: GraphicWindow;
  steps: JourneyStep[];
  revealAtSeconds?: number[];
  fps?: number;
  side?: "left" | "right" | "center";
  eyebrow?: string;
}) {
  const frame = useCurrentFrame();
  const now = frame / fps;
  const reachedIndex = revealAtSeconds
    ? revealAtSeconds.filter((t) => now >= t).length - 1
    : steps.length - 1;

  // the spine draws down to whichever node has been reached
  const spineTarget = Math.max(0, reachedIndex) / Math.max(1, steps.length - 1);
  const spinePct = revealAtSeconds ? spineTarget : 1;

  return (
    <CardShell window={window} side={side} animation="fade" eyebrow={eyebrow}>
      <div style={{ position: "relative", paddingLeft: 8 }}>
        {/* spine track + drawn portion */}
        <div
          style={{
            position: "absolute",
            left: 27,
            top: 22,
            bottom: 22,
            width: 3,
            background: "rgba(250,247,238,0.12)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 27,
            top: 22,
            width: 3,
            height: `calc((100% - 44px) * ${spinePct})`,
            background: `linear-gradient(180deg, ${theme.colors.goldLight}, ${theme.colors.gold})`,
            borderRadius: 2,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {steps.map((step, i) => {
            const reached = i <= reachedIndex;
            const active = i === reachedIndex;
            const revealFrame = revealAtSeconds ? revealAtSeconds[i] * fps : window.startFrame;
            const raw = Math.min(1, Math.max(0, (frame - revealFrame) / 12));
            const p = reached ? 1 - Math.pow(1 - raw, 3) : 0;

            return (
              <div key={step.n} style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.headingFamily,
                    fontWeight: theme.headingWeight,
                    fontSize: 19,
                    background: reached ? theme.colors.gold : theme.colors.deep,
                    color: reached ? theme.colors.deep : "rgba(250,247,238,0.45)",
                    border: reached ? "none" : "2px solid rgba(250,247,238,0.2)",
                    boxShadow: active ? `0 0 0 7px rgba(207,173,58,0.16)` : undefined,
                    transform: `scale(${reached ? 0.9 + p * 0.1 : 0.9})`,
                    zIndex: 1,
                  }}
                >
                  {step.n}
                </div>
                <div style={{ paddingTop: 1, opacity: reached ? 0.45 + p * 0.55 : 0.32 }}>
                  <div
                    style={{
                      color: theme.colors.cream,
                      fontFamily: theme.headingFamily,
                      fontWeight: theme.headingWeight,
                      fontSize: 25,
                      lineHeight: 1.15,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      color: active ? theme.colors.goldLight : theme.colors.inkDim,
                      fontSize: 20,
                      marginTop: 3,
                      fontStyle: "italic",
                    }}
                  >
                    {step.question}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
}
