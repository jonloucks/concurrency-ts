import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { CompletableFactory, isCompletableFactory, Completable, Config, CONTRACT } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { assertContract, assertDuck } from "./helper.test";

describe('CompletableFactory Tests', () => {
  it('isCompletableFactory should return true for CompletableFactory', () => {
    const completableFactory: CompletableFactory = mock<CompletableFactory>();
    ok(isCompletableFactory(completableFactory), 'CompletableFactory should return true');
  });
});

describe('CompletableFactory Exports', () => {
  it('should export Completable and Config', () => {
    const config: Config<number> = mock<Config<number>>();
    const completable: Completable<number> = mock<Completable<number>>();
    ok(config !== undefined, 'Config should be defined');
    ok(completable !== undefined, 'Completable should be defined');
  });
});

assertDuck(isCompletableFactory, 'createCompletable');

assertContract(CONTRACT, 'CompletableFactory');

