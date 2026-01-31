/** 
 * An ExposedPromise is a Promise with exposed resolve and reject methods.
 *
 * @param <T> the type of promise value
 */
export interface ExposedPromise<T> {

  /** 
   * Get the underlying Promise
   *
   * @return the Promise
   */
  getPromise(): Promise<T>;

  /** 
   * Resolve the Promise with the given value
   *
   * @param value the value to resolve the Promise with
   */
  resolve(value: T | PromiseLike<T>): void;
  
  /** 
   * Reject the Promise with the given reason
   *
   * @param reason the reason to reject the Promise with
   */
  reject(reason?: unknown): void;
}