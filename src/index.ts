export { VERSION } from "./version";
export { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";

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


