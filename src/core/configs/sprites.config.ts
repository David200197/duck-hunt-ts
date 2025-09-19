import type { Sprites } from "../../kozmoplay/interfaces/sprites";

export const SpritesConfig = {
  menu: "./graphics/menu.png",
  background: "./graphics/background.png",
  cursor: "./graphics/cursor.png",
  "text-box": "./graphics/text-box.png",
  dog: {
    src: "./graphics/dog.png",
    opt: {
      sliceX: 4,
      sliceY: 3,
      anims: {
        search: {
          from: 0,
          to: 3,
          speed: 6,
          loop: true,
        },
        snif: {
          from: 4,
          to: 5,
          speed: 4,
          loop: true,
        },
        detect: 6,
        jump: {
          from: 7,
          to: 8,
          speed: 6,
        },
        catch: 9,
        mock: {
          from: 10,
          to: 11,
          loop: true,
        },
      },
    },
  },
  duck: {
    src: "./graphics/duck.png",
    opt: {
      sliceX: 8,
      sliceY: 1,
      anims: {
        "flight-diagonal": {
          from: 0,
          to: 2,
          loop: true,
        },
        "flight-side": {
          from: 3,
          to: 5,
          loop: true,
        },
        shot: 6,
        fall: 7,
      },
    },
  },
} as const satisfies Sprites;
