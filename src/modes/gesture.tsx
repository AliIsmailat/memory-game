/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import type { GameMode, Round } from "../types";

export interface GestureRound extends Round {
  points: [number, number][];
}

export type GestureGuess = [number, number][];

const ROUNDS: GestureRound[] = [
  {
    id: "r1",
    points: [
      [0.2, 0.7],
      [0.35, 0.3],
      [0.5, 0.65],
      [0.65, 0.25],
      [0.8, 0.6],
    ],
  },
  {
    id: "r2",
    points: [
      [0.25, 0.25],
      [0.6, 0.2],
      [0.75, 0.45],
      [0.55, 0.7],
      [0.3, 0.68],
      [0.35, 0.45],
    ],
  },
  {
    id: "r3",
    points: [
      [0.2, 0.45],
      [0.35, 0.65],
      [0.55, 0.25],
      [0.75, 0.5],
    ],
  },
  {
    id: "r4",
    points: [
      [0.15, 0.5],
      [0.3, 0.3],
      [0.45, 0.6],
      [0.6, 0.3],
      [0.75, 0.6],
      [0.85, 0.4],
    ],
  },
];

function toPath(points: [number, number][]) {
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${(p[0] * 400).toFixed(1)},${(p[1] * 400).toFixed(1)}`,
    )
    .join(" ");
}

function GesturePreview({ round }: { round: GestureRound }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.transition = "none";
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 1.1s ease-out";
      el.style.strokeDashoffset = "0";
    });
  }, [round]);

  return (
    <div className="canvas-wrap">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <path
          ref={pathRef}
          d={toPath(round.points)}
          fill="none"
          stroke="#E2A63B"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function GestureIdle() {
  const wavePath =
    "M0,200 C 50,120 100,280 150,200 C 200,120 250,280 300,200 C 350,120 400,280 400,200";
  return (
    <div className="canvas-wrap">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <path
          d={wavePath}
          fill="none"
          stroke="#E2A63B"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.5}
          pathLength={100}
          strokeDasharray="30 70"
          className="animate-idle-dash"
        />
      </svg>
    </div>
  );
}

function GestureGuessInput({
  onSubmit,
  onRestart,
  confirmingRestart,
}: {
  round: GestureRound;
  onSubmit: (guess: GestureGuess) => void;
  onRestart: () => void;
  confirmingRestart: boolean;
}) {
  const [points, setPoints] = useState<GestureGuess>([]);
  const drawing = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  function getFrac(clientX: number, clientY: number): [number, number] {
    const rect = wrapRef.current!.getBoundingClientRect();
    return [
      (clientX - rect.left) / rect.width,
      (clientY - rect.top) / rect.height,
    ];
  }

  function handlePointerDown(e: React.PointerEvent) {
    drawing.current = true;
    setPoints([getFrac(e.clientX, e.clientY)]);
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!drawing.current) return;
    setPoints((prev) => [...prev, getFrac(e.clientX, e.clientY)]);
  }
  function handlePointerUp() {
    drawing.current = false;
  }

  return (
    <div
      ref={wrapRef}
      className="canvas-wrap touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <path
          d={toPath(points)}
          fill="none"
          stroke="#E2A63B"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 p-3 bg-linear-to-t from-black/70 via-black/30 to-transparent rounded-b-lg"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span className="text-white text-xs font-mono select-none pointer-events-none">
          Draw the shape
        </span>
        <div className="flex gap-2">
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
            className="bg-white/10 text-white border border-white/20 text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer transition hover:bg-white/20 active:scale-95"
            onClick={() => setPoints([])}
          >
            Clear
          </button>
          <button
            className="bg-amber text-[#1B1500] text-xs font-semibold rounded-full px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition hover:brightness-110 active:scale-95"
            disabled={points.length < 3}
            onClick={() => onSubmit(points)}
          >
            Lock in
          </button>
        </div>
      </div>
    </div>
  );
}

function GestureResult({
  round,
  guess,
}: {
  round: GestureRound;
  guess: GestureGuess;
}) {
  return (
    <div className="canvas-wrap">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <path
          d={toPath(round.points)}
          fill="none"
          stroke="#5FA870"
          strokeWidth={4}
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={toPath(guess)}
          fill="none"
          stroke="#E2A63B"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function pathLen(points: [number, number][]) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(
      points[i][0] - points[i - 1][0],
      points[i][1] - points[i - 1][1],
    );
  }
  return len;
}

function resample(points: [number, number][], n: number): [number, number][] {
  if (points.length < 2) return new Array(n).fill(points[0] ?? [0, 0]);
  const total = pathLen(points);
  if (total === 0) return new Array(n).fill(points[0]);
  const step = total / (n - 1);
  const out: [number, number][] = [points[0]];
  let acc = 0;
  let i = 1;
  let prev = points[0];
  while (out.length < n && i < points.length) {
    const cur = points[i];
    const segLen = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    if (acc + segLen >= step) {
      const t = (step - acc) / segLen;
      const nx = prev[0] + (cur[0] - prev[0]) * t;
      const ny = prev[1] + (cur[1] - prev[1]) * t;
      out.push([nx, ny]);
      prev = [nx, ny];
      acc = 0;
    } else {
      acc += segLen;
      prev = cur;
      i++;
    }
  }
  while (out.length < n) out.push(points[points.length - 1]);
  return out;
}

function computeGestureScore(target: [number, number][], guess: GestureGuess) {
  const targetPx = target.map(
    (p) => [p[0] * 400, p[1] * 400] as [number, number],
  );
  const guessPx = guess.map(
    (p) => [p[0] * 400, p[1] * 400] as [number, number],
  );
  const n = 24;
  const rt = resample(targetPx, n);
  const ru = resample(guessPx, n);
  let sum = 0;
  for (let i = 0; i < n; i++)
    sum += Math.hypot(rt[i][0] - ru[i][0], rt[i][1] - ru[i][1]);
  const avg = sum / n;
  return Math.max(0, 100 * (1 - avg / 110));
}

export const gestureMode: GameMode<GestureRound, GestureGuess> = {
  id: "gesture",
  name: "Gesture",
  description: "A shape gets drawn, then disappears. Redraw it from memory.",
  rounds: ROUNDS,
  previewDurationMs: 5000,
  renderIdle: () => <GestureIdle />,
  renderPreview: (round) => <GesturePreview round={round} />,
  renderGuessInput: (round, onSubmit, onRestart, confirmingRestart) => (
    <GestureGuessInput
      round={round}
      onSubmit={onSubmit}
      onRestart={onRestart}
      confirmingRestart={confirmingRestart}
    />
  ),
  renderResult: (round, guess) => <GestureResult round={round} guess={guess} />,
  computeScore: (round, guess) => computeGestureScore(round.points, guess),
};
