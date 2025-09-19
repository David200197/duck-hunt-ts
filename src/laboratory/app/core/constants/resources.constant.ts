import { createEnum } from "../../../kozmoplay/utils/create-enum";
import { FontsConfig } from "../configs/fonts.config";
import { SoundsConfig } from "../configs/sounds.config";
import { SpritesConfig } from "../configs/sprites.config";

export const FONTS = createEnum(FontsConfig);
export const SOUNDS = createEnum(SoundsConfig);
export const SPRITES = createEnum(SpritesConfig);
