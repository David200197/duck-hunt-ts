import type { Key } from "kaplay";

export type KeyPressMetadata = {
  methodName: string;
  keys: Key[];
  target: Function;
};

const KEYPRESS_METADATA = Symbol.for("KEYPRESS_METADATA");

export class KeyPressRegistry {
  static set(metadata: KeyPressMetadata) {
    const existingMetadata = this.get(metadata.target);

    existingMetadata.push(metadata);

    Reflect.defineMetadata(
      KEYPRESS_METADATA,
      existingMetadata,
      metadata.target
    );
  }

  static get(target: Function): KeyPressMetadata[] {
    const metadata = Reflect.getMetadata(KEYPRESS_METADATA, target);
    if (!metadata) return [];
    return [...metadata];
  }
}
