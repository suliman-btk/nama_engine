export const COLORS = {
  navy: "#1B1E4A",
  navy2: "#2B2F72",
  navyDeep: "#12142F",
  gold: "#CFAD3A",
  goldLight: "#E4C862",
  white: "#FFFFFF",
  cream: "#FAF7EE",
  sand: "#F2ECDD",
  green: "#3CB54A",
  plum: "#241738",
  teal: "#14303C",
  comfort: "#3D6E96",
  challenge: "#CFAD3A",
  pain: "#963D3D",
  ink: "#20223A",
};

/** Background treatments — cycled so consecutive scenes never look identical. */
export const BG = {
  navySolid: COLORS.navy,
  navyDeep: COLORS.navyDeep,
  navyGrad: `linear-gradient(155deg, ${COLORS.navy2} 0%, ${COLORS.navyDeep} 70%)`,
  navyGradAlt: `linear-gradient(200deg, ${COLORS.navy} 0%, #0E1026 100%)`,
  plum: `linear-gradient(160deg, ${COLORS.plum} 0%, ${COLORS.navyDeep} 100%)`,
  teal: `linear-gradient(160deg, ${COLORS.teal} 0%, ${COLORS.navyDeep} 100%)`,
  cream: COLORS.cream,
  sand: COLORS.sand,
  goldGrad: `linear-gradient(160deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
};

export const FONT_HEAD = "'Arial Black', Arial, Helvetica, sans-serif";
export const FONT_BODY = "Arial, Helvetica, sans-serif";

/** The presenter occupies this corner — keep card content clear of it. */
export const AVATAR_SAFE = { width: 300, height: 360 };
