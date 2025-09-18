import k from "../kaplayCtx";
import { FONTS, SPRITES, SOUNDS } from "../config";
import type { SpriteAsset, SoundAsset, FontAsset } from "../types/assets";

export class AssetLoader {
  static loadSprites() {
    Object.entries(SPRITES).forEach(([key, { path, config }]: [string, SpriteAsset]) => {
      k.loadSprite(key, path, config);
    });
  }

  static loadFonts() {
    Object.entries(FONTS).forEach(([_, { path }]: [string, FontAsset]) => {
      k.loadFont("nes", path);
    });
  }

  static loadSounds() {
    Object.entries(SOUNDS).forEach(([key, { path }]: [string, SoundAsset]) => {
      k.loadSound(key, path);
    });
  }

  static loadAllAssets() {
    this.loadSprites();
    this.loadFonts();
    this.loadSounds();
  }
}
