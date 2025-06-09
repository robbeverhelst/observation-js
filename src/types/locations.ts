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

export interface GeoJSONFeature<G extends GeoJSONGeometry | null = GeoJSONGeometry> {
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
  id: number;
  name: string;
  country_code: string;
  permalink: string;
  is_active?: boolean;
  geom?: GeoJSONGeometry;
  determination_requirements?: string;
  geometry: GeoJSONMultiPolygon;
  has_geometry: boolean;
  cover_photo: string | null;
}

export interface SpeciesSeen {
  species: number;
  species_name: string;
  last_observation_date: string;
  observation_count: number;
}
