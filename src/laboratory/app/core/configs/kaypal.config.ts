import type { KaplayConfig } from "../../../kozmoplay/interfaces/kaplay";

export const kaplayConfig: KaplayConfig = {
  width: 256,
  height: 224,
  letterbox: true,
  touchToMouse: true,
  scale: 4,
  pixelDensity: devicePixelRatio,
  debug: process.env.NODE_ENV !== "production",
  background: [0, 0, 0],
  global: true,
};
