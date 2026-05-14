import { Inter } from "next/font/google";
import { useState, useEffect, type ReactElement } from "react";
import { ALUMNI, STAFF, CALENDAR_EVENTS, MOCK_TODAY, ENGAGEMENT_DATA, COMPLETION_DATA, PROGRAM_HEALTH_DELTA, MOCK_LESSONS_COMPLETED, MOCK_ACTIVITIES_OVERDUE, MOCK_ACTIVITIES_RESOLVED_WEEK, SCRIPT_VIEWS, SCRIPTS, MOCK_LESSON_BEST, MOCK_LESSON_WORST, MOCK_MESSAGES_SENT, MOCK_MESSAGES_RECEIVED, MESSAGE_THREADS, MOCK_COMPLETED_ACTIVITIES, type GraphViewKey } from "../data/mock";

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

// ─── Date/calendar utilities ──────────────────────────────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const { year: CAL_TODAY_YEAR, month: CAL_TODAY_MONTH, day: CAL_TODAY_DAY } = MOCK_TODAY;

// ─── Animation helpers ────────────────────────────────────────────────────────

// Vertical collapse — grid-template-rows trick, no JS height measurement needed
function Collapse({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateRows: show ? "1fr" : "0fr",
      opacity: show ? 1 : 0,
      transition: `grid-template-rows 300ms ${MS.eOut}, opacity 220ms ease`,
    }}>
      <div style={{ overflow: "hidden" }}>{children}</div>
    </div>
  );
}

// Fade-out then unmount — for flex-row slots; siblings fill space after card disappears
function FadeSlot({ show, children, style }: { show: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  const [mounted, setMounted] = useState(show);
  const [vis,     setVis]     = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVis(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVis(false);
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;
  return (
    <div style={{
      display: "flex", flexDirection: "column",   // lets StatCard's flex:1 fill height
      opacity: vis ? 1 : 0,
      transform: vis ? "scale(1)" : "scale(0.98)",
      transition: `opacity 220ms ease, transform 220ms ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Dropdown / popover enter-exit (slide down + fade)
function PopoverTransition({ show, children, style }: { show: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  const [mounted, setMounted] = useState(show);
  const [vis,     setVis]     = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVis(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVis(false);
      const t = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;
  return (
    <div style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(-6px)",
      transition: "opacity 170ms ease, transform 170ms ease",
      pointerEvents: vis ? "auto" : "none",
      ...style,
    }}>
      {children}
    </div>
  );
}

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

// ─── Dashboard — view tab ─────────────────────────────────────────────────────
const VIEW_TABS = ["This Week", "This Month", "This Semester"] as const;
type ViewTab = typeof VIEW_TABS[number];

const VIEW_KEY: Record<ViewTab, GraphViewKey> = {
  "This Week":     "week",
  "This Month":    "month",
  "This Semester": "semester",
};

// ─── Customize tools config ───────────────────────────────────────────────────
const TOOL_SECTIONS = [
  {
    key: "yourStudents" as const,
    label: "Your Students",
    tools: [
      { key: "studentLeaderboard" as const, label: "Student Leaderboard" },
      { key: "engagementGraph"    as const, label: "Engagement Graph"    },
      { key: "assignedActivities" as const, label: "Assigned Activities" },
      { key: "myIntake"           as const, label: "My Intake"           },
      { key: "myEvents"           as const, label: "My Events"           },
    ],
  },
  {
    key: "programSnapshot" as const,
    label: "Program Snapshot",
    tools: [
      { key: "programHealth"     as const, label: "Program Health"     },
      { key: "studentsOnTrack"   as const, label: "Students on Track"  },
      { key: "activationRate"    as const, label: "Activation Rate"    },
      { key: "lessonsCompleted"  as const, label: "Lessons Completed"  },
      { key: "activitiesOverdue" as const, label: "Activities Overdue" },
    ],
  },
  {
    key: "whatsWorking" as const,
    label: "What's Working",
    tools: [
      { key: "scripts"  as const, label: "Scripts"  },
      { key: "lessons"  as const, label: "Lessons"  },
      { key: "messages" as const, label: "Messages" },
    ],
  },
] as const;

type ToolKey = typeof TOOL_SECTIONS[number]["tools"][number]["key"];
type ToolsVisible = Record<ToolKey, boolean>;

function initToolsVisible(): ToolsVisible {
  return Object.fromEntries(
    TOOL_SECTIONS.flatMap(s => s.tools.map(t => [t.key, true]))
  ) as ToolsVisible;
}

// ─── Tri-state checkbox ───────────────────────────────────────────────────────
type CheckState = "unchecked" | "partial" | "checked";

function Checkbox({ state }: { state: CheckState }) {
  const filled = state === "checked" || state === "partial";
  return (
    <div style={{
      width: 15, height: 15, borderRadius: 3, flexShrink: 0,
      border: filled ? "none" : "1.5px solid #C5C5CC",
      background: filled ? "#3E4FD3" : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      {state === "checked" && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5l2 2L7.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {state === "partial" && (
        <svg width="7" height="2" viewBox="0 0 7 2" fill="none">
          <path d="M0 1h7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

// ─── Dashboard actions (toolbar) ──────────────────────────────────────────────
function DashboardActions({
  view, onViewChange, toolsVisible, setToolsVisible,
}: {
  view: ViewTab;
  onViewChange: (v: ViewTab) => void;
  toolsVisible: ToolsVisible;
  setToolsVisible: (tv: ToolsVisible) => void;
}) {
  const [open, setOpen] = useState(false);

  function getSectionState(section: typeof TOOL_SECTIONS[number]): CheckState {
    const keys = section.tools.map(t => t.key);
    const n = keys.filter(k => toolsVisible[k]).length;
    if (n === 0) return "unchecked";
    if (n === keys.length) return "checked";
    return "partial";
  }

  function toggleSection(section: typeof TOOL_SECTIONS[number]) {
    const newVal = getSectionState(section) === "unchecked"; // if unchecked → true; else → false
    const patch: Partial<ToolsVisible> = {};
    section.tools.forEach(t => { patch[t.key] = newVal; });
    setToolsVisible({ ...toolsVisible, ...patch } as ToolsVisible);
  }

  function toggleTool(key: ToolKey) {
    setToolsVisible({ ...toolsVisible, [key]: !toolsVisible[key] });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

      {/* ── Customize tools ── */}
      <div
        style={{ position: "relative" }}
        tabIndex={-1}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            height: 36, paddingInline: 14, borderRadius: 8,
            border: BORDER, background: open ? "#F8F8FA" : "#fff", color: "#121216",
            fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          Customize tools
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round">
            <path d={open ? "M3 9l4-4 4 4" : "M3 5l4 4 4-4"}/>
          </svg>
        </button>

        <PopoverTransition show={open} style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 40 }}>
          <div style={{
            background: "#fff", border: BORDER, borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)", padding: "6px 0", minWidth: 236,
          }}>
            {TOOL_SECTIONS.map((section, si) => (
              <div key={section.key}>
                {si > 0 && <div style={{ height: 1, background: "#E5E5EA", margin: "4px 0" }} />}

                {/* Section row */}
                <div
                  onClick={() => toggleSection(section)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", cursor: "pointer" }}
                >
                  <Checkbox state={getSectionState(section)} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#121216" }}>{section.label}</span>
                </div>

                {/* Tool rows */}
                {section.tools.map(tool => (
                  <div
                    key={tool.key}
                    onClick={() => toggleTool(tool.key)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 14px 5px 38px", cursor: "pointer" }}
                  >
                    <Checkbox state={toolsVisible[tool.key] ? "checked" : "unchecked"} />
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#121216" }}>{tool.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PopoverTransition>
      </div>

      {/* ── View tabs ── */}
      <div style={{ display: "flex", alignItems: "center", background: "#F8F8FA", borderRadius: 8, padding: 3, border: BORDER }}>
        {VIEW_TABS.map((tab) => {
          const active = view === tab;
          return (
            <button key={tab} onClick={() => onViewChange(tab)} style={{
              height: 28, paddingInline: 12, borderRadius: 6, border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "#121216" : "#8E8E97",
              fontSize: 13, fontWeight: active ? 500 : 400,
              fontFamily: "var(--font-inter)", cursor: "pointer",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
            }}>{tab}</button>
          );
        })}
      </div>

    </div>
  );
}

// ─── Page configs ─────────────────────────────────────────────────────────────
type PageConfig = { title: string; description: string; actions: ReactElement | null };

function makePageConfigs(
  view: ViewTab,
  setView: (v: ViewTab) => void,
  toolsVisible: ToolsVisible,
  setToolsVisible: (tv: ToolsVisible) => void,
): Record<NavId, PageConfig> {
  return {
    1: { title: "Dashboard",      description: "Good morning, Dr. Okafor  ·  Spring 2026",              actions: <DashboardActions view={view} onViewChange={setView} toolsVisible={toolsVisible} setToolsVisible={setToolsVisible} /> },
    2: { title: "Student Roster", description: "Manage student access and invitation status",             actions: <><BtnMain label="Add Student" /><BtnSecondary label="Import CSV" /></> },
    3: { title: "Learn Library",  description: "Browse and assign lessons to students",                   actions: null },
    4: { title: "Script Library", description: "Manage communication templates available to students",    actions: <BtnMain label="New Script" /> },
    5: { title: "Activities",     description: "Assign follow-up tasks and track student completion",     actions: <BtnMain label="New Activity" /> },
    6: { title: "Messages",       description: "",                                                        actions: <BtnMain label="New Message" /> },
    7: { title: "Events",         description: "Shared with all students in the app",                    actions: <BtnMain label="New Event" /> },
    8: { title: "Resources",      description: "Links, documents, and videos available to all students", actions: <BtnMain label="Add Resource" /> },
    9: { title: "Settings",       description: "",                                                        actions: null },
  };
}

// ─── Nav icons ────────────────────────────────────────────────────────────────
const icons: Record<string, ReactElement> = {
  Dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  ),
  Roster: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
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
      <path d="M10 1v4h3"/><path d="M5 8h6M5 11h4"/>
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
      <path d="M1.5 6.5h13"/><path d="M5 1.5v2M11 1.5v2"/>
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
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: 10, borderRadius: 8, cursor: "pointer",
      background: active ? NAV_ACTIVE_BG : "transparent",
      color: active ? NAV_ACTIVE_COLOR : NAV_REST_COLOR,
      transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
    }}>
      {icons[label]}
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, lineHeight: 1 }}>{label}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 1, label: "Dashboard"  },
  { id: 2, label: "Roster"     },
  { id: 3, label: "Lessons"    },
  { id: 4, label: "Scripts"    },
  { id: 5, label: "Activities" },
  { id: 6, label: "Messages"   },
  { id: 7, label: "Events"     },
  { id: 8, label: "Resources"  },
] as const;

const SETTINGS_ITEM = { id: 9, label: "Settings" } as const;
type NavId = typeof NAV_ITEMS[number]["id"] | typeof SETTINGS_ITEM["id"];

function Sidebar({ active, onSelect }: { active: NavId; onSelect: (id: NavId) => void }) {
  return (
    <div style={{
      width: SIDEBAR_W, height: "100vh", flexShrink: 0,
      background: "#F8F8FA", borderRight: BORDER,
      display: "flex", flexDirection: "column",
      overflow: "hidden", boxSizing: "border-box",
    }}>
      <div style={{ height: TOPBAR_H, flexShrink: 0, display: "flex", alignItems: "center", paddingInline: 16, gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "#3E4FD3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "#fff", fontWeight: 600, letterSpacing: "0.02em" }}>CC</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#121216", lineHeight: 1 }}>Campus Connect</span>
      </div>
      <div style={{ height: 1, background: "#E5E5EA", marginBottom: 8 }} />
      <div style={{ paddingInline: 16, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", paddingBottom: 16 }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(({ id, label }) => (
            <NavItem key={id} label={label} active={active === id} onClick={() => onSelect(id)} />
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ height: 1, background: "#E5E5EA", marginBottom: 8 }} />
        <NavItem label={SETTINGS_ITEM.label} active={active === SETTINGS_ITEM.id} onClick={() => onSelect(SETTINGS_ITEM.id)} />
      </div>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ page, configs }: { page: NavId; configs: Record<NavId, PageConfig> }) {
  const cfg = configs[page];
  return (
    <div style={{ height: TOPBAR_H, flexShrink: 0, background: "#fff", borderBottom: BORDER, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#121216", lineHeight: 1 }}>{cfg.title}</span>
        {cfg.description && (
          <span style={{ fontSize: 14, fontWeight: 400, color: "#8E8E97", lineHeight: 1 }}>{cfg.description}</span>
        )}
      </div>
      {cfg.actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{cfg.actions}</div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

// Avatar helpers
const AVATAR_PALETTE = ["#3E4FD3","#F59E0B","#10B981","#EF4444","#8B5CF6","#06B6D4","#F97316","#EC4899","#14B8A6","#7C3AED"];
const avatarColor    = (id: number) => AVATAR_PALETTE[id % AVATAR_PALETTE.length];
const avatarInitials = (name: string) => { const p = name.trim().split(" "); return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase(); };
const scorePill = (s: number) =>
  s >= 80 ? { bg: "#EBFAF2", text: "#22A062" } :
  s >= 40 ? { bg: "#FEF9E6", text: "#C28F11" } :
             { bg: "#FFEFEF", text: "#C72727" };

// Shared card shell
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: BORDER, borderRadius: 10, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

// ── Student leaderboard ───────────────────────────────────────────────────────
type LeaderTab = "All" | "Needs Attention" | "Rising Stars";
const LEADER_TABS: LeaderTab[] = ["All", "Needs Attention", "Rising Stars"];

const activated = ALUMNI.filter(a => a.status === "Activated").sort((a, b) => b.engagementScore - a.engagementScore);

const scheduledDateLabel = `${MONTH_NAMES[CAL_TODAY_MONTH].slice(0, 3)} ${CAL_TODAY_DAY}`;

function StudentLeaderboard({ onNavigate }: { onNavigate: (page: NavId) => void }) {
  const [tab,     setTab]     = useState<LeaderTab>("All"); // button highlight
  const [rowTab,  setRowTab]  = useState<LeaderTab>("All"); // actual data
  const [rowsVis, setRowsVis] = useState(true);
  const [scheduled, setScheduled] = useState<Set<number>>(new Set());

  function switchTab(next: LeaderTab) {
    if (next === tab) return;
    setTab(next);           // button activates immediately
    setRowsVis(false);      // rows fade out
    setTimeout(() => {
      setRowTab(next);      // swap data while invisible
      requestAnimationFrame(() => setRowsVis(true)); // fade in
    }, 160);
  }

  const rows = rowTab === "All"
    ? activated
    : rowTab === "Needs Attention"
      ? activated.filter(a => a.engagementScore < 60 || a.trend < 0)
      : activated.filter(a => a.trend >= 10);

  return (
    <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#121216" }}>Student Engagement</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8E8E97" }}>Ranked by engagement score this month</p>
          </div>
          {/* Tabs */}
          <div style={{
            display: "flex", alignItems: "center",
            height: 32, background: "#F8F8FA", borderRadius: 8, padding: 2, border: BORDER,
          }}>
            {LEADER_TABS.map((t) => {
              const active = tab === t;
              return (
                <button key={t} onClick={() => switchTab(t)} style={{
                  height: 28, paddingInline: 10, borderRadius: 6, border: "none",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#121216" : "#8E8E97",
                  fontSize: 12, fontWeight: active ? 500 : 400,
                  fontFamily: "var(--font-inter)", cursor: "pointer",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
                }}>{t}</button>
              );
            })}
          </div>
        </div>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 48px 72px 52px 52px 72px 80px 104px", gap: 6, padding: "0 8px 8px", borderBottom: BORDER }}>
          {["#", "Student", "Score", "Trend", "Streak", "Courses", "Completed", "Incomplete", ""].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 500, color: "#8E8E97", textAlign: i >= 2 ? "center" : "left" }}>{h}</span>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div style={{
        flex: 1, overflowY: "auto",
        opacity: rowsVis ? 1 : 0,
        transform: rowsVis ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 160ms ease, transform 160ms ease",
      }}>
        {rows.map((a, i) => {
          const rank       = activated.indexOf(a) + 1;
          const trendUp    = a.trend > 0, trendDown = a.trend < 0;
          const trendColor = trendUp ? "#10B981" : trendDown ? "#EF4444" : "#8E8E97";
          const trendArrow = trendUp ? "↑" : trendDown ? "↓" : "→";
          const completed  = MOCK_COMPLETED_ACTIVITIES[a.id] ?? 0;
          const incomplete = a.assignedActivityIds.length - completed;
          const isScheduled = scheduled.has(a.id);
          return (
            <div key={a.id} style={{
              display: "grid", gridTemplateColumns: "24px 1fr 48px 72px 52px 52px 72px 80px 104px",
              gap: 6, padding: "8px 16px",
              borderBottom: i < rows.length - 1 ? BORDER : "none",
              alignItems: "center",
            }}>
              {/* Rank */}
              <span style={{ fontSize: rank <= 3 ? 14 : 12, color: "#8E8E97", textAlign: "center", lineHeight: 1 }}>
                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
              </span>
              {/* Student */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: avatarColor(a.id), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{avatarInitials(a.name)}</span>
                </div>
                <span style={{ fontSize: 13, color: "#121216", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span>
              </div>
              {/* Score */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 20, borderRadius: 4,
                  background: scorePill(a.engagementScore).bg,
                  color: scorePill(a.engagementScore).text,
                  fontSize: 10, fontWeight: 600,
                }}>{a.engagementScore}</span>
              </div>
              {/* Trend */}
              <span style={{ fontSize: 12, color: trendColor, textAlign: "center" }}>
                {trendArrow} {a.trend > 0 ? `+${a.trend}` : a.trend === 0 ? "—" : a.trend}
              </span>
              {/* Streak */}
              <span style={{ fontSize: 12, color: "#121216", textAlign: "center" }}>
                {a.streak > 0 ? `🔥 ${a.streak}d` : "—"}
              </span>
              {/* # Courses */}
              <span style={{ fontSize: 12, color: "#121216", textAlign: "center" }}>
                {a.assignedLessonIds.length}
              </span>
              {/* Assig. Completed */}
              <span style={{ fontSize: 12, color: "#22A062", textAlign: "center" }}>
                {completed}
              </span>
              {/* Assig. Incomplete */}
              <span style={{ fontSize: 12, color: incomplete > 0 ? "#C72727" : "#8E8E97", textAlign: "center" }}>
                {incomplete}
              </span>
              {/* Schedule 1-1 */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                {isScheduled
                  ? <span style={{ fontSize: 11, color: "#8E8E97" }}>Scheduled {scheduledDateLabel}</span>
                  : <button
                      onClick={() => setScheduled(prev => new Set(prev).add(a.id))}
                      style={{
                        height: 26, paddingInline: 10, borderRadius: 6, border: "none",
                        background: "#3E4FD3", color: "#fff",
                        fontSize: 11, fontWeight: 500, fontFamily: "var(--font-inter)",
                        cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >
                      Schedule 1-1
                    </button>
                }
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: "#ccc" }}>No students match this filter.</div>
        )}
      </div>
      <div style={{ padding: "10px 16px 14px", borderTop: BORDER }}>
        <button
          onClick={() => onNavigate(2)}
          style={{ background: "none", border: "none", fontSize: 12, color: "#3E4FD3", cursor: "pointer", fontFamily: "var(--font-inter)", padding: 0 }}
        >
          View all students →
        </button>
      </div>
    </Card>
  );
}

// ── Engagement graph ──────────────────────────────────────────────────────────
type GraphMetric = "engagement" | "completion";
const METRIC_LABELS: Record<GraphMetric, string> = {
  engagement: "Student Engagement",
  completion:  "Activity Completion",
};

function EngagementGraph({ view }: { view: ViewTab }) {
  const [metric, setMetric] = useState<GraphMetric>("engagement");
  const [open,   setOpen]   = useState(false);

  const vk   = VIEW_KEY[view];
  const data = metric === "engagement" ? ENGAGEMENT_DATA[vk] : COMPLETION_DATA[vk];
  const n    = data.length;

  // SVG coordinate system
  const VW = 560, VH = 140;
  const pL = 36, pR = 12, pT = 10, pB = 28;       // padding
  const plotX = pL, plotY = pT;
  const plotW = VW - pL - pR, plotH = VH - pT - pB;

  const xOf = (i: number) => plotX + (n > 1 ? i * plotW / (n - 1) : plotW / 2);
  const yOf = (v: number) => plotY + plotH * (1 - v / 100);

  const pts  = data.map((d, i) => ({ x: xOf(i), y: yOf(d.value) }));
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${lineD} L${pts[pts.length-1].x.toFixed(1)},${(plotY+plotH).toFixed(1)} L${pts[0].x.toFixed(1)},${(plotY+plotH).toFixed(1)} Z`;

  const gradId = metric === "engagement" ? "engGrad" : "cmpGrad";
  const lineColor = "#3E4FD3";

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <Card>
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Metric dropdown */}
        <div style={{ position: "relative" }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ display: "flex", alignItems: "center", gap: 6, border: BORDER, borderRadius: 8, padding: "5px 10px", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#121216", fontFamily: "var(--font-inter)" }}
          >
            {METRIC_LABELS[metric]}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <PopoverTransition show={open} style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 20 }}>
            <div style={{ background: "#fff", border: BORDER, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", overflow: "hidden", minWidth: 180 }}>
              {(Object.keys(METRIC_LABELS) as GraphMetric[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMetric(m); setOpen(false); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: m === metric ? "#F8F8FA" : "#fff", color: "#121216", fontSize: 13, fontWeight: m === metric ? 500 : 400, fontFamily: "var(--font-inter)", cursor: "pointer" }}
                >
                  {METRIC_LABELS[m]}
                </button>
              ))}
            </div>
          </PopoverTransition>
        </div>
      </div>
      <div style={{ paddingInline: 16, paddingBottom: 14 }}>
        <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", display: "block" }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.15"/>
              <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Y-axis gridlines + labels */}
          {yTicks.map(v => {
            const y = yOf(v);
            return (
              <g key={v}>
                <line x1={plotX} y1={y} x2={plotX + plotW} y2={y} stroke="#E5E5EA" strokeWidth="0.8" strokeDasharray={v === 0 ? "none" : "3 3"}/>
                <text x={plotX - 6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#8E8E97" fontFamily="var(--font-inter)">{v}%</text>
              </g>
            );
          })}

          {/* Area + line */}
          <path d={areaD} fill={`url(#${gradId})`}/>
          <path d={lineD} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinejoin="round"/>

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text key={i} x={xOf(i)} y={plotY + plotH + 16} textAnchor="middle" fontSize="9" fill="#8E8E97" fontFamily="var(--font-inter)">{d.label}</text>
          ))}
        </svg>
      </div>
    </Card>
  );
}

// ── My Assigned Activities (placeholder) ─────────────────────────────────────
function MyAssignedActivities() {
  return (
    <Card style={{ padding: "14px 16px" }}>
      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: "#121216" }}>My Assigned Activities</p>
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 12, color: "#ccc" }}>— coming soon —</span>
      </div>
    </Card>
  );
}

// ── My Intake (placeholder) ───────────────────────────────────────────────────
function MyIntake() {
  return (
    <Card style={{ padding: "14px 16px" }}>
      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: "#121216" }}>My Intake</p>
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 12, color: "#ccc" }}>— coming soon —</span>
      </div>
    </Card>
  );
}

// ── My Events ────────────────────────────────────────────────────────────────
const CAL_DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildCalendarGrid(year: number, month: number) {
  const firstDOW    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDOW).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function MyEvents({ onNavigate }: { onNavigate: (page: NavId) => void }) {
  const [calYear,  setCalYear]  = useState(CAL_TODAY_YEAR);
  const [calMonth, setCalMonth] = useState(CAL_TODAY_MONTH);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // nav helpers
  function prevMonth() {
    setSelectedDay(null);
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    setSelectedDay(null);
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  const calCells   = buildCalendarGrid(calYear, calMonth);
  const eventDays  = new Set(
    CALENDAR_EVENTS
      .filter(e => { const d = new Date(e.date); return d.getFullYear() === calYear && d.getMonth() === calMonth; })
      .map(e => new Date(e.date).getDate())
  );
  const monthEvents = CALENDAR_EVENTS.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  });
  const visibleEvents = selectedDay !== null
    ? monthEvents.filter(e => new Date(e.date).getDate() === selectedDay)
    : monthEvents;

  const isCurrentMonth = calYear === CAL_TODAY_YEAR && calMonth === CAL_TODAY_MONTH;
  const panelLabel     = selectedDay !== null
    ? `${MONTH_NAMES[calMonth]} ${selectedDay}`
    : MONTH_NAMES[calMonth];

  const navBtn = (label: string, onClick: () => void) => (
    <button onClick={onClick} style={{ width: 22, height: 22, border: BORDER, borderRadius: 5, background: "#fff", cursor: "pointer", fontSize: 12, color: "#8E8E97", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-inter)" }}>{label}</button>
  );

  return (
    <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px 12px" }}>
        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#121216" }}>My Events</p>
        <div style={{ display: "flex", gap: 16 }}>

          {/* Mini calendar */}
          <div style={{ flexShrink: 0, width: 196 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#121216" }}>{MONTH_NAMES[calMonth]} {calYear}</span>
              <div style={{ display: "flex", gap: 2 }}>
                {navBtn("‹", prevMonth)}
                {navBtn("›", nextMonth)}
              </div>
            </div>
            {/* Day-of-week headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 2 }}>
              {CAL_DOW_LABELS.map((d, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 500, color: "#8E8E97", padding: "2px 0" }}>{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 1 }}>
              {calCells.map((day, i) => {
                const isToday    = isCurrentMonth && day === CAL_TODAY_DAY;
                const isSelected = day !== null && day === selectedDay;
                const hasEvent   = day !== null && eventDays.has(day);
                return (
                  <div
                    key={i}
                    onClick={() => day && setSelectedDay(isSelected ? null : day)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 26 }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: isSelected ? "#3E4FD3" : isToday ? "#EDEEFD" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: day ? "pointer" : "default",
                    }}>
                      <span style={{ fontSize: 11, color: isSelected ? "#fff" : isToday ? "#3E4FD3" : day ? "#121216" : "transparent", fontWeight: isToday || isSelected ? 600 : 400 }}>
                        {day ?? ""}
                      </span>
                    </div>
                    {hasEvent && !isSelected && (
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3E4FD3", marginTop: 1 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event list */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "#121216" }}>{panelLabel}</p>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleEvents.length === 0 && (
                <p style={{ margin: 0, fontSize: 12, color: "#8E8E97" }}>No events.</p>
              )}
              {visibleEvents.map(evt => {
                const d = new Date(evt.date).getDate();
                return (
                  <div key={evt.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EDEEFD", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#3E4FD3", lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>{MONTH_NAMES[calMonth].slice(0,3)}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#3E4FD3", lineHeight: 1.1 }}>{d}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#121216", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{evt.title}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#8E8E97" }}>{evt.timeLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onNavigate(7)}
              style={{ marginTop: 12, background: "none", border: "none", fontSize: 12, color: "#3E4FD3", cursor: "pointer", fontFamily: "var(--font-inter)", padding: 0, textAlign: "left" }}
            >
              View all events →
            </button>
          </div>

        </div>
      </div>
    </Card>
  );
}

// ── What's working — module-level derived data ────────────────────────────────
const topScripts = [...SCRIPTS]
  .sort((a, b) => (SCRIPT_VIEWS[b.id] ?? 0) - (SCRIPT_VIEWS[a.id] ?? 0))
  .slice(0, 3);
const maxScriptViews    = SCRIPT_VIEWS[topScripts[0]?.id] ?? 1;
const unreadThreadCount = MESSAGE_THREADS.filter(t => t.unreadCount > 0).length;

// ── What's working — cards ────────────────────────────────────────────────────
function WhatsWorkingCards({ toolsVisible }: { toolsVisible: ToolsVisible }) {
  const showScripts  = toolsVisible.scripts;
  const showLessons  = toolsVisible.lessons;
  const showMessages = toolsVisible.messages;
  return (
    <div style={{ display: "flex", gap: 16 }}>

      {/* Card 1 — Scripts */}
      <FadeSlot show={showScripts} style={{ width: "25%", flexShrink: 0 }}>
        <StatCard>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#121216" }}>Scripts</p>
          <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>Most viewed by your students</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topScripts.map(s => {
              const views = SCRIPT_VIEWS[s.id] ?? 0;
              const barW  = Math.round((views / maxScriptViews) * 100);
              return (
                <div key={s.id}>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#121216", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#8E8E97" }}>{views} views</p>
                  <div style={{ height: 4, borderRadius: 2, background: "#E5E5EA" }}>
                    <div style={{ height: "100%", width: `${barW}%`, borderRadius: 2, background: "#3E4FD3" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </StatCard>
      </FadeSlot>

      {/* Card 2 — Lessons */}
      <FadeSlot show={showLessons} style={{ flex: 1 }}>
        <StatCard>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#121216" }}>Lessons</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>Completion rate across all assigned lessons</p>
          <span style={{ display: "block", fontSize: 56, fontWeight: 600, color: "#3E4FD3", lineHeight: 1, marginBottom: 8 }}>{lessonsRate}%</span>
          <div style={{ height: 6, borderRadius: 3, background: "#E5E5EA", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${lessonsRate}%`, borderRadius: 3, background: "#3E4FD3" }} />
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8E8E97" }}>
            {MOCK_LESSONS_COMPLETED} completed &nbsp;·&nbsp; {lessonsNotStarted} in progress or not started &nbsp;·&nbsp; {totalAssignedLessons} total assigned
          </p>
          <p style={{ margin: "0 0 3px", fontSize: 12, color: "#22A062" }}>
            Highest: {MOCK_LESSON_BEST.title} &nbsp; {MOCK_LESSON_BEST.rate}%
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#C72727" }}>
            Lowest: {MOCK_LESSON_WORST.title} &nbsp; {MOCK_LESSON_WORST.rate}%
          </p>
        </StatCard>
      </FadeSlot>

      {/* Card 3 — Messages */}
      <FadeSlot show={showMessages} style={{ width: "25%", flexShrink: 0 }}>
        <StatCard>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#121216" }}>Messages</p>
          <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>Conversations this month</p>
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <div>
              <span style={{ display: "block", fontSize: 32, fontWeight: 700, color: "#3E4FD3", lineHeight: 1, marginBottom: 4 }}>{MOCK_MESSAGES_SENT}</span>
              <span style={{ fontSize: 12, color: "#8E8E97" }}>sent by you</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: 32, fontWeight: 700, color: "#121216", lineHeight: 1, marginBottom: 4 }}>{MOCK_MESSAGES_RECEIVED}</span>
              <span style={{ fontSize: 12, color: "#8E8E97" }}>from students</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#22A062", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{unreadThreadCount}</span>
            <span style={{ fontSize: 12, color: "#8E8E97" }}>unread conversations</span>
          </div>
        </StatCard>
      </FadeSlot>

    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 18, fontWeight: 600, color: "#121216", lineHeight: 1, flexShrink: 0 }}>{title}</span>
      {subtitle && (
        <span style={{ fontSize: 14, fontWeight: 400, color: "#8E8E97", lineHeight: 1 }}>{subtitle}</span>
      )}
    </div>
  );
}

// ── Hoverable stat card ───────────────────────────────────────────────────────
function StatCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, borderRadius: 10, border: BORDER,
        background: hovered ? "#EDEEFD" : "#fff",
        transition: `background ${MS.dFast} ${MS.eOut}`,
        padding: "20px 20px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Computed stats
const invitedAlumni        = ALUMNI.filter(a => a.status === "Invited");
const programHealth        = Math.round(activated.reduce((s, a) => s + a.engagementScore, 0) / activated.length);
const onTrackCount         = activated.filter(a => a.engagementScore > 40).length;
const activationPct        = Math.round(activated.length / (activated.length + invitedAlumni.length) * 100);
const totalAssignedLessons = activated.reduce((s, a) => s + a.assignedLessonIds.length, 0);
const lessonsRate          = Math.round(MOCK_LESSONS_COMPLETED / totalAssignedLessons * 100);
const lessonsNotStarted    = totalAssignedLessons - MOCK_LESSONS_COMPLETED;
const totalAssignedActs    = activated.reduce((s, a) => s + a.assignedActivityIds.length, 0);

// ── Program snapshot ──────────────────────────────────────────────────────────
function ProgramSnapshot({ toolsVisible }: { toolsVisible: ToolsVisible }) {
  const showHealth    = toolsVisible.programHealth;
  const showOnTrack   = toolsVisible.studentsOnTrack;
  const showActRate   = toolsVisible.activationRate;
  const showLessons   = toolsVisible.lessonsCompleted;
  const showOverdue   = toolsVisible.activitiesOverdue;

  const hasTopRow    = showHealth || showOnTrack || showActRate;
  const hasBottomRow = showLessons || showOverdue;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* Top row — 3 stat cards × 192px */}
      <Collapse show={hasTopRow}>
        <div style={{ paddingBottom: 16 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <FadeSlot show={showHealth} style={{ flex: 1 }}>
              <StatCard style={{ height: 192 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontSize: 64, fontWeight: 700, color: "#3E4FD3", lineHeight: 1 }}>{programHealth}</span>
                  <span style={{ fontSize: 16, fontWeight: 400, color: "#8E8E97" }}>/100</span>
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#121216" }}>Program Health</p>
                <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>Your students{"'"} average engagement this month</p>
                <div style={{ height: 6, borderRadius: 3, background: "#E5E5EA", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${programHealth}%`, borderRadius: 3, background: "#3E4FD3" }} />
                </div>
                <p style={{ margin: "10px 0 0", fontSize: 12, color: "#22A062" }}>↑ +{PROGRAM_HEALTH_DELTA} since last month</p>
              </StatCard>
            </FadeSlot>
            <FadeSlot show={showOnTrack} style={{ flex: 1 }}>
              <StatCard style={{ height: 192 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontSize: 64, fontWeight: 700, color: "#22A062", lineHeight: 1 }}>{onTrackCount}</span>
                  <span style={{ fontSize: 16, fontWeight: 400, color: "#8E8E97" }}>/{activated.length}</span>
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#121216" }}>Students on track</p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>for semester completion</p>
              </StatCard>
            </FadeSlot>
            <FadeSlot show={showActRate} style={{ flex: 1 }}>
              <StatCard style={{ height: 192 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontSize: 64, fontWeight: 700, color: "#3E4FD3", lineHeight: 1 }}>{activationPct}%</span>
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#121216" }}>Activation rate</p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>of invited students are active</p>
              </StatCard>
            </FadeSlot>
          </div>
        </div>
      </Collapse>

      {/* Bottom row */}
      <Collapse show={hasBottomRow}>
        <div style={{ display: "flex", gap: 16 }}>
          <FadeSlot show={showLessons} style={{ flex: 1 }}>
            <StatCard>
              <span style={{ display: "block", fontSize: 24, fontWeight: 600, color: "#3E4FD3", lineHeight: 1, marginBottom: 6 }}>{MOCK_LESSONS_COMPLETED}</span>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: "#8E8E97" }}>Lessons completed</p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>of {totalAssignedLessons} assigned &middot; {lessonsRate}% rate</p>
            </StatCard>
          </FadeSlot>
          <FadeSlot show={showOverdue} style={{ flex: 1 }}>
            <StatCard>
              <span style={{ display: "block", fontSize: 24, fontWeight: 600, color: "#C72727", lineHeight: 1, marginBottom: 6 }}>{MOCK_ACTIVITIES_OVERDUE}</span>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: "#8E8E97" }}>Activities overdue</p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: "#8E8E97" }}>of {totalAssignedActs} total &middot; {MOCK_ACTIVITIES_RESOLVED_WEEK} resolved last week</p>
            </StatCard>
          </FadeSlot>
          {[6, 7].map(n => (
            <Card key={n} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "#ccc" }}>Card {n} — coming soon</span>
            </Card>
          ))}
        </div>
      </Collapse>

    </div>
  );
}

// ── Dashboard root ────────────────────────────────────────────────────────────
function DashboardContent({ view, onNavigate, toolsVisible }: { view: ViewTab; onNavigate: (page: NavId) => void; toolsVisible: ToolsVisible }) {
  // ── "Your Students" section visibility ──
  const tv = toolsVisible;
  const showLeaderboard   = tv.studentLeaderboard;
  const showEngagement    = tv.engagementGraph;
  const showActivities    = tv.assignedActivities;
  const showIntake        = tv.myIntake;
  const showEvents        = tv.myEvents;
  const hasLeftCol        = showLeaderboard;
  const hasRightCol       = showEngagement || showActivities || showIntake || showEvents;
  const showYourStudents  = hasLeftCol || hasRightCol;

  // ── "Program Snapshot" section visibility ──
  const showProgramSection = tv.programHealth || tv.studentsOnTrack || tv.activationRate || tv.lessonsCompleted || tv.activitiesOverdue;

  // ── "What's Working" section visibility ──
  const showWhatsWorking   = tv.scripts || tv.lessons || tv.messages;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* Your students */}
      <Collapse show={showYourStudents}>
        <div style={{ paddingBottom: 48 }}>
          <SectionHeader title="Your students" />
          <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            <FadeSlot show={hasLeftCol} style={{ flex: "0 0 50%", minWidth: 0 }}>
              <StudentLeaderboard onNavigate={onNavigate} />
            </FadeSlot>
            <FadeSlot show={hasRightCol} style={{ flex: 1, minWidth: 0 }}>
              <Collapse show={showEngagement}><div style={{ paddingBottom: 16 }}><EngagementGraph view={view} /></div></Collapse>
              <Collapse show={showActivities}><div style={{ paddingBottom: 16 }}><MyAssignedActivities /></div></Collapse>
              <Collapse show={showIntake}><div style={{ paddingBottom: 16 }}><MyIntake /></div></Collapse>
              <Collapse show={showEvents}><MyEvents onNavigate={onNavigate} /></Collapse>
            </FadeSlot>
          </div>
        </div>
      </Collapse>

      {/* Program snapshot */}
      <Collapse show={showProgramSection}>
        <div style={{ paddingBottom: 48 }}>
          <SectionHeader
            title="How is your program doing?"
            subtitle="A snapshot of engagement across all your students this month"
          />
          <ProgramSnapshot toolsVisible={toolsVisible} />
        </div>
      </Collapse>

      {/* What's working */}
      <Collapse show={showWhatsWorking}>
        <div>
          <SectionHeader
            title="What's working?"
            subtitle="See which tools are driving the most student action"
          />
          <WhatsWorkingCards toolsVisible={toolsVisible} />
        </div>
      </Collapse>

    </div>
  );
}

// ─── Roster page ─────────────────────────────────────────────────────────────

type RosterFilter = "All" | "Not Invited" | "Invited" | "Activated";
const ROSTER_FILTERS: RosterFilter[] = ["All", "Not Invited", "Invited", "Activated"];

function emailOf(name: string): string {
  const p = name.trim().split(/\s+/);
  return `${p[0][0].toLowerCase()}.${p[p.length - 1].toLowerCase()}@kent.edu`;
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    "Activated":   { bg: "#EBFAF2", fg: "#22A062" },
    "Invited":     { bg: "#FEF9E6", fg: "#C28F11" },
    "Not Invited": { bg: "#F2F2F5", fg: "#8E8E97" },
  };
  const s = map[status] ?? map["Not Invited"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 80, height: 24, borderRadius: 6, flexShrink: 0,
      background: s.bg, color: s.fg, fontSize: 11, fontWeight: 500,
    }}>
      {status}
    </span>
  );
}

// Column template — tighter date cols, more room for name/email/staff
const ROSTER_COL = "36px minmax(0,0.7fr) minmax(0,0.8fr) 102px 106px 116px 102px 118px 130px minmax(0,0.65fr) 100px 44px";

type SortKey = "name" | "status" | "dateInvited" | "dateActivated" | "dateLastActive" | "lessons" | "activities" | "staff" | "engagement";
type SortDir = "asc" | "desc";

const ROSTER_HEADERS: { label: string; sortKey: SortKey | null; center: boolean }[] = [
  { label: "",                     sortKey: null,             center: false },
  { label: "Name",                 sortKey: "name",           center: false },
  { label: "Email",                sortKey: null,             center: false },
  { label: "Status",               sortKey: "status",         center: false },
  { label: "Date Invited",         sortKey: "dateInvited",    center: false },
  { label: "Date Activated",       sortKey: "dateActivated",  center: false },
  { label: "Last Active",          sortKey: "dateLastActive", center: false },
  { label: "Assigned Lessons",     sortKey: "lessons",        center: true  },
  { label: "Assigned Activities",  sortKey: "activities",     center: true  },
  { label: "Staff Member",         sortKey: "staff",          center: false },
  { label: "Engagement",           sortKey: "engagement",     center: true  },
  { label: "",                     sortKey: null,             center: false },
];

function compareDates(a: string | null | undefined, b: string | null | undefined): number {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  return new Date(a).getTime() - new Date(b).getTime();
}

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
      style={{ marginLeft: 3, flexShrink: 0, opacity: active ? 1 : 0.25, transition: "opacity 150ms" }}>
      <path
        d={dir === "asc" ? "M1 5.5l3-3 3 3" : "M1 2.5l3 3 3-3"}
        stroke={active ? "#3E4FD3" : "#8E8E97"}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function RosterPage() {
  const [filter,   setFilter]   = useState<RosterFilter>("All");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [sortKey,  setSortKey]  = useState<SortKey>("name");
  const [sortDir,  setSortDir]  = useState<SortDir>("asc");

  // Close action menu on outside click
  useEffect(() => {
    if (openMenu === null) return;
    const close = () => setOpenMenu(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenu]);

  const counts: Record<RosterFilter, number> = {
    "All":         ALUMNI.length,
    "Not Invited": ALUMNI.filter(a => a.status === "Not Invited").length,
    "Invited":     ALUMNI.filter(a => a.status === "Invited").length,
    "Activated":   ALUMNI.filter(a => a.status === "Activated").length,
  };

  const rows = ALUMNI
    .filter(a => {
      if (filter !== "All" && a.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const staffName = STAFF.find(s => s.id === a.staffMemberId)?.name.toLowerCase() ?? "";
        return a.name.toLowerCase().includes(q) || staffName.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":            cmp = a.name.localeCompare(b.name); break;
        case "status":          cmp = a.status.localeCompare(b.status); break;
        case "dateInvited":     cmp = compareDates(a.dateInvited, b.dateInvited); break;
        case "dateActivated":   cmp = compareDates(a.dateActivated, b.dateActivated); break;
        case "dateLastActive":  cmp = compareDates(a.dateLastActive ?? a.dateActivated, b.dateLastActive ?? b.dateActivated); break;
        case "lessons":         cmp = a.assignedLessonIds.length - b.assignedLessonIds.length; break;
        case "activities":      cmp = a.assignedActivityIds.length - b.assignedActivityIds.length; break;
        case "staff": {
          const sa = STAFF.find(s => s.id === a.staffMemberId)?.name ?? "";
          const sb = STAFF.find(s => s.id === b.staffMemberId)?.name ?? "";
          cmp = sa.localeCompare(sb);
          break;
        }
        case "engagement":      cmp = a.engagementScore - b.engagementScore; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const allChecked  = rows.length > 0 && rows.every(a => selected.has(a.id));
  const someChecked = rows.some(a => selected.has(a.id)) && !allChecked;

  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev);
      if (allChecked) rows.forEach(a => next.delete(a.id));
      else            rows.forEach(a => next.add(a.id));
      return next;
    });
  }

  function toggleOne(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const cellTxt: React.CSSProperties = {
    paddingInline: 8, fontSize: 12, color: "#121216",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

      {/* ── Filter bar ── */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: BORDER }}>

        {/* Tabs — same segmented style as leaderboard */}
        <div style={{ display: "flex", alignItems: "center", height: 32, background: "#F8F8FA", borderRadius: 8, padding: 2, border: BORDER }}>
          {ROSTER_FILTERS.map(f => {
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                height: 28, paddingInline: 10, borderRadius: 6, border: "none",
                background: active ? "#fff" : "transparent",
                color: active ? "#121216" : "#8E8E97",
                fontSize: 12, fontWeight: active ? 500 : 400,
                fontFamily: "var(--font-inter)", cursor: "pointer",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
                whiteSpace: "nowrap",
              }}>
                {f} ({counts[f]})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <svg style={{ position: "absolute", left: 10, pointerEvents: "none" }} width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or staff member…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              height: 32, paddingInline: "30px 12px", borderRadius: 8, border: BORDER,
              fontSize: 13, color: "#121216", fontFamily: "var(--font-inter)",
              outline: "none", width: 268, background: "#fff",
            }}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

        {/* Column headers — sticky */}
        <div style={{
          flexShrink: 0, display: "grid", gridTemplateColumns: ROSTER_COL,
          padding: "0 20px", borderBottom: BORDER, background: "#FAFAFA",
        }}>
          {/* Header checkbox */}
          <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <input
              type="checkbox"
              checked={allChecked}
              ref={el => { if (el) el.indeterminate = someChecked; }}
              onChange={toggleAll}
              style={{ cursor: "pointer", accentColor: "#3E4FD3", width: 14, height: 14 }}
            />
          </div>
          {ROSTER_HEADERS.slice(1).map(({ label, sortKey: sk, center }, i) => (
            <div key={i}
              onClick={sk ? () => {
                if (sortKey === sk) setSortDir(d => d === "asc" ? "desc" : "asc");
                else { setSortKey(sk); setSortDir("asc"); }
              } : undefined}
              style={{
                height: 40, display: "flex", alignItems: "center", paddingInline: 8,
                fontSize: 11, fontWeight: 500, color: "#8E8E97",
                justifyContent: center ? "center" : "flex-start",
                cursor: sk ? "pointer" : "default",
                userSelect: "none",
                whiteSpace: "nowrap", overflow: "hidden",
              }}
            >
              {label}
              {sk && <SortArrow active={sortKey === sk} dir={sortKey === sk ? sortDir : "asc"} />}
            </div>
          ))}
        </div>

        {/* Scrollable rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {rows.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", fontSize: 13, color: "#C5C5CC" }}>
              No students match your search.
            </div>
          )}
          {rows.map((a, i) => {
            const staff      = STAFF.find(s => s.id === a.staffMemberId);
            const isSelected = selected.has(a.id);
            const menuOpen   = openMenu === a.id;

            return (
              <div key={a.id} style={{
                display: "grid", gridTemplateColumns: ROSTER_COL,
                padding: "0 20px", alignItems: "center",
                borderBottom: i < rows.length - 1 ? BORDER : "none",
                background: isSelected ? "#F5F6FE" : "#fff",
                transition: `background ${MS.dFast} ${MS.eOut}`,
              }}>

                {/* Checkbox */}
                <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleOne(a.id)}
                    style={{ cursor: "pointer", accentColor: "#3E4FD3", width: 14, height: 14 }} />
                </div>

                {/* Name */}
                <div style={{ ...cellTxt, fontSize: 13, fontWeight: 500 }}>{a.name}</div>

                {/* Email */}
                <div style={{ ...cellTxt, color: "#8E8E97" }}>{emailOf(a.name)}</div>

                {/* Status */}
                <div style={{ paddingInline: 8 }}><StatusBadge status={a.status} /></div>

                {/* Date Invited */}
                <div style={cellTxt}>{fmtDate(a.dateInvited)}</div>

                {/* Date Activated */}
                <div style={cellTxt}>{fmtDate(a.dateActivated)}</div>

                {/* Last Active — falls back to dateActivated */}
                <div style={cellTxt}>{fmtDate(a.dateLastActive ?? a.dateActivated)}</div>

                {/* Assigned Lessons */}
                <div style={{ ...cellTxt, textAlign: "center" }}>{a.assignedLessonIds.length || "—"}</div>

                {/* Assigned Activities */}
                <div style={{ ...cellTxt, textAlign: "center" }}>{a.assignedActivityIds.length || "—"}</div>

                {/* Staff Member */}
                <div style={cellTxt}>{staff?.name ?? "—"}</div>

                {/* Engagement */}
                <div style={{ paddingInline: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {a.engagementScore > 0 ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 32, height: 20, borderRadius: 4,
                      background: scorePill(a.engagementScore).bg,
                      color: scorePill(a.engagementScore).text,
                      fontSize: 10, fontWeight: 600,
                    }}>{a.engagementScore}</span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#C5C5CC" }}>—</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ paddingInline: 4, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <button
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); setOpenMenu(menuOpen ? null : a.id); }}
                    style={{
                      width: 28, height: 28, borderRadius: 6, border: BORDER,
                      background: menuOpen ? "#F8F8FA" : "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="3" height="13" viewBox="0 0 3 13" fill="#8E8E97">
                      <circle cx="1.5" cy="1.5" r="1.5"/>
                      <circle cx="1.5" cy="6.5" r="1.5"/>
                      <circle cx="1.5" cy="11.5" r="1.5"/>
                    </svg>
                  </button>

                  <PopoverTransition show={menuOpen} style={{ position: "absolute", right: 0, top: "calc(100% + 2px)", zIndex: 50 }}>
                    <div
                      onMouseDown={e => e.stopPropagation()}
                      style={{ background: "#fff", border: BORDER, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", overflow: "hidden", minWidth: 180 }}
                    >
                      {[
                        { label: "Invite Student",      color: a.status === "Activated" ? "#C5C5CC" : "#121216", enabled: a.status !== "Activated" },
                        { label: "Resend Invitation",   color: a.status === "Invited" ? "#121216" : "#C5C5CC", enabled: a.status === "Invited" },
                        { label: "Remove Student",      color: "#C72727", enabled: true },
                      ].map(({ label, color, enabled }) => (
                        <button key={label} disabled={!enabled} style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "9px 14px", border: "none", background: "#fff",
                          fontSize: 13, color, fontFamily: "var(--font-inter)",
                          cursor: enabled ? "pointer" : "default",
                        }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </PopoverTransition>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div style={{
          flexShrink: 0, borderTop: BORDER,
          padding: "10px 20px", display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: "#8E8E97",
        }}>
          <span style={{ fontWeight: 500, color: "#121216" }}>{ALUMNI.length}</span>
          <span>total students</span>
          <span>·</span>
          <span style={{ fontWeight: 500, color: "#22A062" }}>{counts.Activated}</span>
          <span>activated</span>
          <span>·</span>
          <span style={{ fontWeight: 500, color: "#C28F11" }}>{counts.Invited}</span>
          <span>invited</span>
          <span>·</span>
          <span style={{ fontWeight: 500 }}>{counts["Not Invited"]}</span>
          <span>not invited</span>
        </div>

      </div>
    </div>
  );
}

// ─── Content (page router) ────────────────────────────────────────────────────
function Content({ page, view, onNavigate, toolsVisible }: { page: NavId; view: ViewTab; onNavigate: (page: NavId) => void; toolsVisible: ToolsVisible }) {
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
      {page === 1 && (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <DashboardContent view={view} onNavigate={onNavigate} toolsVisible={toolsVisible} />
        </div>
      )}
      {page === 2 && <RosterPage />}
      {page !== 1 && page !== 2 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#ccc", fontSize: 12 }}>Content — coming soon</span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeNav,    setActiveNav]    = useState<NavId>(1);
  const [dashView,     setDashView]     = useState<ViewTab>("This Month");
  const [toolsVisible, setToolsVisible] = useState<ToolsVisible>(initToolsVisible);
  const pageConfigs = makePageConfigs(dashView, setDashView, toolsVisible, setToolsVisible);

  return (
    <div className={inter.variable} style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", fontFamily: "var(--font-inter)", userSelect: "none", WebkitUserSelect: "none" }}>
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar page={activeNav} configs={pageConfigs} />
        <Content page={activeNav} view={dashView} onNavigate={setActiveNav} toolsVisible={toolsVisible} />
      </div>
    </div>
  );
}
