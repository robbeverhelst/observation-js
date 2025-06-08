import type { ObservationClient } from '../core/client';
import type { Lookups as LookupsType } from '../types';

export class Lookups {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches all lookup values (constants) from the API.
   * These values can be used to translate IDs to human-readable names.
   * @returns A promise that resolves to an object containing all lookups.
   */
  public async get(): Promise<LookupsType> {
    return this.client.publicRequest<LookupsType>('lookups/');
  }
} 