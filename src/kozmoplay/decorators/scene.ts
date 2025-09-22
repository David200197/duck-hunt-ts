import { SceneRegistry } from "../libs/SceneRegistry";
import { Injectable } from "./injectable";

export const Scene = (name: string): ClassDecorator => {
  return (target) => {
    if (typeof target !== "function") {
      throw new Error("@Scene decorator can only be applied to classes");
    }

    Injectable()(target);

    SceneRegistry.registerScene({ name, target });
    return target;
  };
};
