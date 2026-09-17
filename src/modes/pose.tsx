/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from "react";
import type { GameMode, Round } from "../types";
import { RecDot, TimerBar } from "./shared";

interface PoseAngles {
  rS: number;
  rE: number;
  lS: number;
  lE: number;
  rH: number;
  lH: number;
}

export interface PoseRound extends Round {
  name: string;
  pose: PoseAngles;
}

export type PoseGuess = PoseAngles;

const R_SHOULDER: [number, number] = [178, 150];
const L_SHOULDER: [number, number] = [122, 150];
const R_HIP: [number, number] = [168, 258];
const L_HIP: [number, number] = [132, 258];
const UPPER_LEN = 58;
const FORE_LEN = 52;
const LEG_LEN = 110;
const HEAD_C: [number, number] = [150, 108];
const HEAD_R = 27;

const NEUTRAL: PoseAngles = { rS: 100, rE: 0, lS: 90, lE: 0, rH: 95, lH: 85 };

const ROUNDS: PoseRound[] = [
  {
    id: "r1",
    name: "Point up",
    pose: { rS: -90, rE: 0, lS: 100, lE: 0, rH: 95, lH: 85 },
  },
  {
    id: "r2",
    name: "Flex",
    pose: { rS: -10, rE: -100, lS: 100, lE: 0, rH: 95, lH: 85 },
  },
  {
    id: "r3",
    name: "Kick",
    pose: { rS: 0, rE: 0, lS: 180, lE: 0, rH: -30, lH: 95 },
  },
  {
    id: "r4",
    name: "Point down",
    pose: { rS: 40, rE: 70, lS: 100, lE: 0, rH: 95, lH: 85 },
  },
];

function polar(
  base: [number, number],
  len: number,
  angDeg: number,
): [number, number] {
  const r = (angDeg * Math.PI) / 180;
  return [base[0] + len * Math.cos(r), base[1] + len * Math.sin(r)];
}

function angDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

function poseJoints(p: PoseAngles) {
  const rElbow = polar(R_SHOULDER, UPPER_LEN, p.rS);
  const rHand = polar(rElbow, FORE_LEN, p.rS + p.rE);
  const lElbow = polar(L_SHOULDER, UPPER_LEN, p.lS);
  const lHand = polar(lElbow, FORE_LEN, p.lS + p.lE);
  const rFoot = polar(R_HIP, LEG_LEN, p.rH);
  const lFoot = polar(L_HIP, LEG_LEN, p.lH);
  return { rElbow, rHand, lElbow, lHand, rFoot, lFoot };
}

function Figure({
  pose,
  stroke,
  strokeWidth = 9,
  dashed = false,
  showBody = true,
}: {
  pose: PoseAngles;
  stroke: string;
  strokeWidth?: number;
  dashed?: boolean;
  showBody?: boolean;
}) {
  const j = poseJoints(pose);
  const dash = dashed ? "6 6" : undefined;
  return (
    <>
      {showBody && (
        <>
          <circle
            cx={HEAD_C[0]}
            cy={HEAD_C[1]}
            r={HEAD_R}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dash}
          />
          <line
            x1={150}
            y1={140}
            x2={150}
            y2={262}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dash}
          />
        </>
      )}
      <line
        x1={R_SHOULDER[0]}
        y1={R_SHOULDER[1]}
        x2={j.rElbow[0]}
        y2={j.rElbow[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <line
        x1={j.rElbow[0]}
        y1={j.rElbow[1]}
        x2={j.rHand[0]}
        y2={j.rHand[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <line
        x1={L_SHOULDER[0]}
        y1={L_SHOULDER[1]}
        x2={j.lElbow[0]}
        y2={j.lElbow[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <line
        x1={j.lElbow[0]}
        y1={j.lElbow[1]}
        x2={j.lHand[0]}
        y2={j.lHand[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <line
        x1={R_HIP[0]}
        y1={R_HIP[1]}
        x2={j.rFoot[0]}
        y2={j.rFoot[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <line
        x1={L_HIP[0]}
        y1={L_HIP[1]}
        x2={j.lFoot[0]}
        y2={j.lFoot[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
    </>
  );
}

function PoseIdle() {
  return (
    <div className="canvas-wrap">
      <div className="absolute inset-0 origin-bottom animate-idle-sway">
        <svg
          viewBox="0 0 300 400"
          className="absolute inset-0 w-full h-full opacity-50"
        >
          <Figure pose={NEUTRAL} stroke="#E2A63B" />
        </svg>
      </div>
    </div>
  );
}

function PosePreview({ round }: { round: PoseRound }) {
  return (
    <div className="canvas-wrap">
      <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full">
        <Figure pose={round.pose} stroke="#E2A63B" />
      </svg>
      <RecDot />
      <TimerBar durationMs={2800} />
    </div>
  );
}

type HandleId = "rElbow" | "rHand" | "lElbow" | "lHand" | "rFoot" | "lFoot";

function PoseGuessInput({
  onSubmit,
}: {
  round: PoseRound;
  onSubmit: (guess: PoseGuess) => void;
}) {
  const [guess, setGuess] = useState<PoseAngles>(NEUTRAL);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<HandleId | null>(null);

  function toSvgPoint(clientX: number, clientY: number): [number, number] {
    const rect = wrapRef.current!.getBoundingClientRect();
    return [
      ((clientX - rect.left) / rect.width) * 300,
      ((clientY - rect.top) / rect.height) * 400,
    ];
  }

  function handlePointerDown(id: HandleId) {
    return (e: React.PointerEvent) => {
      dragId.current = id;
      (e.target as Element).setPointerCapture(e.pointerId);
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const id = dragId.current;
    if (!id) return;
    const [x, y] = toSvgPoint(e.clientX, e.clientY);
    setGuess((prev) => {
      const next = { ...prev };
      if (id === "rElbow") {
        next.rS =
          (Math.atan2(y - R_SHOULDER[1], x - R_SHOULDER[0]) * 180) / Math.PI;
      } else if (id === "rHand") {
        const elbow = polar(R_SHOULDER, UPPER_LEN, prev.rS);
        const abs = (Math.atan2(y - elbow[1], x - elbow[0]) * 180) / Math.PI;
        next.rE = abs - prev.rS;
      } else if (id === "lElbow") {
        next.lS =
          (Math.atan2(y - L_SHOULDER[1], x - L_SHOULDER[0]) * 180) / Math.PI;
      } else if (id === "lHand") {
        const elbow = polar(L_SHOULDER, UPPER_LEN, prev.lS);
        const abs = (Math.atan2(y - elbow[1], x - elbow[0]) * 180) / Math.PI;
        next.lE = abs - prev.lS;
      } else if (id === "rFoot") {
        next.rH = (Math.atan2(y - R_HIP[1], x - R_HIP[0]) * 180) / Math.PI;
      } else if (id === "lFoot") {
        next.lH = (Math.atan2(y - L_HIP[1], x - L_HIP[0]) * 180) / Math.PI;
      }
      return next;
    });
  }

  function handlePointerUp() {
    dragId.current = null;
  }

  const j = poseJoints(guess);
  const handles: { id: HandleId; p: [number, number] }[] = [
    { id: "rElbow", p: j.rElbow },
    { id: "rHand", p: j.rHand },
    { id: "lElbow", p: j.lElbow },
    { id: "lHand", p: j.lHand },
    { id: "rFoot", p: j.rFoot },
    { id: "lFoot", p: j.lFoot },
  ];

  return (
    <div>
      <div ref={wrapRef} className="canvas-wrap touch-none">
        <svg
          viewBox="0 0 300 400"
          className="absolute inset-0 w-full h-full"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <Figure pose={guess} stroke="#EDEDEC" strokeWidth={8} />
          {handles.map((h) => (
            <circle
              key={h.id}
              cx={h.p[0]}
              cy={h.p[1]}
              r={12}
              fill="#E2A63B"
              fillOpacity={0.9}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown(h.id)}
            />
          ))}
        </svg>
      </div>
      <p className="text-center text-muted text-sm mt-3">
        Drag the joints to rebuild the pose.
      </p>
      <div className="flex gap-2.5 justify-center mt-4">
        <button
          className="bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-4.5 py-2.5"
          onClick={() => onSubmit(guess)}
        >
          Lock in pose
        </button>
      </div>
    </div>
  );
}

function PoseResult({ round, guess }: { round: PoseRound; guess: PoseGuess }) {
  return (
    <div className="canvas-wrap">
      <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full">
        <Figure pose={round.pose} stroke="#5FA870" dashed strokeWidth={9} />
        <Figure
          pose={guess}
          stroke="#E2A63B"
          strokeWidth={9}
          showBody={false}
        />
      </svg>
    </div>
  );
}

function computePoseScore(target: PoseAngles, guess: PoseAngles) {
  const diffs = [
    angDiff(guess.rS, target.rS),
    angDiff(guess.rE, target.rE),
    angDiff(guess.lS, target.lS),
    angDiff(guess.lE, target.lE),
    angDiff(guess.rH, target.rH),
    angDiff(guess.lH, target.lH),
  ];
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  return Math.round(Math.max(0, 100 * (1 - avg / 75)));
}

export const poseMode: GameMode<PoseRound, PoseGuess> = {
  id: "pose",
  name: "Pose",
  description:
    "A figure holds a pose for a moment. Rebuild it, joint by joint.",
  rounds: ROUNDS,
  previewDurationMs: 2900,
  renderIdle: () => <PoseIdle />,
  renderPreview: (round) => <PosePreview round={round} />,
  renderGuessInput: (round, onSubmit) => (
    <PoseGuessInput round={round} onSubmit={onSubmit} />
  ),
  renderResult: (round, guess) => <PoseResult round={round} guess={guess} />,
  computeScore: (round, guess) => computePoseScore(round.pose, guess),
};
