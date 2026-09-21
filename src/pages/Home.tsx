// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { GameMode } from "../types";

const MODE_STYLE: Record<string, { bg: string; icon: React.ReactNode }> = {
  constellation: {
    bg: "#E2A63B",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="4" cy="15" r="1.6" fill="#1B1500" />
        <circle cx="16" cy="4" r="1.6" fill="#1B1500" />
        <circle cx="12" cy="12" r="1.6" fill="#1B1500" />
        <path
          d="M4 15 L12 12 L16 4"
          stroke="#1B1500"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  gesture: {
    bg: "#5FA870",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 15 C6 6, 9 18, 12 9 C14 4, 16 12, 17 6"
          stroke="#0E2314"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  composition: {
    bg: "#7C9CBF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 2v12a1 1 0 0 0 1 1h12M4 6h12a1 1 0 0 1 1 1v12"
          stroke="#12202E"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  pose: {
    bg: "#D64545",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="4" r="2" fill="#2B0E0E" />
        <path
          d="M10 6v6M10 8l-5 3M10 8l5-2M10 12l-3 6M10 12l3 6"
          stroke="#2B0E0E"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

function ModeCard({
  mode,
  onPlay,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mode: GameMode<any, any>;
  onPlay: () => void;
}) {
  const style = MODE_STYLE[mode.id];

  return (
    <button
      onClick={onPlay}
      className="group relative h-64 rounded-lg overflow-hidden text-left cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
      style={{ transition: "translate 0.3s ease, box-shadow 0.6s ease" }}
    >
      <div className="transition-transform duration-500 group-hover:scale-110">
        {mode.renderIdle ? mode.renderIdle() : <div className="canvas-wrap" />}
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/5 to-black/25 pointer-events-none" />

      <div className="absolute top-0 left-0 p-5 pointer-events-none">
        <div className="flex items-center gap-2.5 mb-2">
          {style && (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              style={{ backgroundColor: style.bg }}
            >
              {style.icon}
            </div>
          )}
          <h3 className="text-2xl font-bold text-white drop-shadow-md">
            {mode.name}
          </h3>
        </div>
        <p className="text-amber text-sm font-medium max-w-[22ch] drop-shadow-md">
          {mode.description}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white text-xs font-mono opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        Play &rarr;
      </div>
    </button>
  );
}

export function Home({
  modes,
  onSelectMode,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modes: GameMode<any, any>[];
  onSelectMode: (id: string) => void;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-10 pb-16">
      <p className="text-muted text-sm mb-6">
        Simple memory, reflex and perception games.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        {modes.map((m) => (
          <ModeCard key={m.id} mode={m} onPlay={() => onSelectMode(m.id)} />
        ))}
      </div>
    </div>
  );
}
