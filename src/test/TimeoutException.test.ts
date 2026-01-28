import { ok, throws } from "node:assert";

import { TimeoutException, guard } from "@jonloucks/concurrency-ts/api/TimeoutException";
import { ConcurrencyException } from "../api/ConcurrencyException";

describe('TimeoutException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new TimeoutException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });

  it('with message has correct name and message', () => {
    throws(() => {
      throw new TimeoutException("Problem.");
    }, {
      name: 'TimeoutException',
      message: "Problem."
    });
  });

  it ('guard works', () => {
    ok(!guard("hello"), 'guard should return false for non-timeout exceptions');
    ok(guard(new TimeoutException("timeout")), 'guard should return true for TimeoutException instances');
    ok(!guard(new Error("some other error")), 'guard should return false for other Error instances');
    ok(!guard(null), 'guard should return false for null values');
    ok(!guard(new ConcurrencyException("concurrency error")), 'guard should return false for other exception types');
  });
});
