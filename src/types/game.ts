import type { Vec2, GameObj } from "kaplay";

export type GameState = 
  | "menu"
  | "round-start"
  | "round-end"
  | "hunt-start"
  | "hunt-end"
  | "duck-hunted"
  | "duck-escaped";

export type DogState = "search" | "snif" | "detect" | "jump" | "drop";

export type DogInstance = GameObj & {
  speed: number;
  searchForDucks: () => void;
  slideUpAndDown: () => Promise<void>;
  catchFallenDuck: () => Promise<void>;
  mockPlayer: () => Promise<void>;
};

export type DuckState = "fly" | "shot" | "fall";

export type DuckInstance = GameObj & {
  flyTimer: number;
  timeBeforeEscape: number;
  duckId: string;
  flyDirections: Vec2 | null;
  speed: number;
  quackingSound: any;
  flappingSound: any;
  fallSound: any;
  setBehavior: () => void;
};

export type GameManager = GameObj & {
  isGamePaused: boolean;
  currentScore: number;
  currentRoundNb: number;
  currentHuntNb: number;
  nbBulletLeft: number;
  nbDucksShutInRound: number;
  preySpeed: number;
  resetGameState: () => void;
};