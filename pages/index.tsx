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

// ─── Button helpers ───────────────────────────────────────────────────────────
function BtnMain({ label }: { label: string }) {
  return (
    <button style={{
      height: 36, paddingInline: 14, borderRadius: 8, border: "none",
      background: "#3E4FD3", color: "#fff",
      fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)",
      cursor: "pointer", whiteSpace: "nowrap",
    }}>
      {label}
    </button>
  );
}

function BtnSecondary({ label }: { label: string }) {
  return (
    <button style={{
      height: 36, paddingInline: 14, borderRadius: 8,
      border: BORDER, background: "#fff", color: "#121216",
      fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)",
      cursor: "pointer", whiteSpace: "nowrap",
    }}>
      {label}
    </button>
  );
}

// ─── Dashboard-specific actions ───────────────────────────────────────────────
const VIEW_TABS = ["This Week", "This Month", "This Semester"] as const;
type ViewTab = typeof VIEW_TABS[number];

function DashboardActions() {
  const [view, setView] = useState<ViewTab>("This Month");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* Customize tools dropdown (secondary style + chevron) */}
      <button style={{
        height: 36, paddingInline: 14, borderRadius: 8,
        border: BORDER, background: "#fff", color: "#121216",
        fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
      }}>
        Customize tools
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 5l4 4 4-4"/>
        </svg>
      </button>

      {/* View tab segmented control */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "#F8F8FA", borderRadius: 8, padding: 3,
        border: BORDER,
      }}>
        {VIEW_TABS.map((tab) => {
          const active = view === tab;
          return (
            <button
              key={tab}
              onClick={() => setView(tab)}
              style={{
                height: 28, paddingInline: 12, borderRadius: 6, border: "none",
                background: active ? "#fff" : "transparent",
                color: active ? "#121216" : "#8E8E97",
                fontSize: 13, fontWeight: active ? 500 : 400,
                fontFamily: "var(--font-inter)",
                cursor: "pointer",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page configs ─────────────────────────────────────────────────────────────
type PageConfig = {
  title: string;
  description: string;
  actions: ReactElement | null;
};

const PAGE_CONFIGS: Record<string, PageConfig> = {
  Dashboard:  { title: "Dashboard",       description: "Good morning, Dr. Okafor  ·  Spring 2026",                        actions: <DashboardActions /> },
  Roster:     { title: "Student Roster",  description: "Manage student access and invitation status",                       actions: <><BtnMain label="Add Student" /><BtnSecondary label="Import CSV" /></> },
  Lessons:    { title: "Learn Library",   description: "Browse and assign lessons to students",                             actions: null },
  Scripts:    { title: "Script Library",  description: "Manage communication templates available to students",              actions: <BtnMain label="New Script" /> },
  Activities: { title: "Activities",      description: "Assign follow-up tasks and track student completion",               actions: <BtnMain label="New Activity" /> },
  Messages:   { title: "Messages",        description: "",                                                                  actions: <BtnMain label="New Message" /> },
  Events:     { title: "Events",          description: "Shared with all students in the app",                               actions: <BtnMain label="New Event" /> },
  Resources:  { title: "Resources",       description: "Links, documents, and videos available to all students",            actions: <BtnMain label="Add Resource" /> },
  Settings:   { title: "Settings",        description: "",                                                                  actions: null },
};

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
function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: 10, borderRadius: 8, cursor: "pointer",
        background: active ? NAV_ACTIVE_BG : "transparent",
        color: active ? NAV_ACTIVE_COLOR : NAV_REST_COLOR,
        transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
      }}
    >
      {icons[label]}
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, lineHeight: 1 }}>{label}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const MAIN_NAV = ["Dashboard", "Roster", "Lessons", "Scripts", "Activities", "Messages", "Events", "Resources"];

function Sidebar({ active, onSelect }: { active: string; onSelect: (item: string) => void }) {
  return (
    <div style={{
      width: SIDEBAR_W, height: "100vh", flexShrink: 0,
      background: "#F8F8FA", borderRight: BORDER,
      display: "flex", flexDirection: "column",
      overflow: "hidden", boxSizing: "border-box",
    }}>
      {/* Logo row — same height as topbar so separator aligns */}
      <div style={{
        height: TOPBAR_H, flexShrink: 0,
        display: "flex", alignItems: "center",
        paddingInline: 16, gap: 8,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "#3E4FD3",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 10, color: "#fff", fontWeight: 600, letterSpacing: "0.02em" }}>CC</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#121216", lineHeight: 1 }}>Campus Connect</span>
      </div>

      {/* Separator — flush with topbar bottom border */}
      <div style={{ height: 1, background: "#E5E5EA", marginBottom: 8 }} />

      {/* Nav */}
      <div style={{ paddingInline: 16, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", paddingBottom: 16 }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {MAIN_NAV.map((item) => (
            <NavItem key={item} label={item} active={active === item} onClick={() => onSelect(item)} />
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ height: 1, background: "#E5E5EA", marginBottom: 8 }} />
        <NavItem label="Settings" active={active === "Settings"} onClick={() => onSelect("Settings")} />
      </div>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ page }: { page: string }) {
  const cfg = PAGE_CONFIGS[page] ?? PAGE_CONFIGS.Dashboard;
  return (
    <div style={{
      height: TOPBAR_H, flexShrink: 0,
      background: "#fff", borderBottom: BORDER,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px",
    }}>
      {/* Left — title + description */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#121216", lineHeight: 1 }}>{cfg.title}</span>
        {cfg.description && (
          <span style={{ fontSize: 14, fontWeight: 400, color: "#8E8E97", lineHeight: 1 }}>{cfg.description}</span>
        )}
      </div>

      {/* Right — actions */}
      {cfg.actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {cfg.actions}
        </div>
      )}
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function Content() {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#fff", padding: 24 }}>
      {/* ── Drop page content here ── */}
      <span style={{ color: "#ccc", fontSize: 12 }}>Content</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div
      className={inter.variable}
      style={{
        width: "100vw", height: "100vh", overflow: "hidden",
        display: "flex",
        fontFamily: "var(--font-inter)",
        userSelect: "none", WebkitUserSelect: "none",
      }}
    >
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar page={activeNav} />
        <Content />
      </div>
    </div>
  );
}
