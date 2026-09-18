// src/types/game.ts

export interface Round {
  id: string;
}

export interface GameResult {
  roundId: string;
  score: number; // 0-100
}

export interface GameMode<TRound extends Round = Round, TGuess = unknown> {
  id: string;
  name: string;
  description: string;
  rounds: TRound[];
  previewDurationMs?: number;

  renderIdle?: () => React.ReactNode;
  renderPreview: (round: TRound) => React.ReactNode;
  renderGuessInput: (
    round: TRound,
    onSubmit: (guess: TGuess) => void,
    onRestart: () => void,
    confirmingRestart: boolean,
  ) => React.ReactNode;
  renderResult?: (round: TRound, guess: TGuess, score: number) => React.ReactNode;
  computeScore: (round: TRound, guess: TGuess) => number;
}