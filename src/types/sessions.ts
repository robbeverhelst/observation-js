import type { LocationDetail, Point } from './base';

/**
 * A GeoJSON LineString geometry, used for sessions of type `"transect"`.
 */
export interface LineString {
  type: 'LineString';
  coordinates: [number, number][];
}

/**
 * A list of species groups that were counted within a session.
 */
export interface ObservationList {
  /** Read-only. The observation list id. */
  id: number;
  /** The species group id. */
  species_group: number;
  /** `null`: unknown, `false`: no, `true`: yes. */
  all_species_counted: boolean | null;
  /** `null`: unknown, `false`: no, `true`: yes. */
  all_individuals_counted: boolean | null;
  /** User notes for this list. Empty string when no notes have been entered. */
  notes: string;
}

/**
 * An observation session (formerly known as a transect).
 */
export interface Session {
  /** Read-only. The session id. */
  id: number;
  /** A UUID to uniquely identify this session. */
  uuid: string;
  /** The session type. */
  type: 'point' | 'transect';
  /** A list of species groups that were counted. */
  observation_lists: ObservationList[];
  /** Read-only. The number of observations linked to the session. */
  observation_count: number;
  /** Read-only. The main location of the session. */
  location_detail: LocationDetail;
  /** When the session started, isoformat `yyyy-mm-ddThh:mm:ss`. */
  start_datetime: string;
  /** When the session ended, isoformat `yyyy-mm-ddThh:mm:ss`. */
  end_datetime: string;
  /**
   * Coordinates for the session. Always returned as a GeoJSON object;
   * a `Point` for type `"point"` or a `LineString` for type `"transect"`.
   */
  geom: Point | LineString;
  /** Notes from a session. Empty string when no notes have been entered. */
  notes: string;
  /** Read-only. URL to this session on the website. */
  permalink: string;
}

/**
 * The observation list fields accepted when creating or updating a session.
 */
export interface CreateObservationListPayload {
  species_group: number;
  all_species_counted: boolean | null;
  all_individuals_counted: boolean | null;
  /** Must be entered as an empty string if left out. */
  notes: string;
}

/**
 * The payload accepted when creating or updating a session.
 *
 * The `geom` may be provided as a GeoJSON object or a WKT (Well-known text)
 * string. Only Point geometries are valid for type `"point"` and only
 * LineString geometries for type `"transect"`.
 */
export interface CreateSessionPayload {
  uuid: string;
  type: 'point' | 'transect';
  observation_lists: CreateObservationListPayload[];
  start_datetime: string;
  end_datetime: string;
  geom: Point | LineString | string;
  /** Must be entered as an empty string if left out. */
  notes: string;
}

export type UpdateSessionPayload = CreateSessionPayload;
