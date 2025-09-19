import type { Kaplay } from "../interfaces/kaplay";
import { InjectK } from "../decorators/inject-k";
import type { Sprites } from "../interfaces/sprites";
import type { Sounds } from "../interfaces/sounds";
import type { Fonts } from "../interfaces/fonts";
import { Injectable } from "../decorators/injectable";

@Injectable()
export class KozmoplayResourceLoader {
  private readonly k: Kaplay;

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
  }

  public loadSprites(sprites: Sprites) {
    for (const name in sprites) {
      const value = sprites[name];
      if (typeof value === "string") {
        this.k.loadSprite(name, value);
        continue;
      }
      this.k.loadSprite(name, value.src, value.opt);
    }
  }

  public loadSounds(sounds: Sounds) {
    for (const name in sounds) {
      const value = sounds[name];
      if (typeof value === "string") {
        this.k.loadSound(name, value);
        continue;
      }
      this.k.loadSound(name, value.src);
    }
  }

  public loadFonts(fonts: Fonts) {
    for (const name in fonts) {
      const value = fonts[name];
      if (typeof value === "string") {
        this.k.loadFont(name, value);
        continue;
      }
      this.k.loadFont(name, value.src, value.opt);
    }
  }
}
