import React from "react";
import { theme } from "./theme";
import { CardShell } from "./CardShell";
import type { GraphicWindow } from "./useWindow";

export function DefinitionCard({
  window,
  term,
  definition,
  side = "left",
}: {
  window: GraphicWindow;
  term: string;
  definition: string;
  side?: "left" | "right" | "center";
}) {
  return (
    <CardShell window={window} side={side} animation="fade-rise" eyebrow="What it means" title={term}>
      <div style={{ color: theme.colors.inkDim, fontSize: theme.type.body, lineHeight: 1.5 }}>
        {definition}
      </div>
    </CardShell>
  );
}
