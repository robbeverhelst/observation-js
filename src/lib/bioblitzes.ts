import type { ObservationClient } from '../core/client';
import type {
  BioBlitz,
  BioBlitzCategoryStatistics,
  BioBlitzListParams,
  Paginated,
} from '../types';

export class BioBlitzes {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of relevant BioBlitzes for the user.
   *
   * Contains BioBlitzes the user has liked and/or contributed to. When
   * `coordinates` are supplied, it also contains BioBlitzes at or close to that
   * position. Authentication is not required, but an authenticated request
   * personalizes the `user` field on each BioBlitz.
   *
   * @param params - Optional parameters, e.g. `coordinates` ("lat,lng").
   * @returns A promise that resolves to a paginated list of BioBlitz objects.
   * @throws {ApiError} If the request fails.
   */
  public async list(
    params?: BioBlitzListParams,
  ): Promise<Paginated<BioBlitz>> {
    const options = {
      method: 'GET' as const,
      ...(params?.coordinates
        ? { params: { coordinates: params.coordinates } }
        : {}),
    };
    if (this.#client.hasAccessToken()) {
      return this.#client.request<Paginated<BioBlitz>>('bioblitzes/', options);
    }
    return this.#client.publicRequest<Paginated<BioBlitz>>(
      'bioblitzes/',
      options,
    );
  }

  /**
   * Lists the BioBlitzes an observation contributes to.
   *
   * @param observationId - The unique identifier for the observation.
   * @returns A promise that resolves to a paginated list of BioBlitz objects.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getForObservation(
    observationId: number,
  ): Promise<Paginated<BioBlitz>> {
    return this.#client.request<Paginated<BioBlitz>>(
      `bioblitzes/observation/${observationId}/`,
    );
  }

  /**
   * Fetches the details of a single BioBlitz by its id.
   *
   * Authentication is not required. If the request is unauthenticated, the
   * `user` field will be `null`.
   *
   * @param id - The unique identifier for the BioBlitz.
   * @returns A promise that resolves to the BioBlitz object.
   * @throws {ApiError} If the request fails.
   */
  public async get(id: number): Promise<BioBlitz> {
    const endpoint = `bioblitzes/${id}/`;
    if (this.#client.hasAccessToken()) {
      return this.#client.request<BioBlitz>(endpoint);
    }
    return this.#client.publicRequest<BioBlitz>(endpoint, { method: 'GET' });
  }

  /**
   * Likes a BioBlitz for the authenticated user.
   *
   * @param id - The unique identifier for the BioBlitz.
   * @returns A promise that resolves once the BioBlitz is liked (`HTTP 204`).
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async like(id: number): Promise<void> {
    await this.#client.request<void>(`bioblitzes/${id}/like/`, {
      method: 'POST',
    });
  }

  /**
   * Unlikes a BioBlitz for the authenticated user.
   *
   * @param id - The unique identifier for the BioBlitz.
   * @returns A promise that resolves once the BioBlitz is unliked (`HTTP 204`).
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async unlike(id: number): Promise<void> {
    await this.#client.request<void>(`bioblitzes/${id}/like/`, {
      method: 'DELETE',
    });
  }

  /**
   * Fetches summary statistics for a BioBlitz category.
   *
   * Authentication is not required.
   *
   * @param categoryId - The unique identifier for the BioBlitz category.
   * @returns A promise that resolves to the category statistics.
   * @throws {ApiError} If the request fails.
   */
  public async getCategoryStatistics(
    categoryId: number,
  ): Promise<BioBlitzCategoryStatistics> {
    const endpoint = `bioblitzes/category/${categoryId}/statistics/`;
    if (this.#client.hasAccessToken()) {
      return this.#client.request<BioBlitzCategoryStatistics>(endpoint);
    }
    return this.#client.publicRequest<BioBlitzCategoryStatistics>(endpoint, {
      method: 'GET',
    });
  }
}
