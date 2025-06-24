import type { Photo } from './base';

export interface SpeciesGroup {
  id: number;
  name: string;
  name_plural: string;
  icon: string;
}

export interface SpeciesData {
  id: number;
  name: string;
  scientific_name: string;
  group: number;
  group_name: string;
  // TODO: Investigate API discrepancy - API returns string but was typed as number
  rarity: string; // Changed from number to string based on E2E test findings
  // TODO: Investigate API discrepancy - field can be undefined in some responses
  rarity_text?: string; // Changed from required to optional based on E2E test findings
  type: string;
  // TODO: Investigate API discrepancy - API returns string but was typed as number
  status: string; // Changed from number to string based on E2E test findings
  // TODO: Investigate API discrepancy - field can be undefined in some responses
  url?: string; // Changed from required to optional based on E2E test findings
  // TODO: Investigate API discrepancy - photos can be undefined in some responses
  photos?: Photo[]; // Changed to optional based on E2E test findings
  // TODO: Investigate API discrepancy - sounds can be undefined in some responses
  sounds?: []; // Changed to optional based on E2E test findings
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
