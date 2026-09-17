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

  // Renderas under "visa"-fasen (facit synligt en kort stund)
  renderPreview: (round: TRound) => React.ReactNode;

  // Renderas under "gissa"-fasen (spelaren interagerar)
  renderGuessInput: (round: TRound, onSubmit: (guess: TGuess) => void) => React.ReactNode;

  // Räknar ut poäng 0-100 utifrån spelarens gissning
  computeScore: (round: TRound, guess: TGuess) => number;
}

export interface GameMode<TRound extends Round = Round, TGuess = unknown> {
  id: string;
  name: string;
  description: string;
  rounds: TRound[];
  previewDurationMs?: number; // ny rad, default 3000 om utelämnad

  renderPreview: (round: TRound) => React.ReactNode;
  renderGuessInput: (round: TRound, onSubmit: (guess: TGuess) => void) => React.ReactNode;
  computeScore: (round: TRound, guess: TGuess) => number;
}

export interface GameMode<TRound extends Round = Round, TGuess = unknown> {
  id: string;
  name: string;
  description: string;
  rounds: TRound[];
  previewDurationMs?: number;

  renderPreview: (round: TRound) => React.ReactNode;
  renderGuessInput: (round: TRound, onSubmit: (guess: TGuess) => void) => React.ReactNode;
  renderResult?: (round: TRound, guess: TGuess, score: number) => React.ReactNode;
  computeScore: (round: TRound, guess: TGuess) => number;
}

export interface GameMode<TRound extends Round = Round, TGuess = unknown> {
  id: string;
  name: string;
  description: string;
  rounds: TRound[];
  previewDurationMs?: number;

  renderIdle?: () => React.ReactNode;
  renderPreview: (round: TRound) => React.ReactNode;
  renderGuessInput: (round: TRound, onSubmit: (guess: TGuess) => void) => React.ReactNode;
  renderResult?: (round: TRound, guess: TGuess, score: number) => React.ReactNode;
  computeScore: (round: TRound, guess: TGuess) => number;
}