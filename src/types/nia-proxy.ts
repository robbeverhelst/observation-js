export interface NiaPrediction {
  probability: number;
  taxon: {
    id: number;
    name: string;
    vernacular_name: string | null;
    group_name: string;
    group_id: number;
    url: string;
  };
}

export interface NiaResponse {
  model_version: string;
  model_coverage: {
    description: string;
  };
  location_detail: {
    name: string;
  } | null;
  predictions: NiaPrediction[];
  species: {
    name: string;
    scientific_name: string;
    group: string;
  }[];
}

export interface NiaIdentifyOptions {
  images: Blob[];
  location?: {
    lat: number;
    lng: number;
  };
}
