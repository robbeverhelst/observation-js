import type { ObservationClient } from '../core/client';
import type {
  Challenge,
  ChallengeListParams,
  ChallengeRanking,
  MarkAsSeenResponse,
  Paginated,
  SubscribeResponse,
} from '../types';

export class Challenges {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of challenges, which can be filtered by various parameters.
   * This endpoint is public, but results may differ for authenticated users.
   *
   * @param params - Optional parameters to filter the challenges.
   * @returns A promise that resolves to a paginated list of challenge objects.
   * @throws {ApiError} If the request fails.
   */
  async list(params?: ChallengeListParams): Promise<Paginated<Challenge>> {
    const options = {
      params: params as Record<string, string | number>,
    };
    if (this.#client.hasAccessToken()) {
      return this.#client.request<Paginated<Challenge>>('challenges/', options);
    }
    return this.#client.publicRequest<Paginated<Challenge>>('challenges/', {
      ...options,
      method: 'GET',
      cache: true,
    });
  }

  /**
   * Fetches the details of a specific challenge by its ID.
   * This endpoint is public, but results may differ for authenticated users.
   *
   * @param id - The unique identifier of the challenge.
   * @returns A promise that resolves to the challenge details.
   * @throws {ApiError} If the request fails.
   */
  async get(id: number): Promise<Challenge> {
    if (this.#client.hasAccessToken()) {
      return this.#client.request<Challenge>(`challenges/${id}`);
    }
    return this.#client.publicRequest<Challenge>(`challenges/${id}`, {
      method: 'GET',
      cache: true,
    });
  }

  /**
   * Fetches the user ranking for a specific challenge.
   *
   * @param id - The unique identifier of the challenge.
   * @param by - The criteria to rank by, either 'species' or 'observations'.
   * @returns A promise that resolves to the challenge ranking data.
   * @throws {ApiError} If the request fails.
   */
  async getRanking(
    id: number,
    by: 'species' | 'observations'
  ): Promise<ChallengeRanking> {
    const endpoint = `challenges/${id}/ranking/${by}`;
    if (this.#client.hasAccessToken()) {
      return this.#client.request<ChallengeRanking>(endpoint);
    }
    return this.#client.publicRequest<ChallengeRanking>(endpoint, {
      method: 'GET',
      cache: true,
    });
  }

  /**
   * Gets all the IDs of challenges that a specific observation contributes to.
   *
   * @param observationId - The unique identifier of the observation.
   * @returns A promise that resolves to a paginated list of challenge IDs.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  async getForObservation(
    observationId: number
  ): Promise<Paginated<{ id: number }>> {
    return this.#client.request<Paginated<{ id: number }>>(
      `challenges/observation/${observationId}`
    );
  }

  /**
   * Subscribes the authenticated user to a challenge, or unsubscribes them.
   *
   * @param id - The unique identifier of the challenge.
   * @param isSubscribed - Set to `true` to subscribe, `false` to unsubscribe.
   * @returns A promise that resolves to the updated subscription status.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  async subscribe(
    id: number,
    isSubscribed: boolean
  ): Promise<SubscribeResponse> {
    const body = new URLSearchParams({
      is_subscribed: String(isSubscribed),
    });
    return this.#client.request<SubscribeResponse>(`challenges/${id}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  }

  /**
   * Marks a piece of challenge content (e.g., instructions, results) as "seen" by the authenticated user.
   *
   * @param contentId - The unique identifier of the challenge content.
   * @returns A promise that resolves to an object with the `last_seen` timestamp.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  async markContentAsSeen(contentId: number): Promise<MarkAsSeenResponse> {
    return this.#client.request<MarkAsSeenResponse>(
      `challenges/content/${contentId}/seen`,
      {
        method: 'POST',
      },
    );
  }
} 