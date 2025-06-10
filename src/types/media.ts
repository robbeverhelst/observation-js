export interface MediaUploadResponse {
  name: string;
  identify_result_url: string | null;
}

export interface MediaItem {
  id: number;
  file: string;
  url: string;
  attribution: string;
  type: 'photo' | 'sound';
  created_at: string;
  observation_id?: number;
}
