import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import {
    Completable, Completion,
    Concurrency,
    Config as ConcurrencyConfig,
    Consumer,
    CONTRACT,
    guard,
    OnCompletion,
    StateMachine,
    Supplier,
    Waitable
} from "@jonloucks/concurrency-ts/api/Concurrency";
import { OptionalType } from "@jonloucks/contracts-ts";
import { assertContract, assertDuck } from "./helper.test";

describe("Concurrency exports", () => {
  it("isConcurrency() should identify Concurrency instances", () => {
    const concurrencyInstance: Concurrency = mock<Concurrency>();
    ok(guard(concurrencyInstance), "The instance should be identified as Concurrency");
  });
});

describe("Config tests", () => {
  it("Config interface should be usable", () => {
    const config: ConcurrencyConfig = mock<ConcurrencyConfig>();
    ok(config, "Config instance should be created");
  });
});

describe('Concurrency exports', () => {
  it('should export all expected members', () => {
    assertNothing(null as OptionalType<ConcurrencyConfig>);
    assertNothing(null as OptionalType<Concurrency>);
    assertNothing(null as OptionalType<Waitable<unknown>>);
    assertNothing(null as OptionalType<StateMachine<unknown>>);
    assertNothing(null as OptionalType<Completable<unknown>>);
    assertNothing(null as OptionalType<Completion<unknown>>);
    assertNothing(null as OptionalType<OnCompletion<unknown>>);
    assertNothing(null as OptionalType<Supplier<unknown>>);
    assertNothing(null as OptionalType<Consumer<unknown>>);
  });
});

assertDuck(guard,
  'createWaitable',
    'createStateMachine',
    'createCompletable',
    'createCompletion',
    'completeLater',
    'completeNow',
    'open'
);

assertContract(CONTRACT, 'Concurrency');

function assertNothing(_value: OptionalType<unknown>): void {
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}
