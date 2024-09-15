import NodeEventEmitter from "node:events";

export type EventEmitter = NodeEventEmitter;

export class AppEventEmitter {
  private static instance: EventEmitter;

  private constructor() {}

  public static getInstance(): EventEmitter {
    if (!AppEventEmitter.instance) {
      AppEventEmitter.instance = new NodeEventEmitter();
    }

    return AppEventEmitter.instance;
  }
}
