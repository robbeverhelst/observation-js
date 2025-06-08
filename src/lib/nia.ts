import type { ObservationClient } from '../core/client';
import type { NiaResponse } from '../types';

export interface NiaIdentifyOptions {
  images: Blob[];
  location?: {
    lat: number;
    lng: number;
  };
}

export class Nia {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Requests image identification from the NIA proxy.
   * This endpoint can be used anonymously (with a daily limit) or authenticated.
   * @param options The images and optional location coordinates.
   * @returns A promise that resolves to the NIA identification response.
   */
  public async identify(options: NiaIdentifyOptions): Promise<NiaResponse> {
    const formData = new FormData();

    options.images.forEach((image, index) => {
      formData.append(`image`, image);
    });

    if (options.location) {
      formData.append(
        'location_coordinates',
        `${options.location.lat},${options.location.lng}`
      );
    }

    const requestMethod = this.client.hasAccessToken()
      ? this.client.request.bind(this.client)
      : this.client.publicRequest.bind(this.client);

    // This endpoint has a different base path than the rest of the API.
    return requestMethod<NiaResponse>('/api/identify-proxy/v1/', {
      method: 'POST',
      body: formData,
    });
  }
} 