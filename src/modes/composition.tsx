/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from "react";
import type { GameMode, Round } from "../types";
import { RecDot, TimerBar } from "./shared";

interface Rect {
  x: number;
  y: number;
  s: number;
}

export interface CompositionRound extends Round {
  scene: () => React.ReactNode;
  rect: Rect;
}

export interface CompositionGuess {
  x: number;
  y: number;
}
function randomRect(): Rect {
  const s = 0.45 + Math.random() * 0.25;
  const x = Math.random() * (1 - s);
  const y = Math.random() * (1 - s);
  return { x, y, s };
}

function CafeScene() {
  return (
    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="cafeBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2c22" />
          <stop offset="1" stopColor="#171210" />
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#cafeBg)" />
      <rect
        x="340"
        y="0"
        width="160"
        height="500"
        fill="#5a4632"
        opacity="0.5"
      />
      <rect
        x="365"
        y="40"
        width="110"
        height="180"
        fill="#caa876"
        opacity="0.35"
      />
      <ellipse cx="180" cy="360" rx="120" ry="26" fill="#241a12" />
      <rect x="120" y="260" width="130" height="16" rx="7" fill="#6b4c31" />
      <circle cx="120" cy="240" r="38" fill="#caa876" />
      <path d="M84 268 Q120 335 156 268 Z" fill="#caa876" />
      <ellipse cx="215" cy="285" rx="11" ry="8" fill="#e8e3d8" />
      <rect x="209" y="288" width="13" height="11" fill="#e8e3d8" />
    </svg>
  );
}

function HorizonScene() {
  return (
    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="horizonBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b3350" />
          <stop offset="0.6" stopColor="#c98a4a" />
          <stop offset="1" stopColor="#4a3324" />
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#horizonBg)" />
      <circle cx="360" cy="150" r="36" fill="#f4d78a" />
      <polygon
        points="0,320 100,220 180,300 260,180 360,310 500,220 500,500 0,500"
        fill="#1c1712"
        opacity="0.85"
      />
    </svg>
  );
}

function PortraitScene() {
  return (
    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="portraitBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5c5348" />
          <stop offset="1" stopColor="#232019" />
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#portraitBg)" />
      <ellipse cx="330" cy="560" rx="130" ry="120" fill="#d8c6ad" />
      <circle cx="330" cy="260" r="70" fill="#e6d4ba" />
    </svg>
  );
}

function StreetScene() {
  return (
    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="streetBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4250" />
          <stop offset="1" stopColor="#161a20" />
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#streetBg)" />
      <rect x="0" y="140" width="110" height="360" fill="#232a33" />
      <rect x="120" y="70" width="90" height="430" fill="#2b323c" />
      <rect x="215" y="200" width="70" height="300" fill="#1d232b" />
      <polygon points="0,500 500,500 500,360 0,400" fill="#0e1116" />
      <rect x="370" y="240" width="5" height="150" fill="#c9c2b0" />
      <circle cx="372" cy="235" r="11" fill="#f4d78a" opacity="0.85" />
      <circle cx="410" cy="390" r="8" fill="#100e0c" />
      <rect x="402" y="398" width="16" height="35" fill="#100e0c" />
    </svg>
  );
}
const SCENES = [CafeScene, HorizonScene, PortraitScene, StreetScene];
const ROUNDS: CompositionRound[] = SCENES.map((scene, i) => ({
  id: `r${i + 1}`,
  scene,
  rect: randomRect(),
}));

function CompositionIdle() {
  return (
    <div className="canvas-wrap">
      <div className="absolute inset-0 animate-idle-pan opacity-60">
        <CafeScene />
      </div>
    </div>
  );
}

function CompositionPreview({ round }: { round: CompositionRound }) {
  const { rect, scene: Scene } = round;
  return (
    <div className="canvas-wrap">
      <div
        className="absolute"
        style={{
          width: `${100 / rect.s}%`,
          height: `${100 / rect.s}%`,
          left: `${(-rect.x / rect.s) * 100}%`,
          top: `${(-rect.y / rect.s) * 100}%`,
        }}
      >
        <Scene />
      </div>
      <RecDot />
      <TimerBar durationMs={2800} />
    </div>
  );
}

function CompositionGuessInput({
  round,
  onSubmit,
}: {
  round: CompositionRound;
  onSubmit: (guess: CompositionGuess) => void;
}) {
  const s = round.rect.s;
  const [pos, setPos] = useState<CompositionGuess>({
    x: 0.5 - s / 2,
    y: 0.5 - s / 2,
  });
  const dragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const Scene = round.scene;

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    start.current = { x: pos.x, y: pos.y, px: e.clientX, py: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const rect = wrapRef.current!.getBoundingClientRect();
    const dx = (e.clientX - start.current.px) / rect.width;
    const dy = (e.clientY - start.current.py) / rect.height;
    setPos({
      x: Math.max(0, Math.min(1 - s, start.current.x + dx)),
      y: Math.max(0, Math.min(1 - s, start.current.y + dy)),
    });
  }
  function handlePointerUp() {
    dragging.current = false;
  }

  return (
    <div>
      <div ref={wrapRef} className="canvas-wrap touch-none">
        <Scene />
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute border-2 border-amber bg-amber/15 cursor-grab active:cursor-grabbing"
          style={{
            left: `${pos.x * 100}%`,
            top: `${pos.y * 100}%`,
            width: `${s * 100}%`,
            height: `${s * 100}%`,
          }}
        />
      </div>
      <p className="text-center text-muted text-sm mt-3">
        Drag the frame to where you remember it.
      </p>
      <div className="flex gap-2.5 justify-center mt-4">
        <button
          className="bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-4.5 py-2.5"
          onClick={() => onSubmit(pos)}
        >
          Lock in guess
        </button>
      </div>
    </div>
  );
}

function CompositionResult({
  round,
  guess,
}: {
  round: CompositionRound;
  guess: CompositionGuess;
}) {
  const { rect, scene: Scene } = round;
  return (
    <div className="canvas-wrap">
      <Scene />
      <div
        className="absolute border-2 border-good border-dashed pointer-events-none"
        style={{
          left: `${rect.x * 100}%`,
          top: `${rect.y * 100}%`,
          width: `${rect.s * 100}%`,
          height: `${rect.s * 100}%`,
        }}
      />
      <div
        className="absolute border-2 border-amber bg-amber/10 pointer-events-none"
        style={{
          left: `${guess.x * 100}%`,
          top: `${guess.y * 100}%`,
          width: `${rect.s * 100}%`,
          height: `${rect.s * 100}%`,
        }}
      />
    </div>
  );
}

function computeCompositionScore(target: Rect, guess: CompositionGuess) {
  const s = target.s;
  const ix1 = Math.max(target.x, guess.x);
  const iy1 = Math.max(target.y, guess.y);
  const ix2 = Math.min(target.x + s, guess.x + s);
  const iy2 = Math.min(target.y + s, guess.y + s);
  const iw = Math.max(0, ix2 - ix1);
  const ih = Math.max(0, iy2 - iy1);
  const inter = iw * ih;
  const union = s * s * 2 - inter;
  const iou = union > 0 ? inter / union : 0;
  return Math.round(iou * 100);
}

export const compositionMode: GameMode<CompositionRound, CompositionGuess> = {
  id: "composition",
  name: "Composition",
  description:
    "A photo appears already framed. Rebuild the exact crop from memory.",
  rounds: ROUNDS,
  previewDurationMs: 2900,
  renderIdle: () => <CompositionIdle />,
  renderPreview: (round) => <CompositionPreview round={round} />,
  renderGuessInput: (round, onSubmit) => (
    <CompositionGuessInput round={round} onSubmit={onSubmit} />
  ),
  renderResult: (round, guess) => (
    <CompositionResult round={round} guess={guess} />
  ),
  computeScore: (round, guess) => computeCompositionScore(round.rect, guess),
};
