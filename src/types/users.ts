export interface User {
  id: number;
  name: string;
  avatar: string | null;
  observation_count: number;
  species_count: number;
  validation_count: number;
}

export interface Terms {
  terms: string;
  privacy_policy: string;
}

export interface UserStats {
  // Define the structure based on API response
  [key: string]: unknown;
}
