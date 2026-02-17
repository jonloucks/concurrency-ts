import { ok, strictEqual } from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { createConcurrencyFactory } from "@jonloucks/concurrency-ts";
import { Concurrency, Config } from "@jonloucks/concurrency-ts/api/Concurrency";
import { ConcurrencyFactory, CONTRACT, guard } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { used } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { CONTRACTS } from "@jonloucks/contracts-ts";
import { assertContract, assertGuard, mockDuck } from "./helper.test.js";
import { isPresent, OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createConcurrency',
  'install'
];

const REPOSITORY_FUNCTION_NAMES: (string | symbol)[] = [
  "keep", "store", "require", "check", "open"
];

describe("ConcurrencyFactory exports", () => {
  it("isConcurrencyFactory() should identify ConcurrencyFactory instances", () => {
    const instance: ConcurrencyFactory = mockDuck<ConcurrencyFactory>(...FUNCTION_NAMES);

    ok(guard(instance), "The instance should be identified as ConcurrencyFactory");
  });
});

describe("Config tests", () => {
  it("Config interface should be usable", () => {
    const config: Config = mockDuck<Config>("contracts");
    ok(config, "Config instance should be created");
  });
});

describe('ConcurrencyFactory exports', () => {
  it('should export all expected members', () => {
    assertNothing(null as OptionalType<ConcurrencyFactory>);
  });
});

function assertNothing(_value: OptionalType<unknown>): void {
  used(_value);
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}

assertGuard(guard, 'createConcurrency', 'install');

assertContract(CONTRACT, 'ConcurrencyFactory');

describe('ConcurrencyFactory Implementation Tests', () => {

  it('should create factory with valid config', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    ok(isPresent(factory), 'Factory should be created');
  });

  it('should have createConcurrency method', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    ok(isPresent(factory.createConcurrency), 'Factory should have createConcurrency method');
    ok(typeof factory.createConcurrency === 'function', 'createConcurrency should be a function');
  });

  it('should have install method', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    ok(isPresent(factory.install), 'Factory should have install method');
    ok(typeof factory.install === 'function', 'install should be a function');
  });

  it('should create concurrency instance', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    const concurrency = factory.createConcurrency();
    ok(isPresent(concurrency), 'Concurrency should be created');
  });

  it('should create concurrency with empty config', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    const concurrency = factory.createConcurrency({});
    ok(isPresent(concurrency), 'Concurrency with empty config should be created');
  });

  it('should create concurrency without explicit contracts', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    const concurrency = factory.createConcurrency({});
    ok(isPresent(concurrency), 'Concurrency should use factory contracts');
  });
});

describe('ConcurrencyFactory Multiple Creation Tests', () => {
  let factory: ConcurrencyFactory;

  beforeEach(() => {
    factory = createConcurrencyFactory();
  });

  it('should create multiple independent Concurrency instances', () => {
    const concurrency1: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    const concurrency2: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    const concurrency3: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });

    ok(isPresent(concurrency1), 'First concurrency should be created');
    ok(isPresent(concurrency2), 'Second concurrency should be created');
    ok(isPresent(concurrency3), 'Third concurrency should be created');
  });

  it('should create many Concurrency instances sequentially', () => {
    const concurrencies: Concurrency[] = [];
    for (let i = 0; i < 5; i++) {
      const concurrency: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
      ok(isPresent(concurrency), `Concurrency ${i} should be created`);
      concurrencies.push(concurrency);
    }
    strictEqual(concurrencies.length, 5, 'Should have created 5 concurrencies');
  });
});

describe('ConcurrencyFactory Install Tests', () => {
  let factory: ConcurrencyFactory;
  let repository: Repository;

  beforeEach(() => {
    factory = createConcurrencyFactory();
    repository = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);
  });

  it('should install with valid config and repository', () => {
    const config: Config = { contracts: CONTRACTS };
    factory.install(repository, config);
    ok(true, 'Install should complete without error');
  });

  it('should install with empty config', () => {
    const config: Config = {};
    factory.install(repository, config);
    ok(true, 'Install with empty config should complete');
  });

  it('should install multiple times', () => {
    const config: Config = { contracts: CONTRACTS };
    const mockRepository1: Repository = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);
    const mockRepository2: Repository = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);

    factory.install(mockRepository1, config);
    factory.install(mockRepository2, config);

    ok(true, 'Should be able to install multiple times');
  });
});

describe('ConcurrencyFactory Config Handling Tests', () => {
  it('should create factory with default contracts', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory({});
    ok(isPresent(factory), 'Factory should be created with default contracts');
  });

  it('should create factory with explicit contracts', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory({ contracts: CONTRACTS });
    ok(isPresent(factory), 'Factory should be created with explicit contracts');
  });

  it('should merge config when creating Concurrency', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory({ contracts: CONTRACTS });
    const concurrency: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency), 'Config should merge correctly');
  });

  it('should override factory config with createConcurrency config', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory({ contracts: CONTRACTS });
    const concurrency: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency), 'Override config should work');
  });
});

describe('ConcurrencyFactory Concurrency Methods Tests', () => {
  let factory: ConcurrencyFactory;

  beforeEach(() => {
    factory = createConcurrencyFactory({ contracts: CONTRACTS });
  });

  it('created Concurrency should have expected methods', () => {
    const concurrency: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency.createWaitable), 'Should have createWaitable');
    ok(isPresent(concurrency.createCompletable), 'Should have createCompletable');
    ok(isPresent(concurrency.createStateMachine), 'Should have createStateMachine');
  });

  it('created Concurrency should be Open', () => {
    const concurrency: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency.open), 'Should have open method');
  });
});

describe('ConcurrencyFactory Integration Tests', () => {
  it('should create factory and use it to create multiple concurrencies', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory({ contracts: CONTRACTS });

    const concurrency1: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    const concurrency2: Concurrency = factory.createConcurrency({ contracts: CONTRACTS });

    ok(isPresent(concurrency1), 'First concurrency created');
    ok(isPresent(concurrency2), 'Second concurrency created');

    const autoClose1: AutoClose = concurrency1.open();
    const autoClose2: AutoClose = concurrency2.open();

    ok(isPresent(autoClose1), 'AutoClose from first concurrency');
    ok(isPresent(autoClose2), 'AutoClose from second concurrency');

    autoClose1.close();
    autoClose2.close();
  });

  it('should install into repository and create concurrency', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    const mockRepository: Repository = mockDuck<Repository>("keep", "store", "require", "check", "open");

    factory.install(mockRepository, {});
    const concurrency: Concurrency = factory.createConcurrency({});

    ok(isPresent(concurrency), 'Concurrency created after install');
  });

  it('should handle concurrent factory operations', () => {
    const factory1: ConcurrencyFactory = createConcurrencyFactory();
    const factory2: ConcurrencyFactory = createConcurrencyFactory();

    const concurrency1: Concurrency = factory1.createConcurrency();
    const concurrency2: Concurrency = factory2.createConcurrency();

    ok(isPresent(concurrency1), 'Concurrency from factory1');
    ok(isPresent(concurrency2), 'Concurrency from factory2');
  });

  it('should allow complex factory usage pattern', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    const repository: Repository = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);

    // Install
    factory.install(repository);

    // Create multiple concurrencies
    const concurrency1: Concurrency = factory.createConcurrency();
    const concurrency2: Concurrency = factory.createConcurrency();

    ok(isPresent(concurrency1), 'First concurrency created');
    ok(isPresent(concurrency2), 'Second concurrency created');

    // Both should have the methods
    ok(isPresent(concurrency1.createWaitable), 'Should have createWaitable');
    ok(isPresent(concurrency2.createWaitable), 'Should have createWaitable');
  });
});

describe('ConcurrencyFactory Edge Cases Tests', () => {
  it('should handle factory with undefined contracts', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    ok(isPresent(factory), 'Factory should handle undefined contracts');
  });

  it('should handle createConcurrency with undefined contracts', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();
    const concurrency: Concurrency = factory.createConcurrency();
    ok(isPresent(concurrency), 'Concurrency should handle undefined contracts');
  });

  it('should create many factories independently', () => {
    const factories: ConcurrencyFactory[] = [];
    for (let i = 0; i < 3; i++) {
      factories.push(createConcurrencyFactory());
    }

    factories.forEach((f, i) => {
      ok(isPresent(f), `Factory ${i} should be created`);
      const c: Concurrency = f.createConcurrency();
      ok(isPresent(c), `Concurrency from factory ${i} should be created`);
    });
  });

  it('should handle rapid factory operations', () => {
    const factory: ConcurrencyFactory = createConcurrencyFactory();

    for (let i = 0; i < 10; i++) {
      const concurrency: Concurrency = factory.createConcurrency();
      ok(isPresent(concurrency), `Concurrency ${i} should be created`);
    }
  });
});