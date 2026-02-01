export { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";

import { create as createConcurrencyFactory } from "./impl/ConcurrencyFactory.impl";
export { VERSION } from "./version";

import { Concurrency, ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";

export {
  Concurrency,
  ConcurrencyConfig,
  ConcurrencyFactory,
  createConcurrencyFactory
};

const CONCURRENCY_FACTORY: ConcurrencyFactory = createConcurrencyFactory({});

/** 
 * Create a new Concurrency instance
 * @param config the Concurrency Config
 *
 * @return the new Concurrency instance
 */
export function createConcurrency(config: ConcurrencyConfig): Concurrency {
  return CONCURRENCY_FACTORY.createConcurrency(config);
}

// /**
//  * A shared global Concurrency instance.
//  */
// export const CONCURRENCY : Concurrency = (() : Concurrency => {
//     const globalConfig : ConcurrencyConfig = { 
//       ratified: true,
//       shutdownEvents: ['exit']
//     };
//     const concurrency = createConcurrency(globalConfig);
//     concurrency.open(); // closed on exit
//     validateConcurrency(concurrency);
//     return concurrency;
// })();


