// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { GameMode } from "../types";
import { ModeCard } from "../components/ModeCard";

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
