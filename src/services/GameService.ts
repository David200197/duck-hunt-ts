import k from "../kaplayCtx";
import type { GameManager, GameState } from "../types/game";
import { GAME_CONFIG } from "../config";

export class GameService {
  private manager: GameManager;
  private static instance: GameService;
  private constructor() {
    this.manager = this.initGameManager();
  }

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  getScore(): number {
    return this.manager.currentScore;
  }

  getRound(): number {
    return this.manager.currentRoundNb;
  }

  getBullets(): number {
    return this.manager.nbBulletLeft;
  }

  isGameOver(): boolean {
    return this.manager.isGamePaused;
  }

  shoot(): void {
    if (this.manager.nbBulletLeft > 0) {
      this.manager.nbBulletLeft--;
      k.play("gun-shot");
    }
  }

  private initGameManager(): GameManager {
    const gameState = {
      isGamePaused: false,
      currentScore: 0,
      currentRoundNb: 0,
      currentHuntNb: 0,
      nbBulletLeft: GAME_CONFIG.maxBullets,
      nbDucksShutInRound: 0,
      preySpeed: GAME_CONFIG.duckInitialSpeed,
      resetGameState(this: GameManager) {
        this.isGamePaused = false;
        this.currentScore = 0;
        this.currentRoundNb = 0;
        this.currentHuntNb = 0;
        this.nbBulletLeft = GAME_CONFIG.maxBullets;
        this.nbDucksShutInRound = 0;
        this.preySpeed = GAME_CONFIG.duckInitialSpeed;
      },
    };

    return k.add([
      k.state("menu", [
        "menu",
        "round-start",
        "round-end",
        "hunt-start",
        "hunt-end",
        "duck-hunted",
        "duck-escaped",
      ] as GameState[]),
      gameState,
    ]) as GameManager;
  }

  getManager(): GameManager {
    return this.manager;
  }

  resetGame() {
    this.manager.resetGameState();
  }

  increaseDuckSpeed() {
    this.manager.preySpeed += 50;
  }

  addScore(points: number) {
    this.manager.currentScore += points;
  }

  getBestScore(): number {
    return k.getData<number>("best-score") || 0;
  }

  updateBestScore() {
    const bestScore = this.getBestScore();
    if (bestScore < this.manager.currentScore) {
      k.setData("best-score", this.manager.currentScore);
    }
  }

  isRoundComplete(): boolean {
    return this.manager.currentHuntNb >= GAME_CONFIG.maxRound;
  }

  isPerfectRound(): boolean {
    return this.manager.nbDucksShutInRound === GAME_CONFIG.maxRound;
  }

  canAdvanceToNextRound(): boolean {
    return this.manager.nbDucksShutInRound >= GAME_CONFIG.minDucksToPass;
  }
}