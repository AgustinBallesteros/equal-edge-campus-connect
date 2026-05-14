import { Inter } from "next/font/google";
import { useState, type ReactElement } from "react";
import { ALUMNI, WEEKLY_ENGAGEMENT, CALENDAR_EVENTS } from "../data/mock";

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

// ─── Dashboard — view tab ─────────────────────────────────────────────────────
const VIEW_TABS = ["This Week", "This Month", "This Semester"] as const;
type ViewTab = typeof VIEW_TABS[number];

function DashboardActions() {
  const [view, setView] = useState<ViewTab>("This Month");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
      <div style={{
        display: "flex", alignItems: "center",
        background: "#F8F8FA", borderRadius: 8, padding: 3, border: BORDER,
      }}>
        {VIEW_TABS.map((tab) => {
          const active = view === tab;
          return (
            <button key={tab} onClick={() => setView(tab)} style={{
              height: 28, paddingInline: 12, borderRadius: 6, border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "#121216" : "#8E8E97",
              fontSize: 13, fontWeight: active ? 500 : 400,
              fontFamily: "var(--font-inter)", cursor: "pointer",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
            }}>
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page configs ─────────────────────────────────────────────────────────────
type PageConfig = { title: string; description: string; actions: ReactElement | null };

const PAGE_CONFIGS: Record<NavId, PageConfig> = {
  1: { title: "Dashboard",      description: "Good morning, Dr. Okafor  ·  Spring 2026",                  actions: <DashboardActions /> },
  2: { title: "Student Roster", description: "Manage student access and invitation status",                 actions: <><BtnMain label="Add Student" /><BtnSecondary label="Import CSV" /></> },
  3: { title: "Learn Library",  description: "Browse and assign lessons to students",                       actions: null },
  4: { title: "Script Library", description: "Manage communication templates available to students",        actions: <BtnMain label="New Script" /> },
  5: { title: "Activities",     description: "Assign follow-up tasks and track student completion",         actions: <BtnMain label="New Activity" /> },
  6: { title: "Messages",       description: "",                                                            actions: <BtnMain label="New Message" /> },
  7: { title: "Events",         description: "Shared with all students in the app",                        actions: <BtnMain label="New Event" /> },
  8: { title: "Resources",      description: "Links, documents, and videos available to all students",     actions: <BtnMain label="Add Resource" /> },
  9: { title: "Settings",       description: "",                                                            actions: null },
};

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
function TopBar({ page }: { page: NavId }) {
  const cfg = PAGE_CONFIGS[page];
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

function StudentLeaderboard() {
  const [tab, setTab] = useState<LeaderTab>("All");

  const rows = tab === "All"
    ? activated
    : tab === "Needs Attention"
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
                <button key={t} onClick={() => setTab(t)} style={{
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
        <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 52px 80px 56px", gap: 8, padding: "0 8px 8px", borderBottom: BORDER }}>
          {["#", "Student", "Score", "Trend", "Streak"].map((h, i) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 500, color: "#8E8E97", textAlign: i >= 2 ? "center" : "left" }}>{h}</span>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {rows.map((a, i) => {
          const rank = activated.indexOf(a) + 1;
          const trendUp = a.trend > 0, trendDown = a.trend < 0;
          const trendColor = trendUp ? "#10B981" : trendDown ? "#EF4444" : "#8E8E97";
          const trendArrow = trendUp ? "↑" : trendDown ? "↓" : "→";
          return (
            <div key={a.id} style={{
              display: "grid", gridTemplateColumns: "28px 1fr 52px 80px 56px",
              gap: 8, padding: "8px 16px",
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
            </div>
          );
        })}
        {rows.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: "#ccc" }}>No students match this filter.</div>
        )}
      </div>
    </Card>
  );
}

// ── Engagement graph ──────────────────────────────────────────────────────────
function EngagementGraph() {
  const W = 400, H = 90;
  const data = WEEKLY_ENGAGEMENT;
  const scores = data.map(d => d.score);
  const min = Math.min(...scores), max = Math.max(...scores);
  const pad = { t: 8, b: 8, l: 4, r: 4 };
  const xStep = (W - pad.l - pad.r) / (data.length - 1);
  const yRange = H - pad.t - pad.b;
  const pts = data.map((d, i) => ({
    x: pad.l + i * xStep,
    y: pad.t + yRange * (1 - (d.score - min) / (max - min)),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`;

  return (
    <Card>
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, border: BORDER, borderRadius: 8, padding: "5px 10px", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#121216", fontFamily: "var(--font-inter)" }}>
          Student Engagement
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4l4 4 4-4"/></svg>
        </button>
      </div>
      <div style={{ paddingInline: 8, paddingBottom: 10 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
          <defs>
            <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3E4FD3" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#3E4FD3" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={area} fill="url(#engGrad)"/>
          <path d={line} fill="none" stroke="#3E4FD3" strokeWidth="1.5"/>
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
// May 2026: starts on Friday (col 5, 0-indexed S=0), 31 days
// May 2026: year=2026, month=4
const CAL_TODAY = 14, CAL_FIRST_DOW = 5;
const CAL_DAYS_IN_MONTH = 31;
const CAL_DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildCalendarGrid() {
  const cells: (number | null)[] = Array(CAL_FIRST_DOW).fill(null);
  for (let d = 1; d <= CAL_DAYS_IN_MONTH; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const calCells = buildCalendarGrid();

// days that have events
const eventDays = new Set(CALENDAR_EVENTS.map(e => parseInt(e.date.split("-")[2])));

function MyEvents() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const visibleEvents = selectedDay !== null
    ? CALENDAR_EVENTS.filter(e => parseInt(e.date.split("-")[2]) === selectedDay)
    : CALENDAR_EVENTS;

  const panelLabel = selectedDay !== null ? `May ${selectedDay}` : "This month";

  return (
    <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px 12px" }}>
        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#121216" }}>My Events</p>
        <div style={{ display: "flex", gap: 16 }}>

          {/* Mini calendar */}
          <div style={{ flexShrink: 0, width: 196 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#121216" }}>May 2026</span>
              <button style={{ width: 22, height: 22, border: BORDER, borderRadius: 5, background: "#fff", cursor: "pointer", fontSize: 12, color: "#8E8E97", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-inter)" }}>›</button>
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
                const isToday   = day === CAL_TODAY;
                const isSelected = day !== null && day === selectedDay;
                const hasEvent  = day !== null && eventDays.has(day);
                return (
                  <div
                    key={i}
                    onClick={() => day && setSelectedDay(isSelected ? null : day)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 26 }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: isToday || isSelected ? "#3E4FD3" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: day ? "pointer" : "default",
                    }}>
                      <span style={{ fontSize: 11, color: isToday || isSelected ? "#fff" : day ? "#121216" : "transparent", fontWeight: isToday || isSelected ? 600 : 400 }}>
                        {day ?? ""}
                      </span>
                    </div>
                    {hasEvent && !(isToday || isSelected) && (
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3E4FD3", marginTop: 1 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event list */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "#121216" }}>{panelLabel}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleEvents.length === 0 && (
                <p style={{ margin: 0, fontSize: 12, color: "#8E8E97" }}>No events this day.</p>
              )}
              {visibleEvents.map(evt => {
                const day = parseInt(evt.date.split("-")[2]);
                return (
                  <div key={evt.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EDEEFD", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#3E4FD3", lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>May</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#3E4FD3", lineHeight: 1.1 }}>{day}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#121216", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{evt.title}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#8E8E97" }}>{evt.timeLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
}

// ── Dashboard root ────────────────────────────────────────────────────────────
function DashboardContent() {
  return (
    <div>
      <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#121216" }}>Your students</p>
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        {/* Left — leaderboard */}
        <div style={{ flex: "0 0 45%", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <StudentLeaderboard />
        </div>
        {/* Right — stacked cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <EngagementGraph />
          <MyAssignedActivities />
          <MyIntake />
          <MyEvents />
        </div>
      </div>
    </div>
  );
}

// ─── Content (page router) ────────────────────────────────────────────────────
function Content({ page }: { page: NavId }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#fff", padding: 24 }}>
      {page === 1 && <DashboardContent />}
      {page !== 1 && (
        <span style={{ color: "#ccc", fontSize: 12 }}>Content — coming soon</span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeNav, setActiveNav] = useState<NavId>(1);

  return (
    <div className={inter.variable} style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", fontFamily: "var(--font-inter)", userSelect: "none", WebkitUserSelect: "none" }}>
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar page={activeNav} />
        <Content page={activeNav} />
      </div>
    </div>
  );
}
