import { useEffect, useState, useRef } from "react";

export function TimerDisplay({ durationMs }: { durationMs: number }) {
  const [remaining, setRemaining] = useState(durationMs);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    let raf: number;
    function tick() {
      const elapsed = performance.now() - startRef.current;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      if (left > 0) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);

  return (
    <div className="absolute top-3 right-3 font-mono text-2xl font-bold text-white drop-shadow-md">
      {" "}
      {(remaining / 1000).toFixed(2)}s
    </div>
  );
}
export function GridDots() {
  const positions: number[] = [];
  for (let g = 0.1; g < 1; g += 0.1) positions.push(Math.round(g * 100) / 100);
  return (
    <>
      {positions.map((gx) =>
        positions.map((gy) => (
          <div
            key={`${gx}-${gy}`}
            className="grid-dot"
            style={{ left: `${gx * 100}%`, top: `${gy * 100}%` }}
          />
        )),
      )}
    </>
  );
}

export function TimerBar({ durationMs }: { durationMs: number }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setCollapsed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="timerbar"
      style={{
        transform: collapsed ? "scaleX(0)" : "scaleX(1)",
        transition: collapsed ? `transform ${durationMs}ms linear` : "none",
      }}
    />
  );
}

export function RecDot() {
  return (
    <div className="rec-dot">
      <span className="blip" />
      SHOWING
    </div>
  );
}

const STAGES = ["Ready", "Set", "Go!"];

export function Countdown({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= STAGES.length) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), 1000);
    return () => clearTimeout(timer);
  }, [index, onComplete]);

  return (
    <div className="canvas-wrap flex items-center justify-center">
      <div className="font-mono text-amber text-6xl uppercase tracking-wide">
        {STAGES[index]}
      </div>
    </div>
  );
}

export function CountUp({
  target,
  durationMs = 600,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  durationMs?: number;
  suffix?: string;
  decimals?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(target * t);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}
