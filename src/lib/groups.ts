import type { ObservationClient } from '../core/client';
import type {
  Challenge,
  ChallengeTemplate,
  Group,
  GroupSummary,
  Observation,
  Paginated,
} from '../types';

export class Groups {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches the groups for the current authenticated user.
   *
   * @returns A promise that resolves to a paginated list of the user's groups.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async list(): Promise<Paginated<Group>> {
    return this.#client.request<Paginated<Group>>('user/groups/');
  }

  /**
   * Fetches the details of a specific group by its ID.
   * The authenticated user must be a member of the group.
   *
   * @param groupId The unique identifier of the group.
   * @returns A promise that resolves to the group object.
   * @throws {AuthenticationError} If the user is not a member or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async get(groupId: number): Promise<Group> {
    return this.#client.request<Group>(`groups/${groupId}`);
  }

  /**
   * Fetches a public summary of a group using an invite code.
   * This does not require authentication.
   *
   * @param groupId The unique identifier of the group.
   * @param inviteCode The invite code for the group.
   * @returns A promise that resolves to the group's public summary.
   * @throws {ApiError} If the group or invite code is invalid.
   */
  public async getSummary(
    groupId: number,
    inviteCode: string,
  ): Promise<GroupSummary> {
    return this.#client.publicRequest<GroupSummary>(
      `groups/${groupId}/summary/${inviteCode}/`,
    );
  }

  /**
   * Creates a new group.
   *
   * @param name The name of the new group.
   * @param photo The group's photo/avatar as a Blob or Buffer.
   * @returns A promise that resolves to the newly created group object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async create(name: string, photo: Blob | Buffer): Promise<Group> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', new Blob([photo]));
    return this.#client.request<Group>('groups/create/', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Updates an existing group's details.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group to update.
   * @param data An object containing the data to update (name and/or photo).
   * @returns A promise that resolves to the updated group object.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async update(
    groupId: number,
    data: { name?: string; photo?: Blob | Buffer },
  ): Promise<Group> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.photo) formData.append('photo', new Blob([data.photo]));
    return this.#client.request<Group>(`groups/${groupId}`, {
      method: 'PATCH',
      body: formData,
    });
  }

  /**
   * Deletes a group.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group to delete.
   * @returns A promise that resolves when the group is successfully deleted.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async delete(groupId: number): Promise<void> {
    await this.#client.request<void>(`groups/${groupId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Renews the invite code for a group.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group.
   * @returns A promise that resolves to the updated group object with a new invite link.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async renewInviteCode(groupId: number): Promise<Group> {
    return this.#client.request<Group>(`groups/${groupId}/renew-invite-code/`, {
      method: 'POST',
    });
  }

  /**
   * Joins a group using an invite code.
   *
   * @param groupId The unique identifier of the group to join.
   * @param inviteCode The invite code for the group.
   * @returns A promise that resolves when the user has successfully joined the group.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the invite code is invalid or the request fails.
   */
  public async join(groupId: number, inviteCode: string): Promise<void> {
    await this.#client.request<void>(`groups/${groupId}/join/${inviteCode}/`, {
      method: 'POST',
    });
  }

  /**
   * Leaves a group.
   * The authenticated user must be a member of the group.
   *
   * @param groupId The unique identifier of the group to leave.
   * @returns A promise that resolves when the user has successfully left the group.
   * @throws {AuthenticationError} If the user is not a member or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async leave(groupId: number): Promise<void> {
    await this.#client.request<void>(`groups/${groupId}/leave/`, {
      method: 'POST',
    });
  }

  /**
   * Removes a member from a group.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group.
   * @param memberId The unique identifier of the member to remove.
   * @returns A promise that resolves when the member is successfully removed.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async removeMember(groupId: number, memberId: number): Promise<void> {
    await this.#client.request<void>(`groups/${groupId}/members/${memberId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Fetches the available challenge templates that can be used to create group challenges.
   *
   * @returns A promise that resolves to a paginated list of challenge templates.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async listChallengeTemplates(): Promise<Paginated<ChallengeTemplate>> {
    return this.#client.request<Paginated<ChallengeTemplate>>(
      'groups/challenge-templates/',
    );
  }

  /**
   * Fetches the challenges for a specific group.
   * The authenticated user must be a member of the group.
   *
   * @param groupId The unique identifier of the group.
   * @returns A promise that resolves to a paginated list of challenges for the group.
   * @throws {AuthenticationError} If the user is not a member or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async listChallenges(groupId: number): Promise<Paginated<Challenge>> {
    return this.#client.request<Paginated<Challenge>>(
      `groups/${groupId}/challenges/`,
    );
  }

  /**
   * Creates a new challenge for a group from a template.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group.
   * @param data An object containing the challenge details (template ID, start, and end times).
   * @returns A promise that resolves to the newly created challenge.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async createChallenge(
    groupId: number,
    data: {
      template: number;
      start_date_time: string;
      end_date_time: string;
    },
  ): Promise<Challenge> {
    return this.#client.request<Challenge>(`groups/${groupId}/challenges/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Updates an existing group challenge.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group.
   * @param challengeId The unique identifier of the challenge to update.
   * @param data An object containing the data to update (start and/or end times).
   * @returns A promise that resolves to the updated challenge.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async updateChallenge(
    groupId: number,
    challengeId: number,
    data: { start_date_time?: string; end_date_time?: string },
  ): Promise<Challenge> {
    return this.#client.request<Challenge>(
      `groups/${groupId}/challenges/${challengeId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    );
  }

  /**
   * Deletes a group challenge.
   * The authenticated user must be an admin of the group.
   *
   * @param groupId The unique identifier of the group.
   * @param challengeId The unique identifier of the challenge to delete.
   * @returns A promise that resolves when the challenge is successfully deleted.
   * @throws {AuthenticationError} If the user is not an admin or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async deleteChallenge(
    groupId: number,
    challengeId: number,
  ): Promise<void> {
    await this.#client.request<void>(
      `groups/${groupId}/challenges/${challengeId}/`,
      {
        method: 'DELETE',
      },
    );
  }

  /**
   * Fetches observations for a specific group.
   * The authenticated user must be a member of the group.
   *
   * @param groupId The unique identifier of the group.
   * @returns A promise that resolves to a list of observations.
   *   Note: This response is not paginated in the standard way.
   * @throws {AuthenticationError} If the user is not a member or not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getObservations(
    groupId: number,
  ): Promise<{
    next: string | null;
    previous: string | null;
    results: Observation[];
  }> {
    return this.#client.request<{
      next: string | null;
      previous: string | null;
      results: Observation[];
    }>(`groups/${groupId}/observations/`);
  }
}
