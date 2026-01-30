import { Completion, CompletionState, Config } from '@jonloucks/concurrency-ts/api/Completion';
import { RequiredType, OptionalType } from '@jonloucks/contracts-ts/api/Types';
import { Throwable } from '@jonloucks/concurrency-ts/api/Types';
import { isTerminalState } from '@jonloucks/concurrency-ts/api/CompletionState';

export function create<T>(config: Config<T>): Completion<T> {
  return CompletionImpl.createInternal(config);
}

// ---- Implementation details below ----

class CompletionImpl<T> implements Completion<T> {
  isCompleted(): boolean {
    return isTerminalState(this.getState());
  }

  getValue(): OptionalType<T> {
    return this.config.value;
  }

  getState(): RequiredType<CompletionState> {
    return this.config.state;
  }

  getThrown(): OptionalType<Throwable<unknown>> {
    return this.config.thrown;
  }

  getPromise(): OptionalType<Promise<T>> {
    return this.config.promise;
  }

  static createInternal<T>(config: Config<T>): Completion<T> {
    return new CompletionImpl<T>(config);
  }

  private constructor(private readonly config: Config<T>) {
  }  
}