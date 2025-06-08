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

  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * List challenges.
   * @param params - The parameters to filter the challenges.
   * @returns A paginated list of challenges.
   */
  async list(params?: ChallengeListParams): Promise<Paginated<Challenge>> {
    const request = this.#client.hasAccessToken()
      ? this.#client.request
      : this.#client.publicRequest;
    return request<Paginated<Challenge>>('challenges/', {
      params: { ...params },
    });
  }

  /**
   * Get the details of a challenge.
   * @param id - The ID of the challenge.
   * @returns The challenge details.
   */
  async get(id: number): Promise<Challenge> {
    const request = this.#client.hasAccessToken()
      ? this.#client.request.bind(this.#client)
      : this.#client.publicRequest.bind(this.#client);
    return request<Challenge>(`challenges/${id}/`);
  }

  /**
   * Get the ranking of a challenge.
   * @param id - The ID of the challenge.
   * @param by - The criteria to rank by.
   * @returns The challenge ranking.
   */
  async getRanking(
    id: number,
    by: 'species' | 'observations',
  ): Promise<ChallengeRanking> {
    const request = this.#client.hasAccessToken()
      ? this.#client.request.bind(this.#client)
      : this.#client.publicRequest.bind(this.#client);
    return request<ChallengeRanking>(`challenges/${id}/ranking/${by}/`);
  }

  /**
   * Get all the IDs of challenges an observation contributes to.
   * @param observationId - The ID of the observation.
   * @returns A paginated list of challenge IDs.
   */
  async getForObservation(
    observationId: number,
  ): Promise<Paginated<{ id: number }>> {
    return this.#client.request<Paginated<{ id: number }>>(
      `challenges/observation/${observationId}/`,
    );
  }

  /**
   * Subscribe or unsubscribe from a challenge.
   * @param id - The ID of the challenge.
   * @param isSubscribed - Whether to subscribe or unsubscribe.
   * @returns The subscription status.
   */
  async subscribe(
    id: number,
    isSubscribed: boolean,
  ): Promise<SubscribeResponse> {
    const body = new URLSearchParams({
      is_subscribed: String(isSubscribed),
    });
    return this.#client.request<SubscribeResponse>(`challenges/${id}/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  }

  /**
   * Mark challenge content as seen.
   * @param contentId - The ID of the challenge content.
   * @returns The last seen timestamp.
   */
  async markContentAsSeen(contentId: number): Promise<MarkAsSeenResponse> {
    return this.#client.request<MarkAsSeenResponse>(
      `challenges/content/${contentId}/seen/`,
      {
        method: 'POST',
      },
    );
  }
} 