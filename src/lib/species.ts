import type { ObservationClient } from '../core/client';
import type {
  Observation,
  Paginated,
  Species as SpeciesData,
  SpeciesGroup,
  SpeciesGroupAttributes,
  SpeciesOccurrence,
  SpeciesSearchParams,
} from '../types';

export class Species {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Retrieves a single species by its ID.
   * The name of the species will be returned in the language set on the client (default: 'en').
   * This is a public endpoint and does not require authentication.
   *
   * @param id The unique identifier of the species.
   * @returns A promise that resolves to the species object.
   * @throws {ApiError} If the request fails.
   */
  public async get(id: number): Promise<SpeciesData> {
    const request = this.#client.hasAccessToken()
      ? this.#client.request
      : this.#client.publicRequest;
    return request<SpeciesData>(`species/${id}`);
  }

  /**
   * Searches for species based on a query string and other filters.
   * This is a public endpoint and does not require authentication.
   *
   * @param params - The search parameters, including the search query and filters.
   * @returns A promise that resolves to a paginated list of matching species.
   * @throws {ApiError} If the request fails.
   */
  public async search(
    params: SpeciesSearchParams = {},
  ): Promise<Paginated<SpeciesData>> {
    const request = this.#client.hasAccessToken()
      ? this.#client.request
      : this.#client.publicRequest;
    return request<Paginated<SpeciesData>>('species/search/', {
      params: params as unknown as Record<string, string | number>,
    });
  }

  /**
   * Retrieves observations for a single species.
   * This is a public endpoint and does not require authentication.
   *
   * @param id The unique identifier of the species.
   * @param params - Optional query parameters to filter the observations.
   * @returns A promise that resolves to a paginated list of observations for the species.
   * @throws {ApiError} If the request fails.
   */
  public async getObservations(
    id: number,
    params: Record<string, string | number> = {},
  ): Promise<Paginated<Observation>> {
    const request = this.#client.hasAccessToken()
      ? this.#client.request
      : this.#client.publicRequest;
    return request<Paginated<Observation>>(`species/${id}/observations/`, {
      params,
    });
  }

  /**
   * Retrieves species occurrence data for a given set of species IDs at a specific location.
   * This is a public endpoint and does not require authentication.
   *
   * @param ids - An array of species IDs.
   * @param point - The location, formatted as a WKT point string (e.g., 'POINT(4.895168 52.370216)').
   * @returns A promise that resolves to a list of species occurrences.
   * @throws {ApiError} If the request fails.
   */
  public async getOccurrence(
    ids: number[],
    point: string,
  ): Promise<Paginated<SpeciesOccurrence>> {
    const params = {
      species_id: ids.join(','),
      point,
    };
    return this.#client.publicRequest<Paginated<SpeciesOccurrence>>(
      'species-occurrence',
      {
        params,
      },
    );
  }

  /**
   * Retrieves a list of all species groups.
   * The names of the groups will be returned in the language set on the client (default: 'en').
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to a list of species group objects.
   * @throws {ApiError} If the request fails.
   */
  public async listGroups(): Promise<SpeciesGroup[]> {
    return this.#client.publicRequest('species-groups/');
  }

  /**
   * Retrieves the specific observation field attributes for a given species group.
   * This is a public endpoint and does not require authentication.
   *
   * @param id The unique identifier of the species group.
   * @returns A promise that resolves to the attributes for the species group.
   * @throws {ApiError} If the request fails.
   */
  public async getGroupAttributes(id: number): Promise<SpeciesGroupAttributes> {
    return this.#client.publicRequest<SpeciesGroupAttributes>(
      `species-groups/${id}/attributes/`,
    );
  }
}
