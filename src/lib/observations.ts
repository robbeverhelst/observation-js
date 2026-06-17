import type { ObservationClient } from '../core/client';
import type {
  CreateObservationOptions,
  CreateObservationPayload,
  DeletedObservation,
  Observation,
  Paginated,
  SyncObservationPayload,
  SyncObservationResult,
  UpdateObservationPayload,
} from '../types';

/**
 * Filtering parameters accepted by the observation list endpoints.
 * See the "Observation filters" section of the API docs.
 */
interface ObservationSearchParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  country?: string;
  /** ISO8601 date or datetime; only observations modified at or after this. */
  modified_since?: string;
  /** ISO8601 date; only observations on or after this date. */
  date_after?: string;
  /** ISO8601 date; only observations on or before this date. */
  date_before?: string;
  species_group?: number;
  rarity?: number;
  activity?: string;
  life_stage?: string;
  /** Free-text search in species/family/location/observer/notes/external refs. */
  search?: string;
  /** Select observations with or without photo (user observations only). */
  has_photo?: boolean;
}

/**
 * Parameters for the "observations around a point" endpoint.
 */
interface AroundPointParams {
  /** Center coordinates as a `latitude,longitude` pair string. Required. */
  coordinates: string;
  /** Only observations within this many days before `end_date`. Required. */
  days: number;
  /** Search radius in meters (default 5000, max 10000). */
  radius?: number;
  /** ISO8601 date; only observations on or before this date (default today). */
  end_date?: string;
  /** Restrict to a single species group. */
  species_group?: number;
  /** Only observations of species with at least this rarity. */
  min_rarity?: number;
  limit?: number;
  offset?: number;
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
   * Helper function to filter out undefined values from params
   * @private
   */
  private filterParams(
    params: ObservationSearchParams | AroundPointParams,
  ): Record<string, string | number | boolean> {
    const filtered: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        filtered[key] = value;
      }
    }
    return filtered;
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
    return this.#client.request<Observation>(`observations/${id}/`);
  }

  /**
   * Creates a new observation via the single-observation endpoint.
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
   * Creates (or updates) multiple observations in one request via the
   * one-way-sync endpoint (`POST /observations/create/`).
   *
   * The endpoint replies with one result per submitted observation, in order:
   * on success the URL of the created/updated observation, otherwise an object
   * describing the field errors. An error for one observation does not prevent
   * the others from being created.
   *
   * Media uploads, `links` and `details` are not supported by this endpoint;
   * use {@link create} for those. Observations are matched/updated by their
   * `external_id`.
   *
   * @param observations - The observations to create or update.
   * @returns A promise that resolves to a list of per-observation results.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async sync(
    observations: SyncObservationPayload[],
  ): Promise<SyncObservationResult[]> {
    return this.#client.request<SyncObservationResult[]>('observations/create/', {
      method: 'POST',
      body: JSON.stringify(observations),
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
   * Lists observations filtered by the supplied parameters.
   * This is the general observations list endpoint (`GET /observations/`).
   * Requires authentication.
   *
   * @param params - Search and filtering parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async search(
    params: ObservationSearchParams = {},
  ): Promise<Paginated<Observation>> {
    return this.#client.request<Paginated<Observation>>('observations/', {
      params: this.filterParams(params),
    });
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
  ): Promise<Paginated<Observation>> {
    return this.#client.publicRequest<Paginated<Observation>>(
      `species/${speciesId}/observations/`,
      { params: this.filterParams(params) },
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
  ): Promise<Paginated<Observation>> {
    return this.#client.request<Paginated<Observation>>(
      `species/${speciesId}/related-observations/`,
      { params: this.filterParams(params) },
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
  ): Promise<Paginated<Observation>> {
    const endpoint = userId ? `user/${userId}/observations/` : 'user/observations/';
    return this.#client.request<Paginated<Observation>>(endpoint, {
      params: this.filterParams(params),
    });
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
  ): Promise<Paginated<Observation>> {
    return this.#client.publicRequest<Paginated<Observation>>(
      `locations/${locationId}/observations/`,
      { params: this.filterParams(params) },
    );
  }

  /**
   * Retrieves observations around a specific geographic point.
   *
   * @param params - Center coordinates, time window and search parameters.
   * @returns A promise that resolves to a paginated list of observations.
   * @throws {ApiError} If the request fails.
   */
  public async getAroundPoint(
    params: AroundPointParams,
  ): Promise<Paginated<Observation>> {
    return this.#client.publicRequest<Paginated<Observation>>(
      'observations/around-point/',
      { params: this.filterParams(params) },
    );
  }

  /**
   * Lists observations that have been deleted at or after a given timestamp.
   * Each entry contains the original observation id and the moment of deletion,
   * which is enough to synchronize localized storage.
   * Requires authentication.
   *
   * @param modifiedSince - ISO8601 date or datetime to list deletions from.
   * @returns A promise that resolves to a paginated list of deleted observations.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getDeleted(
    modifiedSince: string,
  ): Promise<Paginated<DeletedObservation>> {
    return this.#client.request<Paginated<DeletedObservation>>(
      'observations/deleted/',
      { params: { modified_since: modifiedSince } },
    );
  }
}
