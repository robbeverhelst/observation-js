import type {
  LocationDetail,
  Photo,
  Point,
  Sound,
  UserDetail,
} from './base';
import type { Species } from './species';

export interface Observation {
  id: number;
  url: string;
  species: Species | null;
  species_guess: string;
  user: UserDetail;
  location: LocationDetail | null;
  point: Point;
  date: string;
  time: string | null;
  count: number | null;
  count_text: string | null;
  photos: Photo[];
  sounds: Sound[];
  comments_count: number;
  likes_count: number;
  validation_status: string;
  is_validated: boolean;
  model_prediction: string;
  obscured_by_user: boolean;
  created_at: string;
}

export type ObservationField<F extends string> = { id: number; field: F };
export type ObservationFieldValue = ObservationField<
  | 'behaviour'
  | 'collection_method'
  | 'counting_method'
  | 'determination_method'
  | 'life_stage'
  | 'sex'
  | 'substrate'
  | 'vegetation_type'
> & {
  value: number;
  value_text: string;
};

export type ObservationFieldValueFree = ObservationField<'project'> & {
  value_text: string;
};

export type ObservationComment = {
  id: number;
  user: UserDetail;
  comment: string;
  created_at: string;
};

export type ObservationLike = {
  user: UserDetail;
  created_at: string;
};

export interface CreateObservationOptions {
  upload_photos?: Blob[];
  upload_sounds?: Blob[];
}

export type CreateObservationPayload = {
  // Core fields
  date: string;
  species_id?: number;
  species_guess?: string;

  // Location
  location_id?: number;
  point?: Point;

  // Details
  time?: string;
  notes?: string;
  is_certain?: boolean;
  count?: number;

  // Media (for async uploads)
  upload_media?: string[];
  
  // Advanced fields (example)
  // 'fields' would be an array of ObservationFieldValue or ObservationFieldValueFree
  // fields?: (ObservationFieldValue | ObservationFieldValueFree)[];
};

export type UpdateObservationPayload = Partial<CreateObservationPayload>; 