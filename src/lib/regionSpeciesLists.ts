import type { ObservationClient } from '../core/client';
import type { RegionSpecies, RegionSpeciesList } from '../types';

export class RegionSpeciesLists {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches the available combinations of region and species group.
   * @returns A promise that resolves to a list of region species lists.
   */
  public async list(): Promise<RegionSpeciesList[]> {
    return this.client.publicRequest<RegionSpeciesList[]>('region-lists/');
  }

  /**
   * Fetches the species in a specific region list.
   * @param listId The ID of the region list.
   * @returns A promise that resolves to a list of species for the given list.
   */
  public async getSpecies(listId: number): Promise<RegionSpecies[]> {
    return this.client.publicRequest<RegionSpecies[]>(
      `region-lists/${listId}/species/`
    );
  }
} 