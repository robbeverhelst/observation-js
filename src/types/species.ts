import type { Photo } from './base';

export interface SpeciesGroup {
  id: number;
  name: string;
  name_plural: string;
  icon: string;
}

export interface Species {
  id: number;
  name: string;
  scientific_name: string;
  group: number;
  group_name: string;
  rarity: number;
  rarity_text: string;
  type: string;
  status: number;
  url: string;
  photos: Photo[];
  sounds: []; // Assuming sounds might be similar to photos, but no data in original types
  name_vernacular: string | null;
  name_vernacular_language: string | null;
}

export interface SpeciesSearchParams {
  q?: string;
  species_group?: number;
}

export interface SpeciesOccurrence {
  id: number;
  name: string;
  scientific_name: string;
  occurrence_status: string;
}

export interface SpeciesGroupAttributes {
  // Define structure based on expected API response
  [key: string]: unknown;
}
