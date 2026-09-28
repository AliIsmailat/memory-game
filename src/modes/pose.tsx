/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from "react";
import type { GameMode, Round } from "../types";

// Each limb is one straight segment controlled by a single angle:
// rS / lS = right / left arm (from the shoulder), rH / lH = right / left leg
// (from the hip). 0 = pointing right, 90 = pointing down, -90 = pointing up.
interface PoseAngles {
  rS: number;
  lS: number;
  rH: number;
  lH: number;
}

export interface PoseRound extends Round {
  name: string;
  pose: PoseAngles;
}

export type PoseGuess = PoseAngles;

type Point = [number, number];
type Segment = [Point, Point];

const R_SHOULDER: Point = [178, 120];
const L_SHOULDER: Point = [122, 120];
const R_HIP: Point = [168, 228];
const L_HIP: Point = [132, 228];
const ARM_LEN = 110;
const LEG_LEN = 110;
const HEAD_C: Point = [150, 78];
const HEAD_R = 27;
const TORSO: Segment = [
  [150, 110],
  [150, 232],
];

// Arms hang slightly outward and the legs start close together.
const NEUTRAL: PoseAngles = { rS: 85, lS: 95, rH: 95, lH: 85 };

function polar(base: Point, len: number, angDeg: number): Point {
  const r = (angDeg * Math.PI) / 180;
  return [base[0] + len * Math.cos(r), base[1] + len * Math.sin(r)];
}

function angDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

function poseJoints(p: PoseAngles) {
  return {
    rHand: polar(R_SHOULDER, ARM_LEN, p.rS),
    lHand: polar(L_SHOULDER, ARM_LEN, p.lS),
    rFoot: polar(R_HIP, LEG_LEN, p.rH),
    lFoot: polar(L_HIP, LEG_LEN, p.lH),
  };
}

// -- Procedural pose generation ----------------------------------------------
// A pose is only used if no two body parts overlap: every pair of parts
// (torso, both arms, both legs) keeps a minimum distance, no limb touches the
// head, and the draggable handles stay far enough apart to be clickable.
// Poses are also re-rolled if they end up too close to the neutral stance,
// so every round is a distinct pose rather than a barely-changed one.

const ARM_RANGE: [number, number] = [-180, 180];
const HIP_RANGE: [number, number] = [-60, 150];
const MIN_AVG_DEVIATION_FROM_NEUTRAL = 30;
// Distances are in the same SVG units as the figure (300x400). Strokes are
// about 9 wide, so a 16 centerline gap leaves a visible gap between parts.
const MIN_HANDLE_DIST = 34;
const MIN_PART_GAP = 16;
const HEAD_GAP = 16;
const MAX_ATTEMPTS = 1000;

function distPointToSegment(pt: Point, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(pt[0] - a[0], pt[1] - a[1]);
  const t = Math.max(
    0,
    Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / lengthSq),
  );
  return Math.hypot(pt[0] - (a[0] + t * dx), pt[1] - (a[1] + t * dy));
}

function segmentsIntersect(a1: Point, a2: Point, b1: Point, b2: Point) {
  const ccw = (a: Point, b: Point, c: Point) =>
    (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);
  return (
    ccw(a1, b1, b2) !== ccw(a2, b1, b2) && ccw(a1, a2, b1) !== ccw(a1, a2, b2)
  );
}

function segmentDistance(a: Segment, b: Segment): number {
  if (segmentsIntersect(a[0], a[1], b[0], b[1])) return 0;
  return Math.min(
    distPointToSegment(a[0], b[0], b[1]),
    distPointToSegment(a[1], b[0], b[1]),
    distPointToSegment(b[0], a[0], a[1]),
    distPointToSegment(b[1], a[0], a[1]),
  );
}

function poseParts(pose: PoseAngles) {
  const j = poseJoints(pose);
  return {
    torso: TORSO,
    rArm: [R_SHOULDER, j.rHand] as Segment,
    lArm: [L_SHOULDER, j.lHand] as Segment,
    rLeg: [R_HIP, j.rFoot] as Segment,
    lLeg: [L_HIP, j.lFoot] as Segment,
  };
}

function handlesFarEnough(pose: PoseAngles): boolean {
  const j = poseJoints(pose);
  const pts = [j.rHand, j.lHand, j.rFoot, j.lFoot];
  for (let i = 0; i < pts.length; i++) {
    for (let k = i + 1; k < pts.length; k++) {
      if (
        Math.hypot(pts[i][0] - pts[k][0], pts[i][1] - pts[k][1]) <
        MIN_HANDLE_DIST
      ) {
        return false;
      }
    }
  }
  return true;
}

function partsDoNotOverlap(pose: PoseAngles): boolean {
  const parts = Object.values(poseParts(pose));
  for (let i = 0; i < parts.length; i++) {
    for (let k = i + 1; k < parts.length; k++) {
      if (segmentDistance(parts[i], parts[k]) < MIN_PART_GAP) return false;
    }
  }
  return true;
}

function clearsHead(pose: PoseAngles): boolean {
  const { rArm, lArm, rLeg, lLeg } = poseParts(pose);
  return [rArm, lArm, rLeg, lLeg].every(
    ([a, b]) => distPointToSegment(HEAD_C, a, b) >= HEAD_R + HEAD_GAP,
  );
}

function randInRange([min, max]: [number, number]) {
  return min + Math.random() * (max - min);
}

function tryGeneratePose(): PoseAngles | null {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const pose: PoseAngles = {
      rS: randInRange(ARM_RANGE),
      lS: randInRange(ARM_RANGE),
      rH: randInRange(HIP_RANGE),
      lH: randInRange(HIP_RANGE),
    };

    const avgDeviation =
      (angDiff(pose.rS, NEUTRAL.rS) +
        angDiff(pose.lS, NEUTRAL.lS) +
        angDiff(pose.rH, NEUTRAL.rH) +
        angDiff(pose.lH, NEUTRAL.lH)) /
      4;

    if (
      avgDeviation >= MIN_AVG_DEVIATION_FROM_NEUTRAL &&
      handlesFarEnough(pose) &&
      partsDoNotOverlap(pose) &&
      clearsHead(pose)
    ) {
      return pose;
    }
  }
  return null;
}

const FALLBACK_POSES: PoseAngles[] = [
  { rS: -60, lS: -120, rH: 70, lH: 110 },
  { rS: -20, lS: 110, rH: 60, lH: 100 },
  { rS: 0, lS: 180, rH: 75, lH: 105 },
];

function randomPose(): PoseAngles {
  return (
    tryGeneratePose() ??
    FALLBACK_POSES[Math.floor(Math.random() * FALLBACK_POSES.length)]
  );
}

const ROUND_COUNT = 4;

// Rounds are built fresh each time a session starts (see regenerateRounds
// below), so a brand new set of poses is generated on every Play / Restart.
function buildRounds(): PoseRound[] {
  return Array.from({ length: ROUND_COUNT }, (_, i) => ({
    id: `r${i + 1}`,
    name: `Pose ${i + 1}`,
    pose: randomPose(),
  }));
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
  const limbs: Segment[] = [
    [R_SHOULDER, j.rHand],
    [L_SHOULDER, j.lHand],
    [R_HIP, j.rFoot],
    [L_HIP, j.lFoot],
  ];
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
            x1={TORSO[0][0]}
            y1={TORSO[0][1]}
            x2={TORSO[1][0]}
            y2={TORSO[1][1]}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dash}
          />
        </>
      )}
      {limbs.map(([a, b], i) => (
        <line
          key={i}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dash}
        />
      ))}
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
    </div>
  );
}

type HandleId = "rHand" | "lHand" | "rFoot" | "lFoot";

function PoseGuessInput({
  onSubmit,
  onRestart,
  confirmingRestart,
}: {
  round: PoseRound;
  onSubmit: (guess: PoseGuess) => void;
  onRestart: () => void;
  confirmingRestart: boolean;
}) {
  const [guess, setGuess] = useState<PoseAngles>(NEUTRAL);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<HandleId | null>(null);

  function toSvgPoint(clientX: number, clientY: number): Point {
    const rect = wrapRef.current!.getBoundingClientRect();
    return [
      ((clientX - rect.left) / rect.width) * 300,
      ((clientY - rect.top) / rect.height) * 400,
    ];
  }

  function angleFrom(origin: Point, x: number, y: number) {
    return (Math.atan2(y - origin[1], x - origin[0]) * 180) / Math.PI;
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
      if (id === "rHand") next.rS = angleFrom(R_SHOULDER, x, y);
      else if (id === "lHand") next.lS = angleFrom(L_SHOULDER, x, y);
      else if (id === "rFoot") next.rH = angleFrom(R_HIP, x, y);
      else if (id === "lFoot") next.lH = angleFrom(L_HIP, x, y);
      return next;
    });
  }

  function handlePointerUp() {
    dragId.current = null;
  }

  const j = poseJoints(guess);
  const handles: { id: HandleId; p: Point }[] = [
    { id: "rHand", p: j.rHand },
    { id: "lHand", p: j.lHand },
    { id: "rFoot", p: j.rFoot },
    { id: "lFoot", p: j.lFoot },
  ];

  return (
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
            r={14}
            fill="#E2A63B"
            fillOpacity={0.9}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown(h.id)}
          />
        ))}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 p-3 bg-linear-to-t from-black/70 via-black/30 to-transparent rounded-b-lg pointer-events-none">
        <span className="text-white text-xs font-mono select-none pointer-events-none">
          Drag the joints
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
            className="bg-amber text-[#1B1500] text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer transition hover:brightness-110 active:scale-95 select-none"
            onClick={() => onSubmit(guess)}
          >
            Lock in
          </button>
        </div>
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

// An angle error below POSE_TOLERANCE_DEG counts as zero for that limb (15
// degrees is roughly a 29 unit miss at the hand or foot). Beyond that, the
// average error over the four limbs lowers the score linearly, reaching 0 at
// POSE_FALLOFF_DEG of average excess error.
const POSE_TOLERANCE_DEG = 15;
const POSE_FALLOFF_DEG = 70;

function computePoseScore(target: PoseAngles, guess: PoseAngles) {
  const excess = [
    angDiff(guess.rS, target.rS),
    angDiff(guess.lS, target.lS),
    angDiff(guess.rH, target.rH),
    angDiff(guess.lH, target.lH),
  ].map((d) => Math.max(0, d - POSE_TOLERANCE_DEG));
  const avg = excess.reduce((a, b) => a + b, 0) / excess.length;
  return Math.max(0, 100 * (1 - avg / POSE_FALLOFF_DEG));
}

export const poseMode: GameMode<PoseRound, PoseGuess> = {
  id: "pose",
  name: "Pose",
  description:
    "A figure holds a pose for a moment. Rebuild it, joint by joint.",
  rounds: buildRounds(),
  regenerateRounds: buildRounds,
  previewDurationMs: 5000,
  renderIdle: () => <PoseIdle />,
  renderPreview: (round) => <PosePreview round={round} />,
  renderGuessInput: (round, onSubmit, onRestart, confirmingRestart) => (
    <PoseGuessInput
      round={round}
      onSubmit={onSubmit}
      onRestart={onRestart}
      confirmingRestart={confirmingRestart}
    />
  ),
  renderResult: (round, guess) => <PoseResult round={round} guess={guess} />,
  computeScore: (round, guess) => computePoseScore(round.pose, guess),
};
