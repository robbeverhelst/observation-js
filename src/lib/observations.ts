import type { ObservationClient } from '../core/client';
import type {
  CreateObservationOptions,
  CreateObservationPayload,
  Observation,
  UpdateObservationPayload,
} from '../types';

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

  /**
   * Creates a new observation.
   * This is an authenticated endpoint.
   * @param payload The observation data.
   * @param options Optional synchronous file uploads.
   * @returns The created observation object.
   */
  public async create(
    payload: CreateObservationPayload,
    options: CreateObservationOptions = {}
  ): Promise<Observation> {
    const { upload_photos, upload_sounds } = options;

    if (upload_photos?.length || upload_sounds?.length) {
      const formData = new FormData();
      formData.append('observation', JSON.stringify(payload));
      upload_photos?.forEach((photo) =>
        formData.append('upload_photos', photo)
      );
      upload_sounds?.forEach((sound) =>
        formData.append('upload_sounds', sound)
      );
      return this.client.request<Observation>('observations/create-single/', {
        method: 'POST',
        body: formData,
      });
    }

    return this.client.request<Observation>('observations/create-single/', {
      method: 'POST',
      body: payload as any,
    });
  }

  /**
   * Updates an existing observation.
   * This is an authenticated endpoint.
   * @param id The ID of the observation to update.
   * @param payload The observation data to update.
   * @param options Optional synchronous file uploads.
   * @returns The updated observation object.
   */
  public async update(
    id: number,
    payload: UpdateObservationPayload,
    options: CreateObservationOptions = {}
  ): Promise<Observation> {
    const { upload_photos, upload_sounds } = options;

    if (upload_photos?.length || upload_sounds?.length) {
      const formData = new FormData();
      formData.append('observation', JSON.stringify(payload));
      upload_photos?.forEach((photo) =>
        formData.append('upload_photos', photo)
      );
      upload_sounds?.forEach((sound) =>
        formData.append('upload_sounds', sound)
      );
      return this.client.request<Observation>(`observations/${id}/update/`, {
        method: 'POST',
        body: formData,
      });
    }

    return this.client.request<Observation>(`observations/${id}/update/`, {
      method: 'POST',
      body: payload as any,
    });
  }
} 