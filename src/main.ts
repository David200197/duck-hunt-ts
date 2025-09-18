import { COLORS, fontConfig } from "./constants";
import makeDog from "./entities/dog";
import makeDuck from "./entities/duck";
import gameManager from "./gameManager";
import k from "./kaplayCtx";
import { formatScore } from "./utils";

k.loadSprite("menu", "./graphics/menu.png");
k.loadSprite("background", "./graphics/background.png");
k.loadSprite("cursor", "./graphics/cursor.png");
k.loadSprite("text-box", "./graphics/text-box.png");
k.loadSprite("dog", "./graphics/dog.png", {
  sliceX: 4,
  sliceY: 3,
  anims: {
    search: {
      from: 0,
      to: 3,
      speed: 6,
      loop: true,
    },
    snif: {
      from: 4,
      to: 5,
      speed: 4,
      loop: true,
    },
    detect: 6,
    jump: {
      from: 7,
      to: 8,
      speed: 6,
    },
    catch: 9,
    mock: { from: 10, to: 11, loop: true },
  },
});
k.loadSprite("duck", "./graphics/duck.png", {
  sliceX: 8,
  sliceY: 1,
  anims: {
    "flight-diagonal": { from: 0, to: 2, loop: true },
    "flight-side": { from: 3, to: 5, loop: true },
    shot: 6,
    fall: 7,
  },
});

k.loadFont("nes", "./fonts/nintendo-nes-font/nintendo-nes-font.ttf");

k.loadSound("gun-shot", "./sounds/gun-shot.wav");
k.loadSound("ui-appear", "./sounds/ui-appear.wav");
k.loadSound("sniffing", "./sounds/sniffing.wav");
k.loadSound("barking", "./sounds/barking.wav");
k.loadSound("laughing", "./sounds/laughing.wav");
k.loadSound("successful-hunt", "./sounds/successful-hunt.wav");
k.loadSound("quacking", "./sounds/quacking.wav");
k.loadSound("flapping", "./sounds/flapping.wav");
k.loadSound("fall", "./sounds/fall.wav");
k.loadSound("impact", "./sounds/impact.wav");
k.loadSound("forest-ambiance", "./sounds/forest-ambiance.wav");

k.scene("main-menu", () => {
  k.add([k.sprite("menu")]);
  k.add([
    k.text("CLICK TO START", {
      font: "nes",
      size: 8,
    }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 40),
  ]);
  k.add([
    k.text("MADE BY DAVID", {
      font: "nes",
      size: 8,
    }),
    k.z(2),
    k.pos(10, 215),
    k.color(COLORS.BLUE),
    k.opacity(0.5),
  ]);

  let bestScore = k.getData<number>("best-score");
  if (!bestScore) {
    bestScore = 0;
    k.setData("best-score", 0);
  }

  k.add([
    k.text(`TOP SCORE = ${formatScore(bestScore, 6)}`, {
      font: "nes",
      size: 8,
    }),
    k.pos(55, 184),
    k.color(COLORS.RED),
  ]);

  k.onClick(() => {
    k.go("game");
  });
});

k.scene("game", () => {
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
    duckIcons.add([k.rect(7, 9), k.pos(1 + 8 * i, 0), `duckIcon-${i}`]);
  }

  const bulletUIMask = k.add([
    k.rect(0, 8),
    k.pos(25, 198),
    k.z(2),
    k.color(0, 0, 0),
  ]);

  const dog = makeDog(k.vec2(0, k.center().y));
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
    if (gameManager.nbDucksShutInRound === 10) gameManager.currentScore += 500;

    gameManager.nbDucksShutInRound = 0;
    for (const duckIcon of duckIcons.children) {
      duckIcon.color = k.color(255, 255, 255);
    }

    gameManager.enterState("round-start");
  });

  const huntStartController = gameManager.onStateEnter("hunt-start", () => {
    gameManager.currentHuntNb++;
    const duck = makeDuck(
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

  //gameManager.enterState("round-start")

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
      k.add([k.text("PAUSED", fontConfig), k.pos(5, 5), k.z(3), "paused-text"]);
      return;
    }
    //@ts-ignore
    audioCtx.resume();

    const pausedText = k.get("paused-text")[0];
    if (pausedText) k.destroy(pausedText);
  });
});

k.scene("game-over", async () => {
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
  k.add([
    k.text("GAME OVER!", fontConfig),
    k.anchor("center"),
    k.pos(k.center()),
  ]);
  await k.wait(2);
  k.go("main-menu");
});

k.go("main-menu");
