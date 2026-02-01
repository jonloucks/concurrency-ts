import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";
import { create as createConcurrencyFactory } from "./impl/ConcurrencyFactory.impl";
import { VERSION } from "./version";
import { Concurrency, ConcurrencyConfig, CONTRACT as CONCURRENCY_CONTRACT } from "@jonloucks/concurrency-ts/api/Concurrency";
import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";

/**
 * A shared global ConcurrencyFactory instance.
 */
const CONCURRENCY_FACTORY: ConcurrencyFactory = createConcurrencyFactory({});

/** 
 * Create a new Concurrency instance
 * @param config the Concurrency Config
 *
 * @return the new Concurrency instance
 */
function createConcurrency(config?: ConcurrencyConfig): Concurrency {
  return CONCURRENCY_FACTORY.createConcurrency(config);
}

/**
 * A shared global Concurrency instance.
 */
const CONCURRENCY : Concurrency = (() : Concurrency => { return createConcurrency();})();

export {
  VERSION,
  Concurrency,
  ConcurrencyConfig,
  ConcurrencyFactory,
  ConcurrencyException,
  createConcurrencyFactory,
  createConcurrency,
  CONCURRENCY,
  CONCURRENCY_CONTRACT,
  CONCURRENCY_FACTORY
};


