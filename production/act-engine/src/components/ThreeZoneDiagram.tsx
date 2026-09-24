import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../course/CourseContext";
import { CardShell } from "./CardShell";
import type { GraphicWindow } from "./useWindow";

export type Zone = { id: string; label: string; tag: string; description: string; accent: string };

const DEFAULT_ZONES: Zone[] = [
  { id: "comfort", label: "Comfort Zone", tag: "Easy", description: "You do it without needing to think hard or put in effort.", accent: "#6E93C8" },
  { id: "challenge", label: "Challenge Zone", tag: "Let's Go", description: "You have some idea how — not yet enough experience to do it easily.", accent: "#CFAD3A" },
  { id: "pain", label: "Pain Zone", tag: "No Way", description: "You genuinely don't know how to tackle it, and it leaves you stuck.", accent: "#C4677A" },
];

/**
 * The three learning zones, drawn the way the narration describes them — "picture three
 * circles" — as actual concentric rings rather than a list of three text rows. The geometry
 * IS the explanation here: comfort sits in the middle, challenge is the ring you step out
 * into, pain is the outer edge beyond it. A bulleted list can't carry that; nested circles
 * carry it before a word is read.
 *
 * The rings build outward from the centre in narration order, then the legend beside them
 * fills in the wording. `activeZoneId` lifts one ring and dims the rest.
 */
export function ThreeZoneDiagram({
  window,
  side = "left",
  zones = DEFAULT_ZONES,
  activeZoneId,
}: {
  window: GraphicWindow;
  side?: "left" | "right" | "center";
  zones?: Zone[];
  activeZoneId?: string;
}) {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - window.startFrame;

  // rings build outward: comfort, then challenge, then pain
  const ringProgress = (i: number) => {
    const start = (window.enterFrames ?? fps * 0.45) + i * fps * 0.26;
    const p = Math.min(1, Math.max(0, (local - start) / (fps * 0.5)));
    return 1 - Math.pow(1 - p, 3);
  };

  const [comfort, challenge, pain] = zones;
  const size = 430;
  const c = size / 2;
  // outer -> inner so the inner rings paint on top
  const rings = [
    { zone: pain, r: 202, i: 2 },
    { zone: challenge, r: 139, i: 1 },
    { zone: comfort, r: 77, i: 0 },
  ];

  return (
    <CardShell window={window} side={side} animation="diagram-build" eyebrow="The three zones">
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          {rings.map(({ zone, r, i }) => {
            const p = ringProgress(i);
            const active = activeZoneId ? zone.id === activeZoneId : false;
            const dim = activeZoneId ? !active : false;
            return (
              <g key={zone.id} opacity={p * (dim ? 0.35 : 1)}>
                <circle
                  cx={c}
                  cy={c}
                  r={r * p}
                  fill={zone.accent}
                  fillOpacity={zone.id === "comfort" ? 0.26 : 0.13}
                  stroke={zone.accent}
                  strokeWidth={active ? 4 : 2.5}
                />
              </g>
            );
          })}
          {/* zone tags sit in their own band, so the ring is labelled where it lives */}
          {[
            { zone: comfort, y: c, i: 0 },
            { zone: challenge, y: c - 110, i: 1 },
            { zone: pain, y: c - 175, i: 2 },
          ].map(({ zone, y, i }) => (
            <text
              key={zone.id}
              x={c}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              opacity={ringProgress(i)}
              style={{
                fill: zone.accent,
                fontFamily: theme.headingFamily,
                fontWeight: theme.headingWeight,
                fontSize: 17,
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              {zone.tag}
            </text>
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, minWidth: 0 }}>
          {zones.map((z, i) => {
            const p = ringProgress(i);
            const active = activeZoneId ? z.id === activeZoneId : false;
            const dim = activeZoneId ? !active : false;
            return (
              <div
                key={z.id}
                style={{
                  opacity: p * (dim ? 0.4 : 1),
                  transform: `translateX(${(1 - p) * 18}px)`,
                  borderLeft: `4px solid ${z.accent}`,
                  paddingLeft: 14,
                }}
              >
                <div
                  style={{
                    color: active ? z.accent : theme.colors.cream,
                    fontFamily: theme.headingFamily,
                    fontWeight: theme.headingWeight,
                    fontSize: 29,
                    lineHeight: 1.15,
                  }}
                >
                  {z.label}
                </div>
                <div style={{ color: theme.colors.inkDim, fontSize: 22, lineHeight: 1.4, marginTop: 4 }}>
                  {z.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
}
