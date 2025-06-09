import type { ObservationClient } from '../core/client';
import type { MediaUploadResponse, Paginated } from '../types';

export class Media {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Uploads a media file (photo or sound) to get a temporary name.
   * This temporary name can then be used when creating or updating an observation.
   *
   * @param media The media file (as a Blob) to upload.
   * @param options - Optional parameters.
   * @param options.identify - If `true`, the system will attempt to identify the species in the media.
   * @returns A promise that resolves to the media upload response, containing the temporary name.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async upload(
    media: Blob,
    options: { identify?: boolean } = {},
  ): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('media', media);

    const params: Record<string, string | number> = {};
    if (options.identify) {
      params.identify = 'true';
    }

    return this.#client.request<MediaUploadResponse>('media-upload/', {
      method: 'POST',
      body: formData,
      params,
    });
  }

  /**
   * @throws {ApiError} If the request fails.
   */
  public async getSimilar(id: number): Promise<Paginated<Media>> {
    const params: Record<string, string | number> = {
      model: 'Media',
      pk: id,
    };
    return this.#client.request<Paginated<Media>>('media/similar/', {
      method: 'GET',
      params,
    });
  }
}
