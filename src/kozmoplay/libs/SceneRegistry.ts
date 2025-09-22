export interface SceneMetadata {
  name: string;
  target: Function;
}

export class SceneRegistry {
  private static scenes: SceneMetadata[] = [];

  static registerScene(metadata: SceneMetadata): void {
    this.scenes.push(metadata);
  }

  static getAllScenes(): SceneMetadata[] {
    return this.scenes;
  }
}
