// Basic GeoJSON types based on the API response
export namespace GeoJSON {
  export type Geometry = Point | Polygon | MultiPolygon | LineString;

  export interface Point {
    type: 'Point';
    coordinates: [number, number];
  }

  export interface Polygon {
    type: 'Polygon';
    coordinates: Array<Array<[number, number]>>;
  }

  export interface MultiPolygon {
    type: 'MultiPolygon';
    coordinates: Array<Array<Array<[number, number]>>>;
  }

  export interface LineString {
    type: 'LineString';
    coordinates: Array<[number, number]>;
  }

  export interface Feature<G extends Geometry | null = Geometry> {
    type: 'Feature';
    geometry: G;
    properties: Record<string, unknown> | null;
  }

  export interface FeatureCollection<G extends Geometry | null = Geometry> {
    type: 'FeatureCollection';
    features: Array<Feature<G>>;
  }
}

export interface Location {
  id: number;
  name: string;
  country_code: string;
  permalink: string;
  is_active?: boolean;
  geom?: GeoJSON.Geometry;
  determination_requirements?: string;
  geometry: GeoJSON.MultiPolygon;
  has_geometry: boolean;
  cover_photo: string | null;
}

export interface SpeciesSeen {
  species: number;
  species_name: string;
  last_observation_date: string;
  observation_count: number;
} 