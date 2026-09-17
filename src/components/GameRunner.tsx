import { useEffect, useState } from "react";
import type { GameMode, Round } from "../types";
import { Countdown } from "../modes/shared";

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

  const round = mode.rounds[roundIndex];
  const previewMs = mode.previewDurationMs ?? 3000;

  useEffect(() => {
    if (phase !== "preview") return;
    const timer = setTimeout(() => setPhase("guess"), previewMs);
    return () => clearTimeout(timer);
  }, [phase, roundIndex, previewMs]);

  function handlePlay() {
    setPhase("countdown");
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
  const average = scores.length ? Math.round(total / scores.length) : 0;

  return (
    <div className="flex flex-col items-center px-4 pt-7 pb-15">
      {phase !== "idle" && phase !== "final" && (
        <div className="flex gap-4 items-center mb-4.5 font-mono text-sm text-muted">
          <span>
            ROUND <b className="text-text">{roundIndex + 1}</b>/
            {mode.rounds.length}
          </span>
          <span>
            SCORE <b className="text-text">{total}</b>
          </span>
        </div>
      )}

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
                className="bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-6 py-3 shadow-lg"
              >
                Play
              </button>
            </div>
          </div>
        )}

        {phase === "countdown" && (
          <Countdown seconds={5} onComplete={() => setPhase("preview")} />
        )}

        {phase === "preview" && <div>{mode.renderPreview(round)}</div>}

        {phase === "guess" && (
          <div>{mode.renderGuessInput(round, handleSubmit)}</div>
        )}

        {phase === "result" && (
          <div className="text-center">
            {mode.renderResult && lastGuess !== null && (
              <div className="mb-4">
                {mode.renderResult(round, lastGuess, lastScore)}
              </div>
            )}
            <div className="font-mono text-2xl text-amber">{lastScore}</div>
            <p className="text-muted text-sm mb-4">points out of 100</p>
            <button
              onClick={handleNext}
              className="bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-4.5 py-2.5"
            >
              {roundIndex + 1 >= mode.rounds.length
                ? "See results"
                : "Next round"}
            </button>
          </div>
        )}

        {phase === "final" && (
          <div className="text-center">
            <div className="font-mono text-4xl text-amber">{average}</div>
            <p className="text-muted text-sm mb-4">average score out of 100</p>
            <button
              onClick={handleRestart}
              className="bg-amber text-[#1B1500] text-sm font-semibold rounded-md px-4.5 py-2.5"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
