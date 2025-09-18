import k from "../kaplayCtx";
import { FONT_CONFIG, GAME_CONFIG } from "../config";
import { formatScore } from "../utils";
import { GameService } from "./GameService";
import { Dog } from "../entities/dog";
import { Duck } from "../entities/duck";

export class SceneManager {
  private static instance: SceneManager;
  private gameService: GameService;

  private constructor() {
    this.gameService = GameService.getInstance();
    this.initializeScenes();
  }

  static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  private initializeScenes(): void {
    this.initMainMenuScene();
    this.initGameScene();
    this.initGameOverScene();
  }

  private initMainMenuScene(): void {
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
        k.color("#9fa2cb"),
        k.opacity(0.5),
      ]);

      const bestScore = this.gameService.getBestScore();
      k.add([
        k.text(`TOP SCORE = ${formatScore(bestScore, 6)}`, {
          font: "nes",
          size: 8,
        }),
        k.pos(55, 184),
        k.color("#cb7387"),
      ]);

      k.onClick(() => k.go("game"));
    });
  }

  private initGameScene(): void {
    k.scene("game", () => {
      // Create game objects
      const dog = new Dog(k.vec2(0, k.height() - 100));
      const duck = new Duck("duck-1", GAME_CONFIG.duckInitialSpeed);

      // Add background
      k.add([k.sprite("background")]);

      // Create UI elements
      const topBar = k.add([
        k.text("", {
          ...FONT_CONFIG,
          size: 24,
        }),
        k.pos(20, 20),
      ]);

      // Create bullet display elements
      const bulletDisplayPos = k.vec2(20, k.height() - 60);
      const bulletDisplay = k.add([
        k.text("", {
          ...FONT_CONFIG,
          size: 24,
        }),
        k.pos(bulletDisplayPos),
      ]);

      // Update UI elements
      const updateUI = () => {
        const score = this.gameService.getScore();
        const round = this.gameService.getRound();
        const bullets = this.gameService.getBullets();
        
        topBar.text = `SCORE: ${formatScore(score, 6)}     R=${round}`;
        bulletDisplay.text = "BULLETS: " + "I ".repeat(bullets);
      };

      // Initial UI update
      updateUI();

      // Game event listeners
      k.onUpdate(() => {
        if (this.gameService.isGameOver()) {
          this.goToScene("game-over");
        }
      });

      // Add click/touch handler for shooting
      k.onClick(() => {
        if (this.gameService.getBullets() > 0) {
          this.gameService.shoot();
          updateUI();
        }
      });

      // Start game sequence
      dog.searchForDucks();
    });
  }

  private initGameOverScene(): void {
    k.scene("game-over", async () => {
      k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
      k.add([
        k.text("GAME OVER!", FONT_CONFIG),
        k.anchor("center"),
        k.pos(k.center()),
      ]);
      await k.wait(2);
      k.go("main-menu");
    });
  }

  goToScene(sceneName: string): void {
    k.go(sceneName);
  }
}