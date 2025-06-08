import type { ObservationClient } from '../core/client';
import type { Language, Paginated } from '../types';

export class Languages {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches a list of all supported languages.
   * @returns A promise that resolves to a paginated list of languages.
   */
  public async list(): Promise<Paginated<Language>> {
    return this.client.publicRequest<Paginated<Language>>('languages/');
  }
} 