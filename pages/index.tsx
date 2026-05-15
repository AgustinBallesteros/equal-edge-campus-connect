import { Inter } from "next/font/google";
import { useState, useEffect, useCallback, useRef, type ReactElement } from "react";
import { ALUMNI, STAFF, CALENDAR_EVENTS, MOCK_TODAY, ENGAGEMENT_DATA, COMPLETION_DATA, PROGRAM_HEALTH_DELTA, MOCK_LESSONS_COMPLETED, MOCK_ACTIVITIES_OVERDUE, MOCK_ACTIVITIES_RESOLVED_WEEK, SCRIPT_VIEWS, SCRIPTS, MOCK_LESSON_BEST, MOCK_LESSON_WORST, MOCK_MESSAGES_SENT, MOCK_MESSAGES_RECEIVED, MESSAGE_THREADS, MOCK_COMPLETED_ACTIVITIES, MOCK_CSV_ROWS, MOCK_CSV_ROW_STATUS, MOCK_CSV_STATS, LESSONS, CATEGORY_COLOR, type GraphViewKey, type Alumni, type CsvRowStatus, type LessonCategory } from "../data/mock";

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
function BtnMain({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      height: 36, paddingInline: 14, borderRadius: 8, border: "none",
      background: "#3E4FD3", color: "#fff",
      fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)",
      cursor: "pointer", whiteSpace: "nowrap",
    }}>
      {label}
    </button>
  );
}

function BtnSecondary({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
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
type PageConfig = { title: string; description: React.ReactNode; actions: React.ReactNode };

// ─── Add Student Modal ────────────────────────────────────────────────────────
function AddStudentModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(show);
  const [vis,     setVis]     = useState(show);
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");

  useEffect(() => {
    if (show) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVis(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVis(false);
      const t = setTimeout(() => {
        setMounted(false);
        setFirstName(""); setLastName(""); setEmail("");
      }, 220);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 40, paddingInline: 12, boxSizing: "border-box",
    borderRadius: 8, border: "1.5px solid #E8E8EC",
    fontSize: 14, color: "#121216", fontFamily: "var(--font-inter)",
    outline: "none", background: "#fff",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: vis ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 220ms ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 12, width: 480,
          boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
          opacity: vis ? 1 : 0,
          transform: vis ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
          transition: "opacity 220ms ease, transform 220ms ease",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#121216", marginBottom: 6 }}>Add Student</div>
          <div style={{ fontSize: 13, color: "#8E8E97", lineHeight: 1.55 }}>
            The student will appear on the roster. You can send an invitation separately.
          </div>
        </div>

        <div style={{ height: 1, background: "#E8E8EC" }} />

        {/* Fields */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {([
            { label: "First Name",    value: firstName, set: setFirstName, placeholder: "e.g. Jordan"                   },
            { label: "Last Name",     value: lastName,  set: setLastName,  placeholder: "e.g. Martinez"                 },
            { label: "Email Address", value: email,     set: setEmail,     placeholder: "e.g. j.martinez@university.edu" },
          ] as { label: string; value: string; set: (v: string) => void; placeholder: string }[]).map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#121216", marginBottom: 6 }}>
                {label}
              </label>
              <input
                type="text" value={value} placeholder={placeholder}
                onChange={e => set(e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#E8E8EC" }} />

        {/* Footer */}
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{
            height: 36, paddingInline: 16, borderRadius: 8, border: BORDER,
            background: "#fff", color: "#121216",
            fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button style={{
            height: 36, paddingInline: 16, borderRadius: 8, border: "none",
            background: "#3E4FD3", color: "#fff",
            fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
          }}>
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Remove Student Modal ─────────────────────────────────────────────────────
function RemoveStudentModal({ studentName, isBulk, show, onClose }: { studentName: string; isBulk?: boolean; show: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(show);
  const [vis,     setVis]     = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVis(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVis(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: vis ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 220ms ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 12, width: 440,
          boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
          opacity: vis ? 1 : 0,
          transform: vis ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
          transition: "opacity 220ms ease, transform 220ms ease",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#121216", marginBottom: 6 }}>
            {isBulk ? "Remove Students" : "Remove Student"}
          </div>
          <div style={{ fontSize: 13, color: "#8E8E97", lineHeight: 1.55 }}>
            This will permanently remove{" "}
            <span style={{ color: "#121216", fontWeight: 500 }}>{studentName}</span>
            {" "}from the roster. This cannot be undone.
          </div>
        </div>

        <div style={{ height: 1, background: "#E8E8EC" }} />

        {/* Footer */}
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{
            height: 36, paddingInline: 16, borderRadius: 8, border: BORDER,
            background: "#fff", color: "#121216",
            fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button style={{
            height: 36, paddingInline: 16, borderRadius: 8, border: "none",
            background: "#C72727", color: "#fff",
            fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
          }}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function makePageConfigs(
  view: ViewTab,
  setView: (v: ViewTab) => void,
  toolsVisible: ToolsVisible,
  setToolsVisible: (tv: ToolsVisible) => void,
  onAddStudent: () => void,
  onImportCSV:  () => void,
  activeLessonId: number | null,
  onLessonBack:   () => void,
  onAssignLesson: () => void,
): Record<NavId, PageConfig> {
  const activeLesson = activeLessonId ? LESSONS.find(l => l.id === activeLessonId) ?? null : null;
  return {
    1: { title: "Dashboard",      description: "Good morning, Dr. Okafor  ·  Spring 2026",              actions: <DashboardActions view={view} onViewChange={setView} toolsVisible={toolsVisible} setToolsVisible={setToolsVisible} /> },
    2: { title: "Student Roster", description: "Manage student access and invitation status",             actions: <><BtnMain label="Add Student" onClick={onAddStudent} /><BtnSecondary label="Import CSV" onClick={onImportCSV} /></> },
    3: activeLesson
      ? {
          title: activeLesson.title,
          description: (
            <button onClick={onLessonBack} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: "#3E4FD3", fontWeight: 400, fontFamily: "var(--font-inter)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, lineHeight: 1 }}>
              ← Lesson Library
            </button>
          ),
          actions: <BtnMain label="Assign Lesson" onClick={onAssignLesson} />,
        }
      : { title: "Learn Library",  description: "Browse and assign lessons to students", actions: null },
    4: { title: "Script Library", description: "Manage communication templates available to students",    actions: <BtnMain label="New Script" /> },
    5: { title: "Activities",     description: "Assign follow-up tasks and track student completion",     actions: <BtnMain label="New Activity" /> },
    6: { title: "Messages",       description: "",                                                        actions: <BtnMain label="+ New Message" /> },
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
function NavItem({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: 10, borderRadius: 8, cursor: "pointer",
      background: active ? NAV_ACTIVE_BG : "transparent",
      color: active ? NAV_ACTIVE_COLOR : NAV_REST_COLOR,
      transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
    }}>
      {icons[label]}
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, lineHeight: 1, flex: 1 }}>{label}</span>
      {badge != null && badge > 0 && (
        <div style={{
          minWidth: 18, height: 18, borderRadius: 9, paddingInline: 5,
          background: active ? "#fff" : "#22A062",
          color:      active ? "#3E4FD3" : "#fff",
          fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {badge}
        </div>
      )}
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
          {NAV_ITEMS.map(({ id, label }) => {
            const totalUnread = MESSAGE_THREADS.reduce((s, t) => s + t.unreadCount, 0);
            return (
              <NavItem key={id} label={label} active={active === id} onClick={() => onSelect(id)}
                badge={label === "Messages" ? totalUnread : undefined} />
            );
          })}
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
  const [tab,        setTab]        = useState<LeaderTab>("All"); // button highlight
  const [rowTab,     setRowTab]     = useState<LeaderTab>("All"); // actual data
  const [rowsVis,    setRowsVis]    = useState(true);
  const [scheduled,  setScheduled]  = useState<Set<number>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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
            <div key={a.id}
              onMouseEnter={() => setHoveredRow(a.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid", gridTemplateColumns: "24px 1fr 48px 72px 52px 52px 72px 80px 104px",
                gap: 6, padding: "8px 16px",
                borderBottom: i < rows.length - 1 ? BORDER : "none",
                alignItems: "center",
                background: hoveredRow === a.id ? "#EDEEFD" : "#fff",
                transition: `background ${MS.dFast} ${MS.eOut}`,
                cursor: "default",
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
  const d = new Date(iso + "T00:00");
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  return `${m} ${d.getDate()}, ${d.getFullYear()}`;
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

// ─── Import step 1 — Upload File ─────────────────────────────────────────────
function ImportStep1Upload({ uploaded, onUpload, onRemove }: {
  uploaded: boolean;
  onUpload: () => void;
  onRemove: () => void;
}) {
  const MOCK_FILENAME = "students_spring2026.csv";
  const MOCK_FILESIZE = "1.4 KB";
  const MOCK_ROWS     = MOCK_CSV_ROWS.length; // 16

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Drop zone ── */}
      {!uploaded ? (
        <div style={{
          borderRadius: 12, border: "2px dashed #3E4FD3",
          background: "#F0F1FD", padding: "40px 24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          {/* Upload icon */}
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1.5px solid #3E4FD3",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="#3E4FD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12V4M4 7l4-4 4 4"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#121216" }}>
              Drag and drop your CSV file here
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#8E8E97" }}>or</p>
          </div>
          <button
            onClick={onUpload}
            style={{
              height: 36, paddingInline: 20, borderRadius: 8, border: "none",
              background: "#3E4FD3", color: "#fff",
              fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
            }}>
            Browse Files
          </button>
          <p style={{ margin: 0, fontSize: 12, color: "#8E8E97" }}>
            Supports .csv files only · Max 10MB
          </p>
        </div>
      ) : (
        /* ── Uploaded file card ── */
        <div style={{
          borderRadius: 12, border: "1.5px solid #3E4FD3",
          background: "#F0F1FD", padding: "16px 20px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          {/* File icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 8, background: "#fff",
            border: BORDER, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              stroke="#3E4FD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2H5a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V7M10 2l4 4M10 2v4h4"/>
              <path d="M6 10h6M6 13h4"/>
            </svg>
          </div>
          {/* File info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#121216" }}>
              {MOCK_FILENAME}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8E8E97" }}>
              {MOCK_FILESIZE} · {MOCK_ROWS} rows detected
            </p>
          </div>
          {/* Remove */}
          <button
            onClick={onRemove}
            style={{
              width: 28, height: 28, borderRadius: 6, border: BORDER,
              background: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l8 8M9 1L1 9"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── CSV Template banner ── */}
      <div style={{
        borderRadius: 10, border: BORDER, background: "#FAFAFA",
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        {/* Document icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 7, background: "#E8E8EC", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            stroke="#8E8E97" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6M9 2l4 4M9 2v4h4"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#121216" }}>Download CSV Template</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8E8E97" }}>
            Use our template to ensure your CSV is formatted correctly
          </p>
        </div>
        <button style={{
          height: 32, paddingInline: 14, borderRadius: 7, border: BORDER,
          background: "#fff", color: "#121216",
          fontSize: 13, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer", flexShrink: 0,
        }}>
          Download
        </button>
      </div>

      {/* ── Required columns info ── */}
      <div style={{
        borderRadius: 10, border: BORDER, background: "#FAFAFA", padding: "14px 16px",
      }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#121216" }}>Required CSV columns</p>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8E8E97" }}>
          {["first_name", "last_name", "email"].map((col, i, arr) => (
            <span key={col}>
              <code style={{ fontFamily: "monospace", color: "#3E4FD3" }}>{col}</code>
              {i < arr.length - 1 && <span style={{ margin: "0 6px", color: "#C5C5CC" }}>·</span>}
            </span>
          ))}
        </p>
        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#121216" }}>Optional columns</p>
        <p style={{ margin: 0, fontSize: 12, color: "#8E8E97" }}>
          Any additional columns will be ignored during import
        </p>
      </div>

    </div>
  );
}

// ─── Import step 2 — Map Columns ─────────────────────────────────────────────
const SYSTEM_FIELDS = ["first_name", "last_name", "email"] as const;

function ImportStep2MapColumns({ mapping, onChange }: {
  mapping: Record<string, string>;
  onChange: (header: string, value: string) => void;
}) {
  const headers = MOCK_CSV_ROWS[0];
  const usedRequired = Object.values(mapping).filter(v => v !== "" && v !== "skip");

  function isDuplicate(value: string) {
    return value !== "" && value !== "skip" && usedRequired.filter(v => v === value).length > 1;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Heading */}
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#121216" }}>Map Columns</p>
        <p style={{ margin: 0, fontSize: 13, color: "#8E8E97" }}>
          Match each column from your CSV to the correct system field.
        </p>
      </div>

      {/* Column rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Header labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 8, paddingInline: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#8E8E97", textTransform: "uppercase", letterSpacing: "0.05em" }}>CSV Column</span>
          <span />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#8E8E97", textTransform: "uppercase", letterSpacing: "0.05em" }}>System Field</span>
        </div>

        {headers.map(header => {
          const value    = mapping[header];
          const dup      = isDuplicate(value);
          const isMapped = value !== "" && value !== "skip";

          return (
            <div key={header} style={{
              display: "grid", gridTemplateColumns: "1fr 32px 1fr",
              gap: 8, alignItems: "center",
              padding: "10px 12px", borderRadius: 8, border: BORDER, background: "#fff",
            }}>
              {/* CSV column name */}
              <code style={{ fontSize: 13, color: "#3E4FD3", fontFamily: "monospace" }}>{header}</code>

              {/* Arrow */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  stroke={isMapped ? "#3E4FD3" : "#C5C5CC"}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7h10M8 3l4 4-4 4"/>
                </svg>
              </div>

              {/* Dropdown */}
              <select
                value={value}
                onChange={e => onChange(header, e.target.value)}
                style={{
                  height: 32, padding: "0 8px", borderRadius: 7, width: "100%",
                  border: dup ? "1.5px solid #C72727" : isMapped ? "1.5px solid #3E4FD3" : BORDER,
                  fontSize: 13, color: value === "" ? "#8E8E97" : "#121216",
                  fontFamily: "var(--font-inter)", background: "#fff",
                  outline: "none", cursor: "pointer",
                }}
              >
                <option value="" disabled>Select field…</option>
                {SYSTEM_FIELDS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
                <option value="skip">— Skip column —</option>
              </select>
            </div>
          );
        })}
      </div>

      {/* Required-field coverage pills */}
      <div style={{ display: "flex", gap: 6 }}>
        {SYSTEM_FIELDS.map(f => {
          const mapped = usedRequired.includes(f) && !isDuplicate(f);
          return (
            <span key={f} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              height: 26, paddingInline: 10, borderRadius: 20,
              fontSize: 12, fontWeight: 500,
              background: mapped ? "#ECFDF5" : "#F8F8FA",
              color: mapped ? "#22A062" : "#8E8E97",
              border: `1px solid ${mapped ? "#A7F3D0" : "#E8E8EC"}`,
              transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}, border-color ${MS.dFast} ${MS.eOut}`,
            }}>
              {mapped && (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2L7.5 2" stroke="#22A062" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {f}
            </span>
          );
        })}
      </div>

    </div>
  );
}

// ─── Import step 3 — Review ──────────────────────────────────────────────────

type ReviewRow = {
  csvIdx:  number;
  cells:   Record<string, string>;
  status:  CsvRowStatus;
};

const COL_LABELS: Record<string, string> = {
  first_name: "First Name",
  last_name:  "Last Name",
  email:      "Email",
};

function recomputeReviewStatuses(list: ReviewRow[]): ReviewRow[] {
  const emailCount: Record<string, number> = {};
  list.forEach(r => {
    const e = r.cells["email"]?.trim().toLowerCase();
    if (e) emailCount[e] = (emailCount[e] ?? 0) + 1;
  });
  return list.map(r => {
    if (SYSTEM_FIELDS.some(f => !r.cells[f]?.trim())) return { ...r, status: "skipped" as CsvRowStatus };
    const e = r.cells["email"]?.trim().toLowerCase();
    if (e && emailCount[e] > 1) return { ...r, status: "duplicate" as CsvRowStatus };
    return { ...r, status: "ok" as CsvRowStatus };
  });
}

function ImportStep3Review({
  mapping,
  onCountsChange,
}: {
  mapping: Record<string, string>;
  onCountsChange: (c: { toImport: number; skipped: number; duplicates: number }) => void;
}) {
  const [rows, setRows] = useState<ReviewRow[]>(() => {
    const initial = MOCK_CSV_ROWS.slice(1).map((row, i) => {
      const cells: Record<string, string> = {};
      MOCK_CSV_ROWS[0].forEach((header, colIdx) => {
        const field = mapping[header];
        if (field && field !== "skip") cells[field] = row[colIdx];
      });
      return { csvIdx: i, cells, status: "ok" as CsvRowStatus };
    });
    return recomputeReviewStatuses(initial);
  });

  const [editCell,   setEditCell]   = useState<{ idx: number; field: string } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Keep shell footer counts in sync
  useEffect(() => {
    onCountsChange({
      toImport:   rows.filter(r => r.status === "ok").length,
      duplicates: rows.filter(r => r.status === "duplicate").length,
      skipped:    rows.filter(r => r.status === "skipped").length,
    });
  }, [rows, onCountsChange]);

  // Columns to show — SYSTEM_FIELDS order, only those present in mapping
  const columns = SYSTEM_FIELDS.filter(f => Object.values(mapping).includes(f));

  function updateCell(csvIdx: number, field: string, value: string) {
    setRows(prev => recomputeReviewStatuses(
      prev.map(r => r.csvIdx === csvIdx ? { ...r, cells: { ...r.cells, [field]: value } } : r)
    ));
  }

  function removeRow(csvIdx: number) {
    setRows(prev => recomputeReviewStatuses(prev.filter(r => r.csvIdx !== csvIdx)));
  }

  const colTemplate = `${columns.map(() => "1fr").join(" ")} 108px 36px`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "24px 0" }}>

      {/* Heading */}
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#121216" }}>Review Import</p>
        <p style={{ margin: 0, fontSize: 13, color: "#8E8E97" }}>
          Click any cell to edit inline. Remove duplicates or fix errors before continuing.
        </p>
      </div>

      {/* Table */}
      <div style={{ border: BORDER, borderRadius: 10, overflow: "hidden" }}>

        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: colTemplate,
          background: "#F8F8FA", borderBottom: BORDER,
        }}>
          {columns.map(col => (
            <div key={col} style={{ padding: "9px 12px", fontSize: 11, fontWeight: 600, color: "#8E8E97", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {COL_LABELS[col] ?? col}
            </div>
          ))}
          <div style={{ padding: "9px 12px", fontSize: 11, fontWeight: 600, color: "#8E8E97", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
          <div />
        </div>

        {/* Data rows */}
        {rows.map((row, rowI) => {
          const isHovered = hoveredRow === row.csvIdx;
          const baseBg    = row.status === "duplicate" ? "#FFFBEB"
                          : row.status === "skipped"   ? "#FEF2F2"
                          : "#fff";
          const hoverBg   = row.status === "duplicate" ? "#FFF8E1"
                          : row.status === "skipped"   ? "#FDEAEA"
                          : "#F8F8FA";
          return (
            <div
              key={row.csvIdx}
              onMouseEnter={() => setHoveredRow(row.csvIdx)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid", gridTemplateColumns: colTemplate,
                alignItems: "center",
                background: isHovered ? hoverBg : baseBg,
                borderBottom: rowI < rows.length - 1 ? BORDER : undefined,
                transition: "background 120ms ease",
              }}
            >
              {/* Editable cells */}
              {columns.map(field => {
                const isEditing = editCell?.idx === row.csvIdx && editCell?.field === field;
                const val = row.cells[field] ?? "";
                return (
                  <div
                    key={field}
                    onClick={() => !isEditing && setEditCell({ idx: row.csvIdx, field })}
                    style={{ padding: "7px 12px", cursor: "text", minWidth: 0 }}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        value={val}
                        onChange={e => updateCell(row.csvIdx, field, e.target.value)}
                        onBlur={() => setEditCell(null)}
                        onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditCell(null); }}
                        style={{
                          width: "100%", padding: "2px 6px",
                          border: "1.5px solid #3E4FD3", borderRadius: 5,
                          fontSize: 13, fontFamily: "var(--font-inter)",
                          outline: "none", background: "#fff", color: "#121216",
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: 13,
                        color: val ? "#121216" : "#C5C5CC",
                        display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {val || "—"}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Status badge */}
              <div style={{ padding: "7px 12px" }}>
                {row.status !== "ok" && (
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    height: 22, paddingInline: 8, borderRadius: 20,
                    fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
                    ...(row.status === "duplicate"
                      ? { background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }
                      : { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }),
                  }}>
                    {row.status === "duplicate" ? "Duplicate" : "Missing email"}
                  </span>
                )}
              </div>

              {/* Remove button */}
              <div style={{ padding: "7px 8px", display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => removeRow(row.csvIdx)}
                  title="Remove row"
                  style={{
                    width: 22, height: 22, borderRadius: 5,
                    border: "none", background: isHovered ? "#EDEDF2" : "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#8E8E97", transition: "background 120ms ease, color 120ms ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E0E0EA"; (e.currentTarget as HTMLButtonElement).style.color = "#C72727"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isHovered ? "#EDEDF2" : "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#8E8E97"; }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M1.5 1.5l7 7M8.5 1.5l-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Import step 4 — Confirm ─────────────────────────────────────────────────

function ImportStep4Confirm({ counts }: {
  counts: { toImport: number; skipped: number; duplicates: number };
}) {
  const { toImport, skipped, duplicates } = counts;

  const rows: { icon: ReactElement; label: string; value: string; color: string; bg: string; border: string }[] = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3 3L11.5 4" stroke="#22A062" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "students will be added to the roster",
      value: String(toImport),
      color: "#22A062", bg: "#ECFDF5", border: "#A7F3D0",
    },
    ...(skipped > 0 ? [{
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 4.5v3M7 9.5v.5" stroke="#C28F11" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="7" cy="7" r="5.5" stroke="#C28F11" strokeWidth="1.4"/>
        </svg>
      ),
      label: `row${skipped !== 1 ? "s" : ""} skipped — missing required fields`,
      value: String(skipped),
      color: "#92400E", bg: "#FFFBEB", border: "#FDE68A",
    }] : []),
    ...(duplicates > 0 ? [{
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2.5" y="4.5" width="7" height="7" rx="1.5" stroke="#6366F1" strokeWidth="1.4"/>
          <path d="M5 4V3.5A1.5 1.5 0 016.5 2h4A1.5 1.5 0 0112 3.5v4A1.5 1.5 0 0110.5 9H10" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      label: `duplicate${duplicates !== 1 ? "s" : ""} will be ignored`,
      value: String(duplicates),
      color: "#4338CA", bg: "#EEF2FF", border: "#C7D2FE",
    }] : []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "40px 0" }}>

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "#ECFDF5", border: "2px solid #A7F3D0",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 12l5 5L20 7" stroke="#22A062" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Heading */}
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#121216" }}>
          Ready to import
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#8E8E97", maxWidth: 340 }}>
          Review the summary below and click <strong style={{ color: "#121216" }}>Import</strong> to add students to the roster.
        </p>
      </div>

      {/* Summary rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 400 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 10,
            background: r.bg, border: `1px solid ${r.border}`,
          }}>
            <div style={{ flexShrink: 0 }}>{r.icon}</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.value}</span>
            <span style={{ fontSize: 13, color: r.color }}>{r.label}</span>
          </div>
        ))}
      </div>

      {/* Fine print */}
      <p style={{ margin: 0, fontSize: 12, color: "#B0B0BA", textAlign: "center", maxWidth: 360 }}>
        This action cannot be undone. Skipped and duplicate rows will not be imported.
      </p>

    </div>
  );
}

// ─── CSV Import shell ─────────────────────────────────────────────────────────
const IMPORT_STEPS = ["Upload File", "Map Columns", "Review", "Import"] as const;
type ImportStep = 0 | 1 | 2 | 3;

// Preview stats derived from mock CSV data
const IMPORT_PREVIEW = MOCK_CSV_STATS;

function RosterImportShell({ onClose }: { onClose: () => void }) {
  const [step,          setStep]          = useState<ImportStep>(0); // nav logic
  const [barStep,       setBarStep]       = useState<ImportStep>(0); // circle / label colours
  const [connFill,      setConnFill]      = useState<[number,number,number]>([0, 0, 0]); // 0–1 per connector
  const [contentStep,   setContentStep]   = useState<ImportStep>(0); // content area (lags)
  const [vis,           setVis]           = useState(true);
  const [slideFrom,     setSlideFrom]     = useState<"left" | "right">("right");
  const [fileUploaded,  setFileUploaded]  = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>(
    () => Object.fromEntries(MOCK_CSV_ROWS[0].map(h => [h, ""]))
  );
  const mappedRequired = Object.values(mapping).filter(v => v !== "" && v !== "skip");
  const step2Ready = SYSTEM_FIELDS.every(f => mappedRequired.includes(f)) &&
    new Set(mappedRequired).size === mappedRequired.length;
  const [liveCounts, setLiveCounts] = useState({
    toImport:   IMPORT_PREVIEW.toImport,
    skipped:    IMPORT_PREVIEW.skipped,
    duplicates: IMPORT_PREVIEW.duplicates,
  });
  const handleCountsChange = useCallback(
    (c: { toImport: number; skipped: number; duplicates: number }) => setLiveCounts(c),
    []
  );

  function navigate(next: ImportStep) {
    if (next === step) return;
    const fwd = next > step;
    const connIdx = fwd ? step : next; // connector between the two steps

    setStep(next); // nav buttons / logic update immediately

    if (fwd) {
      // Fill connector first (240ms CSS transition), then light up next circle
      setConnFill(prev => prev.map((v, j) => j === connIdx ? 1 : v) as [number,number,number]);
      setTimeout(() => setBarStep(next), 250);
    } else {
      // Dim circle immediately, then retract connector
      setBarStep(next);
      setConnFill(prev => prev.map((v, j) => j === connIdx ? 0 : v) as [number,number,number]);
    }

    // Content slide transition (independent 160ms delay)
    setVis(false);
    setTimeout(() => {
      setSlideFrom(fwd ? "right" : "left");
      setContentStep(next);
      requestAnimationFrame(() => setVis(true));
    }, 160);
  }

  const showInfo = contentStep === 1 || contentStep === 2;

  const btnBase: React.CSSProperties = {
    height: 36, paddingInline: 16, borderRadius: 8, border: "none",
    fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

      {/* ── Step bar ── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center",
        padding: "0 24px", height: 52, borderBottom: BORDER,
      }}>
        {IMPORT_STEPS.map((label, i) => {
          const idx    = i as ImportStep;
          const done   = barStep > idx;   // uses barStep (delayed on forward)
          const active = barStep === idx;
          const last   = i === IMPORT_STEPS.length - 1;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Circle */}
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done || active ? "#3E4FD3" : "#E8E8EC",
                  transition: `background 180ms ${MS.eOut}`,
                }}>
                  {done
                    ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <span style={{ fontSize: 10, fontWeight: 700, color: active ? "#fff" : "#8E8E97", lineHeight: 1, transition: `color 180ms ${MS.eOut}` }}>{i + 1}</span>
                  }
                </div>
                {/* Label */}
                <span style={{
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? "#121216" : done ? "#3E4FD3" : "#8E8E97",
                  whiteSpace: "nowrap",
                  transition: `color 180ms ${MS.eOut}, font-weight 180ms ${MS.eOut}`,
                }}>
                  {label}
                </span>
              </div>
              {/* Connector — animated fill track */}
              {!last && (
                <div style={{
                  position: "relative", width: 36, height: 2,
                  marginInline: 10, flexShrink: 0,
                  background: "#E8E8EC", borderRadius: 1,
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, bottom: 0,
                    borderRadius: 1,
                    width: `${connFill[i] * 100}%`,
                    background: "#3E4FD3",
                    transition: "width 240ms ease",
                  }} />
                </div>
              )}
            </div>
          );
        })}

        <div style={{ flex: 1 }} />
        <button onClick={onClose} style={{
          height: 32, paddingInline: 14, borderRadius: 7, border: BORDER,
          background: "#fff", color: "#121216",
          fontSize: 13, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
        }}>
          Cancel import
        </button>
      </div>

      {/* ── Step content ── */}
      <div style={{
        flex: 1, overflowY: "auto",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateX(0)" : slideFrom === "right" ? "translateX(16px)" : "translateX(-16px)",
        transition: "opacity 160ms ease, transform 160ms ease",
      }}>
        {contentStep === 0 && (
          <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20%" }}>
            <div style={{ width: "100%" }}>
              <ImportStep1Upload
                uploaded={fileUploaded}
                onUpload={() => setFileUploaded(true)}
                onRemove={() => setFileUploaded(false)}
              />
            </div>
          </div>
        )}
        {contentStep === 1 && (
          <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20%" }}>
            <div style={{ width: "100%" }}>
              <ImportStep2MapColumns
                mapping={mapping}
                onChange={(h, v) => setMapping(prev => ({ ...prev, [h]: v }))}
              />
            </div>
          </div>
        )}
        {contentStep === 2 && (
          <div style={{ padding: "0 20%" }}>
            <ImportStep3Review mapping={mapping} onCountsChange={handleCountsChange} />
          </div>
        )}
        {contentStep === 3 && (
          <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20%" }}>
            <ImportStep4Confirm counts={liveCounts} />
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        flexShrink: 0, borderTop: BORDER,
        padding: "12px 24px", display: "flex", alignItems: "center",
      }}>
        {/* Left — Back */}
        <div style={{ flex: 1 }}>
          {step > 0 && (
            <button onClick={() => navigate((step - 1) as ImportStep)} style={{
              ...btnBase, border: BORDER, background: "#fff", color: "#121216",
            }}>
              Back
            </button>
          )}
        </div>

        {/* Centre — info text (steps 1 & 2 only) */}
        {showInfo && (
          <div style={{ fontSize: 13, color: "#8E8E97", textAlign: "center" }}>
            <span style={{ color: "#22A062", fontWeight: 500 }}>{liveCounts.toImport} student{liveCounts.toImport !== 1 ? "s" : ""}</span>
            {" "}will be added
            {liveCounts.skipped > 0 && (
              <> · <span style={{ color: "#C72727", fontWeight: 500 }}>{liveCounts.skipped} missing email</span></>
            )}
            {liveCounts.duplicates > 0 && (
              <> · <span style={{ color: "#C28F11", fontWeight: 500 }}>{liveCounts.duplicates} duplicate{liveCounts.duplicates !== 1 ? "s" : ""}</span></>
            )}
          </div>
        )}

        {/* Right — Continue / Import */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {step < 3
            ? <button
                onClick={() => navigate((step + 1) as ImportStep)}
                disabled={(step === 0 && !fileUploaded) || (step === 1 && !step2Ready)}
                style={{
                  ...btnBase,
                  background: (step === 0 && !fileUploaded) || (step === 1 && !step2Ready) ? "#C5C5CC" : "#3E4FD3",
                  color: "#fff",
                  cursor: (step === 0 && !fileUploaded) || (step === 1 && !step2Ready) ? "not-allowed" : "pointer",
                }}>
                Continue
              </button>
            : <button style={{ ...btnBase, background: "#3E4FD3", color: "#fff" }}>
                Import {liveCounts.toImport} Student{liveCounts.toImport !== 1 ? "s" : ""}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

function RosterPage() {
  const [filter,    setFilter]    = useState<RosterFilter>("All"); // tab highlight
  const [rowFilter, setRowFilter] = useState<RosterFilter>("All"); // actual data
  const [rowsVis,   setRowsVis]   = useState(true);
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openMenu,     setOpenMenu]     = useState<number | null>(null);
  const [sortKey,      setSortKey]      = useState<SortKey>("name");
  const [sortDir,      setSortDir]      = useState<SortDir>("asc");
  const [removeTarget, setRemoveTarget] = useState<Alumni | null>(null);
  const [hoveredRow,   setHoveredRow]   = useState<number | null>(null);

  function switchFilter(next: RosterFilter) {
    if (next === filter) return;
    setFilter(next);
    setRowsVis(false);
    setTimeout(() => {
      setRowFilter(next);
      requestAnimationFrame(() => setRowsVis(true));
    }, 160);
  }

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
      if (rowFilter !== "All" && a.status !== rowFilter) return false;
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

  const selectedAlumni = ALUMNI.filter(a => selected.has(a.id));
  const inviteCount    = selectedAlumni.filter(a => a.status === "Not Invited").length;
  const resendCount    = selectedAlumni.filter(a => a.status === "Invited").length;
  const hasSelection   = selected.size > 0;

  const cellTxt: React.CSSProperties = {
    paddingInline: 8, fontSize: 12, color: "#121216",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

      {/* ── Filter / Bulk action bar ── */}
      <div style={{
        flexShrink: 0, position: "relative",
        borderBottom: hasSelection ? "1px solid #3E4FD3" : BORDER,
        transition: `border-color ${MS.dFast} ${MS.eOut}`,
      }}>

        {/* Filter bar — sits in natural flow, gives the wrapper its height */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 20px",
          opacity: hasSelection ? 0 : 1,
          pointerEvents: hasSelection ? "none" : "auto",
          transition: `opacity ${MS.dFast} ${MS.eOut}`,
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", alignItems: "center", height: 32, background: "#F8F8FA", borderRadius: 8, padding: 2, border: BORDER }}>
            {ROSTER_FILTERS.map(f => {
              const active = filter === f;
              return (
                <button key={f} onClick={() => switchFilter(f)} style={{
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

        {/* Bulk action bar — overlays on selection */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 20px",
          background: "#F0F1FD",
          opacity: hasSelection ? 1 : 0,
          pointerEvents: hasSelection ? "auto" : "none",
          transition: `opacity ${MS.dFast} ${MS.eOut}`,
        }}>
          {/* Count */}
          <span style={{ fontSize: 13, fontWeight: 600, color: "#3E4FD3", whiteSpace: "nowrap", marginRight: 2 }}>
            {selected.size} student{selected.size !== 1 ? "s" : ""} selected
          </span>

          {/* Invite */}
          {inviteCount > 0 && (
            <button style={{
              height: 32, paddingInline: 12, borderRadius: 7, border: "none",
              background: "#3E4FD3", color: "#fff",
              fontSize: 13, fontWeight: 500, fontFamily: "var(--font-inter)",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
              Invite {inviteCount} Selected
            </button>
          )}

          {/* Resend */}
          {resendCount > 0 && (
            <button style={{
              height: 32, paddingInline: 12, borderRadius: 7, border: "none",
              background: "#3E4FD3", color: "#fff",
              fontSize: 13, fontWeight: 500, fontFamily: "var(--font-inter)",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
              Resend Invitation to {resendCount} Selected
            </button>
          )}

          {/* Remove */}
          <button
            onClick={() => setRemoveTarget({ id: -1, name: `${selected.size} student${selected.size !== 1 ? "s" : ""}` } as Alumni)}
            style={{
              height: 32, paddingInline: 12, borderRadius: 7, border: "none",
              background: "#C72727", color: "#fff",
              fontSize: 13, fontWeight: 500, fontFamily: "var(--font-inter)",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
            Remove {selected.size} Selected
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Clear selection */}
          <button
            onClick={() => setSelected(new Set())}
            style={{
              height: 32, paddingInline: 10, borderRadius: 7,
              border: "none", background: "transparent",
              color: "#3E4FD3", fontSize: 13, fontWeight: 500,
              fontFamily: "var(--font-inter)", cursor: "pointer", whiteSpace: "nowrap",
            }}>
            Clear selection
          </button>
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
        <div style={{
          flex: 1, overflowY: "auto",
          opacity: rowsVis ? 1 : 0,
          transform: rowsVis ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 160ms ease, transform 160ms ease",
        }}>
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
              <div key={a.id}
                onMouseEnter={() => setHoveredRow(a.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid", gridTemplateColumns: ROSTER_COL,
                  padding: "0 20px", alignItems: "center",
                  borderBottom: i < rows.length - 1 ? BORDER : "none",
                  background: isSelected ? "#F5F6FE" : hoveredRow === a.id ? "#EDEEFD" : "#fff",
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
                        { label: "Invite Student",      color: a.status !== "Not Invited" ? "#C5C5CC" : "#121216", enabled: a.status === "Not Invited" },
                        { label: "Resend Invitation",   color: a.status === "Invited" ? "#121216" : "#C5C5CC", enabled: a.status === "Invited" },
                        { label: "Remove Student",      color: "#C72727", enabled: true, onSelect: () => { setOpenMenu(null); setRemoveTarget(a); } },
                      ].map(({ label, color, enabled, onSelect }) => (
                        <button key={label} disabled={!enabled} onClick={onSelect} style={{
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

      <RemoveStudentModal
        studentName={removeTarget?.name ?? ""}
        isBulk={removeTarget?.id === -1}
        show={removeTarget !== null}
        onClose={() => { setRemoveTarget(null); if (removeTarget?.id === -1) setSelected(new Set()); }}
      />
    </div>
  );
}

// ─── Lessons page ────────────────────────────────────────────────────────────

function lessonStats(id: number) {
  const pct      = [62,48,71,38,55,29,83,44,67,31,72,56,45,79,38,62,51,44,67,29][id - 1] ?? 50;
  const assigned = ALUMNI.filter(a => a.assignedLessonIds.includes(id)).length;
  return { pct, assigned };
}

function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function LessonCard({ lesson, onAssign, onOpenDetail }: { lesson: LessonItem; onAssign: () => void; onOpenDetail: () => void }) {
  const [hovered, setHovered] = useState(false);
  const color = CATEGORY_COLOR[lesson.category];
  const { pct, assigned } = lessonStats(lesson.id);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 12,
        border: hovered ? "1px solid #C5C5CC" : BORDER,
        padding: "16px", display: "flex", flexDirection: "column", gap: 10,
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: `box-shadow ${MS.dFast} ${MS.eOut}, border-color ${MS.dFast} ${MS.eOut}`,
        cursor: "pointer",
      }}
    >
      {/* Category badge */}
      <div style={{ display: "flex" }}>
        <span style={{
          display: "inline-flex", alignItems: "center",
          height: 22, paddingInline: 9, borderRadius: 20,
          fontSize: 11, fontWeight: 600,
          background: hexAlpha(color, 0.12),
          color,
        }}>
          {lesson.category}
        </span>
      </div>

      {/* Title */}
      <p
        onClick={onOpenDetail}
        style={{
          margin: 0, fontSize: 15, fontWeight: 600, color: "#121216",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", cursor: "pointer",
        }}
      >
        {lesson.title}
      </p>

      {/* Summary */}
      <p style={{
        margin: 0, fontSize: 13, color: "#8E8E97", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden", flex: 1,
      }}>
        {lesson.summary}
      </p>

      {/* Meta */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8E8E97" }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="6" cy="6" r="5"/><path d="M6 3.5v2.75l1.75 1.25"/>
        </svg>
        <span>{lesson.minRead} min read</span>
        <span style={{ color: "#D0D0D8" }}>·</span>
        <span>{lesson.blocks} blocks</span>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ height: 4, borderRadius: 2, background: "#F0F0F5", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "#22A062", transition: "width 0.3s ease" }} />
        </div>
        <p style={{ margin: "5px 0 0", fontSize: 11, color: "#A0A0AA" }}>
          {pct}% of assigned students completed
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, borderTop: BORDER }}>
        <button
          onClick={e => { e.stopPropagation(); onAssign(); }}
          style={{
            background: "none", border: "none", padding: 0,
            fontSize: 13, fontWeight: 500, color: "#3E4FD3",
            fontFamily: "var(--font-inter)", cursor: "pointer",
          }}
        >
          Assign →
        </button>
        <span style={{ fontSize: 12, color: "#A0A0AA" }}>{assigned} assigned</span>
      </div>
    </div>
  );
}

// ─── Date Picker Field ────────────────────────────────────────────────────────

function DatePickerField({ value, onChange }: {
  value:    string | null;
  onChange: (v: string | null) => void;
}) {
  const today = new Date();
  const [open,     setOpen]     = useState(false);
  const [calYear,  setCalYear]  = useState(value ? new Date(value + "T00:00").getFullYear() : today.getFullYear());
  const [calMonth, setCalMonth] = useState(value ? new Date(value + "T00:00").getMonth()    : today.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }
  function selectDay(day: number) {
    const m = String(calMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${calYear}-${m}-${d}`);
    setOpen(false);
  }

  const cells   = buildCalendarGrid(calYear, calMonth);
  const todayY  = today.getFullYear(), todayM = today.getMonth(), todayD = today.getDate();
  const selDate = value ? new Date(value + "T00:00") : null;
  const selY    = selDate?.getFullYear() ?? null;
  const selM    = selDate?.getMonth() ?? null;
  const selD    = selDate?.getDate() ?? null;

  const displayLabel = selDate
    ? `${MONTH_NAMES[selDate.getMonth()]} ${selDate.getDate()}, ${selDate.getFullYear()}`
    : null;

  const navBtn = (ch: string, fn: () => void) => (
    <button onClick={fn} style={{
      width: 24, height: 24, border: BORDER, borderRadius: 6,
      background: "#fff", cursor: "pointer", fontSize: 13, color: "#8E8E97",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-inter)", lineHeight: 1,
    }}>{ch}</button>
  );

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          height: 44, paddingInline: 14, borderRadius: 8,
          border: open ? "1.5px solid #3E4FD3" : BORDER,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
          transition: `border-color ${MS.dFast} ${MS.eOut}`,
        }}
      >
        <span style={{ fontSize: 14, color: displayLabel ? "#121216" : "#C5C5CC" }}>
          {displayLabel ?? "Optional"}
        </span>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke={open ? "#3E4FD3" : "#A0A0AA"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: `stroke ${MS.dFast} ${MS.eOut}` }}>
          <rect x="1.5" y="2.5" width="12" height="11" rx="2"/>
          <path d="M1.5 6.5h12M5 1v3M10 1v3"/>
        </svg>
      </div>

      {/* Calendar popover — above the trigger */}
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0,
          background: "#fff", borderRadius: 10, border: BORDER,
          boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
          padding: "14px 14px 10px", width: 252, zIndex: 20,
        }}>
          {/* Month / year nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            {navBtn("‹", prevMonth)}
            <span style={{ fontSize: 13, fontWeight: 600, color: "#121216" }}>
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
            {navBtn("›", nextMonth)}
          </div>

          {/* DOW headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
            {CAL_DOW_LABELS.map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 500, color: "#A0A0AA", paddingBlock: 2 }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 }}>
            {cells.map((day, i) => {
              const isT = day !== null && calYear === todayY && calMonth === todayM && day === todayD;
              const isS = day !== null && calYear === selY   && calMonth === selM   && day === selD;
              return (
                <div
                  key={i}
                  onClick={() => day && selectDay(day)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 30, cursor: day ? "pointer" : "default" }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isS ? "#3E4FD3" : isT ? "#EDEEFD" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: `background ${MS.dFast} ${MS.eOut}`,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: isS || isT ? 600 : 400, color: isS ? "#fff" : isT ? "#3E4FD3" : day ? "#121216" : "transparent" }}>
                      {day ?? ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clear */}
          {value && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: BORDER, display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => { onChange(null); setOpen(false); }}
                style={{ background: "none", border: "none", fontSize: 12, color: "#8E8E97", cursor: "pointer", fontFamily: "var(--font-inter)" }}
              >
                Clear date
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Assign Lesson Modal ──────────────────────────────────────────────────────

type LessonItem = (typeof LESSONS)[number];

function chipLabel(name: string) {
  const [first, ...rest] = name.split(" ");
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
}

function alumniEmail(name: string) {
  const parts = name.replace(/[^a-zA-Z\s]/g, "").toLowerCase().split(" ");
  return `${parts[0][0]}.${parts[parts.length - 1]}@kent.edu`;
}

function AssignLessonModal({ lesson, show, onClose }: {
  lesson: LessonItem | null;
  show:   boolean;
  onClose: () => void;
}) {
  const [mounted,  setMounted]  = useState(show);
  const [vis,      setVis]      = useState(show);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query,    setQuery]    = useState("");
  const [dueDate,  setDueDate]  = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show && lesson) {
      setMounted(true);
      setSelected(new Set(ALUMNI.filter(a => a.assignedLessonIds.includes(lesson.id)).map(a => a.id)));
      const id = requestAnimationFrame(() => setVis(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVis(false);
      const t = setTimeout(() => {
        setMounted(false);
        setSelected(new Set()); setQuery(""); setDueDate(null);
      }, 220);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted || !lesson) return null;

  const color = CATEGORY_COLOR[lesson.category];

  const filtered = ALUMNI.filter(a =>
    !query ||
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    alumniEmail(a.name).includes(query.toLowerCase())
  );

  function toggle(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedStudents = ALUMNI.filter(a => selected.has(a.id));

  const btnBase: React.CSSProperties = {
    height: 40, paddingInline: 20, borderRadius: 8,
    fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", cursor: "pointer",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: vis ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 220ms ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 14, width: 520,
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
          opacity: vis ? 1 : 0,
          transform: vis ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
          transition: "opacity 220ms ease, transform 220ms ease",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 18px", flexShrink: 0 }}>
          <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#121216" }}>Assign Lesson</p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#8E8E97" }}>{lesson.title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color, fontWeight: 400 }}>
            <span>{lesson.category}</span>
            <span style={{ color: "#D0D0D8" }}>·</span>
            <span>{lesson.minRead} min read</span>
            <span style={{ color: "#D0D0D8" }}>·</span>
            <span>{lesson.blocks} blocks</span>
          </div>
        </div>

        <div style={{ height: 1, background: "#E8E8EC", flexShrink: 0 }} />

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Assign to Students */}
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: "#121216" }}>Assign to Students</p>

            {/* Chip + search input */}
            <div
              onClick={() => inputRef.current?.focus()}
              style={{
                minHeight: 44, padding: "6px 10px", borderRadius: 8,
                border: "1.5px solid #3E4FD3",
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
                cursor: "text",
              }}
            >
              {selectedStudents.map(s => (
                <span key={s.id} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  height: 26, paddingInline: 9, borderRadius: 20,
                  background: hexAlpha("#3E4FD3", 0.1),
                  fontSize: 12, fontWeight: 500, color: "#3E4FD3",
                }}>
                  {chipLabel(s.name)}
                  <button
                    onClick={e => { e.stopPropagation(); toggle(s.id); }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", color: "#3E4FD3" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                      <path d="M1.5 1.5l7 7M8.5 1.5l-7 7"/>
                    </svg>
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={selectedStudents.length === 0 ? "+ Add students…" : ""}
                style={{
                  border: "none", outline: "none", flex: 1, minWidth: 100,
                  fontSize: 13, color: "#121216", fontFamily: "var(--font-inter)",
                  background: "transparent", padding: "2px 0",
                }}
              />
            </div>

            <p style={{ margin: "6px 0 8px", fontSize: 12, color: "#A0A0AA" }}>Search by name or email</p>

            {/* Student list */}
            <div style={{ border: BORDER, borderRadius: 8, maxHeight: 196, overflowY: "auto" }}>
              {filtered.length === 0
                ? <div style={{ padding: "12px 14px", fontSize: 13, color: "#A0A0AA" }}>No students found.</div>
                : filtered.map((a, i) => {
                  const checked = selected.has(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", cursor: "pointer",
                        background: checked ? "#F5F6FF" : "#fff",
                        borderBottom: i < filtered.length - 1 ? BORDER : undefined,
                        transition: `background ${MS.dFast} ${MS.eOut}`,
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                        border: checked ? "none" : "1.5px solid #C5C5CC",
                        background: checked ? "#3E4FD3" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: `background ${MS.dFast} ${MS.eOut}`,
                      }}>
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#121216", flex: 1 }}>{a.name}</span>
                      <span style={{ fontSize: 13, color: "#A0A0AA" }}>{alumniEmail(a.name)}</span>
                    </div>
                  );
                })
              }
            </div>
          </div>

        </div>

        {/* Due Date — outside scroll so calendar popover isn't clipped */}
        <div style={{ flexShrink: 0, padding: "0 24px 16px" }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#121216" }}>Due Date</p>
          <DatePickerField value={dueDate} onChange={setDueDate} />
        </div>

        <div style={{ height: 1, background: "#E8E8EC", flexShrink: 0 }} />

        {/* Footer */}
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ ...btnBase, border: BORDER, background: "#fff", color: "#121216" }}>
            Cancel
          </button>
          <button style={{ ...btnBase, border: "none", background: "#3E4FD3", color: "#fff", fontWeight: 700 }}>
            Assign Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lesson Detail Page ───────────────────────────────────────────────────────

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

type AssignmentRow = {
  alumniId:      number;
  name:          string;
  dateAssigned:  string;
  dueDate:       string | null;
  status:        "Completed" | "In Progress" | "Not Started";
  dateCompleted: string | null;
};

function buildAssignments(lessonId: number): AssignmentRow[] {
  return ALUMNI
    .filter(a => a.assignedLessonIds.includes(lessonId))
    .map(a => {
      const base          = a.dateActivated ?? a.dateInvited ?? "2026-01-01";
      const dateAssigned  = addDays(base, (a.id * 3 + lessonId) % 14);
      const dueDate       = addDays(dateAssigned, 21 + (lessonId % 7));
      const hash          = (a.id * 13 + lessonId * 7) % 10;
      const status: AssignmentRow["status"] =
        hash < 4 ? "Completed" : hash < 7 ? "In Progress" : "Not Started";
      const dateCompleted = status === "Completed"
        ? addDays(dateAssigned, 10 + (a.id % 8))
        : null;
      return { alumniId: a.id, name: a.name, dateAssigned, dueDate, status, dateCompleted };
    });
}

function AssignStatusBadge({ status }: { status: AssignmentRow["status"] }) {
  const cfg = status === "Completed"
    ? { bg: "#E8F7EE", color: "#22A062" }
    : status === "In Progress"
    ? { bg: "#EEF1FD", color: "#3E4FD3" }
    : { bg: "#F5F5F8", color: "#8E8E97" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      height: 22, paddingInline: 9, borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: cfg.bg, color: cfg.color,
    }}>
      {status}
    </span>
  );
}

function LessonDetailPage({ lessonId, onAssign }: { lessonId: number; onAssign: () => void }) {
  const lesson      = LESSONS.find(l => l.id === lessonId)!;
  const color       = CATEGORY_COLOR[lesson.category];
  const assignments = buildAssignments(lessonId);
  const completed   = assignments.filter(a => a.status === "Completed");
  const inProgress  = assignments.filter(a => a.status === "In Progress");
  const notStarted  = assignments.filter(a => a.status === "Not Started");
  const total       = assignments.length;

  const completePct   = total > 0 ? Math.round((completed.length  / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress.length / total) * 100) : 0;

  const [tab, setTab] = useState<"all" | "not-started" | "in-progress" | "completed">("all");

  const tabs = [
    { key: "all"         as const, label: "All",         count: total             },
    { key: "not-started" as const, label: "Not Started", count: notStarted.length },
    { key: "in-progress" as const, label: "In Progress", count: inProgress.length },
    { key: "completed"   as const, label: "Completed",   count: completed.length  },
  ];

  const visRows = tab === "all"         ? assignments
               : tab === "completed"   ? completed
               : tab === "in-progress" ? inProgress
               : notStarted;

  const thStyle: React.CSSProperties = {
    padding: "10px 20px", textAlign: "left",
    fontSize: 12, fontWeight: 600, color: "#8E8E97",
    background: "#FAFAFA", whiteSpace: "nowrap",
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* ── Left column (35%) ── */}
          <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Lesson info card */}
            <div style={{ background: "#fff", borderRadius: 12, border: BORDER, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  height: 22, paddingInline: 9, borderRadius: 20,
                  fontSize: 11, fontWeight: 600,
                  background: hexAlpha(color, 0.12), color,
                }}>
                  {lesson.category}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#121216", lineHeight: 1.3 }}>
                {lesson.title}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "#8E8E97", lineHeight: 1.55 }}>
                {lesson.summary}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: BORDER, paddingTop: 14 }}>
                {([
                  ["Read time",      `${lesson.minRead} min`],
                  ["Blocks",         String(lesson.blocks)],
                  ["Category",       lesson.category],
                  ["Total assigned", String(total)],
                ] as [string, string][]).map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#8E8E97" }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#121216" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion stats card */}
            <div style={{ background: "#fff", borderRadius: 12, border: BORDER, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#121216" }}>Overall Completion</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#121216", lineHeight: 1 }}>{completePct}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#8E8E97" }}>%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, display: "flex", overflow: "hidden", background: "#F0F0F5" }}>
                {completePct   > 0 && <div style={{ width: `${completePct}%`,   background: "#22A062", transition: "width 0.3s ease" }} />}
                {inProgressPct > 0 && <div style={{ width: `${inProgressPct}%`, background: "#3E4FD3", transition: "width 0.3s ease" }} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([
                  { label: "Completed",   c: "#22A062", n: completed.length  },
                  { label: "In Progress", c: "#3E4FD3", n: inProgress.length },
                  { label: "Not Started", c: "#D0D0D8", n: notStarted.length },
                ] as { label: string; c: string; n: number }[]).map(({ label, c, n }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#8E8E97" }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#121216" }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right column ── */}
          <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: BORDER, overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: BORDER, flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#121216" }}>
                Assigned Students
                <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 400, color: "#8E8E97" }}>({total})</span>
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: BORDER, paddingInline: 20, flexShrink: 0 }}>
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    background: "none", border: "none",
                    padding: "10px 0", marginRight: 20, marginBottom: -1,
                    fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                    color: tab === t.key ? "#121216" : "#8E8E97",
                    fontFamily: "var(--font-inter)", cursor: "pointer",
                    borderBottom: tab === t.key ? "2px solid #3E4FD3" : "2px solid transparent",
                    transition: `color ${MS.dFast} ${MS.eOut}, border-color ${MS.dFast} ${MS.eOut}`,
                  }}
                >
                  {t.label}
                  <span style={{
                    marginLeft: 5, fontSize: 11, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    height: 16, minWidth: 16, borderRadius: 8, paddingInline: 4,
                    background: tab === t.key ? "#3E4FD3" : "#F0F0F5",
                    color: tab === t.key ? "#fff" : "#8E8E97",
                  }}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Date Assigned</th>
                  <th style={thStyle}>Due Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date Completed</th>
                </tr>
              </thead>
              <tbody>
                {visRows.map(row => (
                  <tr key={row.alumniId} style={{ borderTop: BORDER }}>
                    <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "#121216" }}>{row.name}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#8E8E97" }}>{fmtDate(row.dateAssigned)}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#8E8E97" }}>{row.dueDate ? fmtDate(row.dueDate) : "—"}</td>
                    <td style={{ padding: "12px 20px" }}><AssignStatusBadge status={row.status} /></td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#8E8E97" }}>{row.dateCompleted ? fmtDate(row.dateCompleted) : "—"}</td>
                  </tr>
                ))}
                {visRows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px 20px", textAlign: "center", fontSize: 13, color: "#A0A0AA" }}>
                      No students in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>
      </div>
    </div>
  );
}

function LessonsPage({ activeLessonId, setActiveLessonId, onAssignLesson }: {
  activeLessonId:    number | null;
  setActiveLessonId: (id: number | null) => void;
  onAssignLesson:    (lesson: LessonItem) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<LessonCategory | null>(null);

  if (activeLessonId !== null) {
    return (
      <LessonDetailPage
        lessonId={activeLessonId}
        onAssign={() => { const l = LESSONS.find(x => x.id === activeLessonId); if (l) onAssignLesson(l); }}
      />
    );
  }

  // Ordered unique categories from the lessons list
  const categories = LESSONS.reduce<LessonCategory[]>((acc, l) => {
    if (!acc.includes(l.category)) acc.push(l.category);
    return acc;
  }, []);

  const categoryCounts = Object.fromEntries(
    categories.map(c => [c, LESSONS.filter(l => l.category === c).length])
  ) as Record<LessonCategory, number>;

  const visible = activeCategory ? LESSONS.filter(l => l.category === activeCategory) : LESSONS;

  function toggleCategory(cat: LessonCategory) {
    setActiveCategory(prev => prev === cat ? null : cat);
  }

  const pillBase: React.CSSProperties = {
    height: 32, paddingInline: 14, borderRadius: 20,
    border: BORDER, fontSize: 13, fontWeight: 500,
    fontFamily: "var(--font-inter)", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 5,
    transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}, border-color ${MS.dFast} ${MS.eOut}`,
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

      {/* Category filter bar */}
      <div style={{
        flexShrink: 0, borderBottom: BORDER, background: "#fff",
        padding: "10px 24px", display: "flex", alignItems: "center", gap: 8,
        overflowX: "auto",
      }}>
        {/* All */}
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            ...pillBase,
            background: activeCategory === null ? "#3E4FD3" : "#fff",
            color:      activeCategory === null ? "#fff"    : "#121216",
            borderColor: activeCategory === null ? "#3E4FD3" : "#E5E5EA",
          }}
        >
          All
        </button>

        {categories.map(cat => {
          const active = activeCategory === cat;
          const color  = CATEGORY_COLOR[cat];
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                ...pillBase,
                background:  active ? hexAlpha(color, 0.12) : "#fff",
                color:       active ? color : "#4A4A55",
                borderColor: active ? hexAlpha(color, 0.4)  : "#E5E5EA",
              }}
            >
              {cat}
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: active ? color : "#A0A0AA",
                background: active ? hexAlpha(color, 0.15) : "#F0F0F5",
                height: 18, minWidth: 18, borderRadius: 10,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                paddingInline: 5,
              }}>
                {categoryCounts[cat]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {visible.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onAssign={() => onAssignLesson(lesson)} onOpenDetail={() => setActiveLessonId(lesson.id)} />
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        flexShrink: 0, borderTop: BORDER, background: "#fff",
        padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, color: "#8E8E97",
      }}>
        {activeCategory === null ? (
          <>Total <span style={{ fontWeight: 600, color: "#121216", marginInline: 4 }}>{LESSONS.length}</span> lessons</>
        ) : (
          <>
            Showing <span style={{ fontWeight: 600, color: "#121216", marginInline: 4 }}>{visible.length}</span>
            {" "}of{" "}
            <span style={{ fontWeight: 600, color: "#121216", marginInline: 4 }}>{LESSONS.length}</span>
            {" "}lessons
            <span style={{ marginInline: 8, color: "#D0D0D8" }}>·</span>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                background: "none", border: "none", padding: 0,
                fontSize: 13, fontWeight: 500, color: "#3E4FD3",
                cursor: "pointer", fontFamily: "var(--font-inter)",
              }}
            >
              Clear filter to see all
            </button>
          </>
        )}
      </div>

    </div>
  );
}

// ─── Messages page ────────────────────────────────────────────────────────────

const MSG_TODAY_ISO = `${MOCK_TODAY.year}-${String(MOCK_TODAY.month + 1).padStart(2, "0")}-${String(MOCK_TODAY.day).padStart(2, "0")}`;
const MSG_YESTERDAY_ISO = (() => {
  const d = new Date(MSG_TODAY_ISO + "T00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
})();
const MSG_NOW_MINS = 13 * 60 + 5; // fixed "now" = 13:05 for relative timestamps

function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function threadTimestamp(date: string, time: string): string {
  if (date === MSG_TODAY_ISO) {
    const [h, m] = time.split(":").map(Number);
    const diff = MSG_NOW_MINS - (h * 60 + m);
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  }
  if (date === MSG_YESTERDAY_ISO) return "Yesterday";
  const d = new Date(date + "T00:00");
  return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}`;
}

function msgTimestamp(date: string, time: string): string {
  const prefix = date === MSG_TODAY_ISO ? "Today" : (() => {
    const d = new Date(date + "T00:00");
    return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}`;
  })();
  return `${prefix} · ${fmtTime(time)}`;
}

function dateGroupLabel(date: string): string {
  if (date === MSG_TODAY_ISO)     return "Today";
  if (date === MSG_YESTERDAY_ISO) return "Yesterday";
  return fmtDate(date);
}

function MsgAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const ini = name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "#EEF1FD", color: "#3E4FD3",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.36), fontWeight: 600, lineHeight: 1,
    }}>
      {ini}
    </div>
  );
}

function sortedMsgThreads() {
  return [...MESSAGE_THREADS].sort((a, b) => {
    const aL = a.messages[a.messages.length - 1];
    const bL = b.messages[b.messages.length - 1];
    return (`${bL.date}T${bL.time}`).localeCompare(`${aL.date}T${aL.time}`);
  });
}

function MessagesPage() {
  const threads = sortedMsgThreads();
  const [activeId, setActiveId] = useState<number>(threads[0].id);
  const [search,   setSearch]   = useState("");
  const [inputVal, setInputVal] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeId)!;
  const student      = ALUMNI.find(a => a.id === activeThread.studentId)!;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant" });
  }, [activeId]);

  const visible = search.trim()
    ? threads.filter(t => {
        const a = ALUMNI.find(x => x.id === t.studentId);
        return a?.name.toLowerCase().includes(search.toLowerCase());
      })
    : threads;

  const msgs = activeThread.messages;
  const unreadStart = activeThread.unreadCount > 0 ? msgs.length - activeThread.unreadCount : -1;

  type GroupedMsg = (typeof msgs)[number] & { msgIdx: number };
  const dateGroups: { date: string; rows: GroupedMsg[] }[] = [];
  msgs.forEach((msg, i) => {
    const last = dateGroups[dateGroups.length - 1];
    if (!last || last.date !== msg.date) {
      dateGroups.push({ date: msg.date, rows: [{ ...msg, msgIdx: i }] });
    } else {
      last.rows.push({ ...msg, msgIdx: i });
    }
  });

  const divStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 12, margin: "16px 0",
  };
  const divLine: React.CSSProperties = { flex: 1, height: 1, background: "#E5E5EA" };
  const divLabel: React.CSSProperties = { fontSize: 12, color: "#A0A0AA", fontWeight: 500, whiteSpace: "nowrap" };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>

      {/* ── Left: Thread list ── */}
      <div style={{ width: 320, flexShrink: 0, borderRight: BORDER, display: "flex", flexDirection: "column", background: "#fff" }}>

        {/* Search */}
        <div style={{ padding: "12px 16px", borderBottom: BORDER }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#A0A0AA" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="5.5" cy="5.5" r="4"/><path d="M10 10l2.5 2.5"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              style={{
                width: "100%", height: 36, paddingInline: "32px 12px",
                boxSizing: "border-box", borderRadius: 8,
                border: "1.5px solid #E8E8EC", outline: "none",
                fontSize: 13, color: "#121216", fontFamily: "var(--font-inter)",
                background: "#F8F8FA",
              }}
            />
          </div>
        </div>

        {/* Thread items */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {visible.map(thread => {
            const a      = ALUMNI.find(x => x.id === thread.studentId)!;
            const last   = thread.messages[thread.messages.length - 1];
            const active = thread.id === activeId;
            const online = last.date === MSG_TODAY_ISO;
            return (
              <div
                key={thread.id}
                onClick={() => setActiveId(thread.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "12px 16px", cursor: "pointer",
                  background: active ? "#F0F2FD" : "#fff",
                  borderLeft: active ? "3px solid #3E4FD3" : "3px solid transparent",
                  borderBottom: BORDER,
                  transition: `background ${MS.dFast} ${MS.eOut}`,
                }}
              >
                {/* Avatar + online dot */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <MsgAvatar name={a.name} size={36} />
                  {online && (
                    <div style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 9, height: 9, borderRadius: "50%",
                      background: "#22A062", border: "1.5px solid #fff",
                    }} />
                  )}
                </div>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: "#121216", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#A0A0AA", flexShrink: 0, marginLeft: 8 }}>
                      {threadTimestamp(last.date, last.time)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#8E8E97", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {last.text}
                    </span>
                    {thread.unreadCount > 0 && (
                      <div style={{
                        marginLeft: 8, flexShrink: 0,
                        minWidth: 18, height: 18, borderRadius: 9, paddingInline: 4,
                        background: "#22A062", color: "#fff",
                        fontSize: 11, fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {thread.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right: Chat ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#FAFAFA" }}>

        {/* Chat header */}
        <div style={{
          flexShrink: 0, height: 64, background: "#fff", borderBottom: BORDER,
          paddingInline: 24, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <MsgAvatar name={student.name} size={36} />
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#121216", lineHeight: 1.2 }}>{student.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#A0A0AA", lineHeight: 1.4 }}>
                {student.dateLastActive ? `Last active: ${fmtDate(student.dateLastActive)}` : "No recent activity"}
              </p>
            </div>
          </div>
          <button style={{
            background: "none", border: "none", padding: 0,
            fontSize: 13, fontWeight: 500, color: "#3E4FD3",
            fontFamily: "var(--font-inter)", cursor: "pointer",
          }}>
            View Profile →
          </button>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 4px" }}>
          {dateGroups.map(group => (
            <div key={group.date}>
              {/* Date divider */}
              <div style={divStyle}>
                <div style={divLine} />
                <span style={divLabel}>{dateGroupLabel(group.date)}</span>
                <div style={divLine} />
              </div>

              {group.rows.map(msg => {
                const isStaff = msg.sender === "staff";
                return (
                  <div key={msg.id}>
                    {/* Unread divider */}
                    {msg.msgIdx === unreadStart && (
                      <div style={{ ...divStyle, margin: "8px 0 16px" }}>
                        <div style={divLine} />
                        <span style={divLabel}>{activeThread.unreadCount} unread message{activeThread.unreadCount !== 1 ? "s" : ""}</span>
                        <div style={divLine} />
                      </div>
                    )}
                    {/* Bubble row */}
                    <div style={{
                      display: "flex",
                      flexDirection: isStaff ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      gap: 8, marginBottom: 10,
                    }}>
                      {!isStaff && <MsgAvatar name={student.name} size={28} />}
                      <div style={{ maxWidth: "60%", display: "flex", flexDirection: "column", alignItems: isStaff ? "flex-end" : "flex-start" }}>
                        {!isStaff && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#8E8E97", marginBottom: 3 }}>
                            {student.name}
                          </span>
                        )}
                        <div style={{
                          padding: "10px 14px",
                          borderRadius: isStaff ? "12px 12px 4px 12px" : "4px 12px 12px 12px",
                          background: isStaff ? "#3E4FD3" : "#fff",
                          color: isStaff ? "#fff" : "#121216",
                          fontSize: 14, lineHeight: 1.5,
                          border: isStaff ? "none" : BORDER,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize: 11, color: "#A0A0AA", marginTop: 4 }}>
                          {msgTimestamp(msg.date, msg.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div style={{
          flexShrink: 0, borderTop: BORDER, background: "#fff",
          padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <button style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: "#F0F0F5", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8E8E97",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 7.5L7 14a4.5 4.5 0 01-6.5-6.5l7-7a3 3 0 014.5 4.5L5 12a1.5 1.5 0 01-2.5-2.5l7-7"/>
            </svg>
          </button>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && inputVal.trim()) setInputVal(""); }}
            placeholder="Type a message..."
            style={{
              flex: 1, height: 36, paddingInline: 14,
              borderRadius: 8, border: "1.5px solid #E8E8EC",
              outline: "none", fontSize: 14, color: "#121216",
              fontFamily: "var(--font-inter)", background: "#fff",
            }}
          />
          <button
            onClick={() => { if (inputVal.trim()) setInputVal(""); }}
            style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: inputVal.trim() ? "#3E4FD3" : "#E8E8EC",
              border: "none", cursor: inputVal.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: `background ${MS.dFast} ${MS.eOut}`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12.5 7L1.5 2l2 5-2 5 11-5z" fill={inputVal.trim() ? "#fff" : "#A0A0AA"}/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Content (page router) ────────────────────────────────────────────────────
function Content({ page, view, onNavigate, toolsVisible, importOpen, onImportClose, activeLessonId, setActiveLessonId, onAssignLesson }: { page: NavId; view: ViewTab; onNavigate: (page: NavId) => void; toolsVisible: ToolsVisible; importOpen: boolean; onImportClose: () => void; activeLessonId: number | null; setActiveLessonId: (id: number | null) => void; onAssignLesson: (lesson: LessonItem) => void }) {
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
      {page === 1 && (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <DashboardContent view={view} onNavigate={onNavigate} toolsVisible={toolsVisible} />
        </div>
      )}
      {page === 2 && (importOpen ? <RosterImportShell onClose={onImportClose} /> : <RosterPage />)}
      {page === 3 && <LessonsPage activeLessonId={activeLessonId} setActiveLessonId={setActiveLessonId} onAssignLesson={onAssignLesson} />}
      {page === 6 && <MessagesPage />}
      {page !== 1 && page !== 2 && page !== 3 && page !== 6 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#ccc", fontSize: 12 }}>Content — coming soon</span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeNav,        setActiveNav]        = useState<NavId>(1);
  const [dashView,         setDashView]         = useState<ViewTab>("This Month");
  const [toolsVisible,     setToolsVisible]     = useState<ToolsVisible>(initToolsVisible);
  const [addStudentOpen,   setAddStudentOpen]   = useState(false);
  const [importCSVOpen,    setImportCSVOpen]    = useState(false);
  const [activeLessonId,   setActiveLessonId]   = useState<number | null>(null);
  const [assignLessonItem, setAssignLessonItem] = useState<LessonItem | null>(null);

  function handleNavSelect(id: NavId) {
    setActiveNav(id);
    if (id !== 3) setActiveLessonId(null);
  }

  const pageConfigs = makePageConfigs(
    dashView, setDashView, toolsVisible, setToolsVisible,
    () => setAddStudentOpen(true), () => setImportCSVOpen(true),
    activeLessonId,
    () => setActiveLessonId(null),
    () => { const l = LESSONS.find(l => l.id === activeLessonId); if (l) setAssignLessonItem(l); },
  );

  return (
    <div className={inter.variable} style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", fontFamily: "var(--font-inter)", userSelect: "none", WebkitUserSelect: "none" }}>
      <Sidebar active={activeNav} onSelect={handleNavSelect} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar page={activeNav} configs={pageConfigs} />
        <Content
          page={activeNav} view={dashView} onNavigate={handleNavSelect} toolsVisible={toolsVisible}
          importOpen={importCSVOpen} onImportClose={() => setImportCSVOpen(false)}
          activeLessonId={activeLessonId} setActiveLessonId={setActiveLessonId}
          onAssignLesson={(l) => setAssignLessonItem(l)}
        />
      </div>
      <AddStudentModal show={addStudentOpen} onClose={() => setAddStudentOpen(false)} />
      <AssignLessonModal
        lesson={assignLessonItem}
        show={assignLessonItem !== null}
        onClose={() => setAssignLessonItem(null)}
      />
    </div>
  );
}
