import { InjectK } from "../decorators/inject-k";
import { Injectable } from "../decorators/injectable";
import type { Kaplay } from "../interfaces/kaplay";

@Injectable()
export class Game {
  private readonly k: Kaplay;

  constructor(@InjectK() k: Kaplay) {
    this.k = k;
  }

  pause() {
    this.k.getTreeRoot().paused = !this.k.getTreeRoot().paused;
    if (this.k.getTreeRoot().paused) {
      //@ts-ignore
      audioCtx.suspend();
      return true;
    }
    //@ts-ignore
    audioCtx.resume();
    return false;
  }
}
