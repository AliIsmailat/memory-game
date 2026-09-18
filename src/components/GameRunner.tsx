import { useEffect, useState } from "react";
import type { GameMode, Round } from "../types";
import { Countdown, TimerDisplay, TimerBar, CountUp } from "../modes/shared";
import { PlayIcon } from "./icons";

type Phase = "idle" | "countdown" | "preview" | "guess" | "result" | "final";

interface GameRunnerProps<TRound extends Round, TGuess> {
  mode: GameMode<TRound, TGuess>;
}

export function GameRunner<TRound extends Round, TGuess>({
  mode,
}: GameRunnerProps<TRound, TGuess>) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scores, setScores] = useState<number[]>([]);
  const [lastScore, setLastScore] = useState(0);
  const [lastGuess, setLastGuess] = useState<TGuess | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [confirmingRestart, setConfirmingRestart] = useState(false);

  const round = mode.rounds[roundIndex];
  const previewMs = mode.previewDurationMs ?? 3000;

  useEffect(() => {
    if (phase !== "preview") return;
    const timer = setTimeout(() => setPhase("guess"), previewMs);
    return () => clearTimeout(timer);
  }, [phase, roundIndex, previewMs]);

  function handleRestartClick() {
    if (confirmingRestart) {
      handleRestart();
      setConfirmingRestart(false);
    } else {
      setConfirmingRestart(true);
      setTimeout(() => setConfirmingRestart(false), 2500);
    }
  }

  function handlePlay() {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setPhase("countdown");
    }, 600);
  }

  function handleSubmit(guess: TGuess) {
    const score = mode.computeScore(round, guess);
    setScores((prev) => [...prev, score]);
    setLastScore(score);
    setLastGuess(guess);
    setPhase("result");
  }

  function handleNext() {
    if (roundIndex + 1 >= mode.rounds.length) {
      setPhase("final");
    } else {
      setRoundIndex((prev) => prev + 1);
      setPhase("countdown");
    }
  }

  function handleRestart() {
    setRoundIndex(0);
    setScores([]);
    setPhase("idle");
  }

  const total = scores.reduce((a, b) => a + b, 0);
  const average = scores.length ? total / scores.length : 0;

  return (
    <div className="flex flex-col items-center px-4 pt-7 pb-15">
      <div className="w-full max-w-145">
        {phase === "idle" && (
          <div className="relative">
            {mode.renderIdle ? (
              mode.renderIdle()
            ) : (
              <div className="canvas-wrap" />
            )}

            <div className="absolute top-0 left-0 p-6 text-left flex flex-col gap-2">
              <h2 className="text-5xl font-bold text-white">{mode.name}</h2>
              <p className="text-amber text-xl font-medium max-w-[24ch]">
                {mode.description}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
              <button
                onClick={handlePlay}
                disabled={isLaunching}
                className={`play-btn bg-amber text-[#1B1500] text-sm font-semibold rounded-4xl px-6 py-3 shadow-lg hover:cursor-pointer flex items-center justify-between gap-4 min-w-25 ${isLaunching ? "firing" : ""}`}
              >
                Play
                <PlayIcon size={14} color="#1B1500" />
              </button>
            </div>
          </div>
        )}

        {phase === "countdown" && (
          <Countdown onComplete={() => setPhase("preview")} />
        )}

        {(phase === "preview" || phase === "guess" || phase === "result") && (
          <div className="relative">
            {phase === "preview" && (
              <div className="relative">
                {mode.renderPreview(round)}
                <TimerBar durationMs={previewMs} />
                <TimerDisplay durationMs={previewMs} />
              </div>
            )}

            {phase === "guess" && (
              <div>
                {mode.renderGuessInput(
                  round,
                  handleSubmit,
                  handleRestartClick,
                  confirmingRestart,
                )}
              </div>
            )}

            {phase === "result" && (
              <div>
                {mode.renderResult &&
                  lastGuess !== null &&
                  mode.renderResult(round, lastGuess, lastScore)}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 bg-linear-to-t from-black/70 via-black/30 to-transparent rounded-b-lg">
                  <div className="font-mono text-white leading-none select-none pointer-events-none">
                    <span className="text-3xl font-bold">
                      <CountUp target={lastScore} decimals={2} />
                    </span>{" "}
                    <span className="text-xs text-white/70 ml-1">/100</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRestartClick}
                      className={`font-mono text-xs rounded-full px-3 py-1.5 cursor-pointer transition select-none ${
                        confirmingRestart
                          ? "bg-rec text-white"
                          : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {confirmingRestart ? "You sure?" : "Restart"}
                    </button>
                    <button
                      onClick={handleNext}
                      className="play-btn bg-amber text-[#1B1500] text-sm font-semibold rounded-4xl px-5 py-2.5 shadow-lg hover:cursor-pointer"
                    >
                      {roundIndex + 1 >= mode.rounds.length
                        ? "See results"
                        : "Next round"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute top-3 left-3 font-mono text-sm font-light text-white drop-shadow-md pointer-events-none">
              {roundIndex + 1}/{mode.rounds.length}
            </div>
          </div>
        )}

        {phase === "final" && (
          <div className="relative">
            {mode.renderIdle ? (
              mode.renderIdle()
            ) : (
              <div className="canvas-wrap" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 rounded-lg">
              <div className="font-mono text-4xl font-bold text-amber">
                <CountUp target={average} suffix="/100" decimals={2} />
              </div>
              <p className="text-white/80 text-sm">average score out of 100</p>
              <button
                onClick={handleRestart}
                className="play-btn bg-amber text-[#1B1500] text-sm font-semibold rounded-4xl px-6 py-3 shadow-lg hover:cursor-pointer mt-2"
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
