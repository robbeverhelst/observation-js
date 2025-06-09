/**
 * @internal
 * The structure of a registered interceptor.
 */
export interface Interceptor<V> {
  onFulfilled: (value: V) => V | Promise<V>;
  onRejected?: (error: unknown) => unknown;
}

/**
 * @internal
 * Manages a collection of interceptors.
 */
export class InterceptorManager<V> {
  private handlers: (Interceptor<V> | null)[] = [];

  /**
   * Adds a new interceptor to the manager.
   *
   * @param onFulfilled - The function to run when the promise is fulfilled.
   * @param onRejected - The function to run when the promise is rejected.
   * @returns An ID that can be used to remove the interceptor later.
   */
  public use(
    onFulfilled: (value: V) => V | Promise<V>,
    onRejected?: (error: unknown) => unknown,
  ): number {
    this.handlers.push({ onFulfilled, onRejected });
    return this.handlers.length - 1;
  }

  /**
   * Removes an interceptor from the manager by its ID.
   *
   * @param id - The ID of the interceptor to remove.
   */
  public eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Iterates over all registered interceptors.
   *
   * @param fn - The function to execute for each interceptor.
   * @internal
   */
  public forEach(fn: (interceptor: Interceptor<V>) => void): void {
    this.handlers.forEach((handler) => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }
}
