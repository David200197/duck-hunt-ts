import { Injectable } from "./injectable";
import { SceneRegistry } from "../libs/SceneRegistry";

export const Scene = (name: string): ClassDecorator => {
  return (target) => {
    if (!target.prototype.load) {
      throw new Error(`Scene ${name} must implement SceneManager interface`);
    }

    Injectable()(target);

    SceneRegistry.registerScene({ name, target });
    return target;
  };
};
