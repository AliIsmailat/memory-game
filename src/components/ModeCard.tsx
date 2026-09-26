// // eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { GameMode } from "../types";
import {
  ConstellationIcon,
  GestureIcon,
  CompositionIcon,
  PoseIcon,
  PlayIcon,
} from "./icons/modes";

const MODE_STYLE: Record<string, { bg: string; icon: React.ReactNode }> = {
  constellation: { bg: "#E2A63B", icon: <ConstellationIcon /> },
  gesture: { bg: "#5FA870", icon: <GestureIcon /> },
  composition: { bg: "#7C9CBF", icon: <CompositionIcon /> },
  pose: { bg: "#D64545", icon: <PoseIcon /> },
};

export function ModeCard({
  mode,
  onPlay,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mode: GameMode<any, any>;
  onPlay: () => void;
}) {
  const style = MODE_STYLE[mode.id];

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPlay();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPlay}
      onKeyDown={handleKeyDown}
      aria-label={`Play ${mode.name}`}
      className="group relative h-72 rounded-lg overflow-hidden text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber hover:-translate-y-1 hover:shadow-2xl"
      style={{ transition: "translate 0.6s ease, box-shadow 0.6s ease" }}
    >
      <div className="w-full h-full">
        <div className="transition-transform duration-500 group-hover:scale-110">
          {mode.renderIdle ? (
            mode.renderIdle()
          ) : (
            <div className="canvas-wrap" />
          )}
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

        <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            aria-label={`Play ${mode.name}`}
            tabIndex={-1}
            className="flex items-center gap-2 rounded-full pl-3 pr-2 py-1.5 shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
            style={{ backgroundColor: style?.bg ?? "#E2A63B" }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "#1B1500" }}
            >
              Play
            </span>
            <PlayIcon size={11} color="#1B1500" />
          </button>
        </div>
      </div>
    </div>
  );
}
