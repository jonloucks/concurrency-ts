import { ok } from "node:assert";

import { Completion } from "@jonloucks/concurrency-ts/api/Completion";
import { mockDuck } from "./helper.test";


describe('Completion Exports', () => {
  it('should export Completion and Config', () => {
    const completion: Completion<number> = mockDuck<Completion<number>>();
    ok(completion !== undefined, 'Completion should be defined');
  });
});
