import type { ObservationClient } from '../core/client';
import type { Region, RegionType } from '../types';

export class Regions {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of all regions.
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to a list of region objects.
   * @throws {ApiError} If the request fails.
   */
  async list(): Promise<Region[]> {
    return this.#client.publicRequest<Region[]>('regions/', {
      method: 'GET',
      cache: true,
    });
  }

  /**
   * Fetches a list of all region types.
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to a list of region type objects.
   * @throws {ApiError} If the request fails.
   */
  async listTypes(): Promise<RegionType[]> {
    return this.#client.publicRequest<RegionType[]>('region-types/', {
      method: 'GET',
      cache: true,
    });
  }
}
