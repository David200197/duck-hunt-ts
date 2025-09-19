export interface SceneMetadata {
  name: string;
  target: Function;
}

export class SceneRegistry {
  private static scenes: Map<string, SceneMetadata> = new Map();

  static registerScene(metadata: SceneMetadata): void {
    this.scenes.set(metadata.name, metadata);
  }

  static getScene(name: string): SceneMetadata | undefined {
    return this.scenes.get(name);
  }

  static getAllScenes(): SceneMetadata[] {
    return Array.from(this.scenes.values());
  }

  static getSceneClasses(): any[] {
    return Array.from(this.scenes.values()).map((metadata) => metadata.target);
  }
}
