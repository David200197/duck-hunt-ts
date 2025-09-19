import type { Sounds } from "../../kozmoplay/interfaces/sounds";

export const SoundsConfig = {
  "gun-shot": "./sounds/gun-shot.wav",
  "ui-appear": "./sounds/ui-appear.wav",
  sniffing: "./sounds/sniffing.wav",
  barking: "./sounds/barking.wav",
  laughing: "./sounds/laughing.wav",
  "successful-hunt": "./sounds/successful-hunt.wav",
  quacking: "./sounds/quacking.wav",
  flapping: "./sounds/flapping.ogg",
  fall: "./sounds/fall.wav",
  impact: "./sounds/impact.wav",
  "forest-ambiance": "./sounds/forest-ambiance.wav",
} as const satisfies Sounds;
