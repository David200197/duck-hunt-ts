import { ContainerModule } from "inversify";
import { KozmoplayResourceLoader } from "./services/kozmoplay-resource.loader";
import { KozmoplaySceneLoader } from "./services/kozmoplay-scene.loader";

export const KozmoplayModule = new ContainerModule((ctx) => {
  ctx.bind(KozmoplayResourceLoader).toSelf().inSingletonScope();
  ctx.bind(KozmoplaySceneLoader).toSelf().inSingletonScope();
});
