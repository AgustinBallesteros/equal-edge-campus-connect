import { Inter } from "next/font/google";

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
const SIDEBAR_W  = "20%";
const TOPBAR_H   = 64;
const BORDER     = "1px solid #E5E5EA";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
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
      }}
    >
      {/* ── Drop sidebar content here ── */}
      <div style={{
        flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#ccc", fontSize: 12, fontFamily: "var(--font-inter)" }}>
          Sidebar
        </span>
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
      <span style={{ color: "#ccc", fontSize: 12, fontFamily: "var(--font-inter)" }}>
        Top bar
      </span>
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
      <span style={{ color: "#ccc", fontSize: 12, fontFamily: "var(--font-inter)" }}>
        Content
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
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
      <Sidebar />

      {/* ── Right panel: top bar + scrollable content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar />
        <Content />
      </div>
    </div>
  );
}
