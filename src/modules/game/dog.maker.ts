import type { Vec2, GameObj } from "kaplay";
import { InjectK } from "../../kozmoplay/decorators/inject-k";
import { Injectable } from "../../kozmoplay/decorators/injectable";
import type { Kaplay } from "../../kozmoplay/interfaces/kaplay";
import { GameManager } from "./game.manager";
import { Inject } from "../../kozmoplay/decorators/inject";

@Injectable()
export class DogMaker {
  private readonly k: Kaplay;
  private readonly gameManager: GameManager;

  constructor(
    @InjectK() k: Kaplay,
    @Inject(GameManager) gameManager: GameManager
  ) {
    this.k = k;
    this.gameManager = gameManager;
  }

  make(position: Vec2) {
    const k = this.k;
    const gameManager = this.gameManager.data;

    return k.add([
      k.sprite("dog"),
      k.pos(position),
      k.state("search", ["search", "snif", "detect", "jump", "drop"]),
      k.z(2),
      {
        speed: 15,
        searchForDucks(this: GameObj) {
          let nbSnifs = 0;
          this.onStateEnter("search", async () => {
            this.play("search");
            await k.wait(2);
            this.enterState("snif");
          });
          this.onStateUpdate("search", () => {
            this.move(this.speed, 0);
          });
          this.onStateEnter("snif", async () => {
            nbSnifs++;
            this.play("snif");
            const sniffingSound = k.play("sniffing", { volume: 2 });
            await k.wait(2);
            sniffingSound.stop();
            if (nbSnifs === 2) return this.enterState("detect");
            this.enterState("search");
          });
          this.onStateEnter("detect", async () => {
            const barkingSound = k.play("barking");
            this.play("detect");
            await k.wait(2);
            barkingSound.stop();
            this.enterState("jump");
          });
          this.onStateEnter("jump", async () => {
            const barkingSound = k.play("barking");
            this.play("jump");
            await k.wait(0.5);
            barkingSound.stop();
            this.use(k.z(0));
            this.enterState("drop");
          });
          this.onStateUpdate("jump", async () => {
            this.move(100, -50);
          });
          this.onStateEnter("drop", async () => {
            await k.tween(
              this.pos.y,
              125,
              0.5,
              (newY) => {
                this.pos.y = newY;
              },
              k.easings.linear
            );
            gameManager.enterState("round-start", true);
          });
        },
        async slideUpAndDown(this: GameObj) {
          await k.tween(
            this.pos.y,
            90,
            0.4,
            (newY) => (this.pos.y = newY),
            k.easings.linear
          );
          await k.wait(1);
          await k.tween(
            this.pos.y,
            125,
            0.4,
            (newY) => (this.pos.y = newY),
            k.easings.linear
          );
        },
        async catchFallenDuck(this: GameObj) {
          this.play("catch");
          k.play("successful-hunt");
          await this.slideUpAndDown();
          gameManager.enterState("hunt-end");
        },
        async mockPlayer(this: GameObj) {
          const laughingSound = k.play("laughing");
          this.play("mock");
          await this.slideUpAndDown();
          laughingSound.stop();
          gameManager.enterState("hunt-end");
        },
      },
    ]);
  }
}
