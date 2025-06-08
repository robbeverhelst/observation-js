import type { ObservationClient } from '../core/client';
import type {
  CreateTransectPayload,
  Transect,
  UpdateTransectPayload,
} from '../types';

export class Transects {
  #client: ObservationClient;

  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Create a new transect (V1).
   * @param payload - The data for the new transect.
   * @returns The created transect.
   */
  async create(payload: CreateTransectPayload): Promise<Transect> {
    return this.#client.request<Transect>(
      'transects/create-or-update/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * Update an existing transect (V1).
   * @param payload - The data to update the transect with. A transect will be created if a transect with the given uuid does not exist.
   * @returns The updated transect.
   */
  async update(payload: UpdateTransectPayload): Promise<Transect> {
    return this.#client.request<Transect>(
      'transects/create-or-update/',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  }
} 