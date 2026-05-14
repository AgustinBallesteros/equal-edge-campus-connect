import { Inter } from "next/font/google";
import { useState, type ReactElement } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

// ─── Design tokens ────────────────────────────────────────────────────────────
export const BLUE = "#558BF7";

export const MS = {
  dFast: "150ms",
  eOut:  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

// ─── Layout constants ─────────────────────────────────────────────────────────
const SIDEBAR_W = "20%";
const TOPBAR_H  = 64;
const BORDER    = "1px solid #E5E5EA";

// ─── Nav tokens ───────────────────────────────────────────────────────────────
const NAV_REST_COLOR   = "#8E8E97";
const NAV_ACTIVE_COLOR = "#3E4FD3";
const NAV_ACTIVE_BG    = "#EDEEFD";

// ─── Nav icons (16 × 16, currentColor) ───────────────────────────────────────
const icons: Record<string, ReactElement> = {
  Dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  ),
  Roster: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="3"/>
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
    </svg>
  ),
  Lessons: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h5a2 2 0 0 1 2 2v9a1.5 1.5 0 0 0-1.5-1.5H2V3z"/>
      <path d="M14 3h-5a2 2 0 0 0-2 2v9a1.5 1.5 0 0 1 1.5-1.5H14V3z"/>
    </svg>
  ),
  Scripts: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 1h6l3 3v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
      <path d="M10 1v4h3"/>
      <path d="M5 8h6M5 11h4"/>
    </svg>
  ),
  Activities: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8h3l2-5 4 10 2-5h3"/>
    </svg>
  ),
  Messages: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-4 3V3a1 1 0 0 1 1-1z"/>
    </svg>
  ),
  Events: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5"/>
      <path d="M1.5 6.5h13"/>
      <path d="M5 1.5v2M11 1.5v2"/>
    </svg>
  ),
  Resources: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5a1 1 0 0 1 1-1h4l2 2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5z"/>
    </svg>
  ),
  Settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.5"/>
      <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M12.6 3.4l-.85.85M4.25 11.75l-.85.85"/>
    </svg>
  ),
};

// ─── Nav item ─────────────────────────────────────────────────────────────────
function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: 8,
        cursor: "pointer",
        background: active ? NAV_ACTIVE_BG : "transparent",
        color: active ? NAV_ACTIVE_COLOR : NAV_REST_COLOR,
        transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
      }}
    >
      {icons[label]}
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, lineHeight: 1 }}>
        {label}
      </span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const MAIN_NAV = ["Dashboard", "Roster", "Lessons", "Scripts", "Activities", "Messages", "Events", "Resources"];

function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (item: string) => void;
}) {
  return (
    <div
      style={{
        width: SIDEBAR_W,
        height: "100vh",
        flexShrink: 0,
        background: "#F8F8FA",
        borderRight: BORDER,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Logo — matches topbar height so separator aligns with topbar bottom border */}
      <div style={{
        height: TOPBAR_H,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        paddingInline: 16,
        gap: 8,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#3E4FD3",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, color: "#fff", fontWeight: 600, letterSpacing: "0.02em" }}>CC</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#121216", lineHeight: 1 }}>
          Campus Connect
        </span>
      </div>

      {/* Separator — flush with topbar bottom border */}
      <div style={{ height: 1, background: "#E5E5EA", marginInline: 0, marginBottom: 8 }} />

      {/* Nav padding wrapper */}
      <div style={{ paddingInline: 16, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* Main nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {MAIN_NAV.map((item) => (
            <NavItem key={item} label={item} active={active === item} onClick={() => onSelect(item)} />
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Separator */}
        <div style={{ height: 1, background: "#E5E5EA", marginBottom: 8 }} />

        {/* Settings */}
        <NavItem label="Settings" active={active === "Settings"} onClick={() => onSelect("Settings")} />
      </div>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div
      style={{
        height: TOPBAR_H,
        flexShrink: 0,
        background: "#fff",
        borderBottom: BORDER,
        display: "flex",
        alignItems: "center",
        paddingInline: 24,
      }}
    >
      {/* ── Drop top bar content here ── */}
      <span style={{ color: "#ccc", fontSize: 12 }}>Top bar</span>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function Content() {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#fff",
        padding: 24,
      }}
    >
      {/* ── Drop page content here ── */}
      <span style={{ color: "#ccc", fontSize: 12 }}>Content</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeNav, setActiveNav] = useState("Roster");

  return (
    <div
      className={inter.variable}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        fontFamily: "var(--font-inter)",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <Sidebar active={activeNav} onSelect={setActiveNav} />

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar />
        <Content />
      </div>
    </div>
  );
}
