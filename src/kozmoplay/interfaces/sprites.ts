import type { LoadSpriteOpt, LoadSpriteSrc } from "kaplay";

export type Sprites = Record<
  string,
  { src: LoadSpriteSrc | LoadSpriteSrc[]; opt?: LoadSpriteOpt } | string
>;
