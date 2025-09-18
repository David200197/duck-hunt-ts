import type { Vec2, GameObj } from "kaplay";
import k from "../kaplayCtx";
import { BaseEntity } from "../core/entities/BaseEntity";
import { GameEvents, GAME_EVENTS } from "../core/GameEvents";
import { GAME_CONFIG } from "../config";
import { COLORS } from "../config";
import type { DuckState } from "../types/game";
import { GameService } from "../services/GameService";

export class Duck extends BaseEntity {
  private flyTimer: number = 0;
  private timeBeforeEscape: number = GAME_CONFIG.escapeTime;
  private position: Vec2;
  private speed: number;
  private duckId: string;
  private flyDirection: Vec2;
  private quackingSound: any;
  private flappingSound: any;
  private fallSound: any;
  private gameService: GameService;

  constructor(duckId: string, speed: number) {
    super();
    this.duckId = duckId;
    this.speed = speed;
    this.gameService = GameService.getInstance();
    
    const startingPos = [
      k.vec2(80, k.center().y + 40),
      k.vec2(k.center().x, k.center().y + 40),
      k.vec2(200, k.center().y + 40),
    ];
    
    const flyDirections = [
      k.vec2(-1, -1),
      k.vec2(1, -1),
      k.vec2(1, -1),
    ];

    const chosenPosIndex = k.randi(startingPos.length);
    const chosenFlyDirectionIndex = k.randi(flyDirections.length);

    this.position = startingPos[chosenPosIndex];
    this.flyDirection = flyDirections[chosenFlyDirectionIndex];
  }

  protected createGameObject(): GameObj {
    return k.add([
      k.sprite("duck", { anim: "flight-side" }),
      k.area({
        shape: new k.Rect(k.vec2(0), 24, 24),
      }),
      k.body(),
      k.anchor("center"),
      k.pos(this.position),
      k.state("fly", ["fly", "shot", "fall"] as DuckState[]),
      k.timer(),
      k.offscreen({ destroy: true, distance: 100 }),
    ]);
  }

  setBehavior(): void {
    if (this.flyDirection.x < 0) this.gameObject.flipX = true;
    
    this.quackingSound = k.play("quacking", { volume: 0.5, loop: true });
    this.flappingSound = k.play("flapping", { loop: true, speed: 2 });

    this.initializeFlyState();
    this.initializeShotState();
    this.initializeFallState();
    this.setupClickHandler();
    this.setupEscapeTimer();
    this.setupOffscreenHandler();
  }

  private initializeFlyState(): void {
    this.gameObject.onStateUpdate("fly", () => {
      const currentAnim = this.gameObject.getCurAnim().name === "flight-side"
        ? "flight-diagonal"
        : "flight-side";

      if (
        this.flyTimer < this.timeBeforeEscape &&
        (this.gameObject.pos.x > k.width() + 10 || this.gameObject.pos.x < -10)
      ) {
        this.flyDirection.x = -this.flyDirection.x;
        this.gameObject.flipX = !this.gameObject.flipX;
        this.gameObject.play(currentAnim);
      }

      if (this.gameObject.pos.y < -10 || this.gameObject.pos.y > k.height() - 70) {
        this.flyDirection.y = -this.flyDirection.y;
        this.gameObject.play(currentAnim);
      }

      this.gameObject.move(k.vec2(this.flyDirection).scale(this.speed));
    });
  }

  private initializeShotState(): void {
    this.gameObject.onStateEnter("shot", async () => {
      this.gameService.getManager().nbDucksShutInRound++;
      this.gameObject.play("shot");
      this.quackingSound.stop();
      this.flappingSound.stop();
      await k.wait(0.2);
      this.gameObject.enterState("fall");
    });
  }

  private initializeFallState(): void {
    const sky = k.get("sky")[0];

    this.gameObject.onStateEnter("fall", () => {
      this.fallSound = k.play("fall", { volume: 0.7 });
      this.gameObject.play("fall");
    });

    this.gameObject.onStateUpdate("fall", async () => {
      this.gameObject.move(0, this.speed);
      if (this.gameObject.pos.y > k.height() - 70) {
        this.fallSound.stop();
        k.play("impact");
        k.destroy(this.gameObject);
        sky.color = k.Color.fromHex(COLORS.BLUE);
        
        const duckIcon = k.get(`duckIcon-${this.duckId}`, { recursive: true })[0];
        if (duckIcon) duckIcon.color = k.Color.fromHex(COLORS.RED);

        await k.wait(1);
        GameEvents.getInstance().emit(GAME_EVENTS.HUNT_END);
      }
    });
  }

  private setupClickHandler(): void {
    this.gameObject.onClick(() => {
      if (this.gameService.getManager().nbBulletLeft <= 0) return;
      this.gameService.addScore(GAME_CONFIG.duckHitScore);
      this.gameObject.enterState("shot");
    });
  }

  private setupEscapeTimer(): void {
    const sky = k.get("sky")[0];
    
    this.gameObject.loop(1, () => {
      this.flyTimer++;
      if (this.flyTimer === this.timeBeforeEscape) {
        sky.color = k.Color.fromHex(COLORS.BEIGE);
      }
    });
  }

  private setupOffscreenHandler(): void {
    this.gameObject.onExitScreen(() => {
      this.quackingSound.stop();
      this.flappingSound.stop();
      
      const sky = k.get("sky")[0];
      sky.color = k.Color.fromHex(COLORS.BLUE);
      
      this.gameService.getManager().nbBulletLeft = GAME_CONFIG.maxBullets;
      GameEvents.getInstance().emit(GAME_EVENTS.DUCK_ESCAPED);
    });
  }
}