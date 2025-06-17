import type { ObservationClient } from '../core/client';
import type { Language, Paginated } from '../types';

export class Languages {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of all languages supported by the API.
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to a paginated list of language objects.
   * @throws {ApiError} If the request fails.
   */
  public async list(): Promise<Paginated<Language>> {
    return this.#client.publicRequest<Paginated<Language>>('languages/', {
      method: 'GET',
      clientCache: true,
    });
  }
}
