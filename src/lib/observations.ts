import type { ObservationClient } from '../core/client';
import type { Observation } from '../types';

export class Observations {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Retrieve a single observation by its ID.
   * This is an authenticated endpoint.
   * @param id The ID of the observation.
   * @returns The observation object.
   */
  public async get(id: number): Promise<Observation> {
    return this.client.request<Observation>(`observations/${id}`);
  }
} 