/**
 * Statistics of a BioBlitz.
 */
export interface BioBlitzStatistics {
  /** Number of species observed in the BioBlitz. */
  species: number;
  /** Number of observations in the BioBlitz. */
  observations: number;
  /** Number of users with observations in the BioBlitz. */
  observers: number;
  /**
   * Time when statistics were last calculated (ISO 8601 with UTC offset), or
   * `null` when the statistics have not been calculated yet.
   */
  updated: string | null;
}

/**
 * Statistics of the authenticated user within a BioBlitz.
 */
export interface BioBlitzUserStatistics {
  /** Number of species observed by the user in the BioBlitz. */
  species: number;
  /** Number of observations by the user in the BioBlitz. */
  observations: number;
}

/**
 * Information about the relationship between the authenticated user and a
 * BioBlitz.
 */
export interface BioBlitzUser {
  /** Indicates whether the user has liked the BioBlitz. */
  liked: boolean;
  /** Statistics of the user in the BioBlitz. */
  statistics: BioBlitzUserStatistics;
}

/**
 * Details of the category a BioBlitz belongs to.
 */
export interface BioBlitzCategory {
  /** BioBlitz category id. */
  id: number;
  /** Name of the BioBlitz category. */
  name: string;
  /** Description of the BioBlitz category, in HTML format (empty if absent). */
  description: string;
  /** URL to the BioBlitz category detail view on the website. */
  permalink: string;
}

/**
 * A BioBlitz: a time- and place-bound biodiversity recording event.
 */
export interface BioBlitz {
  /** BioBlitz id. */
  id: number;
  /** Name of the BioBlitz. */
  name: string;
  /** Description of the BioBlitz, in HTML format (empty if absent). */
  description: string;
  /** Start date of the BioBlitz (isoformat yyyy-mm-dd). */
  start_date: string;
  /**
   * End date of the BioBlitz (isoformat yyyy-mm-dd). The end date is inclusive.
   */
  end_date: string;
  /**
   * Target number of species for the BioBlitz, or `null` if no target is set.
   */
  target: number | null;
  /** Statistics of the BioBlitz. */
  statistics: BioBlitzStatistics;
  /**
   * Information about the relationship between the authenticated user and this
   * BioBlitz, or `null` if the current user is not authenticated.
   */
  user: BioBlitzUser | null;
  /**
   * Details of the category this BioBlitz belongs to, or `null` if it does not
   * belong to a category.
   */
  category: BioBlitzCategory | null;
  /** URL to the cover image (1600 x 1000 px JPEG satellite map render). */
  cover_image: string;
  /** URL to the cover image thumbnail (288 x 144 px). */
  cover_thumbnail: string;
  /** URL to the location image (1000 x 1000 px PNG OpenStreetMap render). */
  location_image: string;
  /** URL to the BioBlitz detail view on the website. */
  permalink: string;
}

/**
 * Summary statistics for a BioBlitz category.
 */
export interface BioBlitzCategoryStatistics {
  /** Number of BioBlitzes in the category. */
  bioblitzes: number;
  /** Number of observations in all of the BioBlitzes in the category. */
  observations: number;
  /** Number of species in all of the BioBlitzes in the category. */
  species: number;
  /** Number of observers in all of the BioBlitzes in the category. */
  observers: number;
}

/**
 * Optional parameters for listing BioBlitzes.
 */
export interface BioBlitzListParams {
  /**
   * The user's location, formatted as a `latitude,longitude` pair (e.g.
   * "52.7869,6.1181"). When supplied, BioBlitzes at or close to that position
   * are also returned.
   */
  coordinates?: string;
}
