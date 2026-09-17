// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const sunY = theme === "dark" ? 120 : 0;
  const moonY = theme === "dark" ? 0 : 120;

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="nav-btn relative w-9 h-9 rounded-md border border-border overflow-hidden"
    >
      <span
        className="absolute inset-0 flex items-center justify-center text-lg transition-transform duration-300 ease-in"
        style={{ transform: `translateY(${sunY}%)` }}
      >
        ☀️
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center text-lg transition-transform duration-300 ease-in"
        style={{ transform: `translateY(${moonY}%)` }}
      >
        🌙
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
