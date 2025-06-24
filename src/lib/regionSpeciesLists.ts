import type { ObservationClient } from '../core/client';
import type { RegionSpeciesList, SpeciesData } from '../types';

export class RegionSpeciesLists {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of all available species lists for regions.
   *
   * @returns A promise that resolves to a paginated list of region species lists.
   */
  async list(): Promise<RegionSpeciesList[]> {
    return this.#client.publicRequest<RegionSpeciesList[]>('region-lists/');
  }

  /**
   * Fetches the species for a specific region species list.
   *
   * @param id - The ID of the region species list.
   * @returns A promise that resolves to an array of species in the list.
   */
  async getSpecies(id: number): Promise<SpeciesData[]> {
    return this.#client.publicRequest<SpeciesData[]>(`region-lists/${id}/species/`);
  }
}
