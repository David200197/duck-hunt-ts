import type { GameObj, StateComp } from "kaplay";
import { Injectable } from "../../kozmoplay/decorators/injectable";
import { InjectK } from "../../kozmoplay/decorators/inject-k";
import type { Kaplay } from "../../kozmoplay/interfaces/kaplay";

type GameManagerData = GameObj<
  | StateComp
  | {
      isGamePaused: boolean;
      currentScore: number;
      currentRoundNb: number;
      currentHuntNb: number;
      nbBulletLeft: number;
      nbDucksShutInRound: number;
      preySpeed: number;
      resetGameState(this: GameObj): void;
    }
>;

@Injectable()
export class GameManager {
  data: GameManagerData;

  constructor(@InjectK() k: Kaplay) {
    this.data = k.add([
      k.state("menu", [
        "menu",
        "round-start",
        "round-end",
        "hunt-start",
        "hunt-end",
        "duck-hunted",
        "duck-escaped",
      ]),
      {
        isGamePaused: false,
        currentScore: 0,
        currentRoundNb: 0,
        currentHuntNb: 0,
        nbBulletLeft: 3,
        nbDucksShutInRound: 0,
        preySpeed: 100,
        resetGameState(this: GameObj) {
          this.isGamePaused = false;
          this.currentScore = 0;
          this.currentRoundNb = 0;
          this.currentHuntNb = 0;
          this.nbBulletLeft = 3;
          this.nbDucksShutInRound = 0;
          this.preySpeed = 100;
        },
      },
    ]);
  }
}
