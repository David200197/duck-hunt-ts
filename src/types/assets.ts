type SpriteAnimation = {
  from?: number;
  to?: number;
  speed?: number;
  loop?: boolean;
};

type SpriteConfig = {
  sliceX?: number;
  sliceY?: number;
  anims?: Record<string, number | SpriteAnimation>;
};

export type SpriteAsset = {
  path: string;
  config?: SpriteConfig;
};

export type SoundAsset = {
  path: string;
  config?: {
    volume?: number;
    loop?: boolean;
    speed?: number;
  };
};

export type FontAsset = {
  path: string;
};

export type AssetMap<T> = {
  [key: string]: T;
};