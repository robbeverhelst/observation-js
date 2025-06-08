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
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches the groups for the current authenticated user.
   * @returns A paginated list of groups.
   */
  public async list(): Promise<Paginated<Group>> {
    return this.client.request<Paginated<Group>>('user/groups/');
  }

  /**
   * Fetches the details of a specific group.
   * The user must be a member of the group.
   * @param groupId The ID of the group.
   * @returns The group object.
   */
  public async get(groupId: number): Promise<Group> {
    return this.client.request<Group>(`groups/${groupId}/`);
  }

  /**
   * Fetches a public summary of a group using an invite code.
   * @param groupId The ID of the group.
   * @param inviteCode The invite code.
   * @returns The group summary.
   */
  public async getSummary(
    groupId: number,
    inviteCode: string
  ): Promise<GroupSummary> {
    return this.client.publicRequest<GroupSummary>(
      `groups/${groupId}/summary/${inviteCode}/`
    );
  }

  /**
   * Creates a new group.
   * @param name The name of the group.
   * @param photo The group's photo.
   * @returns The newly created group object.
   */
  public async create(name: string, photo: Blob | Buffer): Promise<Group> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', new Blob([photo]));
    return this.client.request<Group>('groups/create/', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Updates an existing group.
   * The user must be an admin of the group.
   * @param groupId The ID of the group to update.
   * @param data The data to update.
   * @returns The updated group object.
   */
  public async update(
    groupId: number,
    data: { name?: string; photo?: Blob | Buffer }
  ): Promise<Group> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.photo) formData.append('photo', new Blob([data.photo]));
    return this.client.request<Group>(`groups/${groupId}/`, {
      method: 'PATCH',
      body: formData,
    });
  }

  /**
   * Deletes a group.
   * The user must be an admin of the group.
   * @param groupId The ID of the group to delete.
   */
  public async delete(groupId: number): Promise<void> {
    await this.client.request<void>(`groups/${groupId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Renews the invite code for a group.
   * The user must be an admin of the group.
   * @param groupId The ID of the group.
   * @returns The updated group object with a new invite link.
   */
  public async renewInviteCode(groupId: number): Promise<Group> {
    return this.client.request<Group>(`groups/${groupId}/renew-invite-code/`, {
      method: 'POST',
    });
  }

  /**
   * Joins a group using an invite code.
   * @param groupId The ID of the group to join.
   * @param inviteCode The invite code.
   */
  public async join(groupId: number, inviteCode: string): Promise<void> {
    await this.client.request<void>(`groups/${groupId}/join/${inviteCode}/`, {
      method: 'POST',
    });
  }

  /**
   * Leaves a group.
   * @param groupId The ID of the group to leave.
   */
  public async leave(groupId: number): Promise<void> {
    await this.client.request<void>(`groups/${groupId}/leave/`, {
      method: 'POST',
    });
  }

  /**
   * Removes a member from a group.
   * The user must be an admin of the group.
   * @param groupId The ID of the group.
   * @param memberId The ID of the member to remove.
   */
  public async removeMember(groupId: number, memberId: number): Promise<void> {
    await this.client.request<void>(`groups/${groupId}/members/${memberId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Fetches the available group challenge templates.
   * @returns A paginated list of challenge templates.
   */
  public async listChallengeTemplates(): Promise<Paginated<ChallengeTemplate>> {
    return this.client.request<Paginated<ChallengeTemplate>>(
      'groups/challenge-templates/'
    );
  }

  /**
   * Fetches the challenges for a specific group.
   * @param groupId The ID of the group.
   * @returns A paginated list of challenges.
   */
  public async listChallenges(groupId: number): Promise<Paginated<Challenge>> {
    return this.client.request<Paginated<Challenge>>(
      `groups/${groupId}/challenges/`
    );
  }

  /**
   * Creates a new challenge for a group.
   * @param groupId The ID of the group.
   * @param data The challenge details.
   * @returns The newly created challenge.
   */
  public async createChallenge(
    groupId: number,
    data: {
      template: number;
      start_date_time: string;
      end_date_time: string;
    }
  ): Promise<Challenge> {
    return this.client.request<Challenge>(`groups/${groupId}/challenges/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Updates an existing group challenge.
   * @param groupId The ID of the group.
   * @param challengeId The ID of the challenge to update.
   * @param data The data to update.
   * @returns The updated challenge.
   */
  public async updateChallenge(
    groupId: number,
    challengeId: number,
    data: { start_date_time?: string; end_date_time?: string }
  ): Promise<Challenge> {
    return this.client.request<Challenge>(
      `groups/${groupId}/challenges/${challengeId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * Deletes a group challenge.
   * @param groupId The ID of the group.
   * @param challengeId The ID of the challenge to delete.
   */
  public async deleteChallenge(
    groupId: number,
    challengeId: number
  ): Promise<void> {
    await this.client.request<void>(
      `groups/${groupId}/challenges/${challengeId}/`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Fetches observations for a specific group.
   * @param groupId The ID of the group.
   * @returns A list of observations. Note: This is not a standard paginated response.
   */
  public async getObservations(
    groupId: number
  ): Promise<{ next: string | null; previous: string | null; results: Observation[] }> {
    return this.client.request<{
      next: string | null;
      previous: string | null;
      results: Observation[];
    }>(`groups/${groupId}/observations/`);
  }
} 