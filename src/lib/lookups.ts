import type { ObservationClient } from '../core/client';
import type { Lookups as LookupsType } from '../types';

export class Lookups {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches all lookup tables from the API.
   * Lookup tables contain constant values used throughout the API,
   * such as validation statuses, rarities, counting methods, etc.
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to an object containing all lookup tables.
   * @throws {ApiError} If the request fails.
   */
  public async get(): Promise<LookupsType> {
    return this.#client.publicRequest<LookupsType>('lookups/', {
      method: 'GET',
      clientCache: true,
    });
  }
}
