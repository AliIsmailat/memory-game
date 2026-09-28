/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import type { GameMode, Round } from "../types";
import { GridDots } from "./shared";

export interface GestureRound extends Round {
  points: [number, number][];
}

export type GestureGuess = [number, number][];

// -- Procedural shape generation --------------------------------------------
// Points stay within a margined square (clear of the edges and the bottom
// control bar), keep a minimum distance from every other point (not just
// their neighbor in the sequence), never let a new segment cross an earlier
// one, and never turn by less than MIN_ANGLE_DEG at an interior joint (which
// would otherwise read as one long near-straight line instead of a distinct
// shape).

const MARGIN_X = 0.18;
const MARGIN_TOP = 0.15;
const MARGIN_BOTTOM = 0.32;
const MIN_DIST = 0.16;
const MIN_ANGLE_DEG = 35;
const MAX_ATTEMPTS_PER_POINT = 200;
const MAX_ATTEMPTS_PER_SHAPE = 200;

function pointDist(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function segmentsIntersect(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number],
) {
  const ccw = (a: [number, number], b: [number, number], c: [number, number]) =>
    (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);
  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
}

function angleAt(
  a: [number, number],
  b: [number, number],
  c: [number, number],
) {
  const v1 = [a[0] - b[0], a[1] - b[1]];
  const v2 = [c[0] - b[0], c[1] - b[1]];
  const n1 = Math.hypot(v1[0], v1[1]);
  const n2 = Math.hypot(v2[0], v2[1]);
  if (n1 === 0 || n2 === 0) return 180;
  const cosA = Math.max(
    -1,
    Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (n1 * n2)),
  );
  return (Math.acos(cosA) * 180) / Math.PI;
}

function tryGenerateShape(nPoints: number): [number, number][] | null {
  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_SHAPE; attempt++) {
    const pts: [number, number][] = [];
    let ok = true;

    for (let i = 0; i < nPoints; i++) {
      let placed = false;
      for (let t = 0; t < MAX_ATTEMPTS_PER_POINT; t++) {
        const cand: [number, number] = [
          MARGIN_X + Math.random() * (1 - 2 * MARGIN_X),
          MARGIN_TOP + Math.random() * (1 - MARGIN_TOP - MARGIN_BOTTOM),
        ];

        if (pts.some((p) => pointDist(cand, p) < MIN_DIST)) continue;

        if (pts.length >= 1) {
          const prev = pts[pts.length - 1];
          let crosses = false;
          for (let j = 0; j < pts.length - 2; j++) {
            if (segmentsIntersect(prev, cand, pts[j], pts[j + 1])) {
              crosses = true;
              break;
            }
          }
          if (crosses) continue;
        }

        if (pts.length >= 2) {
          const angle = angleAt(pts[pts.length - 2], pts[pts.length - 1], cand);
          if (angle < MIN_ANGLE_DEG) continue;
        }

        pts.push(cand);
        placed = true;
        break;
      }
      if (!placed) {
        ok = false;
        break;
      }
    }

    if (ok && pts.length === nPoints) return pts;
  }
  return null;
}

const FALLBACK_SHAPES: [number, number][][] = [
  [
    [0.2, 0.7],
    [0.35, 0.3],
    [0.5, 0.65],
    [0.65, 0.25],
  ],
  [
    [0.25, 0.25],
    [0.6, 0.2],
    [0.75, 0.55],
    [0.35, 0.6],
  ],
];

// Always 4 points for now. A future "hard mode" can raise this (5-6 points)
// for extra difficulty without changing anything else here.
const POINTS_PER_SHAPE = 4;

function randomShape(): [number, number][] {
  return (
    tryGenerateShape(POINTS_PER_SHAPE) ??
    FALLBACK_SHAPES[Math.floor(Math.random() * FALLBACK_SHAPES.length)]
  );
}

const ROUND_COUNT = 4;

// Rounds are built fresh each time a session starts (see regenerateRounds
// below), so a brand new set of shapes is generated on every Play / Restart.
function buildRounds(): GestureRound[] {
  return Array.from({ length: ROUND_COUNT }, (_, i) => ({
    id: `r${i + 1}`,
    points: randomShape(),
  }));
}

function UndoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <GridDots />
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
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [previewEnd, setPreviewEnd] = useState<[number, number] | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  function getFrac(clientX: number, clientY: number): [number, number] {
    const rect = wrapRef.current!.getBoundingClientRect();
    return [
      (clientX - rect.left) / rect.width,
      (clientY - rect.top) / rect.height,
    ];
  }

  function handlePointerDown(e: React.PointerEvent) {
    const pos = getFrac(e.clientX, e.clientY);
    setDragStart(pos);
    setPreviewEnd(pos);
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragStart) return;
    setPreviewEnd(getFrac(e.clientX, e.clientY));
  }

  function handlePointerUp() {
    if (!dragStart || !previewEnd) return;
    setPoints((prev) =>
      prev.length === 0 ? [dragStart, previewEnd] : [...prev, previewEnd],
    );
    setDragStart(null);
    setPreviewEnd(null);
  }

  const displayPoints =
    dragStart && previewEnd
      ? [
          ...points,
          ...(points.length === 0 ? [dragStart, previewEnd] : [previewEnd]),
        ]
      : points;

  function handleUndo() {
    setPoints((prev) => (prev.length <= 2 ? [] : prev.slice(0, -1)));
  }

  return (
    <div
      ref={wrapRef}
      className="canvas-wrap touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <GridDots />
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <path
          d={toPath(displayPoints)}
          fill="none"
          stroke="#E2A63B"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end sm:justify-between gap-3 p-3 bg-linear-to-t from-black/70 via-black/30 to-transparent rounded-b-lg pointer-events-none">
        <span className="hidden sm:inline text-white text-xs font-mono select-none pointer-events-none">
          Draw one straight segment at a time
        </span>
        <div
          className="flex gap-2 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={onRestart}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer transition select-none min-w-23 text-center ${
              confirmingRestart
                ? "bg-rec text-white"
                : "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95"
            }`}
          >
            {confirmingRestart ? "You sure?" : "Restart"}
          </button>
          <button
            className="bg-white/10 text-white border border-white/20 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition hover:bg-white/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed select-none"
            onClick={handleUndo}
            disabled={points.length === 0}
            aria-label="Undo last stroke"
          >
            <UndoIcon size={15} />
          </button>
          <button
            className="bg-white/10 text-white border border-white/20 text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer transition hover:bg-white/20 active:scale-95 select-none"
            onClick={() => setPoints([])}
          >
            Clear
          </button>
          <button
            className="bg-amber text-[#1B1500] text-xs font-semibold rounded-full px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition hover:brightness-110 active:scale-95 select-none"
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
      <GridDots />
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
  const tolerancePx = 10;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const dist = Math.hypot(rt[i][0] - ru[i][0], rt[i][1] - ru[i][1]);
    sum += Math.max(0, dist - tolerancePx);
  }
  const avg = sum / n;
  return Math.max(0, 100 * (1 - avg / 170));
}

export const gestureMode: GameMode<GestureRound, GestureGuess> = {
  id: "gesture",
  name: "Gesture",
  description: "A shape gets drawn, then disappears. Redraw it from memory.",
  rounds: buildRounds(),
  regenerateRounds: buildRounds,
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
