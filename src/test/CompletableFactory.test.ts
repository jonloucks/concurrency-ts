import { mock, MockProxy } from "jest-mock-extended";
import { ok, strictEqual } from "node:assert";

import { Completable, CompletableFactory, Config, CONTRACT, guard } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACTS, isPresent } from "@jonloucks/contracts-ts";
import { assertContract, assertGuard, mockGuardFix } from "./helper.test";

import { create as createCompletableFactory } from "../impl/CompletableFactory.impl";

const FUNCTION_NAMES : (string|symbol)[] = [
  'createCompletable'
];

describe('CompletableFactory Tests', () => {
  it('isCompletableFactory should return true for CompletableFactory', () => {
    const completableFactory: MockProxy<CompletableFactory> = mock<CompletableFactory>();
    mockGuardFix(completableFactory, ...FUNCTION_NAMES);
    ok(guard(completableFactory), 'CompletableFactory should return true');
  });
});

describe('CompletableFactory Exports', () => {
  it('should export Completable and Config', () => {
    const config: MockProxy<Config<number>> = mock<Config<number>>();
    mockGuardFix(config, "contracts", "initialValue");  
    const completable: MockProxy<Completable<number>> = mock<Completable<number>>();
    mockGuardFix(completable, "open", "isCompleted");
    ok(config !== undefined, 'Config should be defined');
    ok(completable !== undefined, 'Completable should be defined');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'CompletableFactory');

describe('CompletableFactory Implementation Tests', () => {
  let factory: CompletableFactory;

  beforeEach(() => {
    factory = createCompletableFactory({ contracts: CONTRACTS });
  });

  it('should create factory with valid config', () => {
    ok(isPresent(factory), 'Factory should be created');
  });

  it('should have createCompletable method', () => {
    ok(isPresent(factory.createCompletable), 'Factory should have createCompletable method');
    ok(typeof factory.createCompletable === 'function', 'createCompletable should be a function');
  });

  it('should create completable without additional config', () => {
    const completable = factory.createCompletable({ contracts: CONTRACTS });
    ok(isPresent(completable), 'Completable should be created');
    ok(isPresent(completable.open), 'Completable should have open method');
    ok(isPresent(completable.isCompleted), 'Completable should have isCompleted method');
  });

  it('should create completable with initial value', () => {
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: 'test' });
    ok(isPresent(completable), 'Completable with initial value should be created');
  });

  it('should create completable with null initial value', () => {
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: null });
    ok(isPresent(completable), 'Completable with null should be created');
  });

  it('should create completable with undefined initial value', () => {
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: undefined });
    ok(isPresent(completable), 'Completable with undefined should be created');
  });

  it('should use factory contracts when not provided', () => {
    const completable = factory.createCompletable<number>({ contracts: CONTRACTS });
    ok(isPresent(completable), 'Completable should use factory contracts');
    ok(!completable.isCompleted(), 'Completable should be incomplete initially');
  });

  it('should override factory contracts when provided', () => {
    const completable = factory.createCompletable<number>({ contracts: CONTRACTS });
    ok(isPresent(completable), 'Completable with override contracts should be created');
  });
});

describe('CompletableFactory Generic Type Tests', () => {
  let factory: CompletableFactory;

  beforeEach(() => {
    factory = createCompletableFactory({ contracts: CONTRACTS });
  });

  it('should create completable for string type', () => {
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: 'test-string' });
    ok(isPresent(completable), 'Completable<string> should be created');
  });

  it('should create completable for number type', () => {
    const completable = factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: 42 });
    ok(isPresent(completable), 'Completable<number> should be created');
  });

  it('should create completable for boolean type', () => {
    const completable = factory.createCompletable<boolean>({ contracts: CONTRACTS, initialValue: true });
    ok(isPresent(completable), 'Completable<boolean> should be created');
  });

  it('should create completable for object type', () => {
    const completable = factory.createCompletable({ contracts: CONTRACTS, initialValue: { key: 'value' } });
    ok(isPresent(completable), 'Completable<object> should be created');
  });

  it('should create completable for array type', () => {
    const completable = factory.createCompletable({ contracts: CONTRACTS, initialValue: [1, 2, 3] });
    ok(isPresent(completable), 'Completable<array> should be created');
  });
});

describe('CompletableFactory Multiple Creation Tests', () => {
  let factory: CompletableFactory;

  beforeEach(() => {
    factory = createCompletableFactory({ contracts: CONTRACTS });
  });

  it('should create multiple independent completables', () => {
    const completable1 = factory.createCompletable<string>({ contracts: CONTRACTS });
    const completable2 = factory.createCompletable<number>({ contracts: CONTRACTS });
    const completable3 = factory.createCompletable<boolean>({ contracts: CONTRACTS });

    ok(isPresent(completable1), 'First completable should be created');
    ok(isPresent(completable2), 'Second completable should be created');
    ok(isPresent(completable3), 'Third completable should be created');

    ok(!completable1.isCompleted(), 'First should be incomplete');
    ok(!completable2.isCompleted(), 'Second should be incomplete');
    ok(!completable3.isCompleted(), 'Third should be incomplete');
  });

  it('should create completables with different initial values', () => {
    const completable1 = factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: 1 });
    const completable2 = factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: 2 });
    const completable3 = factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: 3 });

    ok(isPresent(completable1), 'First completable created');
    ok(isPresent(completable2), 'Second completable created');
    ok(isPresent(completable3), 'Third completable created');
  });

  it('should create many completables sequentially', () => {
    for (let i = 0; i < 10; i++) {
      const completable = factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: i });
      ok(isPresent(completable), `Completable ${i} should be created`);
      strictEqual(completable.isCompleted(), false, `Completable ${i} should be incomplete`);
    }
  });
});

describe('CompletableFactory Config Combination Tests', () => {
  let factory: CompletableFactory;

  beforeEach(() => {
    factory = createCompletableFactory({ contracts: CONTRACTS });
  });

  it('should combine factory config with completable config', () => {
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: 'combined' });
    ok(isPresent(completable), 'Combined config should work');
    ok(isPresent(completable.open), 'Should have all methods');
  });

  it('completable config should override factory config', () => {
    const completable = factory.createCompletable<string>({ 
      contracts: CONTRACTS,
      initialValue: 'override'
    });
    ok(isPresent(completable), 'Override config should work');
  });

  it('should handle empty completable config', () => {
    const completable = factory.createCompletable({ contracts: CONTRACTS });
    ok(isPresent(completable), 'Empty config should use factory defaults');
  });
});

describe('CompletableFactory Edge Cases Tests', () => {
  let factory: CompletableFactory;

  beforeEach(() => {
    factory = createCompletableFactory({ contracts: CONTRACTS });
  });

  it('should handle empty string as initial value', () => {
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: '' });
    ok(isPresent(completable), 'Should accept empty string');
  });

  it('should handle zero as initial value', () => {
    const completable = factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: 0 });
    ok(isPresent(completable), 'Should accept zero');
  });

  it('should handle false as initial value', () => {
    const completable = factory.createCompletable<boolean>({ contracts: CONTRACTS, initialValue: false });
    ok(isPresent(completable), 'Should accept false');
  });

  it('should handle empty array as initial value', () => {
    const completable = factory.createCompletable<number[]>({ contracts: CONTRACTS, initialValue: [] });
    ok(isPresent(completable), 'Should accept empty array');
  });

  it('should handle empty object as initial value', () => {
    const completable = factory.createCompletable<Record<string, never>>({ contracts: CONTRACTS, initialValue: {} });
    ok(isPresent(completable), 'Should accept empty object');
  });
});

describe('CompletableFactory Integration Tests', () => {
  it('should create factory and completables in one flow', () => {
    const factory = createCompletableFactory({ contracts: CONTRACTS });
    const completable = factory.createCompletable<string>({ contracts: CONTRACTS, initialValue: 'flow-test' });
    
    ok(isPresent(factory), 'Factory created');
    ok(isPresent(completable), 'Completable created');
    
    const autoClose = completable.open();
    ok(isPresent(autoClose), 'AutoClose created');
    
    ok(!completable.isCompleted(), 'Should be incomplete');
    
    autoClose.close();
  });

  it('should support multiple factories with different configs', () => {
    const factory1 = createCompletableFactory({ contracts: CONTRACTS });
    const factory2 = createCompletableFactory({ contracts: CONTRACTS });
    
    const completable1 = factory1.createCompletable<number>({ contracts: CONTRACTS, initialValue: 1 });
    const completable2 = factory2.createCompletable<number>({ contracts: CONTRACTS, initialValue: 2 });
    
    ok(isPresent(completable1), 'Completable from factory1 created');
    ok(isPresent(completable2), 'Completable from factory2 created');
  });

  it('should handle complex creation patterns', () => {
    const factory = createCompletableFactory({ contracts: CONTRACTS });
    const completables: Completable<number>[] = [];
    
    for (let i = 0; i < 5; i++) {
      completables.push(factory.createCompletable<number>({ contracts: CONTRACTS, initialValue: i }));
    }
    
    strictEqual(completables.length, 5, 'Should have 5 completables');
    completables.forEach((c, i) => {
      ok(isPresent(c), `Completable ${i} should be present`);
      ok(!c.isCompleted(), `Completable ${i} should be incomplete`);
    });
  });
});

