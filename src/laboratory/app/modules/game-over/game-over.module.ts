import { ContainerModule } from "inversify";
import { GameOverScene } from "./game-over.scene";

export const GameOverModule = new ContainerModule((ctx) => {
  ctx.bind(GameOverScene).toSelf().inSingletonScope();
});
