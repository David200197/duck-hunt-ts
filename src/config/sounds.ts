import type { AssetMap, SoundAsset } from '../types/assets';

export const SOUNDS: AssetMap<SoundAsset> = {
  gunShot: {
    path: "./sounds/gun-shot.wav",
    config: { volume: 0.5 }
  },
  uiAppear: {
    path: "./sounds/ui-appear.wav"
  },
  sniffing: {
    path: "./sounds/sniffing.wav",
    config: { volume: 2 }
  },
  barking: {
    path: "./sounds/barking.wav"
  },
  laughing: {
    path: "./sounds/laughing.wav"
  },
  successfulHunt: {
    path: "./sounds/successful-hunt.wav"
  },
  quacking: {
    path: "./sounds/quacking.wav",
    config: { volume: 0.5, loop: true }
  },
  flapping: {
    path: "./sounds/flapping.ogg",
    config: { loop: true, speed: 2 }
  },
  fall: {
    path: "./sounds/fall.wav",
    config: { volume: 0.7 }
  },
  impact: {
    path: "./sounds/impact.wav"
  },
  forestAmbiance: {
    path: "./sounds/forest-ambiance.wav",
    config: { volume: 0.1, loop: true }
  }
};