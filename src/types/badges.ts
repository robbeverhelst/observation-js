export interface BadgeLevel {
  id: number;
  target_species: number;
  target_observations: number;
  value: number;
  content: string;
}

export interface UserRegularBadge {
  id: number;
  num_species: number;
  num_observations: number;
  is_valid: boolean;
  last_seen: string;
  publication_time: string;
  level: BadgeLevel;
}

export interface UserSeasonBadge {
  id: number;
  rank: number;
  content: string;
  country_code: string;
  last_seen: string;
  publication_time: string;
  label: string;
}

export interface Badge {
  id: number;
  name: string;
  type: 'regular' | 'season';
  silhouette: string;
  background_color: string;
  species_groups: number[];
  user_regular_badge: UserRegularBadge | null;
  next_level: BadgeLevel | null;
  onboarding_levels: BadgeLevel[] | null;
  user_season_badges: UserSeasonBadge[] | null;
} 