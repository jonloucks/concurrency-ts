import { ok } from "node:assert";

import { CONTRACT, WaitableFactory, guard } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Concurrency, createConcurrency } from "@jonloucks/concurrency-ts";
import { assertContract, assertGuard, mockDuck } from "./helper.test";

import { isPresent } from "@jonloucks/concurrency-ts/api/Types";
import { Contracts, CONTRACTS } from "@jonloucks/contracts-ts";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createWaitable'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(CONTRACT, 'WaitableFactory');

describe('WaitableFactory Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let concurrency: Concurrency;
  let closeConcurrency: AutoClose;
  let factory: WaitableFactory;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: contracts });
    closeConcurrency = concurrency.open();
    factory = contracts.enforce(CONTRACT);

  });

  afterEach(() => {
    closeConcurrency.close();
  });

  it('isWaitableFactory should return true for WaitableFactory', () => {
    const factory: WaitableFactory = mockDuck<WaitableFactory>(...FUNCTION_NAMES);
    ok(guard(factory), 'WaitableFactory should return true');
  });
 
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