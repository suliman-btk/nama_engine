import React from "react";
import { theme } from "./theme";
import { CardShell } from "./CardShell";
import type { GraphicWindow } from "./useWindow";

/** Used for the hadith beat in Scene 9. Deliberately the plainest card in the set — no
 * icons, no ornament beyond the shared rail: rule 20 keeps religious content presented as
 * stated rather than decorated. */
export function QuoteCard({
  window,
  quote,
  attribution,
  side = "left",
}: {
  window: GraphicWindow;
  quote: string;
  attribution: string;
  side?: "left" | "right" | "center";
  /** Set by the EDL when this line is still awaiting human sign-off. Intentionally has NO
   * visual effect — a review flag is a note to the team, and must never leak into a frame
   * the learner sees. */
  reviewFlag?: boolean;
}) {
  return (
    <CardShell window={window} side={side} animation="fade" eyebrow="Worth holding on to">
      <div
        style={{
          color: theme.colors.cream,
          fontSize: 44,
          lineHeight: 1.45,
          fontStyle: "italic",
        }}
      >
        “{quote}”
      </div>
      <div
        style={{
          color: theme.colors.gold,
          fontFamily: theme.headingFamily,
          fontWeight: theme.headingWeight,
          fontSize: theme.type.label,
          letterSpacing: 1.4,
          marginTop: 20,
        }}
      >
        {attribution}
      </div>
    </CardShell>
  );
}
