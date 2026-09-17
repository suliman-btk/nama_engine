import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { CardShell } from "./CardShell";
import type { GraphicWindow } from "./useWindow";

export type CompassDirection = {
  id: "north" | "south" | "east" | "west";
  label: string;
  tagline: string;
  traits: string[];
  accent: string;
};

export const DEFAULT_COMPASS_DIRECTIONS: CompassDirection[] = [
  {
    id: "north",
    label: "North",
    tagline: "Fast, task-focused",
    traits: ["Straightforward", "Results focused", "Quick to initiate", "Independent"],
    accent: "#C4677A",
  },
  {
    id: "south",
    label: "South",
    tagline: "Patient, people-focused",
    traits: ["A good listener", "Values relationships", "Involves others", "Likes helping"],
    accent: "#CFAD3A",
  },
  {
    id: "east",
    label: "East",
    tagline: "Detail-focused, thorough",
    traits: ["Logical", "Analytical", "Methodical", "Concentrates deeply"],
    accent: "#6E93C8",
  },
  {
    id: "west",
    label: "West",
    tagline: "Creative, adventurous",
    traits: ["Imaginative", "Motivator", "Social and lively", "Risk-taker"],
    accent: "#7AAE8C",
  },
];

/**
 * The leadership compass, drawn the way the narration introduces it — "picture two lines
 * crossing" — as an actual crossing pair of axes with the four directions at the arm tips,
 * rather than four unrelated text cards. Source visual: official deck slide 89 (four
 * trait-wheels for North/South/East/West); this redraws that content as an editable diagram
 * per the course's visual-rebuild preference rather than embedding the slide as a flat image.
 *
 * `activeId` lifts one direction (full colour, its traits shown) and dims the other three to
 * a quiet outline — used as the narration moves from one direction to the next. With no
 * `activeId`, all four sit at equal weight (the "put all four directions together" beat).
 */
export function LeadershipCompassDiagram({
  window,
  directions = DEFAULT_COMPASS_DIRECTIONS,
  activeId,
  sequence,
  fps: fpsProp,
  eyebrow = "The leadership compass",
  axisLabels = { vertical: ["Fast", "Patient"], horizontal: ["Task-focused", "People-focused"] },
}: {
  window: GraphicWindow;
  directions?: CompassDirection[];
  /** Static: hold on one direction for the whole event window. */
  activeId?: CompassDirection["id"];
  /** Dynamic: the narration moves through several directions inside ONE continuous "show"
   * event (one CardShell mount, no re-triggered enter animation) — each entry's `atSeconds`
   * is the real timestamp (from the word-timing track) where the narration starts naming
   * that direction. Takes priority over `activeId` once playback reaches its first entry. */
  sequence?: { id: CompassDirection["id"]; atSeconds: number }[];
  fps?: number;
  eyebrow?: string;
  axisLabels?: { vertical: [string, string]; horizontal: [string, string] };
}) {
  const frame = useCurrentFrame();
  const { fps: configFps } = useVideoConfig();
  const fps = fpsProp ?? configFps;
  const local = frame - window.startFrame;

  const sequenceActiveId = sequence
    ? (() => {
        const now = frame / fps;
        const reached = sequence.filter((s) => now >= s.atSeconds);
        return reached.length > 0 ? reached[reached.length - 1].id : undefined;
      })()
    : undefined;
  const effectiveActiveId = sequence ? sequenceActiveId : activeId;

  // the cross draws in first, then each arm's label + traits settle in shortly after
  const crossProgress = (() => {
    const p = Math.min(1, Math.max(0, (local - fps * 0.15) / (fps * 0.55)));
    return 1 - Math.pow(1 - p, 3);
  })();

  const armProgress = (armId: CompassDirection["id"], index: number) => {
    const start = fps * 0.55 + index * fps * 0.18;
    const p = Math.min(1, Math.max(0, (local - start) / (fps * 0.4)));
    return 1 - Math.pow(1 - p, 3);
  };

  const size = 460;
  const c = size / 2;
  const armLen = c - 46;

  const arms: { dir: CompassDirection; angle: number; tx: number; ty: number; labelAnchor: "middle" | "start" | "end"; labelDy: number }[] = [
    { dir: directions.find((d) => d.id === "north")!, angle: -90, tx: c, ty: c - armLen, labelAnchor: "middle", labelDy: -14 },
    { dir: directions.find((d) => d.id === "south")!, angle: 90, tx: c, ty: c + armLen, labelAnchor: "middle", labelDy: 30 },
    { dir: directions.find((d) => d.id === "east")!, angle: 0, tx: c + armLen, ty: c, labelAnchor: "middle", labelDy: 34 },
    { dir: directions.find((d) => d.id === "west")!, angle: 180, tx: c - armLen, ty: c, labelAnchor: "middle", labelDy: 34 },
  ];

  return (
    <CardShell window={window} side="left" animation="diagram-build" eyebrow={eyebrow}>
      <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          {/* axis lines, drawn outward from the centre */}
          <g opacity={crossProgress}>
            <line x1={c} y1={c - armLen * crossProgress} x2={c} y2={c + armLen * crossProgress} stroke="rgba(250,247,238,0.30)" strokeWidth={3} />
            <line x1={c - armLen * crossProgress} y1={c} x2={c + armLen * crossProgress} y2={c} stroke="rgba(250,247,238,0.30)" strokeWidth={3} />
          </g>
          {/* faint axis captions, placed at the arm midpoints (not the tips) so they never
              collide with the North/South direction labels sitting at the very top/bottom */}
          <text x={c + 12} y={c - armLen / 2} fontSize={13} fill="rgba(250,247,238,0.4)" style={{ fontFamily: theme.bodyFamily, letterSpacing: 0.5 }}>{axisLabels.vertical[0]}</text>
          <text x={c + 12} y={c + armLen / 2} fontSize={13} fill="rgba(250,247,238,0.4)" style={{ fontFamily: theme.bodyFamily, letterSpacing: 0.5 }}>{axisLabels.vertical[1]}</text>

          {arms.map(({ dir, tx, ty, labelAnchor, labelDy }, i) => {
            const p = armProgress(dir.id, i);
            const active = effectiveActiveId ? dir.id === effectiveActiveId : true;
            const dim = effectiveActiveId ? !active : false;
            return (
              <g key={dir.id} opacity={p * (dim ? 0.35 : 1)}>
                <circle cx={tx} cy={ty} r={active ? 15 : 11} fill={dir.accent} stroke={theme.colors.deep} strokeWidth={active ? 4 : 2} />
                <text
                  x={tx}
                  y={ty + labelDy}
                  textAnchor={labelAnchor}
                  fontFamily={theme.headingFamily}
                  fontWeight={theme.headingWeight}
                  fontSize={active ? 27 : 22}
                  fill={active ? dir.accent : theme.colors.cream}
                >
                  {dir.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
          {(() => {
            const shown = effectiveActiveId ? directions.find((d) => d.id === effectiveActiveId) : undefined;
            if (!shown) {
              return (
                <div style={{ color: theme.colors.inkDim, fontSize: theme.type.body, lineHeight: 1.5 }}>
                  {axisLabels.horizontal[0]} &nbsp;↔&nbsp; {axisLabels.horizontal[1]} — four directions, no direction better than another.
                </div>
              );
            }
            return (
              <>
                <div style={{ color: shown.accent, fontFamily: theme.headingFamily, fontWeight: theme.headingWeight, fontSize: 32 }}>
                  {shown.label}
                </div>
                <div style={{ color: theme.colors.goldLight, fontSize: 21, fontStyle: "italic", marginBottom: 6 }}>{shown.tagline}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {shown.traits.map((t) => (
                    <span
                      key={t}
                      style={{
                        border: `1.5px solid ${shown.accent}`,
                        color: theme.colors.cream,
                        borderRadius: theme.radius.chip,
                        padding: "6px 14px",
                        fontSize: 19,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </CardShell>
  );
}
