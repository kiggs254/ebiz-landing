// Compact line-icon set for the addon cards. Stroke uses currentColor so the
// parent can colour each icon by category.

const SW = 1.7;

export function AddonIcon({ name, size = 22 }: { name?: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: SW,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const dot = (cx: number, cy: number) => (
    <circle cx={cx} cy={cy} r="1" fill="currentColor" stroke="none" />
  );

  switch (name) {
    case "branch":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="19" r="2.2" />
          <circle cx="19" cy="19" r="2.2" />
          <path d="M12 7.2v3.3M12 10.5l-5.6 6M12 10.5l5.6 6" />
        </svg>
      );
    case "repeat":
      return (
        <svg {...common}>
          <path d="M4 9a4 4 0 0 1 4-4h9" />
          <path d="M14 2l3 3-3 3" />
          <path d="M20 15a4 4 0 0 1-4 4H7" />
          <path d="M10 22l-3-3 3-3" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
          <path d="M4 7.5l8 4.5 8-4.5" />
          <path d="M12 12v9" />
        </svg>
      );
    case "percent":
      return (
        <svg {...common}>
          <path d="M18 6L6 18" />
          <circle cx="7.5" cy="7.5" r="2" />
          <circle cx="16.5" cy="16.5" r="2" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v9H3z" />
          <path d="M14 9h3.6l2.4 3v3H14z" />
          <circle cx="7" cy="18" r="1.8" />
          <circle cx="17.5" cy="18" r="1.8" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M13 4H5a1 1 0 0 0-1 1v8l8.5 8.5 9-9L13 4z" />
          <circle cx="8" cy="8" r="1.3" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 0 1-11.5 7.2L4 20.5l1.3-4.5A8 8 0 1 1 20 12z" />
          <path d="M8.5 11h7M8.5 14h4" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" />
        </svg>
      );
    case "coin":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.2" />
          <path d="M14.6 9.3A3 3 0 0 0 12 8c-1.7 0-3 1-3 2.3 0 2.9 6 1.4 6 4.3 0 1.4-1.4 2.4-3 2.4a3 3 0 0 1-2.6-1.3" />
          <path d="M12 6.4v11.2" />
        </svg>
      );
    case "gift":
      return (
        <svg {...common}>
          <rect x="3.5" y="8" width="17" height="4" rx="1" />
          <path d="M5 12v8.5h14V12" />
          <path d="M12 8v12.5" />
          <path d="M12 8S11 4.5 8.5 4.5A2 2 0 0 0 8.5 8.5z" />
          <path d="M12 8s1-3.5 3.5-3.5A2 2 0 0 1 15.5 8.5z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...common}>
          <path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z" />
          <path d="M17 8.5a5 5 0 0 1 0 7" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          {dot(12, 12)}
        </svg>
      );
    case "bubble":
      return (
        <svg {...common}>
          <path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.3A8 8 0 1 1 20 11.5z" />
          {dot(9, 12)}
          {dot(12, 12)}
          {dot(15, 12)}
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l-1 12H7z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
          <path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20.5 20.5L16 16" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.7" />
          <path d="M20 15l-4.5-4.5L6 20" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="M8.5 8L4 12.5 8.5 17" />
          <path d="M15.5 8L20 12.5 15.5 17" />
          <path d="M13.5 5l-3 14" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 4v10" />
          <path d="M8 10.5l4 4 4-4" />
          <path d="M5 19h14" />
        </svg>
      );
    case "medical":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <path d="M12 8.5v7M8.5 12h7" />
        </svg>
      );
    // --- Admin nav / dashboard icons (lucide-matched) ---
    case "grid": // LayoutDashboard
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "cart": // ShoppingCart
      return (
        <svg {...common}>
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.5 3h2l2.4 12a1.6 1.6 0 0 0 1.6 1.3h9a1.6 1.6 0 0 0 1.6-1.3L21 7H6" />
        </svg>
      );
    case "users": // Users
      return (
        <svg {...common}>
          <path d="M16 20v-1.5a4 4 0 0 0-4-4H6.5a4 4 0 0 0-4 4V20" />
          <circle cx="9.2" cy="7.5" r="3.5" />
          <path d="M21.5 20v-1.5a4 4 0 0 0-3-3.85" />
          <path d="M15.5 4.15a4 4 0 0 1 0 7.5" />
        </svg>
      );
    case "bars": // BarChart3
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M18 17V8" />
          <path d="M13 17V5" />
          <path d="M8 17v-4" />
        </svg>
      );
    case "card": // CreditCard
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
          <path d="M2.5 10h19" />
        </svg>
      );
    case "palette": // Appearance
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 0 18 1.5 1.5 0 0 0 1.1-2.5 1.5 1.5 0 0 1 1.1-2.5H16a5 5 0 0 0 5-5c0-3.9-4-6-9-6z" />
          <circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "gear": // Settings
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "pill": // Prescriptions
      return (
        <svg {...common}>
          <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z" />
          <path d="M8.5 8.5l7 7" />
        </svg>
      );
    case "dollar": // DollarSign
      return (
        <svg {...common}>
          <path d="M12 2v20" />
          <path d="M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
          <path d="M16 3v4M8 3v4M3.5 10h17" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...common}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
