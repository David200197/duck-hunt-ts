export const GAME_CONFIG = {
  width: 256,
  height: 224,
  letterbox: true,
  touchToMouse: true,
  scale: 4,
  debug: process.env.NODE_ENV !== "production",
  background: [0, 0, 0],
  global: true,
  duckInitialSpeed: 100,
  maxRound: 10,
  minDucksToPass: 6,
  perfectRoundBonus: 500,
  duckHitScore: 100,
  maxBullets: 3,
  escapeTime: 5
};