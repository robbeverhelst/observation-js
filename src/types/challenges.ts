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
  type: 'regular' | 'onboarding' | 'group';
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
  targets: ChallengeTarget[];
  group: { id: number; name: string } | null;
}

export interface ChallengeListParams {
  type?: 'regular' | 'onboarding' | 'group';
  group_id?: number;
  is_active?: boolean;
}

export interface ChallengeRanking {
  user: UserDetail;
  observation_count: number;
  species_count: number;
  rank: number;
}

export interface MarkAsSeenResponse {
  message: string;
}

export interface SubscribeResponse {
  is_subscribed: boolean;
}

export interface ChallengeRank {
  rank: number;
  user: UserDetail;
  count: number;
  rank_user_count: number;
}

export interface ChallengeTemplate {
  id: number;
  title: string;
  species_groups: number[];
} 