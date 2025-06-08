import type { ObservationClient } from '../core/client';
import type {
  Observation,
  Paginated,
  Species as SpeciesData,
  SpeciesGroup,
  SpeciesGroupAttributes,
  SpeciesOccurrence,
} from '../types.js';

export class Species {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Retrieve details for a single species.
   * This is a public endpoint and does not require authentication.
   * @param id The ID of the species.
   * @returns The species object.
   */
  public async get(id: number): Promise<SpeciesData> {
    return this.client.publicRequest<SpeciesData>(`species/${id}`);
  }

  /**
   * Search for species.
   * @param params The search parameters.
   * @returns A list of species matching the search criteria.
   */
  public async search(
    params: Record<string, string | number>
  ): Promise<Paginated<SpeciesData>> {
    return this.client.publicRequest<Paginated<SpeciesData>>(
      'species/search/',
      { params }
    );
  }

  /**
   * Check the occurrence of one or more species at a specific point.
   * This is a public endpoint and does not require authentication.
   * @param speciesIds An array of species IDs.
   * @param point A WKT point string, e.g., "POINT(4.8 52.3)".
   * @returns An object containing an array of species occurrence objects.
   */
  public async getOccurrence(
    speciesIds: number[],
    point: string
  ): Promise<{ results: SpeciesOccurrence[] }> {
    const params = new URLSearchParams();
    speciesIds.forEach((id) => params.append('species_id', String(id)));
    params.set('point', point);

    // This endpoint has a unique parameter structure, so we build the request manually
    const response = await fetch(
      `${this.client.getApiBaseUrl()}/species-occurrence/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch species occurrence: ${await response.text()}`
      );
    }
    return (await response.json()) as { results: SpeciesOccurrence[] };
  }

  /**
   * Retrieve a list of observations for a specific species.
   * This is a public endpoint and does not require authentication.
   * @param speciesId The ID of the species.
   * @param options Pagination options.
   * @returns A paginated list of observation objects.
   */
  public async getObservations(
    speciesId: number,
    options: { limit?: number; offset?: number } = {}
  ): Promise<Paginated<Observation>> {
    return this.client.publicRequest<Paginated<Observation>>(
      `species/${speciesId}/observations/`,
      { params: options }
    );
  }

  /**
   * Retrieve a list of all species groups.
   * This is a public endpoint and does not require authentication.
   * @returns An array of species group objects.
   */
  public async listGroups(): Promise<SpeciesGroup[]> {
    return this.client.publicRequest<SpeciesGroup[]>(`species-groups/`);
  }

  /**
   * Retrieve the possible attribute values for a given species group.
   * This is a public endpoint and does not require authentication.
   * @param id The ID of the species group.
   * @returns An object containing the attributes for the species group.
   */
  public async getGroupAttributes(id: number): Promise<SpeciesGroupAttributes> {
    return this.client.publicRequest<SpeciesGroupAttributes>(
      `species-groups/${id}/attributes/`
    );
  }
} 