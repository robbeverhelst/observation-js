import type { UserDetail } from './base';

export interface ChallengeContent {
  id: number;
  title: string | null;
  text: string;
  url: string | null;
  video: string | null;
  video_thumbnail: string | null;
  publication_time: string;
  last_seen: string | null;
}

export interface ChallengeTarget {
  id: number;
  name: string;
  type: 'observations' | 'species';
  target_count: number;
  user_count: number;
}

export interface ChallengeUser {
  is_subscribed: boolean;
  observation_count: number;
  species_count: number;
}

export interface Challenge {
  id: number;
  type: 'regular' | 'onboarding' | 'group' | 'template';
  title: string;
  header: string;
  start_date_time: string;
  end_date_time: string;
  cover_image: string;
  cover_thumbnail: string | null;
  instructions: ChallengeContent | null;
  results: ChallengeContent[];
  observation_count: number;
  species_count: number;
  challenge_user: ChallengeUser | null;
  /** Translated text in HTML format (or empty string). */
  targets_description: string;
  targets: ChallengeTarget[];
  /** Group `id` for challenges with type `group`. */
  group_id?: number;
  /** `id` of the template challenge on which a group challenge was based. */
  template_id?: number;
}

export interface ChallengeListParams {
  /** The user's location, formatted as a `latitude,longitude` pair. */
  coordinates?: string;
  type?: 'regular' | 'onboarding' | 'group';
  is_active?: boolean;
}

export interface ChallengeRank {
  rank: number;
  user: UserDetail;
  count: number;
  rank_user_count: number;
}

export interface ChallengeRanking {
  ranking: ChallengeRank[];
}

export interface MarkAsSeenResponse {
  last_seen: string | null;
}

export interface SubscribeResponse {
  is_subscribed: boolean;
  observation_count: number;
  species_count: number;
  /**
   * The date and time that any existing challenge content items were updated
   * to, or `null`.
   */
  last_seen: string | null;
}

export interface ChallengeTemplate {
  id: number;
  title: string;
  species_groups: number[];
}
