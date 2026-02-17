import { test } from "node:test";
import { ok } from "node:assert";
import { VERSION, CONCURRENCY } from "@jonloucks/concurrency-ts";

test("concurrency-ts exports", () => {
  ok(typeof VERSION === "string", "VERSION should be a string.");
  ok(typeof CONCURRENCY === "object", "CONCURRENCY should be an object.");
});