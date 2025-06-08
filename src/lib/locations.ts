import type { ObservationClient } from '../core/client';
import type { GeoJSON, Location, Paginated, SpeciesSeen } from '../types';

export class Locations {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Search for locations by name or coordinates.
   * This is an authenticated endpoint.
   * @param params The search parameters.
   * @returns A paginated list of locations.
   */
  public async search(
    params: { name?: string } | { lat: number; lng: number }
  ): Promise<Paginated<Location>> {
    return this.client.request<Paginated<Location>>('locations/', {
      method: 'GET',
      params,
    });
  }

  /**
   * Retrieve details for a single location.
   * This is an authenticated endpoint.
   * @param id The ID of the location.
   * @returns The location object.
   */
  public async get(id: number): Promise<Location> {
    return this.client.request<Location>(`locations/${id}/`);
  }

  /**
   * List all species seen at a specific location.
   * This is an authenticated endpoint.
   * @param id The ID of the location.
   * @param params The query parameters.
   * @returns A list of species seen.
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
    return this.client.request<{ results: SpeciesSeen[] }>(
      `locations/${id}/species-seen/`,
      { method: 'GET', params }
    );
  }

  /**
   * List all species seen in a radius around a specified point.
   * This is an authenticated endpoint.
   * @param params The query parameters.
   * @returns A list of species seen.
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
    return this.client.request<{ results: SpeciesSeen[] }>(
      'locations/species-seen/',
      { method: 'GET', params }
    );
  }

  /**
   * Returns a GeoJSON FeatureCollection with the location geometry and some properties.
   * This is a public endpoint and does not require authentication.
   * @param params The query parameters. Can be a point or a location id.
   * @returns A GeoJSON FeatureCollection.
   */
  public async getGeoJSON(
    params: { point: string; model?: string } | { id: number; model?: string }
  ): Promise<GeoJSON.FeatureCollection> {
    return this.client.publicRequest<GeoJSON.FeatureCollection>(
      'locations/geojson/',
      params
    );
  }
} 