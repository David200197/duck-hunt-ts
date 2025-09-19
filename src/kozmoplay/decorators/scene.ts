import { Injectable } from "./injectable";
import { SceneRegistry } from "../libs/SceneRegistry";

export const Scene = (name: string): ClassDecorator => {
  return (target) => {
    Injectable()(target);

    SceneRegistry.registerScene({ name, target });
    return target;
  };
};
