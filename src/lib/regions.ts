import type { ObservationClient } from '../core/client';
import type { Region, RegionType } from '../types';

export class Regions {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches a list of regions.
   * @returns A promise that resolves to a list of regions.
   */
  async list(): Promise<Region[]> {
    return this.client.publicRequest<Region[]>('regions/');
  }

  /**
   * Fetches a list of region types.
   * @returns A promise that resolves to a list of region types.
   */
  async listTypes(): Promise<RegionType[]> {
    return this.client.publicRequest<RegionType[]>('region-types/');
  }
} 