import { KOZMOPLAY_CONSTANTS } from "../constants/kozmoplay.constants";
import {
  KeyPressRegistry,
  type KeyPressMetadata,
} from "../libs/KeyPressRegistry";
import { SceneRegistry } from "../libs/SceneRegistry";
import { Injectable } from "./injectable";

export const Scene = (name: string): ClassDecorator => {
  return (target) => {
    if (typeof target !== "function") {
      throw new Error("@Scene decorator can only be applied to classes");
    }

    Injectable()(target);

    const pendingKeyPressMetadata: KeyPressMetadata[] =
      Reflect.getMetadata(
        KOZMOPLAY_CONSTANTS.KEYPRESS_METADATA,
        target.prototype
      ) || [];

    pendingKeyPressMetadata.forEach((metadata) => {
      KeyPressRegistry.set(name, {
        keys: metadata.keys,
        methodName: metadata.methodName,
      });
    });

    Reflect.defineMetadata(
      KOZMOPLAY_CONSTANTS.KEYPRESS_METADATA,
      [],
      target.prototype
    );

    SceneRegistry.registerScene({ name, target });
    return target;
  };
};
