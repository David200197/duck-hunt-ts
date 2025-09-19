import type { Key } from "kaplay";

export type KeyPressMetadata = {
  methodName: string;
  keys: Key[];
};

export class KeyPressRegistry {
  private static store = new Map<string, Array<KeyPressMetadata>>();

  static set(sceneName: string, metadata: KeyPressMetadata) {
    if (!this.store.has(sceneName)) {
      this.store.set(sceneName, []);
    }

    this.store.get(sceneName)!.push(metadata);
  }

  static get(sceneName: string) {
    return this.store.get(sceneName) || [];
  }
}
