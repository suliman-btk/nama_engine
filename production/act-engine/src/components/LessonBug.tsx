import React from "react";
import { theme } from "./theme";

/**
 * A small persistent identifier — programme name and lesson title — shown whenever the
 * presenter is off full-bleed.
 *
 * Two jobs. It gives the course the same piece of furniture in the same place in every
 * lesson (rule 19: consistent branding), and it anchors the corner of frame that the
 * graphic doesn't reach, so a wide card plus a corner presenter doesn't leave one dead
 * quadrant. It never appears over a full-bleed shot, where it would just be clutter on the
 * presenter's face.
 */
export function LessonBug({ title, opacity }: { title: string; opacity: number }) {
  if (opacity < 0.02) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "5%",
        bottom: "8%",
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: theme.bodyFamily,
      }}
    >
      <div style={{ width: 3, height: 38, background: theme.colors.gold, borderRadius: 2 }} />
      <div>
        <div
          style={{
            color: theme.colors.gold,
            fontFamily: theme.headingFamily,
            fontWeight: theme.headingWeight,
            fontSize: 15,
            letterSpacing: 3.4,
            textTransform: "uppercase",
          }}
        >
          Act
        </div>
        <div style={{ color: "rgba(242,236,221,0.62)", fontSize: 17, marginTop: 3 }}>{title}</div>
      </div>
    </div>
  );
}
