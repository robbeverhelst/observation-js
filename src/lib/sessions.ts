import type { ObservationClient } from '../core/client';
import type {
  CreateSessionPayload,
  Observation,
  Paginated,
  Session,
  UpdateSessionPayload,
} from '../types';

export class Sessions {
  #client: ObservationClient;

  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * List sessions for the current user.
   * @returns A paginated list of sessions.
   */
  async list(): Promise<Paginated<Session>> {
    return this.#client.request<Paginated<Session>>('/api/v2/user/sessions/', {
      method: 'GET',
    });
  }

  /**
   * Create a new session.
   * @param payload - The data for the new session.
   * @returns The created session.
   */
  async create(payload: CreateSessionPayload): Promise<Session> {
    return this.#client.request<Session>('/api/v2/sessions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Update an existing session.
   * @param payload - The data to update the session with. A session will be created if a session with the given uuid does not exist.
   * @returns The updated session.
   */
  async update(payload: UpdateSessionPayload): Promise<Session> {
    return this.#client.request<Session>('/api/v2/sessions/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  /**
   * List observations of a session.
   * @param uuid - The UUID of the session.
   * @returns A paginated list of observations for the session.
   */
  async listObservations(uuid: string): Promise<Paginated<Observation>> {
    return this.#client.request<Paginated<Observation>>(
      `/api/v2/user/sessions/${uuid}/observations/`,
      {
        method: 'GET',
      },
    );
  }
} 