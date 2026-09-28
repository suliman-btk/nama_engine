import React from "react";

export type IconName =
  | "idea"
  | "clipboard"
  | "target"
  | "education"
  | "water"
  | "health"
  | "livelihoods"
  | "time"
  | "calendar"
  | "deliverable"
  | "constraint"
  | "cost"
  | "search"
  | "check"
  | "users"
  | "data"
  | "tools"
  | "science"
  | "art"
  | "risk"
  | "tree"
  | "gantt"
  | "alert"
  | "document";

export function FormalIcon({
  name,
  size = 28,
  color = "currentColor",
  strokeWidth = 2.2,
}: {
  name: IconName | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "idea":
    case "lightbulb":
      return (
        <svg {...props}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      );
    case "clipboard":
    case "plan":
      return (
        <svg {...props}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "target":
    case "goal":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "education":
    case "school":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "water":
    case "droplet":
      return (
        <svg {...props}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case "health":
    case "clinic":
      return (
        <svg {...props}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "livelihoods":
    case "growth":
      return (
        <svg {...props}>
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
          <path d="M3 20h18" />
        </svg>
      );
    case "time":
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "deliverable":
    case "package":
      return (
        <svg {...props}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "constraint":
    case "scale":
      return (
        <svg {...props}>
          <path d="M12 3v18" />
          <path d="M5 6l7-3 7 3" />
          <path d="M4 10l3 5H1z" />
          <path d="M17 10l3 5h-6z" />
        </svg>
      );
    case "cost":
    case "coins":
    case "budget":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M14.5 9a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
          <line x1="12" y1="5" x2="12" y2="19" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "users":
    case "community":
    case "ngo":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "flag":
      return (
        <svg {...props}>
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      );
    case "projects":
    case "briefcase":
      return (
        <svg {...props}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "data":
    case "chart":
      return (
        <svg {...props}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "science":
    case "tools":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "art":
      return (
        <svg {...props}>
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    case "risk":
    case "alert":
      return (
        <svg {...props}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "tree":
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="3" />
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M12 8v4" />
          <path d="M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case "gantt":
      return (
        <svg {...props}>
          <path d="M4 6h10" />
          <path d="M8 12h12" />
          <path d="M6 18h8" />
        </svg>
      );
    default:
      if (name && name.length <= 4) {
        return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{name}</span>;
      }
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="5" fill={color} />
        </svg>
      );
  }
}
