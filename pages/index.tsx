import { Inter } from "next/font/google";
import { useRef, useCallback, useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

// ─── Design tokens ────────────────────────────────────────────────────────────
const BLUE = "#558BF7";

// ─── Motion tokens — JS mirror of motion-system.css custom properties ────────
const MS = {
  dFast: "150ms",
  eOut:  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

// ─── Viewport presets ─────────────────────────────────────────────────────────
const PRESETS = {
  iphone17:   { label: "iPhone 17 Pro Max", w: 440,  h: 956  },
  android:    { label: "Android Large",     w: 412,  h: 917  },
  responsive: { label: "Responsive",        w: null, h: null },
} as const;
type PresetKey = keyof typeof PRESETS;
type Platform  = "mobile" | "desktop";

const MENU_ORIGIN = { top: 16, left: 16 };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [preset,   setPreset]   = useState<PresetKey>("iphone17");
  const [scale,    setScale]    = useState(1);
  const [menuOpen, setMenuOpen] = useState(true);
  const [platform, setPlatform] = useState<Platform>("mobile");

  // Reset scale to 1 when switching to desktop (no auto-fit needed)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (platform === "desktop") setScale(1);
  }, [platform]);

  // ── Dev menu drag-to-reposition ────────────────────────────────────────────
  const [menuPos,  setMenuPos]  = useState(MENU_ORIGIN);
  const menuPosRef = useRef(MENU_ORIGIN);

  const menuDrag = useRef({
    active:         false,
    startX:         0,
    startY:         0,
    startLeft:      16,
    startTop:       16,
    moved:          false,
    longPressTimer: null as ReturnType<typeof setTimeout> | null,
  });
  const lastTap = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!menuDrag.current.active) return;
      const dx = e.clientX - menuDrag.current.startX;
      const dy = e.clientY - menuDrag.current.startY;
      const newLeft = Math.max(0, Math.min(window.innerWidth  - 40, menuDrag.current.startLeft + dx));
      const newTop  = Math.max(0, Math.min(window.innerHeight - 40, menuDrag.current.startTop  + dy));
      menuDrag.current.moved = true;
      menuPosRef.current = { top: newTop, left: newLeft };
      setMenuPos({ top: newTop, left: newLeft });
    };
    const onUp = () => {
      if (!menuDrag.current.active) return;
      menuDrag.current.active = false;
      if (menuDrag.current.longPressTimer) {
        clearTimeout(menuDrag.current.longPressTimer);
        menuDrag.current.longPressTimer = null;
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, []);

  const onMenuPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < 350) {
      lastTap.current = 0;
      menuPosRef.current = MENU_ORIGIN;
      setMenuPos(MENU_ORIGIN);
      return;
    }
    lastTap.current = now;
    const startX = e.clientX;
    const startY = e.clientY;
    menuDrag.current.moved = false;
    const timer = setTimeout(() => {
      menuDrag.current.active    = true;
      menuDrag.current.startX    = startX;
      menuDrag.current.startY    = startY;
      menuDrag.current.startLeft = menuPosRef.current.left;
      menuDrag.current.startTop  = menuPosRef.current.top;
      menuDrag.current.longPressTimer = null;
      setMenuOpen(false);
    }, 300);
    menuDrag.current.longPressTimer = timer;
  }, []);

  const onMenuClick = useCallback(() => {
    if (menuDrag.current.moved) {
      menuDrag.current.moved = false;
      return;
    }
    if (menuDrag.current.longPressTimer) {
      clearTimeout(menuDrag.current.longPressTimer);
      menuDrag.current.longPressTimer = null;
    }
    setMenuOpen(v => !v);
  }, []);

  const isDesktop    = platform === "desktop";
  const isResponsive = !isDesktop && preset === "responsive";
  const { w, h }     = isDesktop ? { w: null, h: null } : PRESETS[preset];

  // Auto-fit scale to viewport whenever preset or window size changes (mobile fixed only)
  useEffect(() => {
    if (isDesktop || isResponsive) return;
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 48) / h!);
      setScale(parseFloat(s.toFixed(2)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [preset, isDesktop, isResponsive, h]);

  const visualW = (isDesktop || isResponsive) ? "100vw" : w! * scale;
  const visualH = (isDesktop || isResponsive) ? "100vh" : h! * scale;

  return (
    <div
      className={`${inter.variable}`}
      style={{
        minHeight: "100vh", width: "100%",
        background: "#E8E8ED",
        fontFamily: "var(--font-inter)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: (isDesktop || isResponsive) ? "hidden" : undefined,
      }}
    >
      {/* ── Viewport frame ── */}
      <div style={{ width: visualW, height: visualH, flexShrink: 0, position: "relative" }}>
        <div
          style={{
            transform: (isDesktop || isResponsive) ? (scale !== 1 ? `scale(${scale})` : undefined) : `scale(${scale})`,
            transformOrigin: "top left",
            width:  (isDesktop || isResponsive) ? "100%" : w!,
            height: (isDesktop || isResponsive) ? "100%" : h!,
            background: "#fff",
            overflow: "hidden",
            boxShadow: (isDesktop || isResponsive) ? "none" : "0 8px 40px rgba(0,0,0,0.18)",
            borderRadius: (isDesktop || isResponsive) ? 0 : 8,
            userSelect: "none",
            WebkitUserSelect: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* ── Drop your screen component here ── */}
          <span style={{ color: "#ccc", fontSize: 13, fontFamily: "var(--font-inter)" }}>
            {isDesktop ? "Desktop" : "Mobile"} — add your screen here
          </span>
        </div>
      </div>

      {/* ── Dev menu ── */}
      <div
        style={{
          position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 2000,
          display: "flex", flexDirection: "column", gap: 8,
          alignItems: "flex-start",
        }}
      >
        {/* Toggle button — tap-and-hold to drag, double-tap to reset */}
        <button
          onPointerDown={onMenuPointerDown}
          onClick={onMenuClick}
          title={menuOpen ? "Hide menu (hold to drag, double-tap to reset)" : "Show menu"}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: menuOpen ? "rgba(30,30,32,0.90)" : "rgba(30,30,32,0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            transition: `background ${MS.dFast} ${MS.eOut}`,
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="14" height="12" rx="2.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4"/>
            <path d="M1 6h14" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4"/>
            <path d="M5 9.5h6M5 11.5h4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Menu panel */}
        {menuOpen && (
          <div
            style={{
              background: "rgba(22,22,24,0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex", flexDirection: "column", gap: 10,
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              minWidth: 210,
            }}
          >
            {/* Platform toggle */}
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Platform
            </span>
            <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.07)", borderRadius: 9, padding: 3 }}>
              {(["mobile", "desktop"] as Platform[]).map((p) => {
                const isActive = platform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    style={{
                      flex: 1, height: 28, borderRadius: 7, border: "none",
                      background: isActive ? BLUE : "transparent",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                      fontSize: 12, fontWeight: isActive ? 600 : 400,
                      cursor: "pointer", fontFamily: "var(--font-inter)",
                      transition: `background ${MS.dFast} ${MS.eOut}, color ${MS.dFast} ${MS.eOut}`,
                    }}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* Viewport section — mobile only */}
            {!isDesktop && (
              <>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 -2px" }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Viewport
                </span>
                {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
                  const p      = PRESETS[key];
                  const active = preset === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setPreset(key)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 10, cursor: "pointer", borderRadius: 8, padding: "7px 10px",
                        background: active ? "rgba(85,139,247,0.22)" : "transparent",
                        transition: `background ${MS.dFast} ${MS.eOut}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                          border: active ? "none" : "1.5px solid rgba(255,255,255,0.25)",
                          background: active ? BLUE : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                        <span style={{ fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.65)", fontWeight: active ? 500 : 400 }}>
                          {p.label}
                        </span>
                      </div>
                      {p.w && (
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                          {p.w}×{p.h}
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 -2px" }} />

            {/* Scale slider */}
            <div style={{
              display: "flex", flexDirection: "column", gap: 6,
              opacity: (!isDesktop && isResponsive) ? 0.35 : 1,
              transition: `opacity ${MS.dFast} ${MS.eOut}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Scale
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {Math.round(scale * 100)}%
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="3" width="10" height="7" rx="1.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
                </svg>
                <input
                  type="range" min={0.3} max={1} step={0.01} value={scale}
                  disabled={!isDesktop && isResponsive}
                  onChange={(e) => setScale(Number(e.target.value))}
                  style={{ flex: 1, accentColor: BLUE, cursor: (!isDesktop && isResponsive) ? "not-allowed" : "pointer" }}
                />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="0.5" y="1.5" width="11" height="9" rx="1.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
