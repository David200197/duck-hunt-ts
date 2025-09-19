import type { SceneDef } from "kaplay";

export interface OnLoadScene {
  onLoad: SceneDef;
}

export interface OnLeaveScene {
  onLeave(newScene?: string | undefined): void;
}

export interface OnClickScene {
  onClick(): void;
}

export interface OnUpdateScene {
  onUpdate(): void;
}

export type SceneManager = OnLoadScene &
  OnLeaveScene &
  OnClickScene &
  OnUpdateScene;
