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

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of observation sessions for the authenticated user.
   *
   * @returns A promise that resolves to a paginated list of sessions.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  async list(): Promise<Paginated<Session>> {
    return this.#client.request<Paginated<Session>>('/api/v2/user/sessions/', {
      method: 'GET',
    });
  }

  /**
   * Creates a new observation session.
   *
   * @param payload - The data for the new session.
   * @returns A promise that resolves to the newly created session object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  async create(payload: CreateSessionPayload): Promise<Session> {
    return this.#client.request<Session>('/api/v2/sessions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Updates an existing observation session.
   * If a session with the given UUID does not exist, a new one will be created.
   *
   * @param payload - The data to update the session with, including its UUID.
   * @returns A promise that resolves to the updated or created session object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  async update(payload: UpdateSessionPayload): Promise<Session> {
    return this.#client.request<Session>('/api/v2/sessions/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Fetches the observations associated with a specific session.
   *
   * @param uuid - The unique identifier (UUID) of the session.
   * @returns A promise that resolves to a paginated list of observations for the session.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
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