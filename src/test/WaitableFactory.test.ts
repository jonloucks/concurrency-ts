import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { CONTRACT, WaitableFactory, guard } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { assertContract, assertGuard } from "./helper.test";

//TODO: Replace with real import when available
import { create as createWaitableFactory } from "@jonloucks/concurrency-ts/impl/WaitableFactory.impl";
import { isPresent } from "@jonloucks/concurrency-ts/api/Types";

describe('WaitableFactory Tests', () => {
  it('isWaitableFactory should return true for WaitableFactory', () => {
    const factory: WaitableFactory = mock<WaitableFactory>();
    ok(guard(factory), 'WaitableFactory should return true');
  });
});

assertGuard(guard,
  'createWaitable'
);

assertContract(CONTRACT, 'WaitableFactory');

describe('WaitableFactory createWaitable Tests', () => {
  const factory: WaitableFactory = createWaitableFactory();

  it('createWaitable with empty config should create a Waitable', () => {
    const waitable = factory.createWaitable<string>();
    ok(isPresent(waitable), 'createWaitable with config should create a Waitable');
    ok(waitable.supply() === undefined, 'Waitable should have the undefined initial value');  
  });

  it('createWaitable with initial value should create a Waitable', () => {
    const waitable = factory.createWaitable<number>({ initialValue: 42 });
    ok(isPresent(waitable), 'createWaitable with initial value should create a Waitable');
    ok(waitable.supply() === 42, 'Waitable should have the correct initial value');
  });
});