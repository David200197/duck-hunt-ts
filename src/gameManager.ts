import type { GameObj } from "kaplay";
import k from "./kaplayCtx";

export const makeGameManager = () => {
  return k.add([
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
};

const gameManager = makeGameManager();
export default gameManager;
