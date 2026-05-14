import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

// ─── Design tokens ────────────────────────────────────────────────────────────
export const BLUE = "#558BF7";

// ─── Motion tokens — JS mirror of motion-system.css custom properties ────────
export const MS = {
  dFast: "150ms",
  eOut:  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      className={`${inter.variable}`}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#fff",
        fontFamily: "var(--font-inter)",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* ── Drop your screen component here ── */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#ccc", fontSize: 13, fontFamily: "var(--font-inter)" }}>
          Desktop — add your screen here
        </span>
      </div>
    </div>
  );
}
