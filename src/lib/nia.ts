import type { ObservationClient } from '../core/client';
import type { NiaResponse, NiaIdentifyOptions } from '../types';

export class Nia {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Requests image identification from the NIA (Naturalis Image Analysis) proxy.
   * This endpoint can be used anonymously (with a daily rate limit) or authenticated.
   * The NIA service attempts to identify the species in the provided images.
   *
   * @param options - The images to identify and optional location coordinates.
   * @returns A promise that resolves to the NIA identification response.
   * @throws {ApiError} If the request fails.
   */
  public async identify(options: NiaIdentifyOptions): Promise<NiaResponse> {
    const formData = new FormData();

    options.images.forEach((image) => {
      formData.append(`image`, image);
    });

    if (options.location) {
      formData.append(
        'location_coordinates',
        `${options.location.lat},${options.location.lng}`,
      );
    }

    if (this.#client.hasAccessToken()) {
      return this.#client.request<NiaResponse>('/api/identify-proxy/v1/', {
        method: 'POST',
        body: formData,
      });
    }

    // This endpoint has a different base path than the rest of the API.
    return this.#client.publicRequest<NiaResponse>('/api/identify-proxy/v1/', {
      method: 'POST',
      body: formData,
    });
  }
}
