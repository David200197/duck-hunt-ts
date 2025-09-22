import type { GameObj } from "kaplay";
import type { Kaplay } from "../../../kozmoplay/interfaces/kaplay";
import type { GameManager } from "../game.manager";

export class Dog {
  speed = 15;
  kaplay: Kaplay;

  constructor(kaplay: Kaplay, gameManager: GameManager) {
    this.kaplay = kaplay;
  }

  searchForDucks(this: GameObj) {
    const kaplay = this.kaplay;

    let nbSnifs = 0;
    this.onStateEnter("search", async () => {
      this.play("search");
      await kaplay.wait(2);
      this.enterState("snif");
    });
    this.onStateUpdate("search", () => {
      this.move(this.speed, 0);
    });
    this.onStateEnter("snif", async () => {
      nbSnifs++;
      this.play("snif");
      const sniffingSound = kaplay.play("sniffing", { volume: 2 });
      await kaplay.wait(2);
      sniffingSound.stop();
      if (nbSnifs === 2) return this.enterState("detect");
      this.enterState("search");
    });
    this.onStateEnter("detect", async () => {
      const barkingSound = kaplay.play("barking");
      this.play("detect");
      await kaplay.wait(2);
      barkingSound.stop();
      this.enterState("jump");
    });
    this.onStateEnter("jump", async () => {
      const barkingSound = kaplay.play("barking");
      this.play("jump");
      await kaplay.wait(0.5);
      barkingSound.stop();
      this.use(kaplay.z(0));
      this.enterState("drop");
    });
    this.onStateUpdate("jump", async () => {
      this.move(100, -50);
    });
    this.onStateEnter("drop", async () => {
      await kaplay.tween(
        this.pos.y,
        125,
        0.5,
        (newY: number) => {
          this.pos.y = newY;
        },
        kaplay.easings.linear
      );
      this.gameManager.state.enterState("round-start", true);
    });
  }
}
