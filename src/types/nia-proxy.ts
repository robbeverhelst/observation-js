import type { LocationDetail } from './base';

/**
 * A single morph prediction returned by NIA for a prediction entry.
 */
export interface NiaMorph {
  /** The probability of this morph. */
  probability: number;
  /** The morph token, e.g. `IMAGO` or `LARVA_NYMPH`. */
  token: string;
}

/**
 * A single prediction returned by NIA.
 */
export interface NiaPrediction {
  /** The probability of this prediction. */
  probability: number;
  /** The predicted taxon. */
  taxon: {
    /** The taxon id, e.g. `"8807@WRN"`. */
    id: string;
    /** The scientific name of the taxon. */
    name: string;
  };
  /** Optional per-prediction morph predictions, for certain species. */
  morphs?: NiaMorph[];
}

/**
 * A species augmented onto the NIA response.
 */
export interface NiaSpecies {
  /** The species id. */
  id: number;
  /** The scientific name of the species. */
  scientific_name: string;
  /** The common (vernacular) name of the species. */
  name: string;
  /** The species group id. */
  group: number;
  /** The species type. Refer to Lookups / Constants. */
  type?: string;
  /** The rarity of the species. Depends on `location_detail`; missing without a location. */
  rarity?: number;
  /** The status of the species. Depends on `location_detail`; missing without a location. */
  status?: number;
}

/**
 * A life stage augmented onto the NIA response.
 */
export interface NiaLifeStage {
  /** The id of the species this life stage belongs to. */
  species_id: number;
  /** The life stage id. */
  id: number;
  /** The human readable label of the life stage. */
  text: string;
  /** Whether the life stage is active. */
  is_active: boolean;
  /** Present and `true` when this is the default life stage for the species group. */
  is_default?: boolean;
}

/**
 * The augmented response from the NIA identify proxy.
 */
export interface NiaResponse {
  /**
   * Describes the coverage of the currently active NIA model(s).
   * Always added to successful responses.
   */
  model_coverage: {
    /** A link to an image showing the coverage visually. */
    image: string;
    /** A textual description of the coverage. */
    description: string;
  };
  /** The predictions returned by NIA. */
  predictions: NiaPrediction[];
  /**
   * The display name of the matched location.
   * @deprecated Use `location_detail` instead. Only present when parsable coordinates are supplied.
   */
  location?: string;
  /**
   * The full matched location object.
   * Only present when parsable coordinates are supplied and within a known location.
   */
  location_detail?: LocationDetail;
  /** The species in the predictions. Only present when NIA replies with predictions. */
  species?: NiaSpecies[];
  /** Life stage details for the top predicted life stage per species, when confident. */
  life_stages?: NiaLifeStage[];
}

export interface NiaIdentifyOptions {
  images: Blob[];
  location?: {
    lat: number;
    lng: number;
  };
}
