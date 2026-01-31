import { CompletionFactory } from '@jonloucks/concurrency-ts/api/CompletionFactory';
import { Completion, CompletionConfig, Config as CurrencyConfig } from '@jonloucks/concurrency-ts/api/Concurrency';
import { RequiredType } from '@jonloucks/contracts-ts';

import { create as createCompletionImpl } from './Completion.impl';

/** 
 * Create a new CompletionFactory
 *
 * @param config The concurrency configuration used to create the factory.
 * @return the new CompletionFactory
 */
export function create(config: CurrencyConfig): CompletionFactory {
  return CompletionFactoryImpl.createInternal(config);
}

// ---- Implementation details below ----

class CompletionFactoryImpl implements CompletionFactory {

  createCompletion<T>(config: CompletionConfig<T>): RequiredType<Completion<T>> {
    return createCompletionImpl<T>(config);
  }

  static createInternal(config: CurrencyConfig): CompletionFactory {
    return new CompletionFactoryImpl(config);
  }

  private constructor(config: CurrencyConfig) {
    this.concurrencyConfig = config;
  }
  private readonly concurrencyConfig: CurrencyConfig;
} 