import React from "react";

// Single-line icon set, one consistent stroke style (round caps/joins, 2px @ 24 viewBox)
// so every icon in the course reads as part of the same drawn family rather than
// mixed OS emoji.
const base = { fill: "none", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconCompass: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M 15 9 L 10.5 10.5 L 9 15 L 13.5 13.5 Z" fill={color} stroke="none" />
    <circle cx="12" cy="12" r="0.9" fill={color} stroke="none" />
  </svg>
);

export const IconGlobe: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <path d="M 3.5 9.5 L 20.5 9.5 M 3.5 14.5 L 20.5 14.5" />
  </svg>
);

export const IconMagnifier: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M 15.5 15.5 L 20.5 20.5" />
    <path d="M 8 10.5 L 13 10.5" />
  </svg>
);

export const IconRocket: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <path d="M 12 3 C 16 6 17 11 15 16 L 9 16 C 7 11 8 6 12 3 Z" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M 9 14 L 6 17 L 9 17 Z M 15 14 L 18 17 L 15 17 Z" fill={color} stroke="none" />
    <path d="M 10 16.5 L 9.3 20 L 12 18 L 14.7 20 L 14 16.5" />
  </svg>
);

export const IconLightbulb: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <path d="M 12 3 C 8.5 3 6.5 5.5 6.5 8.5 C 6.5 10.8 7.8 12 8.7 13.2 C 9.3 14 9.5 14.7 9.5 15.5 L 14.5 15.5 C 14.5 14.7 14.7 14 15.3 13.2 C 16.2 12 17.5 10.8 17.5 8.5 C 17.5 5.5 15.5 3 12 3 Z" />
    <path d="M 9.7 18 L 14.3 18 M 10.3 20 L 13.7 20" />
  </svg>
);

export const IconScales: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <path d="M 12 3 L 12 20 M 7 20 L 17 20" />
    <path d="M 5 6 L 19 6" />
    <path d="M 5 6 L 2.5 11 A 2.5 2.5 0 0 0 7.5 11 Z" />
    <path d="M 19 6 L 16.5 11 A 2.5 2.5 0 0 0 21.5 11 Z" />
  </svg>
);

export const IconPlane: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <path d="M 3 13 L 21 7 L 19 11 L 11 13.5 L 19 16 L 21 20 L 3 14 L 8 13 Z" />
  </svg>
);

export const IconWave: React.FC<{ color: string; size?: number }> = ({ color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>
    <path d="M 3 17 Q 6 12 9 17 T 15 17 T 21 17" />
    <path d="M 3 12 Q 6 7 9 12 T 15 12 T 21 12" opacity={0.5} />
  </svg>
);

export const UNIT_ICONS = [IconCompass, IconGlobe, IconMagnifier, IconRocket];
