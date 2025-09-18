import { AssetLoader, SceneManager } from "./services";

// Initialize services and load assets
AssetLoader.loadAllAssets();

// Start the game
SceneManager.getInstance().goToScene("main-menu");