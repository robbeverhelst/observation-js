export interface Region {
  id: number;
  /** Region type code, defined in the `lookups` part of the response. */
  type: number;
  /** Translated name, in the current language. */
  name: string;
  /** Continent code. Not present if not applicable. */
  continent?: number;
  /** ISO country code. Not present if not applicable. */
  iso?: string;
}

export interface RegionType {
  id: number;
  /** Translated name, in the current language. */
  name: string;
}

/**
 * The unique combination of a `region` and a `species_group`, which is the key
 * for a regional species checklist (the `region-lists/` index object).
 */
export interface RegionSpeciesList {
  id: number;
  /** Region identifier, see {@link Region}. */
  region: number;
  /** Species group identifier, see SpeciesGroup. */
  species_group: number;
  /**
   * Optional name for the region list, translated based on the current language.
   * Not present if no custom name is available.
   */
  custom_name?: string;
}

/**
 * A single species row within a region list (`region-lists/{id}/species/`).
 */
export interface RegionSpecies {
  /** Species id. */
  species: number;
  /** Species group id. */
  group: number;
  /** Name of the species, in the current language. */
  name: string;
  /** Scientific name of the species. */
  scientific_name: string;
  /** Rarity id (lookup), see Rarity description. */
  rarity: number;
  /** True if the species is considered native in this region. */
  native: boolean;
  /** Species type id. */
  type: string;
  /** Species rank id. */
  rank: number;
  /** Species group sort order. */
  sort_order_group: number;
  /** Species rank sort order. */
  sort_order_rank: number;
  /** Species sort order. */
  sort_order_taxonomy: number;
  /**
   * Optional species determination requirements as text, in the current language.
   * Only present if determination requirements are applicable for the species.
   */
  determination_requirements?: string;
}
