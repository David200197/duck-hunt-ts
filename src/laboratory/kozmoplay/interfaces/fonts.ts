import type { LoadFontOpt } from "kaplay";

export type Fonts = Record<
  string,
  { src: any; opt?: LoadFontOpt | undefined } | string
>;
