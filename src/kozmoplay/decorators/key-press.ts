// key-press.ts
import type { Key } from "kaplay";
import {
  KeyPressRegistry,
  type KeyPressMetadata,
} from "../libs/KeyPressRegistry";

export const KeyPress = (key: Key | Key[]): MethodDecorator => {
  return (
    target: Object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const keys = Array.isArray(key) ? key : [key];

    if (typeof descriptor.value !== "function") {
      throw new Error(
        `@KeyPress can only be applied to methods, not ${typeof descriptor.value}`
      );
    }

    const metadata: KeyPressMetadata = {
      keys,
      methodName: String(methodName),
      target: target.constructor,
    };

    KeyPressRegistry.set(metadata);

    return descriptor;
  };
};
