import type { KAPLAYCtx, KAPLAYOpt } from "kaplay";
export type Kaplay = KAPLAYCtx<{}, never>;
export type KaplayConfig = KAPLAYOpt<[undefined], {}> | undefined;
