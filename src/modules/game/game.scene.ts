import { Inject } from "../../kozmoplay/decorators/inject";
import { InjectK } from "../../kozmoplay/decorators/inject-k";
import { Scene } from "../../kozmoplay/decorators/scene";
import type { Kaplay } from "../../kozmoplay/interfaces/kaplay";
import type {
  OnClickScene,
  OnLeaveScene,
  OnLoadScene,
  OnUpdateScene,
} from "../../kozmoplay/interfaces/scene";
import { formatScore } from "../../core/utils/formatScore";
import { DogMaker } from "./builders/dog.maker";
import { DuckMaker } from "./builders/duck.maker";
import { COLORS, fontConfig } from "../../core/constants/game.constants";
import type {
  AnchorComp,
  AudioPlay,
  ColorComp,
  GameObj,
  KEventController,
  PosComp,
  RectComp,
  SpriteComp,
  TextComp,
  ZComp,
} from "kaplay";
import { KeyPress } from "../../kozmoplay/decorators/key-press";
import { GameManager } from "./game.manager";
import { Game } from "../../kozmoplay/services/game";
import { InjectGame } from "../../kozmoplay/decorators/inject-game";

@Scene("game")
export class GameScene
  implements OnLoadScene, OnLeaveScene, OnClickScene, OnUpdateScene
{
  private readonly k: Kaplay;
  private readonly gameManager: GameManager;
  private readonly dogMaker: DogMaker;
  private readonly duckMaker: DuckMaker;
  private readonly game: Game;
  private roundStartController?: KEventController;
  private roundEndController?: KEventController;
  private huntStartController?: KEventController;
  private huntEndController?: KEventController;
  private duckHuntedController?: KEventController;
  private duckEscapedController?: KEventController;
  private forestAmbianceSound?: AudioPlay;
  private score?: GameObj<PosComp | ZComp | TextComp>;
  private bulletUIMask?: GameObj<PosComp | ZComp | RectComp | ColorComp>;
  private cursor?: GameObj<PosComp | ZComp | SpriteComp | AnchorComp>;

  constructor(
    @InjectK() k: Kaplay,
    @Inject(GameManager) gameManager: GameManager,
    @Inject(DogMaker) dogMaker: DogMaker,
    @Inject(DuckMaker) duckMaker: DuckMaker,
    @InjectGame() game: Game
  ) {
    this.k = k;
    this.gameManager = gameManager;
    this.dogMaker = dogMaker;
    this.duckMaker = duckMaker;
    this.game = game;
  }

  onLoad() {
    const k = this.k;
    const gameManager = this.gameManager;

    k.setCursor("none");
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("background"), k.pos(0, -10), k.z(1)]);

    this.score = k.add([
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

    this.bulletUIMask = k.add([
      k.rect(0, 8),
      k.pos(25, 198),
      k.z(2),
      k.color(0, 0, 0),
    ]);

    const dog = this.dogMaker.make(k.vec2(0, k.center().y));
    dog.searchForDucks();

    this.roundStartController = gameManager.state.onStateEnter(
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
        gameManager.state.enterState("hunt-start");
      }
    );

    this.roundEndController = gameManager.state.onStateEnter(
      "round-end",
      () => {
        if (gameManager.nbDucksShutInRound < 6) return k.go("game-over");
        if (gameManager.nbDucksShutInRound === 10)
          gameManager.currentScore += 500;

        gameManager.nbDucksShutInRound = 0;
        for (const duckIcon of duckIcons.children) {
          duckIcon.use(k.color(255, 255, 255));
        }

        gameManager.state.enterState("round-start");
      }
    );

    this.huntStartController = gameManager.state.onStateEnter(
      "hunt-start",
      () => {
        gameManager.currentHuntNb++;
        const duck = this.duckMaker.make(
          String(gameManager.currentHuntNb - 1),
          gameManager.preySpeed
        );
        duck.setBehavior();
      }
    );

    this.huntEndController = gameManager.state.onStateEnter("hunt-end", () => {
      const bestScore = k.getData<number>("best-score") || 0;

      if (bestScore < gameManager.currentScore)
        k.setData("best-score", gameManager.currentScore);

      if (gameManager.currentHuntNb <= 9)
        return gameManager.state.enterState("hunt-start");

      gameManager.currentHuntNb = 0;
      gameManager.state.enterState("round-end");
    });

    this.duckHuntedController = gameManager.state.onStateEnter(
      "duck-hunted",
      async () => {
        gameManager.nbBulletLeft = 3;
        await dog.catchFallenDuck();
      }
    );

    this.duckEscapedController = gameManager.state.onStateEnter(
      "duck-escaped",
      async () => {
        dog.mockPlayer();
      }
    );

    this.cursor = k.add([
      k.sprite("cursor"),
      k.anchor("center"),
      k.pos(),
      k.z(3),
    ]);

    this.forestAmbianceSound = k.play("forest-ambiance", {
      volume: 0.1,
      loop: true,
    });
  }

  onUpdate(): void {
    if (!this.score || !this.bulletUIMask || !this.cursor) return;

    this.score.text = formatScore(this.gameManager.currentScore, 6);

    const nbBulletLeftsToBulletUIMaskWidthMap: Record<number, number> = {
      3: 0,
      2: 8,
      1: 15,
      0: 21,
    };

    this.bulletUIMask.width =
      nbBulletLeftsToBulletUIMaskWidthMap[this.gameManager.nbBulletLeft] || 0;

    this.cursor.moveTo(this.k.mousePos());
  }

  onClick(): void {
    if (
      this.gameManager.state.state === "hunt-start" &&
      !this.gameManager.isGamePaused
    ) {
      if (this.gameManager.nbBulletLeft > 0) {
        this.k.play("gun-shot", { volume: 0.5 });
        this.gameManager.nbBulletLeft--;
      }
    }
  }

  onLeave() {
    this.forestAmbianceSound?.stop();
    this.roundStartController?.cancel();
    this.roundEndController?.cancel();
    this.huntStartController?.cancel();
    this.huntEndController?.cancel();
    this.duckHuntedController?.cancel();
    this.duckEscapedController?.cancel();
    this.gameManager.resetGameState();
  }

  @KeyPress("enter")
  pause() {
    const k = this.k;
    const isPause = this.game.pause();
    this.gameManager.isGamePaused = isPause;
    if (isPause) {
      k.add([k.text("PAUSED", fontConfig), k.pos(5, 5), k.z(3), "paused-text"]);
      return;
    }
    const pausedText = k.get("paused-text")[0];
    if (pausedText) k.destroy(pausedText);
  }
}
