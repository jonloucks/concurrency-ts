export interface ExposedPromise<T> {

  getPromise(): Promise<T>;

  resolve(value: T | PromiseLike<T>): void;
  
  reject(reason?: unknown): void;
}