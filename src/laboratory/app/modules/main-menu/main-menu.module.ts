import { ContainerModule } from "inversify";
import { MainMenuScene } from "./main-menu.scene";

export const MainMenuModule = new ContainerModule((ctx) => {
  ctx.bind(MainMenuScene).toSelf().inSingletonScope();
});
