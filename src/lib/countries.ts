import type { ObservationClient } from '../core/client';
import type { CountryList } from '../types';

export class Countries {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches the list of all countries.
   * The names of the countries will be returned in the language set on the client (default: 'en').
   * This is a public endpoint and does not require authentication.
   *
   * Note: because all countries are always returned, the response does not
   * contain a `count` key (hence `CountryList` rather than `Paginated`).
   *
   * @returns A promise that resolves to the list of country objects.
   * @throws {ApiError} If the request fails.
   */
  public async list(): Promise<CountryList> {
    return this.#client.publicRequest<CountryList>('countries/', {
      method: 'GET',
      clientCache: true,
    });
  }
}
