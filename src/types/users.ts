/**
 * The current authenticated user as returned by `GET /user/info/`.
 */
export interface User {
  /** Unique id of the user. */
  id: number;
  /** Display name of the user. */
  name: string;
  /** Email of the user. */
  email: string;
  /** Whether the user allows us to send mail (newsletters, notifications, etc.). */
  is_mail_allowed: boolean;
  /** Url to the user's profile. */
  url: string;
  /** The uppercase `ISO 3166-1-alpha-2` country code, or `null` when unset. */
  country: string | null;
  /** Whether the user's email address is confirmed. */
  consider_email_confirmed: boolean;
  /** A url to a `jpg` file for the user avatar, or `null` if the user has no avatar. */
  avatar: string | null;
}

/**
 * A single terms document as returned by `GET /user/terms/`.
 */
export interface TermsDocument {
  /** The human readable title of the document, when available. */
  title?: string;
  /** The HTML content of the document. */
  content: string;
  /** ISO 8601 timestamp of when the document was created. */
  created: string;
  /** A permalink to the document on the site. */
  permalink: string;
}

/**
 * The terms a user has to accept before registration, plus the ObsIdentify FAQ.
 * Returned by `GET /user/terms/`.
 */
export interface Terms {
  /** Terms of service document. */
  tos: TermsDocument;
  /** Privacy statement document. */
  privacy: TermsDocument;
  /** Frequently asked questions for the ObsIdentify app. */
  'faq-obsidentify': TermsDocument;
}

/**
 * Aggregated user statistics from `GET /user/stats/observations/`.
 *
 * `total` holds the overall totals; every other key is a date (truncated to the
 * requested aggregation, e.g. `2018`, `2018-02` or `2018-01-01`). Each value is a
 * tuple of `[observation_count, species_count]`.
 */
export interface UserStats {
  /** Overall `[total_observations, total_species]`. */
  total: [number, number];
  /** Per-date `[observation_count, species_count]`. */
  [date: string]: [number, number];
}
