/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import type { GameMode, Round } from "../types";
import { GridDots } from "./shared";

export interface ConstellationRound extends Round {
  points: [number, number][];
}

export type ConstellationGuess = [number, number][];

// -- Procedural point generation ---------------------------------------------
// Points stay within a margined square (clear of the edges) and keep a
// minimum distance from every other point, so no two targets ever land close
// enough to be indistinguishable when clicking them back.

const MARGIN = 0.16;
const MIN_DIST = 0.22;
// Always 4 points for now. A future "hard mode" can raise this (e.g. 5-6)
// for extra difficulty without changing anything else here.
const POINTS_PER_ROUND = 4;
const MAX_ATTEMPTS_PER_POINT = 200;
const MAX_ATTEMPTS_PER_SET = 200;

function pointDist(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function tryGeneratePoints(n: number): [number, number][] | null {
  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_SET; attempt++) {
    const pts: [number, number][] = [];
    let ok = true;

    for (let i = 0; i < n; i++) {
      let placed = false;
      for (let t = 0; t < MAX_ATTEMPTS_PER_POINT; t++) {
        const cand: [number, number] = [
          MARGIN + Math.random() * (1 - 2 * MARGIN),
          MARGIN + Math.random() * (1 - 2 * MARGIN),
        ];
        if (pts.some((p) => pointDist(cand, p) < MIN_DIST)) continue;
        pts.push(cand);
        placed = true;
        break;
      }
      if (!placed) {
        ok = false;
        break;
      }
    }

    if (ok && pts.length === n) return pts;
  }
  return null;
}

const FALLBACK_POINT_SETS: [number, number][][] = [
  [
    [0.22, 0.3],
    [0.68, 0.2],
    [0.5, 0.55],
    [0.78, 0.72],
  ],
  [
    [0.3, 0.65],
    [0.62, 0.72],
    [0.45, 0.35],
    [0.8, 0.3],
  ],
];

function randomPoints(): [number, number][] {
  return (
    tryGeneratePoints(POINTS_PER_ROUND) ??
    FALLBACK_POINT_SETS[Math.floor(Math.random() * FALLBACK_POINT_SETS.length)]
  );
}

const ROUND_COUNT = 4;

// Rounds are built fresh each time a session starts (see regenerateRounds
// below), so a brand new set of points is generated on every Play / Restart.
function buildRounds(): ConstellationRound[] {
  return Array.from({ length: ROUND_COUNT }, (_, i) => ({
    id: `r${i + 1}`,
    points: randomPoints(),
  }));
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
    </div>
  );
}

function ConstellationGuessInput({
  onSubmit,
  onRestart,
  confirmingRestart,
}: {
  round: ConstellationRound;
  onSubmit: (guess: ConstellationGuess) => void;
  onRestart: () => void;
  confirmingRestart: boolean;
}) {
  const [guesses, setGuesses] = useState<ConstellationGuess>([]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (guesses.length >= POINTS_PER_ROUND) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGuesses((prev) => [...prev, [x, y]]);
  }

  function handleUndo() {
    setGuesses((prev) => prev.slice(0, -1));
  }

  return (
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

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 p-3 bg-linear-to-t from-black/70 via-black/30 to-transparent rounded-b-lg pointer-events-none">
        <span className="text-white text-xs font-mono select-none pointer-events-none">
          {guesses.length}/{POINTS_PER_ROUND} placed
        </span>
        <div
          className="flex gap-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onRestart}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer transition select-none ${
              confirmingRestart
                ? "bg-rec text-white"
                : "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95"
            }`}
          >
            {confirmingRestart ? "You sure?" : "Restart"}
          </button>
          <button
            className="bg-white/10 text-white border border-white/20 text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer transition hover:bg-white/20 active:scale-95 select-none"
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            className="bg-amber text-[#1B1500] text-xs font-semibold rounded-full px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition hover:brightness-110 active:scale-95 select-none"
            disabled={guesses.length !== POINTS_PER_ROUND}
            onClick={() => onSubmit(guesses)}
          >
            Lock in
          </button>
        </div>
      </div>
    </div>
  );
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
      const d = pointDist(g, t.p);
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
  return Math.max(0, 100 * (1 - avg / (diag * 0.35)));
}

export const constellationMode: GameMode<
  ConstellationRound,
  ConstellationGuess
> = {
  id: "constellation",
  name: "Constellation",
  description: "Five points, three seconds. Click them back where they were.",
  rounds: buildRounds(),
  regenerateRounds: buildRounds,
  previewDurationMs: 2900,
  renderIdle: () => <ConstellationIdle />,
  renderPreview: (round) => <ConstellationPreview round={round} />,
  renderGuessInput: (round, onSubmit, onRestart, confirmingRestart) => (
    <ConstellationGuessInput
      round={round}
      onSubmit={onSubmit}
      onRestart={onRestart}
      confirmingRestart={confirmingRestart}
    />
  ),
  renderResult: (round, guess) => (
    <ConstellationResult round={round} guess={guess} />
  ),
  computeScore: (round, guess) =>
    scoreFromPairs(matchPairs(round.points, guess)),
};
