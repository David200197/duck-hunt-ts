import { ContainerModule } from "inversify";
import { KozmoplayResourceLoader } from "./services/kozmoplay-resource.loader";
import { KozmoplayManager } from "./services/kozmoplay.manager";

export const KozmoplayModule = new ContainerModule((ctx) => {
  ctx.bind(KozmoplayResourceLoader).toSelf().inSingletonScope();
  ctx.bind(KozmoplayManager).toSelf().inSingletonScope();
});
