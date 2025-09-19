import { InjectK } from "../decorators/inject-k";
import { Injectable } from "../decorators/injectable";
import type { Kaplay } from "../interfaces/kaplay";
import { SceneRegistry } from "../libs/SceneRegistry";
import type { SceneManager } from "../interfaces/scene-manager";

@Injectable()
export class KozmoplayManager {
  private readonly k: Kaplay;

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
  }

  loadScenes(getSceneManagerService: (target: Function) => SceneManager) {
    const scenes = SceneRegistry.getAllScenes();
    for (const { name, target } of scenes) {
      this.k.scene(name, (...arg) =>
        getSceneManagerService(target).load(...arg)
      );
    }
  }
}
