import { fontConfig } from "../../core/constants/game.constants";
import { InjectK } from "../../kozmoplay/decorators/inject-k";
import { Scene } from "../../kozmoplay/decorators/scene";
import type { Kaplay } from "../../kozmoplay/interfaces/kaplay";
import type { SceneManager } from "../../kozmoplay/interfaces/scene-manager";

@Scene("game-over")
export class GameOverScene implements SceneManager {
  private readonly k: Kaplay;

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
  }

  async load() {
    const k = this.k;
    k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
    k.add([
      k.text("GAME OVER!", fontConfig),
      k.anchor("center"),
      k.pos(k.center()),
    ]);
    await k.wait(2);
    k.go("main-menu");
  }
}
