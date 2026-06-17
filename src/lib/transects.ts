import type { ObservationClient } from '../core/client';
import type { Transect, TransectPayload } from '../types';

const CREATE_OR_UPDATE_ENDPOINT = 'transects/create-or-update/';

export class Transects {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Creates a new transect (legacy V1).
   *
   * Sends a `POST` request to the create-or-update endpoint. If a transect with
   * the given `uuid` already exists, the API responds with `HTTP 409`.
   *
   * @param payload - The writable transect data.
   * @returns A promise that resolves to the created transect.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails (e.g. `409` if the uuid exists).
   */
  public async create(payload: TransectPayload): Promise<Transect> {
    return this.#client.request<Transect>(CREATE_OR_UPDATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Creates or updates a transect (legacy V1).
   *
   * Sends a `PUT` request to the create-or-update endpoint. A `uuid` is
   * mandatory; the transect identified by that `uuid` is updated, or created if
   * it does not yet exist.
   *
   * @param payload - The writable transect data. The `uuid` is mandatory.
   * @returns A promise that resolves to the updated (or created) transect.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async update(payload: TransectPayload): Promise<Transect> {
    return this.#client.request<Transect>(CREATE_OR_UPDATE_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }
}
