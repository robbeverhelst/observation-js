import type { ObservationClient } from '../core/client';
import type {
  CreateObservationOptions,
  CreateObservationPayload,
  Observation,
  UpdateObservationPayload,
} from '../types';

// Types for observation search and filtering
interface ObservationSearchParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  country?: string;
  modified_after?: string;
  observation_date_after?: string;
  observation_date_before?: string;
  species_group?: number;
  rarity?: number;
  user?: number;
  species?: number;
}

interface AroundPointParams extends ObservationSearchParams {
  lng: number;
  lat: number;
  radius_km?: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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

  /**
   * Search/list observations with filtering options.
   * Note: General observation listing may not be available. Use more specific methods like getBySpecies, getByLocation, etc.
   *
   * @param params - Search and filtering parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {ApiError} If the request fails.
   */
  public async search(params: ObservationSearchParams = {}): Promise<PaginatedResponse<Observation>> {
    // Try alternative endpoints since general observations/ might not exist
    if (params.species) {
      return this.getBySpecies(params.species, params);
    }
    if (params.user) {
      return this.getByUser(params.user, params);
    }
    // Fallback to around-point search if lat/lng provided in extended params
    throw new Error('General observation search not available. Use getBySpecies(), getByUser(), getByLocation(), or getAroundPoint() instead.');
  }

  /**
   * Retrieves observations for a specific species.
   *
   * @param speciesId - The unique identifier of the species.
   * @param params - Optional filtering parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {ApiError} If the request fails.
   */
  public async getBySpecies(
    speciesId: number,
    params: ObservationSearchParams = {},
  ): Promise<PaginatedResponse<Observation>> {
    return this.#client.publicRequest<PaginatedResponse<Observation>>(
      `species/${speciesId}/observations/`,
      { params },
    );
  }

  /**
   * Retrieves related species observations for a specific species.
   * Requires authentication.
   *
   * @param speciesId - The unique identifier of the species.
   * @param params - Optional filtering parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getRelatedBySpecies(
    speciesId: number,
    params: ObservationSearchParams = {},
  ): Promise<PaginatedResponse<Observation>> {
    return this.#client.request<PaginatedResponse<Observation>>(
      `species/${speciesId}/related-observations/`,
      { params },
    );
  }

  /**
   * Retrieves observations for a specific user.
   * If no userId is provided, returns observations for the authenticated user.
   * Requires authentication.
   *
   * @param userId - The unique identifier of the user (optional for current user).
   * @param params - Optional filtering parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getByUser(
    userId?: number,
    params: ObservationSearchParams = {},
  ): Promise<PaginatedResponse<Observation>> {
    const endpoint = userId ? `user/${userId}/observations/` : 'user/observations/';
    return this.#client.request<PaginatedResponse<Observation>>(endpoint, { params });
  }

  /**
   * Retrieves observations for a specific location.
   *
   * @param locationId - The unique identifier of the location.
   * @param params - Optional filtering parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {ApiError} If the request fails.
   */
  public async getByLocation(
    locationId: number,
    params: ObservationSearchParams = {},
  ): Promise<PaginatedResponse<Observation>> {
    return this.#client.publicRequest<PaginatedResponse<Observation>>(
      `locations/${locationId}/observations/`,
      { params },
    );
  }

  /**
   * Retrieves observations around a specific geographic point.
   *
   * @param params - Point coordinates and search parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {ApiError} If the request fails.
   */
  public async getAroundPoint(params: AroundPointParams): Promise<PaginatedResponse<Observation>> {
    return this.#client.publicRequest<PaginatedResponse<Observation>>(
      'observations/around-point/',
      { params },
    );
  }

  /**
   * Retrieves observations that were deleted after a specific timestamp.
   * Requires authentication.
   *
   * @param modifiedAfter - ISO timestamp to get deletions after this point.
   * @returns A promise that resolves to a list of deleted observation IDs.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getDeleted(modifiedAfter: string): Promise<{ results: number[] }> {
    return this.#client.request<{ results: number[] }>('observations/deleted/', {
      params: { modified_after: modifiedAfter },
    });
  }
}
