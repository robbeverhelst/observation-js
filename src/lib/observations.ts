import type { ObservationClient } from '../core/client';
import type {
  CreateObservationOptions,
  CreateObservationPayload,
  Observation,
  UpdateObservationPayload,
} from '../types';

export class Observations {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Retrieves a single observation by its ID.
   *
   * @param id The unique identifier of the observation.
   * @returns A promise that resolves to the observation object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async get(id: number): Promise<Observation> {
    return this.#client.request<Observation>(`observations/${id}`);
  }

  /**
   * Creates a new observation.
   *
   * @param payload - The core data for the new observation.
   * @param options - Optional parameters, including media files to upload synchronously.
   * @returns A promise that resolves to the newly created observation object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async create(
    payload: CreateObservationPayload,
    options: CreateObservationOptions = {},
  ): Promise<Observation> {
    const { upload_photos, upload_sounds } = options;

    if (upload_photos?.length || upload_sounds?.length) {
      const formData = new FormData();
      formData.append('observation', JSON.stringify(payload));
      upload_photos?.forEach((photo) =>
        formData.append('upload_photos', photo),
      );
      upload_sounds?.forEach((sound) =>
        formData.append('upload_sounds', sound),
      );
      return this.#client.request<Observation>('observations/create-single/', {
        method: 'POST',
        body: formData,
      });
    }

    return this.#client.request<Observation>('observations/create-single/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Updates an existing observation.
   *
   * @param id - The unique identifier of the observation to update.
   * @param payload - The data to update on the observation.
   * @param options - Optional parameters, including media files to upload synchronously.
   * @returns A promise that resolves to the updated observation object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async update(
    id: number,
    payload: UpdateObservationPayload,
    options: CreateObservationOptions = {},
  ): Promise<Observation> {
    const { upload_photos, upload_sounds } = options;

    if (upload_photos?.length || upload_sounds?.length) {
      const formData = new FormData();
      formData.append('observation', JSON.stringify(payload));
      upload_photos?.forEach((photo) =>
        formData.append('upload_photos', photo),
      );
      upload_sounds?.forEach((sound) =>
        formData.append('upload_sounds', sound),
      );
      return this.#client.request<Observation>(`observations/${id}/update/`, {
        method: 'POST',
        body: formData,
      });
    }

    return this.#client.request<Observation>(`observations/${id}/update/`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Deletes an observation by its ID.
   *
   * @param id The unique identifier of the observation to delete.
   * @returns A promise that resolves when the observation is successfully deleted.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async delete(id: number): Promise<void> {
    await this.#client.request<void>(`observations/${id}/delete/`, {
      method: 'POST',
    });
  }
}
