import "reflect-metadata";

import { Container, ContainerModule } from "inversify";
import { KozmoplayModule } from "./kozmoplay.module";
import type { Sprites } from "./interfaces/sprites";
import type { Sounds } from "./interfaces/sounds";
import type { Fonts } from "./interfaces/fonts";
import kaplay from "kaplay";
import { KOZMOPLAY_CONSTANTS } from "./constants/kozmoplay.constants";
import type { Kaplay, KaplayConfig } from "./interfaces/kaplay";
import { KozmoplayResourceLoader } from "./services/kozmoplay-resource.loader";
import { KozmoplaySceneLoader } from "./services/kozmoplay-scene.loader";

export class KozmoplayApplication {
  private readonly container: Container;
  private readonly gopt?: KaplayConfig;

  constructor(modules: ContainerModule[], gopt?: KaplayConfig) {
    this.gopt;
    const k = kaplay(gopt);

    this.container = new Container();
    this.container
      .bind<Kaplay>(KOZMOPLAY_CONSTANTS.K)
      .toDynamicValue(() => k)
      .inSingletonScope();
    this.container.load(...modules, KozmoplayModule);
  }

  public loadSprites(sprites: Sprites) {
    const kozmoplayResourcesLoader = this.container.get(
      KozmoplayResourceLoader
    );
    return kozmoplayResourcesLoader.loadSprites(sprites);
  }

  public loadSounds(sounds: Sounds) {
    const kozmoplayResourcesLoader = this.container.get(
      KozmoplayResourceLoader
    );
    return kozmoplayResourcesLoader.loadSounds(sounds);
  }

  public loadFonts(fonts: Fonts) {
    const kozmoplayResourcesLoader = this.container.get(
      KozmoplayResourceLoader
    );
    return kozmoplayResourcesLoader.loadFonts(fonts);
  }

  public get<T>(serviceIdentifier: symbol): T {
    return this.container.get<T>(serviceIdentifier);
  }

  public async run(scene: string): Promise<void> {
    const k = this.get<Kaplay>(KOZMOPLAY_CONSTANTS.K);
    const kozmoplaySceneLoader = this.container.get(KozmoplaySceneLoader);
    kozmoplaySceneLoader.loadScenes((target) => this.container.get(target));
    k.go(scene);
  }
}
