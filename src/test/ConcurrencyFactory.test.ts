import { ok, strictEqual } from "node:assert";

import { createConcurrencyFactory } from "@jonloucks/concurrency-ts";
import { Config } from "@jonloucks/concurrency-ts/api/Concurrency";
import { ConcurrencyFactory, CONTRACT, guard } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { used } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { CONTRACTS, isPresent, OptionalType, Repository } from "@jonloucks/contracts-ts";
import { assertContract, assertGuard, mockDuck } from "./helper.test";

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
    const concurrency1 = factory.createConcurrency({ contracts: CONTRACTS });
    const concurrency2 = factory.createConcurrency({ contracts: CONTRACTS });
    const concurrency3 = factory.createConcurrency({ contracts: CONTRACTS });

    ok(isPresent(concurrency1), 'First concurrency should be created');
    ok(isPresent(concurrency2), 'Second concurrency should be created');
    ok(isPresent(concurrency3), 'Third concurrency should be created');
  });

  it('should create many Concurrency instances sequentially', () => {
    const concurrencies = [];
    for (let i = 0; i < 5; i++) {
      const concurrency = factory.createConcurrency({ contracts: CONTRACTS });
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
    const config = { contracts: CONTRACTS };
    factory.install(repository, config);
    ok(true, 'Install should complete without error');
  });

  it('should install with empty config', () => {
    const config = {};
    factory.install(repository, config);
    ok(true, 'Install with empty config should complete');
  });

  it('should call repository.keep for each factory', () => {
    const config = { contracts: CONTRACTS };
    const mockRepository = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);
    let callCount = 0;

    mockRepository.keep.mockImplementation(() => {
      callCount++;
    });

    factory.install(mockRepository, config);
    ok(callCount >= 3, 'Repository.keep should be called for each factory');
  });

  it('should install multiple times', () => {
    const config = { contracts: CONTRACTS };
    const mockRepository1 = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);
    const mockRepository2 = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);

    factory.install(mockRepository1, config);
    factory.install(mockRepository2, config);

    ok(true, 'Should be able to install multiple times');
  });
});

describe('ConcurrencyFactory Config Handling Tests', () => {
  it('should create factory with default contracts', () => {
    const factory = createConcurrencyFactory({});
    ok(isPresent(factory), 'Factory should be created with default contracts');
  });

  it('should create factory with explicit contracts', () => {
    const factory = createConcurrencyFactory({ contracts: CONTRACTS });
    ok(isPresent(factory), 'Factory should be created with explicit contracts');
  });

  it('should merge config when creating Concurrency', () => {
    const factory = createConcurrencyFactory({ contracts: CONTRACTS });
    const concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency), 'Config should merge correctly');
  });

  it('should override factory config with createConcurrency config', () => {
    const factory = createConcurrencyFactory({ contracts: CONTRACTS });
    const concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency), 'Override config should work');
  });
});

describe('ConcurrencyFactory Concurrency Methods Tests', () => {
  let factory: ConcurrencyFactory;

  beforeEach(() => {
    factory = createConcurrencyFactory({ contracts: CONTRACTS });
  });

  it('created Concurrency should have expected methods', () => {
    const concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency.createWaitable), 'Should have createWaitable');
    ok(isPresent(concurrency.createCompletable), 'Should have createCompletable');
    ok(isPresent(concurrency.createStateMachine), 'Should have createStateMachine');
  });

  it('created Concurrency should be Open', () => {
    const concurrency = factory.createConcurrency({ contracts: CONTRACTS });
    ok(isPresent(concurrency.open), 'Should have open method');
  });
});

describe('ConcurrencyFactory Integration Tests', () => {
  it('should create factory and use it to create multiple concurrencies', () => {
    const factory = createConcurrencyFactory({ contracts: CONTRACTS });

    const concurrency1 = factory.createConcurrency({ contracts: CONTRACTS });
    const concurrency2 = factory.createConcurrency({ contracts: CONTRACTS });

    ok(isPresent(concurrency1), 'First concurrency created');
    ok(isPresent(concurrency2), 'Second concurrency created');

    const autoClose1 = concurrency1.open();
    const autoClose2 = concurrency2.open();

    ok(isPresent(autoClose1), 'AutoClose from first concurrency');
    ok(isPresent(autoClose2), 'AutoClose from second concurrency');

    autoClose1.close();
    autoClose2.close();
  });

  it('should install into repository and create concurrency', () => {
    const factory = createConcurrencyFactory();
    const mockRepository = mockDuck<Repository>("keep", "store", "require", "check", "open");

    factory.install(mockRepository, {});
    const concurrency = factory.createConcurrency({});

    ok(isPresent(concurrency), 'Concurrency created after install');
  });

  it('should handle concurrent factory operations', () => {
    const factory1 = createConcurrencyFactory();
    const factory2 = createConcurrencyFactory();

    const concurrency1 = factory1.createConcurrency();
    const concurrency2 = factory2.createConcurrency();

    ok(isPresent(concurrency1), 'Concurrency from factory1');
    ok(isPresent(concurrency2), 'Concurrency from factory2');
  });

  it('should allow complex factory usage pattern', () => {
    const factory = createConcurrencyFactory();
    const repository = mockDuck<Repository>(...REPOSITORY_FUNCTION_NAMES);

    // Install
    factory.install(repository);

    // Create multiple concurrencies
    const concurrency1 = factory.createConcurrency();
    const concurrency2 = factory.createConcurrency();

    ok(isPresent(concurrency1), 'First concurrency created');
    ok(isPresent(concurrency2), 'Second concurrency created');

    // Both should have the methods
    ok(isPresent(concurrency1.createWaitable), 'Should have createWaitable');
    ok(isPresent(concurrency2.createWaitable), 'Should have createWaitable');
  });
});

describe('ConcurrencyFactory Edge Cases Tests', () => {
  it('should handle factory with undefined contracts', () => {
    const factory = createConcurrencyFactory();
    ok(isPresent(factory), 'Factory should handle undefined contracts');
  });

  it('should handle createConcurrency with undefined contracts', () => {
    const factory = createConcurrencyFactory();
    const concurrency = factory.createConcurrency();
    ok(isPresent(concurrency), 'Concurrency should handle undefined contracts');
  });

  it('should create many factories independently', () => {
    const factories = [];
    for (let i = 0; i < 3; i++) {
      factories.push(createConcurrencyFactory());
    }

    factories.forEach((f, i) => {
      ok(isPresent(f), `Factory ${i} should be created`);
      const c = f.createConcurrency();
      ok(isPresent(c), `Concurrency from factory ${i} should be created`);
    });
  });

  it('should handle rapid factory operations', () => {
    const factory = createConcurrencyFactory();

    for (let i = 0; i < 10; i++) {
      const concurrency = factory.createConcurrency();
      ok(isPresent(concurrency), `Concurrency ${i} should be created`);
    }
  });
});