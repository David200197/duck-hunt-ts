import type { Vec2, GameObj } from "kaplay";
import k from "../kaplayCtx";
import gameManager from "../gameManager";

const playSniffingSound = () => k.play("sniffing", { volume: 2 });

const playBarkingSound = () => k.play("barking");

const playLaughingSound = () => k.play("laughing");

export default function makeDog(position: Vec2) {
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
          const sniffingSound = playSniffingSound();
          await k.wait(2);
          sniffingSound.stop();
          if (nbSnifs === 2) return this.enterState("detect");
          this.enterState("search");
        });
        this.onStateEnter("detect", async () => {
          const barkingSound = playBarkingSound();
          this.play("detect");
          await k.wait(2);
          barkingSound.stop();
          this.enterState("jump");
        });
        this.onStateEnter("jump", async () => {
          const barkingSound = playBarkingSound();
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
        const laughingSound = playLaughingSound();
        this.play("mock");
        await this.slideUpAndDown();
        laughingSound.stop();
        gameManager.enterState("hunt-end");
      },
    },
  ]);
}
