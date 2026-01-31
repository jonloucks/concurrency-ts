import { OptionalType, RequiredType, Throwable } from "@jonloucks/concurrency-ts/api/Types";
import { CompletionState } from "@jonloucks/concurrency-ts/api/CompletionState";

export { CompletionState };

/** Completion
 *
 * @param <T> the type of completion value  
 */
export interface Completion<T> {

  /** The completion state */
  state: RequiredType<CompletionState>;

  /** The optional thrown exception */
  thrown?: OptionalType<Throwable<unknown>>;

  /** The optional completion value */
  value?: OptionalType<T>;

  /** The optional associated Future */
  promise?: OptionalType<Promise<T>>;
}
