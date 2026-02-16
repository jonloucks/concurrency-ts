import { strictEqual, throws } from "node:assert";
import { describe, it, test } from "node:test";

import { create as createEvents, Events, Config as EventsConfig } from "./Events.impl";
import { Contracts, CONTRACTS } from "@jonloucks/contracts-ts";

describe("Events", () => {
  let contracts: Contracts = CONTRACTS;

  test("with null config should throw error", () => {
    throws(() => {
      createEvents(null as unknown as EventsConfig);
    }, {
      name: 'IllegalArgumentException',
      message: "Config must be present."
    });
  });

  test("with no callback present should throw error", () => {
    throws(() => {
      createEvents({} as EventsConfig);
    }, {
      name: 'IllegalArgumentException',
      message: "Callback must be present."
    });
  });

  test("should open and close event listeners", () => {
    let callbackInvoked = false;
    const eventName = "test-event";

    const events: Events = createEvents({
      contracts: contracts,
      names: [eventName],
      callback: () => {
        callbackInvoked = true;
      }
    });

    strictEqual(events.isOpen(), false);

    const autoClose = events.open();
    strictEqual(events.isOpen(), true);

    process.emit(eventName);
    strictEqual(callbackInvoked, true);

    callbackInvoked = false; // reset for next test

    autoClose.close();
    strictEqual(events.isOpen(), false);

    process.emit(eventName);
    strictEqual(callbackInvoked, false); // should not be invoked after close
  });

  test("should handle multiple open calls safely", () => {
    let callbackCount = 0;
    const eventName = "test-event-multiple";

    const events: Events = createEvents({
      contracts: contracts,
      names: [eventName],
      callback: () => {
        callbackCount++;
      }
    });

    const autoClose1 = events.open();
    const autoClose2 = events.open(); // should be no-op

    strictEqual(events.isOpen(), true);

    process.emit(eventName);
    strictEqual(callbackCount, 1);

    autoClose1.close();
    strictEqual(events.isOpen(), false);

    process.emit(eventName);
    strictEqual(callbackCount, 1); // should not increment after close

    autoClose2.close(); // should be no-op
  });

  test("should handle close without open gracefully", () => {
    const events: Events = createEvents({
      contracts: contracts,
      names: ["non-existent-event"],
      callback: () => { }
    });

    strictEqual(events.isOpen(), false);

    // Closing without opening should be a no-op
    const autoClose = events.open();
    autoClose.close();
    autoClose.close(); // second close should be no-op

    strictEqual(events.isOpen(), false);
  });


  it('raised events should invoke the callback', () => {
    let invoked = false;
    const eventName = 'test-callback-invocation';

    const events: Events = createEvents({
      contracts: contracts,
      names: [eventName],
      callback: () => {
        invoked = true;
      }
    });

    const autoClose = events.open();
    process.emit(eventName);
    strictEqual(invoked, true);
    strictEqual(events.isOpen(), true);

    autoClose.close();
    strictEqual(events.isOpen(), false);
  });
});
