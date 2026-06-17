import type { LocationDetail, Point } from './base';

/**
 * A GeoJSON LineString geometry, used for transects that follow a path.
 * CRS used: WGS84.
 */
export interface TransectLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

/**
 * The geometry of a transect. Always returned as a GeoJSON object (Point or
 * LineString), but may also be sent as a WKT (Well-known text) string.
 * CRS used: WGS84.
 */
export type TransectGeom = Point | TransectLineString;

/**
 * An observation list within a transect, representing a single species group
 * that was counted.
 */
export interface TransectObservationList {
  /** Read-only. The observation list id. */
  id: number;
  /** The species group id. */
  species_group: number;
  /** Whether all species were counted. 0: unknown, 1: no, 2: yes. */
  all_species_counted: number;
  /** Whether all individuals were counted. 0: unknown, 1: no, 2: yes. */
  all_individuals_counted: number;
  /** Optional, user notes for this list. */
  notes?: string;
  /**
   * Optional, the project id to use, where `null` means no project. The user
   * needs permission to add a visit to this project.
   */
  project: number | null;
}

/**
 * A transect (legacy V1). A timed survey along a point or line where species
 * groups are counted.
 */
export interface Transect {
  /** Read-only. The transect id. */
  id: number;
  /** A UUID to uniquely identify this transect. */
  uuid: string;
  /** The transect type, either 'point' or 'transect'. */
  type: 'point' | 'transect';
  /** A list of species groups that were counted. */
  observation_lists: TransectObservationList[];
  /** The date the transect started (isoformat yyyy-mm-dd). */
  start_date: string;
  /** The time the transect started ("HH:MM"). */
  start_time: string;
  /** The date the transect ended. Must be equal or greater than start_date. */
  end_date: string;
  /** The time the transect ended ("HH:MM"). */
  end_time: string;
  /** Coordinates for the transect, as a GeoJSON Point or LineString. */
  geom: TransectGeom;
  /** Read-only. The main location of the transect. */
  location_detail: LocationDetail;
  /** Notes from a transect. */
  notes: string;
  /** Read-only. URL to this transect on the website. */
  permalink: string;
  /** Read-only. The number of observations in the transect. */
  observation_count: number;
}

/**
 * The writable subset of an observation list, used when creating or updating a
 * transect.
 */
export interface TransectObservationListPayload {
  /** The species group id. */
  species_group: number;
  /** Whether all species were counted. 0: unknown, 1: no, 2: yes. */
  all_species_counted: number;
  /** Whether all individuals were counted. 0: unknown, 1: no, 2: yes. */
  all_individuals_counted: number;
  /** Optional, user notes for this list. */
  notes?: string;
  /**
   * Optional, the project id to use, where `null` means no project.
   */
  project?: number | null;
}

/**
 * The writable payload for creating or updating a transect.
 */
export interface TransectPayload {
  /**
   * A UUID to uniquely identify this transect. Mandatory when using `update`
   * (PUT).
   */
  uuid: string;
  /** The transect type, either 'point' or 'transect'. */
  type: 'point' | 'transect';
  /** A list of species groups that were counted. */
  observation_lists: TransectObservationListPayload[];
  /** The date the transect started (isoformat yyyy-mm-dd). */
  start_date: string;
  /** The time the transect started ("HH:MM"). */
  start_time: string;
  /** The date the transect ended. Must be equal or greater than start_date. */
  end_date: string;
  /** The time the transect ended ("HH:MM"). */
  end_time: string;
  /**
   * Coordinates for the transect, as a GeoJSON Point/LineString or a WKT
   * string. Only Point or LineString types are accepted. CRS used: WGS84.
   */
  geom: TransectGeom | string;
  /** Optional notes for the transect. */
  notes?: string;
}
