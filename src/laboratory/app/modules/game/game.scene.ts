import { COLORS, fontConfig } from "../../../../constants";
import { InjectK } from "../../../kozmoplay/decorators/inject-k";
import { Scene } from "../../../kozmoplay/decorators/scene";
import type { Kaplay } from "../../../kozmoplay/interfaces/kaplay";
import type { SceneManager } from "../../../kozmoplay/interfaces/scene-manager";
import { formatScore } from "../../core/utils/formatScore";
import type { DogMaker } from "./dog.maker";
import type { DuckMaker } from "./duck.maker";
import type { GameManager } from "./game.manager";

@Scene("game")
export class GameScene implements SceneManager {
  private readonly k: Kaplay;
  private readonly gameManager: GameManager;
  private readonly dogMaker: DogMaker;
  private readonly duckMaker: DuckMaker;

  constructor(
    @InjectK() k: Kaplay,
    gameManager: GameManager,
    dogMaker: DogMaker,
    duckMaker: DuckMaker
  ) {
    this.k = k;
    this.gameManager = gameManager;
    this.dogMaker = dogMaker;
    this.duckMaker = duckMaker;
  }

  load() {
    const k = this.k;
    const gameManager = this.gameManager.data;

    k.setCursor("none");
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("background"), k.pos(0, -10), k.z(1)]);

    const score = k.add([
      k.text(formatScore(0, 6), fontConfig),
      k.pos(192, 197),
      k.z(2),
    ]);

    const roundCount = k.add([
      k.text("1", fontConfig),
      k.pos(42, 181.5),
      k.z(2),
      k.color(COLORS.RED),
    ]);

    const duckIcons = k.add([k.pos(95, 198)]);
    for (let i = 0; i < 10; i++) {
      duckIcons.add([
        k.rect(7, 9),
        k.pos(1 + 8 * i, 0),
        k.color(255, 255, 255),
        `duckIcon-${i}`,
      ]);
    }

    const bulletUIMask = k.add([
      k.rect(0, 8),
      k.pos(25, 198),
      k.z(2),
      k.color(0, 0, 0),
    ]);

    const dog = this.dogMaker.make(k.vec2(0, k.center().y));
    dog.searchForDucks();

    const roundStartController = gameManager.onStateEnter(
      "round-start",
      async (isFirstRound: boolean) => {
        if (!isFirstRound) gameManager.preySpeed += 50;
        k.play("ui-appear");
        gameManager.currentRoundNb++;
        roundCount.text = String(gameManager.currentRoundNb);
        const textBox = k.add([
          k.sprite("text-box"),
          k.anchor("center"),
          k.pos(k.center().x, k.center().y),
          k.z(2),
        ]);
        textBox.add([
          k.text("ROUND", fontConfig),
          k.anchor("center"),
          k.pos(0, -10),
        ]);
        textBox.add([
          k.text(String(gameManager.currentRoundNb), fontConfig),
          k.anchor("center"),
          k.pos(0, 4),
        ]);

        await k.wait(1);

        k.destroy(textBox);
        gameManager.enterState("hunt-start");
      }
    );

    const roundEndController = gameManager.onStateEnter("round-end", () => {
      if (gameManager.nbDucksShutInRound < 6) return k.go("game-over");
      if (gameManager.nbDucksShutInRound === 10)
        gameManager.currentScore += 500;

      gameManager.nbDucksShutInRound = 0;
      for (const duckIcon of duckIcons.children) {
        duckIcon.use(k.color(255, 255, 255));
      }

      gameManager.enterState("round-start");
    });

    const huntStartController = gameManager.onStateEnter("hunt-start", () => {
      gameManager.currentHuntNb++;
      const duck = this.duckMaker.make(
        String(gameManager.currentHuntNb - 1),
        gameManager.preySpeed
      );
      duck.setBehavior();
    });

    const huntEndController = gameManager.onStateEnter("hunt-end", () => {
      const bestScore = k.getData<number>("best-score") || 0;

      if (bestScore < gameManager.currentScore)
        k.setData("best-score", gameManager.currentScore);

      if (gameManager.currentHuntNb <= 9)
        return gameManager.enterState("hunt-start");

      gameManager.currentHuntNb = 0;
      gameManager.enterState("round-end");
    });

    const duckHuntedController = gameManager.onStateEnter(
      "duck-hunted",
      async () => {
        gameManager.nbBulletLeft = 3;
        await dog.catchFallenDuck();
      }
    );

    const duckEscapedController = gameManager.onStateEnter(
      "duck-escaped",
      async () => {
        dog.mockPlayer();
      }
    );

    const cursor = k.add([
      k.sprite("cursor"),
      k.anchor("center"),
      k.pos(),
      k.z(3),
    ]);

    k.onClick(() => {
      if (gameManager.state === "hunt-start" && !gameManager.isGamePaused) {
        if (gameManager.nbBulletLeft > 0) {
          k.play("gun-shot", { volume: 0.5 });
          gameManager.nbBulletLeft--;
        }
      }
    });

    k.onUpdate(() => {
      score.text = formatScore(gameManager.currentScore, 6);

      const nbBulletLeftsToBulletUIMaskWidthMap: Record<number, number> = {
        3: 0,
        2: 8,
        1: 15,
        0: 21,
      };

      bulletUIMask.width =
        nbBulletLeftsToBulletUIMaskWidthMap[gameManager.nbBulletLeft] || 0;

      cursor.moveTo(k.mousePos());
    });

    const forestAmbianceSound = k.play("forest-ambiance", {
      volume: 0.1,
      loop: true,
    });

    k.onSceneLeave(() => {
      forestAmbianceSound.stop();
      roundStartController.cancel();
      roundEndController.cancel();
      huntStartController.cancel();
      huntEndController.cancel();
      duckHuntedController.cancel();
      duckEscapedController.cancel();
      gameManager.resetGameState();
    });

    k.onKeyPress("enter", () => {
      k.getTreeRoot().paused = !k.getTreeRoot().paused;
      gameManager.isGamePaused = k.getTreeRoot().paused;
      if (gameManager.isGamePaused) {
        //@ts-ignore
        audioCtx.suspend();
        k.add([
          k.text("PAUSED", fontConfig),
          k.pos(5, 5),
          k.z(3),
          "paused-text",
        ]);
        return;
      }
      //@ts-ignore
      audioCtx.resume();

      const pausedText = k.get("paused-text")[0];
      if (pausedText) k.destroy(pausedText);
    });
  }
}
