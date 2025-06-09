import type { Point } from './base';
import type { Species } from './species';

export interface Region {
  id: number;
  name: string;
  slug: string;
  centroid: Point;
  parent: {
    id: number;
    name: string;
  } | null;
}

export interface RegionSpeciesList {
  id: number;
  species: Species;
  date: string;
  first_observation_date: string;
  last_observation_date: string;
  observation_count: number;
}

export type RegionSpecies = RegionSpeciesList;

export interface RegionType {
  id: number;
  name: string;
}
