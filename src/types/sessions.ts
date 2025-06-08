export interface Session {
  id: number;
  uuid: string;
  name: string;
  type: string;
  notes: string | null;
  start_datetime: string;
  end_datetime: string;
  is_active: boolean;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    show_scientific_names: boolean;
    show_high_quality_only: boolean;
    language: string;
  };
}

export interface CreateSessionPayload {
  uuid: string;
  name: string;
  // ... other fields
}

export interface UpdateSessionPayload extends CreateSessionPayload {} 