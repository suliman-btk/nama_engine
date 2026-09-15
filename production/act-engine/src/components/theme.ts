/** Brand tokens, from shared/production-guidelines.md (see video-editing-engine-spec.md
 * "Brand" section). Heading font: guidelines call for Arial Black; the render environment
 * here has neither Arial nor the project's Lato Black installed, so this falls back to a
 * heavy system stack. Swap `headingFamily` for a loaded "Lato Black" (or true Arial Black)
 * when rendering with the project's font files available. */
export const theme = {
  colors: {
    navy: "#1B1E4A",
    deep: "#12142F",
    mid: "#2B2F72",
    /** The one flat slide background. Client feedback (Sep 12): the dark blue gradient reads
     * too dark and too busy — every slide now paints this single solid colour, no gradient,
     * no drifting wash. Change this one value to retone the whole course. */
    surface: "#454C8A",
    gold: "#CFAD3A",
    goldLight: "#E4C862",
    cream: "#FAF7EE",
    sand: "#F2ECDD",
    // derived, for panel work
    panel: "rgba(18,20,47,0.82)",
    panelEdge: "rgba(228,200,98,0.22)",
    inkDim: "rgba(242,236,221,0.72)",
    plumSafe: "#241738",
    tealSafe: "#14303C",
  },
  headingFamily: '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
  bodyFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  headingWeight: 900,
  /** 1080p type scale. Everything on screen is read from ~2m away on a laptop or phone —
   * rule 19 lists "tiny text" as a thing to avoid, so nothing here goes below 22px. */
  type: {
    hero: 62,
    title: 40,
    cardTitle: 30,
    body: 23,
    label: 17,
  },
  radius: { card: 22, chip: 12, video: 20 },
} as const;
