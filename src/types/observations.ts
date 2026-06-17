import type { LocationDetail, Link, Point } from './base';

/**
 * Embedded species summary returned on observations.
 * See the Species docs for the full Species representation.
 */
export interface ObservationSpeciesDetail {
  id: number;
  scientific_name: string;
  name: string;
  group: number;
  type: string;
}

/**
 * Embedded user summary returned on observations.
 */
export interface ObservationUserDetail {
  id: number;
  name: string;
  avatar: string;
}

/**
 * A single entry in an observation's group composition (`details`).
 */
export interface ObservationDetail {
  /** Primary key of the detail row (present on responses). */
  pk?: number;
  number: number;
  sex: string;
  activity: number;
  life_stage: number;
}

/**
 * A single observation as returned by the waarneming.nl API.
 *
 * Relational fields (`species`, `user`, `location`) are returned as integer ids.
 * The corresponding `*_detail` objects are included on some endpoints.
 *
 * Note: the API may add fields not described here; clients must tolerate
 * additional properties.
 */
export interface Observation {
  /** Unique id for this observation (read-only). */
  id: number;
  /** Species id. */
  species: number;
  /** Date of observing, ISO `yyyy-mm-dd`. */
  date: string;
  /** Time of observing, `hh:mm`, or `null` if absent. */
  time: string | null;
  /** Number of individuals. */
  number: number;
  /** Sex of observed individual(s): `M`, `F` or `U`. */
  sex: string;
  /** Coordinates of the observation as a GeoJSON Point. */
  point: Point;
  /** Position accuracy in meters, or `null` if unknown. */
  accuracy: number | null;
  /** Observation notes, or `null` if absent. */
  notes: string | null;
  /** Whether the observer is certain the species is correct. */
  is_certain: boolean;
  /** Code for the validation status (read-only). */
  validation_status: string;
  /** External reference string, or `null` if absent. */
  external_reference: string | null;
  /** Hidden until this date, ISO `yyyy-mm-dd`. */
  embargo_date: string;
  /** UUID4 string identifying the observation. */
  uuid: string;
  /** User id of the observer (read-only). */
  user: number;
  /** Last modification, ISO8601 date/time string (read-only). */
  modified: string;
  /** Id of the species group (read-only). */
  species_group: number;
  /** Id of the location closest to the observation point (read-only). */
  location: number;
  /** List of URLs to photos, empty list if none. */
  photos: string[];
  /** List of URLs to sounds, empty list if none. */
  sounds: string[];
  /** URL to this observation on the website (read-only). */
  permalink: string;

  // Situational / endpoint-dependent fields.

  /** Embedded species summary (read-only, present on some endpoints). */
  species_detail?: ObservationSpeciesDetail;
  /** Embedded user summary (read-only, present on some endpoints). */
  user_detail?: ObservationUserDetail;
  /** Embedded location summary (read-only, present on some endpoints). */
  location_detail?: LocationDetail;
  /** Whether the observation concerns an escaped/planted individual. */
  is_escape?: boolean;
  /** Observed activity id. */
  activity?: number;
  /** Observed life stage id. */
  life_stage?: number;
  /** Observation method id. */
  method?: number;
  /** Substrate id (Mosses, Lichens and Fungi only), or `null`. */
  substrate?: number | null;
  /** Obscurity code (read: `0|1|5|9`). */
  obscurity?: number;
  /** Related species id (host plant, prey, etc.). */
  related_species?: number;
  /** Counting method id, or `null`. */
  counting_method?: number | null;
  /** Location of the observer as a GeoJSON Point, or `null`. */
  observer_location?: Point | null;
  /** Transect UUID this observation belongs to. */
  transect_uuid?: string;
  /** Certainty of recognition by NIA, float between 0 and 1. */
  recognition_probability?: number;
  /** Rarity of the species at the observed location (read-only). */
  rarity?: number;
  /** Status of the species at the observed location (read-only). */
  species_status?: number;
  /** Whether the observation has any photos (some list endpoints). */
  has_photo?: boolean;
  /** Whether the observation has any sounds (some list endpoints). */
  has_sound?: boolean;
  /** Associated links. */
  links?: Link[];
  /** Group composition of the observation. */
  details?: ObservationDetail[];
}

export interface CreateObservationOptions {
  upload_photos?: Blob[];
  upload_sounds?: Blob[];
}

/**
 * Writable fields for creating an observation via the single-observation
 * endpoint (`/observations/create-single/`).
 */
export type CreateObservationPayload = {
  /** Species id. Required. */
  species: number;
  /** Date of observing, ISO `yyyy-mm-dd`. Required. */
  date: string;
  /**
   * Coordinates of the observation, as a GeoJSON Point or WKT string.
   * The location is derived server-side from this point.
   */
  point: Point | string;

  /** Time of observing, `hh:mm`. */
  time?: string;
  /** Number of individuals (defaults to 1). */
  number?: number;
  /** Sex of observed individual(s): `M`, `F` or `U` (defaults to `U`). */
  sex?: string;
  /** Observation notes. */
  notes?: string;
  /** Whether the observer is certain the species is correct (defaults to true). */
  is_certain?: boolean;
  /** Position accuracy in meters. */
  accuracy?: number;
  /** External reference string to identify the observation externally. */
  external_reference?: string;
  /** Hide the observation until this date, ISO `yyyy-mm-dd`. */
  embargo_date?: string;
  /** UUID4 string (defaults to a random uuid4). */
  uuid?: string;
  /** Obscure the exact location: write `0` (public) or `1` (obscured 1km). */
  obscurity?: number;
  /** Whether the observation concerns an escaped/planted individual. */
  is_escape?: boolean;
  /** Observed activity id, or its english name. */
  activity?: number | string;
  /** Observed life stage id, or its english name. */
  life_stage?: number | string;
  /** Observation method id. */
  method?: number;
  /** Substrate id (Mosses, Lichens and Fungi only). */
  substrate?: number;
  /** Related species id (host plant, prey, etc.). */
  related_species?: number;
  /** Counting method id. */
  counting_method?: number;
  /** Location of the observer, as a GeoJSON Point or WKT string. */
  observer_location?: Point | string;
  /** Transect UUID to link this observation to. */
  transect_uuid?: string;
  /** Certainty of recognition by NIA, float between 0 and 1. */
  recognition_probability?: number;
  /** Group composition entries. */
  details?: ObservationDetail[];
  /** Photo URLs or async-upload names. */
  photos?: string[];
  /** Sound URLs or async-upload names. */
  sounds?: string[];

  /** Names of asynchronously uploaded media to attach. */
  upload_media?: string[];
};

export type UpdateObservationPayload = Partial<CreateObservationPayload>;

/**
 * Writable fields for the one-way-sync bulk create endpoint
 * (`/observations/create/`).
 *
 * Differs from {@link CreateObservationPayload}: media uploads, `links` and
 * `details` are not supported, and `external_id` is used instead of
 * `external_reference`.
 */
export type SyncObservationPayload = Omit<
  CreateObservationPayload,
  'external_reference' | 'details' | 'photos' | 'sounds' | 'upload_media'
> & {
  /**
   * Unique-per-user external id. Stored together with the application name in
   * the observation's `external_reference`. An existing observation with the
   * same `external_id` will be updated.
   */
  external_id?: string;
};

/**
 * Result entry from the one-way-sync bulk create endpoint: either the URL of
 * the created/updated observation, or an object describing field errors.
 */
export type SyncObservationResult = string | Record<string, string[]>;

/**
 * An entry returned by the deleted-observations endpoint.
 */
export interface DeletedObservation {
  original_id: number;
  deleted_at: string;
}
