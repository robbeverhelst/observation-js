import type { ObservationClient } from '../core/client';
import type { GeoJSON, Location, Paginated, SpeciesSeen } from '../types';

export class Locations {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Searches for locations by name or by proximity to a geographic point.
   *
   * @param params - The search parameters, either a `name` string or a `lat`/`lng` coordinate pair.
   * @returns A promise that resolves to a paginated list of matching locations.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async search(
    params: { name?: string } | { lat: number; lng: number }
  ): Promise<Paginated<Location>> {
    return this.#client.request<Paginated<Location>>('locations/', {
      method: 'GET',
      params,
    });
  }

  /**
   * Retrieves the details for a single location by its ID.
   *
   * @param id - The unique identifier of the location.
   * @returns A promise that resolves to the location object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async get(id: number): Promise<Location> {
    return this.#client.request<Location>(`locations/${id}`);
  }

  /**
   * Lists all species seen at a specific location, with optional filters.
   *
   * @param id - The unique identifier of the location.
   * @param params - Optional query parameters to filter the results (e.g., date, species group).
   * @returns A promise that resolves to a list of species seen at the location.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getSpeciesSeen(
    id: number,
    params: {
      end_date?: string;
      days?: number;
      species_group?: number;
      rarity?: number;
      fast?: boolean;
    } = {}
  ): Promise<{ results: SpeciesSeen[] }> {
    return this.#client.request<{ results: SpeciesSeen[] }>(
      `locations/${id}/species-seen/`,
      { method: 'GET', params: params as any }
    );
  }

  /**
   * Lists all species seen in a radius around a specified point, with optional filters.
   *
   * @param params - The query parameters, including `lat`, `lng`, and optional `radius`, filters, etc.
   * @returns A promise that resolves to a list of species seen around the point.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getSpeciesSeenAroundPoint(params: {
    lat: number;
    lng: number;
    radius?: number;
    end_date?: string;
    days?: number;
    species_group?: number;
    rarity?: number;
    fast?: boolean;
    order_by?: string;
  }): Promise<{ results: SpeciesSeen[] }> {
    return this.#client.request<{ results: SpeciesSeen[] }>(
      'locations/species-seen/',
      { method: 'GET', params: params as any }
    );
  }

  /**
   * Fetches a GeoJSON FeatureCollection with location geometry and properties.
   * This is a public endpoint.
   *
   * @param params - The query parameters, can be a `point` (WKT format) or a location `id`.
   * @returns A promise that resolves to a GeoJSON FeatureCollection.
   * @throws {ApiError} If the request fails.
   */
  public async getGeoJSON(
    params: { point: string; model?: string } | { id: number; model?: string }
  ): Promise<GeoJSON.FeatureCollection> {
    return this.#client.publicRequest<GeoJSON.FeatureCollection>(
      'locations/geojson/',
      { params: params as any }
    );
  }
} 