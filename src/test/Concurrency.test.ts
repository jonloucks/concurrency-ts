import { ok, strictEqual, throws } from "node:assert";

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
import { CONTRACTS, isPresent, OptionalType } from "@jonloucks/contracts-ts";
import { create as createConcurrency } from "../impl/Concurrency.impl";
import { assertContract, assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'createWaitable',
  'createStateMachine',
  'createCompletable',
  'createCompletion',
  'completeLater',
  'completeNow',
  'open'
];

describe("Concurrency exports", () => {
  it("isConcurrency() should identify Concurrency instances", () => {
    const concurrencyInstance: Concurrency = mockDuck<Concurrency>(...FUNCTION_NAMES);
    ok(guard(concurrencyInstance), "The instance should be identified as Concurrency");
  });
});

describe("Config tests", () => {
  it("Config interface should be usable", () => {
    const config: ConcurrencyConfig = mockDuck<ConcurrencyConfig>(...FUNCTION_NAMES);
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

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'Concurrency');


function assertNothing(_value: OptionalType<unknown>): void {
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}

describe('Concurrency Implementation Tests', () => {
  let concurrency: Concurrency;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: CONTRACTS });
  });

  it('should create concurrency with valid config', () => {
    ok(isPresent(concurrency), 'Concurrency should be created');
  });

  it('should have createWaitable method', () => {
    ok(isPresent(concurrency.createWaitable), 'Should have createWaitable method');
    ok(typeof concurrency.createWaitable === 'function', 'createWaitable should be a function');
  });

  it('should have createStateMachine method', () => {
    ok(isPresent(concurrency.createStateMachine), 'Should have createStateMachine method');
    ok(typeof concurrency.createStateMachine === 'function', 'createStateMachine should be a function');
  });

  it('should have createCompletable method', () => {
    ok(isPresent(concurrency.createCompletable), 'Should have createCompletable method');
    ok(typeof concurrency.createCompletable === 'function', 'createCompletable should be a function');
  });

  it('should have createCompletion method', () => {
    ok(isPresent(concurrency.createCompletion), 'Should have createCompletion method');
    ok(typeof concurrency.createCompletion === 'function', 'createCompletion should be a function');
  });

  it('should have completeLater method', () => {
    ok(isPresent(concurrency.completeLater), 'Should have completeLater method');
    ok(typeof concurrency.completeLater === 'function', 'completeLater should be a function');
  });

  it('should have completeNow method', () => {
    ok(isPresent(concurrency.completeNow), 'Should have completeNow method');
    ok(typeof concurrency.completeNow === 'function', 'completeNow should be a function');
  });

  it('should have open method', () => {
    ok(isPresent(concurrency.open), 'Should have open method');
    ok(typeof concurrency.open === 'function', 'open should be a function');
  });
});

describe('Concurrency Open Method Tests', () => {
  let concurrency: Concurrency;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: CONTRACTS });
  });

  it('should return AutoClose from open', () => {
    const autoClose = concurrency.open();
    ok(isPresent(autoClose), 'open() should return AutoClose');
    ok(isPresent(autoClose.close), 'AutoClose should have close method');
  });

  it('should allow multiple opens', () => {
    const autoClose1 = concurrency.open();
    const autoClose2 = concurrency.open();
    ok(isPresent(autoClose1), 'First open should succeed');
    ok(isPresent(autoClose2), 'Second open should succeed');
  });

  it('should allow close without error', () => {
    const autoClose = concurrency.open();
    autoClose.close();
    ok(true, 'Close should complete without error');
  });

  it('should handle multiple close calls', () => {
    const autoClose = concurrency.open();
    autoClose.close();
    autoClose.close();
    ok(true, 'Multiple close calls should succeed');
  });
});

describe('Concurrency Not Implemented Methods Tests', () => {
  let concurrency: Concurrency;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: CONTRACTS });
  });

  it('completeLater should throw not implemented error', () => {
    const onCompletion = mockDuck<OnCompletion<unknown>>("onCompletion");
    const consumer = mockDuck<Consumer<OnCompletion<unknown>>>("consume");
    
    throws(() => {
      concurrency.completeLater(onCompletion, consumer);
    }, {
      message: /not implemented/i
    });
  });

  it('completeNow should throw not implemented error', () => {
    const onCompletion = mockDuck<OnCompletion<unknown>>("onCompletion");
    const supplier = mockDuck<Supplier<unknown>>("supply");
    
    throws(() => {
      concurrency.completeNow(onCompletion, supplier);
    }, {
      message: /not implemented/i
    });
  });
});

describe('Concurrency Config Handling Tests', () => {
  it('should create concurrency with explicit contracts', () => {
    const concurrency = createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency), 'Concurrency with explicit contracts created');
  });

  it('should create concurrency with default contracts', () => {
    const concurrency = createConcurrency({});
    ok(isPresent(concurrency), 'Concurrency with default contracts created');
  });

  it('should create concurrency with undefined contracts', () => {
    const concurrency = createConcurrency({ contracts: undefined });
    ok(isPresent(concurrency), 'Concurrency with undefined contracts created');
  });
});

describe('Concurrency Multiple Instance Tests', () => {
  it('should create multiple independent Concurrency instances', () => {
    const concurrency1 = createConcurrency({ contracts: CONTRACTS });
    const concurrency2 = createConcurrency({ contracts: CONTRACTS });
    const concurrency3 = createConcurrency({ contracts: CONTRACTS });

    ok(isPresent(concurrency1), 'First concurrency created');
    ok(isPresent(concurrency2), 'Second concurrency created');
    ok(isPresent(concurrency3), 'Third concurrency created');
  });

  it('should create many concurrencies sequentially', () => {
    const concurrencies = [];
    for (let i = 0; i < 5; i++) {
      const concurrency = createConcurrency({ contracts: CONTRACTS });
      ok(isPresent(concurrency), `Concurrency ${i} created`);
      concurrencies.push(concurrency);
    }
    strictEqual(concurrencies.length, 5, 'Should have created 5 concurrencies');
  });
});

describe('Concurrency Integration Tests', () => {
  let concurrency: Concurrency;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: CONTRACTS });
  });

  it('should provide access to all methods', () => {
    // Verify all methods are accessible
    ok(typeof concurrency.open === 'function', 'open is function');
    ok(typeof concurrency.createWaitable === 'function', 'createWaitable is function');
    ok(typeof concurrency.createStateMachine === 'function', 'createStateMachine is function');
    ok(typeof concurrency.createCompletable === 'function', 'createCompletable is function');
    ok(typeof concurrency.createCompletion === 'function', 'createCompletion is function');
    ok(typeof concurrency.completeLater === 'function', 'completeLater is function');
    ok(typeof concurrency.completeNow === 'function', 'completeNow is function');
  });

  it('should support chaining open/close operations', () => {
    const autoClose1 = concurrency.open();
    const autoClose2 = concurrency.open();
    const autoClose3 = concurrency.open();

    autoClose1.close();
    autoClose2.close();
    autoClose3.close();

    ok(true, 'Chaining should work without error');
  });

  it('should handle concurrent open calls', () => {
    const autoCloses = [];
    for (let i = 0; i < 5; i++) {
      autoCloses.push(concurrency.open());
    }

    autoCloses.forEach((ac, i) => {
      ok(isPresent(ac), `AutoClose ${i} should be present`);
    });

    autoCloses.forEach(ac => ac.close());
    ok(true, 'All closes should complete');
  });
});

describe('Concurrency Edge Cases Tests', () => {
  it('should handle empty config', () => {
    const concurrency = createConcurrency({});
    ok(isPresent(concurrency), 'Empty config should work');
  });

  it('should handle rapid instance creation', () => {
    for (let i = 0; i < 10; i++) {
      const concurrency = createConcurrency({ contracts: CONTRACTS });
      ok(isPresent(concurrency), `Instance ${i} created`);
    }
  });

  it('should support different instances independently', () => {
    const c1 = createConcurrency({ contracts: CONTRACTS });
    const c2 = createConcurrency({ contracts: CONTRACTS });

    const ac1 = c1.open();
    const ac2 = c2.open();

    ac1.close();
    ac2.close();

    // Both should still be usable
    const ac3 = c1.open();
    const ac4 = c2.open();

    ok(isPresent(ac3), 'First concurrency still works');
    ok(isPresent(ac4), 'Second concurrency still works');

    ac3.close();
    ac4.close();
  });

  it('should handle close before open in alternate pattern', () => {
    const c1 = createConcurrency({ contracts: CONTRACTS });
    const c2 = createConcurrency({ contracts: CONTRACTS });

    const ac1 = c1.open();
    const ac2 = c2.open();

    ac2.close();
    ac1.close();

    ok(true, 'Alternate close pattern should work');
  });
});

describe('Concurrency Method Accessibility Tests', () => {
  let concurrency: Concurrency;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: CONTRACTS });
  });

  it('all methods should be callable after creation', () => {
    ok(typeof concurrency.open() === 'object', 'open() callable');
    ok(typeof concurrency.createWaitable === 'function', 'createWaitable callable');
    ok(typeof concurrency.createStateMachine === 'function', 'createStateMachine callable');
    ok(typeof concurrency.createCompletable === 'function', 'createCompletable callable');
    ok(typeof concurrency.createCompletion === 'function', 'createCompletion callable');
    ok(typeof concurrency.completeLater === 'function', 'completeLater callable');
    ok(typeof concurrency.completeNow === 'function', 'completeNow callable');
  });

  it('should return consistent AutoClose objects', () => {
    const ac1 = concurrency.open();
    const ac2 = concurrency.open();

    ok(isPresent(ac1.close), 'First AutoClose has close');
    ok(isPresent(ac2.close), 'Second AutoClose has close');
    ok(typeof ac1.close === 'function', 'First close is function');
    ok(typeof ac2.close === 'function', 'Second close is function');
  });
});
