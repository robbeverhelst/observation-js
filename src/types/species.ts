import type { Sound } from './base';

export interface SpeciesGroup {
  id: number;
  name: string;
  name_plural: string;
  icon: string;
}

export interface SpeciesData {
  id: number;
  scientific_name: string;
  /**
   * The authority that published the taxon, e.g. "(Pallas, 1764)" or "Linnaeus, 1758".
   * The formatting is significant: it may be abbreviated ("L."), a single name
   * ("Diels"), include a year, or be wrapped in brackets to indicate later amendments.
   */
  authority: string;
  /** Common name, in the current language. Empty string if no common name is known. */
  name: string;
  group: number;
  /** Species group name, in the current language. */
  group_name: string;
  /**
   * Species status as text, in the current language.
   * Absent when the species is fetched without a location context.
   */
  status?: string;
  /**
   * Species rarity as text, in the current language.
   * Absent when the species is fetched without a location context.
   */
  rarity?: string;
  type: string;
  /** URL to a photo for this species. Empty string when none is available. */
  photo?: string;
  /** Link to the details of this species on the website. */
  permalink: string;
  /**
   * Species determination requirements as text, in the current language.
   * Only present if determination requirements are applicable for the species.
   */
  determination_requirements?: string;
  /** Species info text as HTML, in the current language. */
  info_text?: string;
  sounds?: Sound[];
}

export interface SpeciesSearchParams {
  q?: string;
  species_group?: number;
}

/**
 * A single species occurrence result, as returned by the species-occurrence endpoint.
 */
export interface SpeciesOccurrence {
  species_id: number;
  occurs: 'yes' | 'no' | 'unknown';
}

/**
 * A single possible value for a species group attribute (e.g. an activity,
 * method, life stage or substrate option).
 */
export interface SpeciesGroupAttribute {
  id: number;
  /** Attribute value label, in the current language. */
  text: string;
  /** `false` indicates the value should only be used to render historic data. */
  is_active: boolean;
  /** Present and `true` only for the default value of the attribute, if any. */
  is_default?: boolean;
  /** For activity entries: indicates the activity has 'Broedvogel Monitoring Protocol'. */
  bmp?: boolean;
}

/**
 * Possible values for the observation fields of a species group.
 * The order of the entries is meaningful and should be preserved when presenting
 * them to the user. `substrate` is only present for the Mosses and Lichens (12)
 * and Fungi (11) species groups.
 */
export interface SpeciesGroupAttributes {
  id: number;
  /** Species group name, in the current language. */
  name: string;
  activity: SpeciesGroupAttribute[];
  method: SpeciesGroupAttribute[];
  life_stage: SpeciesGroupAttribute[];
  substrate?: SpeciesGroupAttribute[];
}
