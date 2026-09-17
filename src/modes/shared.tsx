import { useEffect, useState } from "react";

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

export function Countdown({
  seconds,
  onComplete,
}: {
  seconds: number;
  onComplete: () => void;
}) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="canvas-wrap flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted text-sm mb-2">Get ready</p>
        <div className="font-mono text-amber text-6xl">{count}</div>
      </div>
    </div>
  );
}
