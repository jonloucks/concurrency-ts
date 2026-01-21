import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { ConcurrencyFactory, isConcurrencyFactory, CONTRACT} from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { OptionalType } from "@jonloucks/contracts-ts";
import { Config } from "../api/Concurrency";
import { assertContract, assertDuck } from "./helper.test";

describe("ConcurrencyFactory exports", () => {
  it("isConcurrencyFactory() should identify ConcurrencyFactory instances", () => {
    const instance: ConcurrencyFactory = mock<ConcurrencyFactory>();

    ok(isConcurrencyFactory(instance), "The instance should be identified as ConcurrencyFactory");
  });
});

describe("Config tests", () => {
  it("Config interface should be usable", () => {
    const config: Config = mock<Config>();
    ok(config, "Config instance should be created");
  });
});

describe('ConcurrencyFactory exports', () => {
  it('should export all expected members', () => {
    assertNothing(null as OptionalType<ConcurrencyFactory>);
  });
});

function assertNothing(_value: OptionalType<unknown>): void {
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}

assertDuck(isConcurrencyFactory, 'create', 'install');

assertContract(CONTRACT, 'ConcurrencyFactory');