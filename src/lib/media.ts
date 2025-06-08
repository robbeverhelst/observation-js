import type { ObservationClient } from '../core/client';
import type { MediaUploadResponse } from '../types';

export class Media {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Upload a media file (photo or sound) to get a temporary name.
   * This temporary name can be used when creating or updating an observation.
   * This is an authenticated endpoint.
   * @param media The media file (Blob) to upload.
   * @param options Optional parameters.
   * @returns The response from the media upload endpoint.
   */
  public async upload(
    media: Blob,
    options: { identify?: boolean } = {}
  ): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('media', media);

    return this.client.request<MediaUploadResponse>('media-upload/', {
      method: 'POST',
      body: formData,
      params: options,
    });
  }
} 