import type { CacheStore } from '../types';

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export class InMemoryCache implements CacheStore {
  #cache = new Map<string, CacheEntry<unknown>>();

  public get<T>(key: string): T | undefined {
    const entry = this.#cache.get(key);
    if (!entry) return undefined;

    if (entry.expires > Date.now()) {
      return entry.data as T;
    }

    // Clean up expired entry
    this.#cache.delete(key);
    return undefined;
  }

  public set<T>(key: string, value: T, ttl: number): void {
    this.#cache.set(key, {
      data: value,
      expires: Date.now() + ttl * 1000,
    });
  }

  public delete(key: string): void {
    this.#cache.delete(key);
  }

  public has(key: string): boolean {
    // We check `get` to make sure we don't say we "have" an expired key
    return this.get(key) !== undefined;
  }
}
