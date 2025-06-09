import type { ObservationClient } from '../core/client';
import type { Badge, Paginated } from '../types';

export class Badges {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of badges.
   * - For unauthenticated users, this returns a list of public "onboarding" badges.
   * - For authenticated users, this returns their personalized list of badges including progress.
   *
   * @returns A promise that resolves to a paginated list of badge objects.
   * @throws {ApiError} If the request fails.
   */
  public async list(): Promise<Paginated<Badge>> {
    if (this.#client.hasAccessToken()) {
      return this.#client.request<Paginated<Badge>>('badges/');
    }
    return this.#client.publicRequest<Paginated<Badge>>('badges/', {
      method: 'GET',
      cache: true,
    });
  }

  /**
   * Fetches the details of a specific badge by its ID.
   * - For unauthenticated users, this returns the public details of the badge.
   * - For authenticated users, this returns personalized details including their progress.
   *
   * @param id The unique identifier for the badge.
   * @returns A promise that resolves to the badge object.
   * @throws {ApiError} If the request fails.
   */
  public async get(id: number): Promise<Badge> {
    const endpoint = `badges/${id}`;
    if (this.#client.hasAccessToken()) {
      return this.#client.request<Badge>(endpoint);
    }
    return this.#client.publicRequest<Badge>(endpoint, {
      method: 'GET',
      cache: true,
    });
  }

  /**
   * Gets all badge IDs that a specific observation contributes to.
   *
   * @param observationId The unique identifier for the observation.
   * @returns A promise that resolves to a paginated list of badge IDs.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getForObservation(
    observationId: number
  ): Promise<Paginated<{ id: number }>> {
    return this.#client.request<Paginated<{ id: number }>>(
      `badges/observation/${observationId}/`
    );
  }

  /**
   * Marks all regular badges as "seen" for the current user.
   * This updates the `last_seen` timestamp for all of the user's regular badges.
   *
   * @returns A promise that resolves to an object with the `last_seen` timestamp.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async markAllAsSeen(): Promise<{ last_seen: string }> {
    return this.#client.request<{ last_seen: string }>(
      'badges/user-badge/seen/',
      { method: 'POST' }
    );
  }

  /**
   * Gets the `last_seen` timestamp for a specific regular user badge.
   *
   * @param userBadgeId The unique identifier for the user badge.
   * @returns A promise that resolves to an object with the `last_seen` timestamp.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getLastSeen(userBadgeId: number): Promise<{ last_seen: string }> {
    return this.#client.request<{ last_seen: string }>(
      `badges/user-badge/${userBadgeId}/seen/`
    );
  }

  /**
   * Marks a specific regular user badge as "seen".
   *
   * @param userBadgeId The unique identifier for the user badge.
   * @returns A promise that resolves to an object with the updated `last_seen` timestamp.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async markAsSeen(userBadgeId: number): Promise<{ last_seen: string }> {
    return this.#client.request<{ last_seen: string }>(
      `badges/user-badge/${userBadgeId}/seen/`,
      { method: 'POST' }
    );
  }

  /**
   * Gets the `last_seen` timestamp for a specific user season badge.
   *
   * @param userSeasonBadgeId The unique identifier for the user season badge.
   * @returns A promise that resolves to an object with the `last_seen` timestamp.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getSeasonLastSeen(
    userSeasonBadgeId: number
  ): Promise<{ last_seen: string }> {
    return this.#client.request<{ last_seen: string }>(
      `badges/user-season-badge/${userSeasonBadgeId}/seen/`
    );
  }

  /**
   * Marks a specific user season badge as "seen".
   *
   * @param userSeasonBadgeId The unique identifier for the user season badge.
   * @returns A promise that resolves to an object with the updated `last_seen` timestamp.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async markSeasonAsSeen(
    userSeasonBadgeId: number
  ): Promise<{ last_seen: string }> {
    return this.#client.request<{ last_seen: string }>(
      `badges/user-season-badge/${userSeasonBadgeId}/seen/`,
      { method: 'POST' }
    );
  }
} 