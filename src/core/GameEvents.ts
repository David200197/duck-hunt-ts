import { EventEmitter } from './EventEmitter';

export class GameEvents extends EventEmitter {
  private static instance: GameEvents;

  private constructor() {
    super();
  }

  static getInstance(): GameEvents {
    if (!GameEvents.instance) {
      GameEvents.instance = new GameEvents();
    }
    return GameEvents.instance;
  }
}

// Event constants
export const GAME_EVENTS = {
  DUCK_HUNTED: 'duck_hunted',
  DUCK_ESCAPED: 'duck_escaped',
  ROUND_START: 'round_start',
  ROUND_END: 'round_end',
  HUNT_START: 'hunt_start',
  HUNT_END: 'hunt_end',
  GAME_OVER: 'game_over',
  SCORE_UPDATED: 'score_updated',
  PAUSE_GAME: 'pause_game',
} as const;