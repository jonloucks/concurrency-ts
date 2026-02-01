import { ok } from "node:assert";

import { CONTRACT, IdempotentFactory, guard } from "@jonloucks/concurrency-ts/api/IdempotentFactory";
import { Concurrency, createConcurrency } from "@jonloucks/concurrency-ts";
import { AutoClose, Contracts, CONTRACTS, isPresent } from "@jonloucks/contracts-ts";
import { Idempotent, Config as IdempotenConfig, guard as idempotentGuard } from "@jonloucks/concurrency-ts/api/Idempotent";
import { guard as stateMachineGuard } from "@jonloucks/concurrency-ts/api/StateMachine";
import { assertContract, assertGuard } from "./helper.test";
import { AUTO_CLOSE_NONE } from "@jonloucks/contracts-ts/api/AutoClose";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createIdempotent'
];

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'IdempotentFactory');

describe('IdempotentFactory Tests', () => {
  let contracts: Contracts = CONTRACTS;
  let concurrency: Concurrency;
  let closeConcurrency: AutoClose;
  let factory: IdempotentFactory;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: contracts });
    closeConcurrency = concurrency.open();
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeConcurrency.close();
  });

  it('isIdempotentFactory should return true for IdempotentFactory', () => {
    ok(guard(factory), 'IdempotentFactory should return true');
  });

  it('createIdempotent should create a Idempotent instance', () => {
    const config: IdempotenConfig = {
      open: () => AUTO_CLOSE_NONE // a simple noop open function
    };
    const idempotent: Idempotent = factory.createIdempotent(config);
    ok(idempotent, 'Idempotent instance should be created');
    ok(idempotentGuard(idempotent), 'Created instance should be Idempotent');
    ok(isPresent(idempotent.getState()), 'Idempotent should have a state');
    ok(stateMachineGuard(idempotent.getStateMachine()), 'Created instance should have a StateMachine');
  });
});
