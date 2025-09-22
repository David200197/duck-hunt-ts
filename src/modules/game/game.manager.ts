import { Injectable } from "../../kozmoplay/decorators/injectable";
import { InjectK } from "../../kozmoplay/decorators/inject-k";
import type { Kaplay } from "../../kozmoplay/interfaces/kaplay";
import type { StateComp } from "kaplay";

@Injectable()
export class GameManager {
  k: Kaplay;
  isGamePaused = false;
  currentScore = 0;
  currentRoundNb = 0;
  currentHuntNb = 0;
  nbBulletLeft = 3;
  nbDucksShutInRound = 0;
  preySpeed = 100;
  state: StateComp;

  resetGameState() {
    this.isGamePaused = false;
    this.currentScore = 0;
    this.currentRoundNb = 0;
    this.currentHuntNb = 0;
    this.nbBulletLeft = 3;
    this.nbDucksShutInRound = 0;
    this.preySpeed = 100;
  }

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
    this.state = this.createState();
  }

  private createState() {
    return this.k.state("menu", [
      "menu",
      "round-start",
      "round-end",
      "hunt-start",
      "hunt-end",
      "duck-hunted",
      "duck-escaped",
    ]);
  }
}
