import { InjectK } from "../decorators/inject-k";
import { Injectable } from "../decorators/injectable";
import type { Kaplay } from "../interfaces/kaplay";
import { SceneRegistry } from "../libs/SceneRegistry";
import type { SceneManager } from "../interfaces/scene";

@Injectable()
export class KozmoplaySceneLoader {
  private readonly k: Kaplay;

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
  }

  loadScenes(getSceneService: (target: Function) => SceneManager) {
    const scenes = SceneRegistry.getAllScenes();
    for (const { name, target } of scenes) {
      this.k.scene(name, (...arg) => {
        const sceneService = getSceneService(target);
        sceneService?.onLoad?.(...arg);
        this.k.onClick(() => sceneService?.onClick?.());
        this.k.onUpdate(() => sceneService?.onUpdate?.());
        this.k.onSceneLeave((newScene) => {
          sceneService?.onLeave?.(newScene);
        });
      });
    }
  }
}
