import type { ObservationClient } from '../core/client';
import type { CountryList } from '../types';

export class Countries {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches a list of all supported countries.
   * @returns A promise that resolves to the list of countries.
   */
  public async list(): Promise<CountryList> {
    return this.client.publicRequest<CountryList>('countries/');
  }
} 