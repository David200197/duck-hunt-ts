import type { GameObj } from "kaplay";
import k from "../../kaplayCtx";

export abstract class BaseEntity {
  protected gameObject: GameObj;

  constructor() {
    this.gameObject = this.createGameObject();
  }

  protected abstract createGameObject(): GameObj;

  getGameObject(): GameObj {
    return this.gameObject;
  }

  destroy(): void {
    k.destroy(this.gameObject);
  }
}