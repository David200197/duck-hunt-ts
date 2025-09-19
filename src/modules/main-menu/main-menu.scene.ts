import { InjectK } from "../../kozmoplay/decorators/inject-k";
import { Scene } from "../../kozmoplay/decorators/scene";
import type { Kaplay } from "../../kozmoplay/interfaces/kaplay";
import type { OnLoadScene } from "../../kozmoplay/interfaces/scene";
import { COLORS } from "../../core/constants/game.constants";
import { formatScore } from "../../core/utils/formatScore";

@Scene("main-menu")
export class MainMenuScene implements OnLoadScene {
  private readonly k: Kaplay;

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
  }

  onLoad() {
    const k = this.k;

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
  }
}
