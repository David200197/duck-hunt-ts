// key-press.ts
import type { Key } from "kaplay";
import { KOZMOPLAY_CONSTANTS } from "../constants/kozmoplay.constants";
import type { KeyPressMetadata } from "../libs/KeyPressRegistry";

export const KeyPress = (key: Key | Key[]): MethodDecorator => {
  return (
    target: object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const keys = Array.isArray(key) ? key : [key];

    if (typeof descriptor.value !== "function") {
      throw new Error(
        `@KeyPress can only be applied to methods, not ${typeof descriptor.value}`
      );
    }

    const existingMetadata: KeyPressMetadata[] =
      Reflect.getMetadata(
        KOZMOPLAY_CONSTANTS.KEYPRESS_METADATA,
        target
      ) || [];

    const newMetadata: KeyPressMetadata = {
      keys,
      methodName: String(methodName),
    };

    Reflect.defineMetadata(
      KOZMOPLAY_CONSTANTS.KEYPRESS_METADATA,
      [...existingMetadata, newMetadata],
      target
    );

    return descriptor;
  };
};
