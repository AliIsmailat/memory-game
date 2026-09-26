import { useState } from "react";
import { SunIcon, MoonIcon, StarIcon, CloudIcon } from "./icons/theme";
import { BrainLogoIcon } from "./icons/logo";
import type { GameMode } from "../types";

interface NavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modes: GameMode<any, any>[];
  activeModeId: string | null;
  onSelectMode: (id: string) => void;
  onGoHome: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="theme-toggle-btn relative w-16 h-8 rounded-full overflow-hidden transition-colors duration-300 shrink-0"
      style={{
        boxShadow: isDark
          ? "0 0 0 2px color-mix(in srgb, var(--color-amber) 65%, transparent)"
          : "0 0 0 2px color-mix(in srgb, var(--color-amber) 75%, transparent)",
        background: isDark
          ? "linear-gradient(90deg, var(--color-stage-deep), color-mix(in srgb, var(--color-stage) 70%, var(--color-amber) 15%))"
          : "linear-gradient(90deg, color-mix(in srgb, var(--color-amber) 55%, var(--color-panel)), color-mix(in srgb, var(--color-amber) 30%, var(--color-panel)))",
      }}
    >
      {isDark && (
        <>
          <span className="absolute" style={{ top: "6px", left: "8px" }}>
            <StarIcon size={17} color="rgba(255,255,255,0.75)" />
          </span>
        </>
      )}

      {!isDark && (
        <>
          <span className="absolute" style={{ top: "5px", left: "35px" }}>
            <CloudIcon
              size={13}
              color="color-mix(in srgb, var(--color-panel) 90%, white)"
            />
          </span>
          <span className="absolute" style={{ top: "13px", left: "47px" }}>
            <CloudIcon
              size={9}
              color="color-mix(in srgb, var(--color-panel) 90%, white)"
            />
          </span>
        </>
      )}

      <span
        className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out"
        style={{
          background: isDark ? "var(--color-panel)" : "var(--color-panel)",
          transform: isDark ? "translateX(32px)" : "translateX(0)",
          boxShadow: isDark
            ? "0 0 10px 2px color-mix(in srgb, var(--color-text) 30%, transparent)"
            : "0 0 10px 2px color-mix(in srgb, var(--color-amber) 50%, transparent)",
        }}
      >
        {isDark ? (
          <MoonIcon size={16} color="#D7DBE8" />
        ) : (
          <SunIcon size={16} color="var(--color-amber)" />
        )}
      </span>
    </button>
  );
}

function HamburgerIcon({ open, size = 22 }: { open: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {open ? (
        <path
          d="M6 6L18 18M6 18L18 6"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 6h16M4 12h16M4 18h16"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function Navbar({
  modes,
  activeModeId,
  onSelectMode,
  onGoHome,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoColor = theme === "dark" ? "var(--color-amber)" : "#000000";

  function handleSelect(id: string) {
    setMenuOpen(false);
    onSelectMode(id);
  }

  function handleGoHome() {
    setMenuOpen(false);
    onGoHome();
  }

  return (
    <nav className="relative flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 cursor-pointer min-w-0"
        >
          <BrainLogoIcon
            size={38}
            color={logoColor}
            strokeColor={logoColor}
            strokeWidth={18}
          />
          <span className="font-semibold text-text truncate">Memory Game</span>
        </button>
      </div>

      <div className="hidden md:flex gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`nav-link ${m.id === activeModeId ? "active" : ""}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden text-text p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 md:hidden bg-[var(--color-panel)] border-b border-border flex flex-col p-2 gap-1 z-50 shadow-lg">
            {modes.map((m) => {
              const isActive = m.id === activeModeId;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m.id)}
                  className={`text-left rounded-lg px-3 py-2 font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-amber text-[#1B1500]"
                      : "text-text hover:bg-white/10"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}
