import { SunIcon, MoonIcon, StarIcon, CloudIcon } from "./icons";
import type { GameMode } from "../types";

interface NavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modes: GameMode<any, any>[];
  activeModeId: string;
  onSelectMode: (id: string) => void;
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
      className="relative w-16 h-8 rounded-full overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? "linear-gradient(90deg, var(--color-stage-deep), var(--color-stage))"
          : "linear-gradient(90deg, color-mix(in srgb, var(--color-amber) 35%, var(--color-panel)), color-mix(in srgb, var(--color-amber) 15%, var(--color-panel)))",
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
          <span className="absolute" style={{ top: "5px", left: "32px" }}>
            <CloudIcon
              size={13}
              color="color-mix(in srgb, var(--color-panel) 90%, white)"
            />
          </span>
          <span className="absolute" style={{ top: "13px", left: "43px" }}>
            <CloudIcon
              size={11}
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

export function Navbar({
  modes,
  activeModeId,
  onSelectMode,
  theme,
  onToggleTheme,
}: NavbarProps) {
  return (
    <nav className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-amber flex items-center justify-center text-[#1B1500] font-bold text-sm">
          M
        </div>
        <span className="font-semibold text-text">Memory Game</span>
      </div>

      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={
              m.id === activeModeId
                ? "nav-btn bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-4 py-2"
                : "nav-btn bg-transparent text-muted border border-border text-sm font-semibold rounded-md px-4 py-2 transition-colors hover:text-text hover:border-amber"
            }
          >
            {m.name}
          </button>
        ))}
      </div>

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </nav>
  );
}
