import type { ObservationClient } from '../core/client';
import type { Badge, Paginated } from '../types';

export class Badges {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches a list of badges.
   * Returns onboarding badges for unauthenticated users.
   * Returns user-specific badges for authenticated users.
   * @returns A paginated list of badges.
   */
  public async list(): Promise<Paginated<Badge>> {
    if (this.client.hasAccessToken()) {
      return this.client.request<Paginated<Badge>>('badges/');
    }
    return this.client.publicRequest<Paginated<Badge>>('badges/');
  }

  /**
   * Fetches the details of a specific badge.
   * Returns public details for unauthenticated users.
   * Returns user-specific progress for authenticated users.
   * @param id The ID of the badge.
   * @returns The badge object.
   */
  public async get(id: number): Promise<Badge> {
    const endpoint = `badges/${id}/`;
    if (this.client.hasAccessToken()) {
      return this.client.request<Badge>(endpoint);
    }
    return this.client.publicRequest<Badge>(endpoint);
  }

  /**
   * Gets all badge IDs an observation contributes to.
   * This is an authenticated endpoint.
   * @param observationId The ID of the observation.
   * @returns A paginated list of badge IDs.
   */
  public async getForObservation(
    observationId: number
  ): Promise<Paginated<{ id: number }>> {
    return this.client.request<Paginated<{ id: number }>>(
      `badges/observation/${observationId}/`
    );
  }

  /**
   * Sets the `last_seen` date for all regular badges for the current user.
   * This is an authenticated endpoint.
   * @returns An object with the last_seen timestamp.
   */
  public async markAllAsSeen(): Promise<{ last_seen: string }> {
    return this.client.request<{ last_seen: string }>(
      'badges/user-badge/seen/',
      { method: 'POST' }
    );
  }

  /**
   * Gets the `last_seen` date for a specific user badge.
   * This is an authenticated endpoint.
   * @param userBadgeId The ID of the user badge.
   * @returns An object with the last_seen timestamp.
   */
  public async getLastSeen(userBadgeId: number): Promise<{ last_seen: string }> {
    return this.client.request<{ last_seen: string }>(
      `badges/user-badge/${userBadgeId}/seen/`
    );
  }

  /**
   * Sets the `last_seen` date for a specific user badge.
   * This is an authenticated endpoint.
   * @param userBadgeId The ID of the user badge.
   * @returns An object with the updated last_seen timestamp.
   */
  public async markAsSeen(userBadgeId: number): Promise<{ last_seen: string }> {
    return this.client.request<{ last_seen: string }>(
      `badges/user-badge/${userBadgeId}/seen/`,
      { method: 'POST' }
    );
  }

  /**
   * Gets the `last_seen` date for a specific user season badge.
   * This is an authenticated endpoint.
   * @param userSeasonBadgeId The ID of the user season badge.
   * @returns An object with the last_seen timestamp.
   */
  public async getSeasonLastSeen(
    userSeasonBadgeId: number
  ): Promise<{ last_seen: string }> {
    return this.client.request<{ last_seen: string }>(
      `badges/user-season-badge/${userSeasonBadgeId}/seen/`
    );
  }

  /**
   * Sets the `last_seen` date for a specific user season badge.
   * This is an authenticated endpoint.
   * @param userSeasonBadgeId The ID of the user season badge.
   * @returns An object with the updated last_seen timestamp.
   */
  public async markSeasonAsSeen(
    userSeasonBadgeId: number
  ): Promise<{ last_seen: string }> {
    return this.client.request<{ last_seen: string }>(
      `badges/user-season-badge/${userSeasonBadgeId}/seen/`,
      { method: 'POST' }
    );
  }
} 