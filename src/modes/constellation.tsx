/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import type { GameMode, Round } from "../types";
import { GridDots, TimerBar, RecDot } from "./shared";

export interface ConstellationRound extends Round {
  points: [number, number][];
}

export type ConstellationGuess = [number, number][];

const ROUNDS: ConstellationRound[] = [
  {
    id: "r1",
    points: [
      [0.22, 0.3],
      [0.68, 0.2],
      [0.5, 0.55],
      [0.78, 0.72],
      [0.2, 0.75],
    ],
  },
  {
    id: "r2",
    points: [
      [0.3, 0.65],
      [0.62, 0.72],
      [0.45, 0.35],
      [0.8, 0.3],
      [0.18, 0.22],
    ],
  },
  {
    id: "r3",
    points: [
      [0.5, 0.18],
      [0.75, 0.45],
      [0.6, 0.78],
      [0.28, 0.68],
      [0.24, 0.38],
    ],
  },
  {
    id: "r4",
    points: [
      [0.35, 0.22],
      [0.72, 0.28],
      [0.7, 0.62],
      [0.42, 0.78],
      [0.18, 0.5],
    ],
  },
];

function ConstellationPreview({ round }: { round: ConstellationRound }) {
  return (
    <div className="canvas-wrap">
      <GridDots />
      {round.points.map((p, i) => (
        <div
          key={i}
          className="target-dot"
          style={{ left: `${p[0] * 100}%`, top: `${p[1] * 100}%` }}
        />
      ))}
      <RecDot />
      <TimerBar durationMs={2800} />
    </div>
  );
}

function ConstellationIdle() {
  const [stars] = useState(() =>
    Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 2,
      size: 3 + Math.random() * 5,
    })),
  );

  return (
    <div className="canvas-wrap">
      <GridDots />
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber"
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            width: s.size,
            height: s.size,
            marginLeft: -s.size / 2,
            marginTop: -s.size / 2,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
function ConstellationGuessInput({
  onSubmit,
}: {
  round: ConstellationRound;
  onSubmit: (guess: ConstellationGuess) => void;
}) {
  const [guesses, setGuesses] = useState<ConstellationGuess>([]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (guesses.length >= 5) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGuesses((prev) => [...prev, [x, y]]);
  }

  function handleUndo() {
    setGuesses((prev) => prev.slice(0, -1));
  }

  return (
    <div>
      <div className="canvas-wrap" onClick={handleClick}>
        <GridDots />
        {guesses.map((p, i) => (
          <div
            key={i}
            className="guess-dot"
            style={{ left: `${p[0] * 100}%`, top: `${p[1] * 100}%` }}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <p className="text-center text-muted text-sm mt-3">
        {guesses.length}/5 placed. Click in the box.
      </p>
      <div className="flex gap-2.5 justify-center mt-4">
        <button
          className="bg-transparent text-text border border-border text-sm font-semibold rounded-md px-4.5 py-2.5"
          onClick={handleUndo}
        >
          Undo last
        </button>
        <button
          className="bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-4.5 py-2.5 disabled:opacity-40"
          disabled={guesses.length !== 5}
          onClick={() => onSubmit(guesses)}
        >
          Lock in guess
        </button>
      </div>
    </div>
  );
}

function dist(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function matchPairs(targets: [number, number][], guesses: ConstellationGuess) {
  const remaining = targets.map((p, i) => ({ p, i }));
  const pairs: {
    guess: [number, number];
    target: [number, number];
    d: number;
  }[] = [];
  guesses.forEach((g) => {
    let bestIdx = -1;
    let bestDist = Infinity;
    remaining.forEach((t, ri) => {
      const d = dist(g, t.p);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = ri;
      }
    });
    if (bestIdx > -1) {
      pairs.push({ guess: g, target: remaining[bestIdx].p, d: bestDist });
      remaining.splice(bestIdx, 1);
    }
  });
  return pairs;
}

function ConstellationResult({
  round,
  guess,
}: {
  round: ConstellationRound;
  guess: ConstellationGuess;
}) {
  const pairs = matchPairs(round.points, guess);
  return (
    <div className="canvas-wrap">
      <GridDots />
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {pairs.map((pr, i) => (
          <line
            key={i}
            x1={`${pr.guess[0] * 100}%`}
            y1={`${pr.guess[1] * 100}%`}
            x2={`${pr.target[0] * 100}%`}
            y2={`${pr.target[1] * 100}%`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
        ))}
      </svg>
      {round.points.map((p, i) => (
        <div
          key={`t-${i}`}
          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-dashed border-good"
          style={{ left: `${p[0] * 100}%`, top: `${p[1] * 100}%` }}
        />
      ))}
      {guess.map((p, i) => (
        <div
          key={`g-${i}`}
          className="guess-dot"
          style={{ left: `${p[0] * 100}%`, top: `${p[1] * 100}%` }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

function scoreFromPairs(pairs: ReturnType<typeof matchPairs>) {
  const avg = pairs.reduce((s, p) => s + p.d, 0) / pairs.length;
  const diag = Math.hypot(1, 1);
  return Math.round(Math.max(0, 100 * (1 - avg / (diag * 0.35))));
}

export const constellationMode: GameMode<
  ConstellationRound,
  ConstellationGuess
> = {
  id: "constellation",
  name: "Constellation",
  description: "Five points, three seconds. Click them back where they were.",
  rounds: ROUNDS,
  previewDurationMs: 2900,
  renderIdle: () => <ConstellationIdle />,
  renderPreview: (round) => <ConstellationPreview round={round} />,
  renderGuessInput: (round, onSubmit) => (
    <ConstellationGuessInput round={round} onSubmit={onSubmit} />
  ),
  renderResult: (round, guess) => (
    <ConstellationResult round={round} guess={guess} />
  ),
  computeScore: (round, guess) =>
    scoreFromPairs(matchPairs(round.points, guess)),
};
