// Basic GeoJSON types based on the API response
export type GeoJSONGeometry =
  | GeoJSONPoint
  | GeoJSONPolygon
  | GeoJSONMultiPolygon
  | GeoJSONLineString;

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: Array<Array<[number, number]>>;
}

export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon';
  coordinates: Array<Array<Array<[number, number]>>>;
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: Array<[number, number]>;
}

export interface GeoJSONFeature<
  G extends GeoJSONGeometry | null = GeoJSONGeometry,
> {
  type: 'Feature';
  geometry: G;
  properties: Record<string, unknown> | null;
}

export interface GeoJSONFeatureCollection<
  G extends GeoJSONGeometry | null = GeoJSONGeometry,
> {
  type: 'FeatureCollection';
  features: Array<GeoJSONFeature<G>>;
}

export interface Location {
  /** The location id. */
  id: number;
  /** The location name. */
  name: string;
  /** The country code of the location. */
  country_code: string;
  /** A URL to this location on the site. */
  permalink: string;
  /** Whether this location should still be used (location detail only). */
  is_active?: boolean;
  /** GeoJSON Geometry object of this location (location detail only). */
  geom?: GeoJSONGeometry;
}

export interface SpeciesSeen {
  /** The species id. */
  id: number;
  /** The scientific name of the species. */
  scientific_name: string;
  /** The common (vernacular) name of the species. */
  name: string;
  /** The species group id. */
  group: number;
  /** The rarity of the species. Omitted when `fast=true`. */
  rarity?: number;
  /** A URL to the species detail endpoint. */
  species_url: string;
  /** The number of observations within the queried window. */
  num_observations: number;
  /** Date the species was last seen. Omitted when `fast=true` (or embargoed). */
  last_seen?: string;
  /** The id of the most recent observation. Omitted when `fast=true`. */
  last_observation?: number;
  /** A URL to the most recent observation. Omitted when `fast=true`. */
  last_observation_url?: string;
}
