import { fail, ok, strictEqual, throws } from "node:assert";

import { ConcurrencyException } from "../api/ConcurrencyException";
import { Internal } from "./Internal.impl";

describe("Internal throwAggregateError", () => {

  it("with single error throws that error", () => {
    const singleError = new Error("Single error occurred.");
    throws(() => {
      Internal.throwAggregateError("Aggregate error:", singleError);
    }, {
      name: 'Error',
      message: "Single error occurred."
    });
  });

  it("with multiple errors throws ConcurrencyException with aggregated messages", () => {
    const error1 = new Error("First error.");
    const error2 = new Error("Second error.");
    const error3 = "Third error as string.";

    try {
      Internal.throwAggregateError("Multiple errors occurred:", error1, error2, error3);
      fail("Expected throwAggregateError to throw.");
    } catch (e) {
      ok(e instanceof ConcurrencyException);
      const expectedMessage =
        "Multiple errors occurred:\n" +
        "- First error.\n" +
        "- Second error.\n" +
        "- Third error as string.";
      strictEqual(e.message, expectedMessage);
    }
  });
});