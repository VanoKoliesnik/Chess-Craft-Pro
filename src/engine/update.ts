import { AppEventEmitter, EventEmitter, EventName } from "@common/shared";
import { VoidFunction } from "@common/types";

export class UpdateEngine {
  private intervalId: NodeJS.Timeout = null;

  private readonly updateStateCallback: VoidFunction;
  private readonly eventEmitter: EventEmitter;

  constructor(updateState: VoidFunction) {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.listenForEvents();

    this.updateStateCallback = updateState;

    this.start();
  }

  start(ups: number = 1) {
    this.intervalId = setInterval(this.updateState.bind(this), 1_000 / ups);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private listenForEvents() {
    this.eventEmitter.on(EventName.GameFinished, this.finishGame.bind(this));
  }

  private finishGame() {
    this.stop();
  }

  private updateState() {
    this.updateStateCallback();
  }
}
