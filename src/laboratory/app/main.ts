
import { KozmoplayApplication } from "../kozmoplay/kozmoplay.application";
import { FontsConfig } from "./core/configs/fonts.config";
import { kaplayConfig } from "./core/configs/kaypal.config";
import { SoundsConfig } from "./core/configs/sounds.config";
import { SpritesConfig } from "./core/configs/sprites.config";
import modules from "./modules";

const run = async () => {
  const app = new KozmoplayApplication(modules, kaplayConfig);
  app.loadSprites(SpritesConfig);
  app.loadSounds(SoundsConfig);
  app.loadFonts(FontsConfig);
  await app.run("main-menu");
};
run();
