import { ContainerModule } from "inversify";
import { GameScene } from "./game.scene";
import { GameManager } from "./game.manager";
import { DogMaker } from "./dog.maker";
import { DuckMaker } from "./duck.maker";

export const GameModule = new ContainerModule((ctx) => {
  ctx.bind(GameScene).toSelf().inSingletonScope();
  ctx.bind(GameManager).toSelf().inSingletonScope();
  ctx.bind(DogMaker).toSelf().inSingletonScope();
  ctx.bind(DuckMaker).toSelf().inSingletonScope();
});
