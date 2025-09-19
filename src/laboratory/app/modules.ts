import { ContainerModule } from "inversify";
import { MainMenuModule } from "./modules/main-menu/main-menu.module";
import { GameOverModule } from "./modules/game-over/game-over.module";
import { GameModule } from "./modules/game/game.module";

const modules: ContainerModule[] = [MainMenuModule, GameOverModule, GameModule];

export default modules;
