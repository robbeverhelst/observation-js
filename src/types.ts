export interface SpeciesDetail {
  id: number;
  scientific_name: string;
  name: string;
  group: number;
  type: string;
}

export interface UserDetail {
  id: number;
  name: string;
  avatar: string | null;
}

export interface LocationDetail {
  id: number;
  name: string;
  country_code: string;
  permalink: string;
}

export interface Point {
  type: 'Point';
  coordinates: [number, number];
}

export interface Observation {
  id: number;
  uuid: string;
  species: number;
  species_detail: SpeciesDetail;
  date: string;
  time: string | null;
  number: number;
  sex: string;
  is_certain: boolean;
  is_escape: boolean;
  point: Point;
  accuracy: number | null;
  location: number;
  location_detail: LocationDetail;
  user: number;
  user_detail: UserDetail;
  notes: string | null;
  permalink: string;
  modified: string;
  validation_status: string;
  rarity: number;
  species_status: number;
  activity: number;
  life_stage: number;
  method: number | null;
  substrate: null; // Type unknown
  related_species: number;
  obscurity: number;
  counting_method: number | null;
  embargo_date: string;
  external_reference: string | null;
  links: any[]; // Type unknown
  details: any[]; // Type unknown
  observer_location: Point | null;
  transect_uuid: string | null;
  species_group: number;
  photos: any[]; // Define photo type later
  sounds: any[]; // Define sound type later
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ObservationClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface PasswordGrantOptions {
  clientId: string;
  clientSecret?: string; // Only for confidential clients
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface Species {
  id: number;
  scientific_name: string;
  authority: string;
  name: string;
  group: number;
  group_name: string;
  status: string;
  rarity: string;
  type: string;
  photo: string | null;
  permalink: string;
  determination_requirements?: string;
  info_text?: string;
}

export interface SpeciesGroup {
  id: number;
  name: string;
}

export interface SpeciesGroupAttributeValue {
  id: number;
  text: string;
  is_active: boolean;
  is_default?: boolean;
  bmp?: boolean;
}

export interface SpeciesGroupAttributes extends SpeciesGroup {
  activity: SpeciesGroupAttributeValue[];
  method: SpeciesGroupAttributeValue[];
  life_stage: SpeciesGroupAttributeValue[];
  substrate?: SpeciesGroupAttributeValue[];
}

export interface SpeciesOccurrence {
  species_id: number;
  occurs: 'yes' | 'no' | 'unknown';
}

export interface Region {
  id: number;
  type: number;
  name: string;
  continent?: number;
  iso?: string;
}

export interface RegionType {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  country_code: string;
  permalink: string;
  is_active?: boolean;
  geom?: GeoJSON.Geometry;
}

export interface SpeciesSeen {
  id: number;
  scientific_name: string;
  name: string;
  group: number;
  rarity: number;
  species_url: string;
  num_observations: number;
  last_seen?: string;
  last_observation?: number;
  last_observation_url?: string;
}

// Basic GeoJSON types based on the API response
export namespace GeoJSON {
  export type Geometry = Point | Polygon | MultiPolygon;

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

  export interface Feature<G extends Geometry | null = Geometry> {
    type: 'Feature';
    geometry: G;
    properties: Record<string, any> | null;
  }

  export interface FeatureCollection<G extends Geometry | null = Geometry> {
    type: 'FeatureCollection';
    features: Array<Feature<G>>;
  }
} 