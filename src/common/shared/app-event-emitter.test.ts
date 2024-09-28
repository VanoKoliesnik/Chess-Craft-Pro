import { EventEmitter } from "node:events";

import { AppEventEmitter } from "./app-event-emitter";

describe("Common::Shared", () => {
  describe("AppEventEmitter", () => {
    it("should create a single instance of EventEmitter", () => {
      const instance1 = AppEventEmitter.getInstance();
      const instance2 = AppEventEmitter.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(EventEmitter);
    });

    it("should emit and listen to events", () => {
      const eventEmitter = AppEventEmitter.getInstance();
      const eventName = "testEvent";
      const eventData = { message: "Hello, Tests!" };

      const listener = jest.fn();
      eventEmitter.on(eventName, listener);

      eventEmitter.emit(eventName, eventData);

      expect(listener).toHaveBeenCalledWith(eventData);
    });
  });
});
