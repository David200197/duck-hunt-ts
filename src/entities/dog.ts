import type { Vec2, GameObj } from "kaplay";
import k from "../kaplayCtx";
import { BaseEntity } from "../core/entities/BaseEntity";
import { GameEvents, GAME_EVENTS } from "../core/GameEvents";
import type { DogState } from "../types/game";

export class Dog extends BaseEntity {
  private speed: number = 15;
  private position: Vec2;

  constructor(position: Vec2) {
    super();
    this.position = position;
  }

  protected createGameObject(): GameObj {
    return k.add([
      k.sprite("dog"),
      k.pos(this.position),
      k.state("search", ["search", "snif", "detect", "jump", "drop"] as DogState[]),
      k.z(2),
    ]);
  }

  private playSniffingSound() {
    return k.play("sniffing", { volume: 2 });
  }

  private playBarkingSound() {
    return k.play("barking");
  }

  private playLaughingSound() {
    return k.play("laughing");
  }

  async searchForDucks(): Promise<void> {
    let nbSnifs = 0;

    this.gameObject.onStateEnter("search", async () => {
      this.gameObject.play("search");
      await k.wait(2);
      this.gameObject.enterState("snif");
    });

    this.gameObject.onStateUpdate("search", () => {
      this.gameObject.move(this.speed, 0);
    });

    this.gameObject.onStateEnter("snif", async () => {
      nbSnifs++;
      this.gameObject.play("snif");
      const sniffingSound = this.playSniffingSound();
      await k.wait(2);
      sniffingSound.stop();
      if (nbSnifs === 2) return this.gameObject.enterState("detect");
      this.gameObject.enterState("search");
    });

    this.gameObject.onStateEnter("detect", async () => {
      const barkingSound = this.playBarkingSound();
      this.gameObject.play("detect");
      await k.wait(2);
      barkingSound.stop();
      this.gameObject.enterState("jump");
    });

    this.gameObject.onStateEnter("jump", async () => {
      const barkingSound = this.playBarkingSound();
      this.gameObject.play("jump");
      await k.wait(0.5);
      barkingSound.stop();
      this.gameObject.use(k.z(0));
      this.gameObject.enterState("drop");
    });

    this.gameObject.onStateUpdate("jump", () => {
      this.gameObject.move(100, -50);
    });

    this.gameObject.onStateEnter("drop", async () => {
      await k.tween(
        this.gameObject.pos.y,
        125,
        0.5,
        (newY) => {
          this.gameObject.pos.y = newY;
        },
        k.easings.linear
      );
      GameEvents.getInstance().emit(GAME_EVENTS.ROUND_START, true);
    });
  }

  private async slideUpAndDown(): Promise<void> {
    await k.tween(
      this.gameObject.pos.y,
      90,
      0.4,
      (newY) => (this.gameObject.pos.y = newY),
      k.easings.linear
    );
    await k.wait(1);
    await k.tween(
      this.gameObject.pos.y,
      125,
      0.4,
      (newY) => (this.gameObject.pos.y = newY),
      k.easings.linear
    );
  }

  async catchFallenDuck(): Promise<void> {
    this.gameObject.play("catch");
    k.play("successful-hunt");
    await this.slideUpAndDown();
    GameEvents.getInstance().emit(GAME_EVENTS.HUNT_END);
  }

  async mockPlayer(): Promise<void> {
    const laughingSound = this.playLaughingSound();
    this.gameObject.play("mock");
    await this.slideUpAndDown();
    laughingSound.stop();
    GameEvents.getInstance().emit(GAME_EVENTS.HUNT_END);
  }
}