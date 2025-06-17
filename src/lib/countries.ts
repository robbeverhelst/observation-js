import type { ObservationClient } from '../core/client';
import type { Country, Paginated } from '../types';

export class Countries {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a paginated list of all countries.
   * The names of the countries will be returned in the language set on the client (default: 'en').
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to a paginated list of country objects.
   * @throws {ApiError} If the request fails.
   */
  public async list(): Promise<Paginated<Country>> {
    return this.#client.publicRequest<Paginated<Country>>('countries/', {
      method: 'GET',
      clientCache: true,
    });
  }
}
