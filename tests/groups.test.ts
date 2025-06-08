import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Group, GroupSummary, ChallengeTemplate, Challenge } from '../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockChallengeTemplate: ChallengeTemplate = {
    id: 1,
    title: 'Test Challenge Template',
    species_groups: [1],
};

const mockChallenge: Challenge = {
    id: 1,
    type: 'group',
    title: 'Test Challenge',
    header: 'Test Challenge Header',
    start_date_time: '2023-01-01T00:00:00Z',
    end_date_time: '2023-01-31T23:59:59Z',
    cover_image: 'https://example.com/cover.jpg',
    cover_thumbnail: null,
    instructions: null,
    results: [],
    observation_count: 0,
    species_count: 0,
    challenge_user: null,
    targets: [],
    group: { id: 1, name: 'Test Group' },
};

const mockGroup: Group = {
  id: 1,
  name: 'Test Group',
  photo: 'https://example.com/photo.jpg',
  created_at: '2023-01-01T12:00:00Z',
  invite_link: 'https://waarneming.nl/group/1/join/invite-code',
  members: [],
};

const mockGroupSummary: GroupSummary = {
  id: 1,
  name: 'Test Group',
  photo: 'https://example.com/photo.jpg',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('groups.list should fetch a list of groups for the user', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockGroup],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const groups = await client.groups.list();

  expect(groups).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/user/groups/');

  fetchSpy.mockRestore();
});

test('groups.get should fetch a single group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockGroup), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const group = await client.groups.get(1);

  expect(group).toEqual(mockGroup);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/groups/1');

  fetchSpy.mockRestore();
});

test('groups.getSummary should fetch a group summary with an invite code', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockGroupSummary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  const summary = await client.groups.getSummary(1, 'invite-code');

  expect(summary).toEqual(mockGroupSummary);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/groups/1/summary/invite-code/');

  fetchSpy.mockRestore();
});

test('groups.create should create a new group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockGroup), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const photoBlob = new Blob(['fake-photo-data'], { type: 'image/jpeg' });
  const group = await client.groups.create('New Group', photoBlob);

  expect(group).toEqual(mockGroup);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = options?.body as FormData;

  expect(url.pathname).toBe('/api/v1/groups/create/');
  expect(body.get('name')).toBe('New Group');
  expect(body.get('photo')).not.toBeNull();

  fetchSpy.mockRestore();
});

test('groups.update should update an existing group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockGroup), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const group = await client.groups.update(1, { name: 'Updated Name' });

  expect(group).toEqual(mockGroup);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = options?.body as FormData;

  expect(url.pathname).toBe('/api/v1/groups/1');
  expect(options?.method).toBe('PATCH');
  expect(body.get('name')).toBe('Updated Name');

  fetchSpy.mockRestore();
});

test('groups.delete should delete a group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  await client.groups.delete(1);

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];

  expect(url.pathname).toBe('/api/v1/groups/1');
  expect(options?.method).toBe('DELETE');

  fetchSpy.mockRestore();
});

test('groups.renewInviteCode should renew the invite code', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockGroup), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const group = await client.groups.renewInviteCode(1);

  expect(group).toEqual(mockGroup);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/groups/1/renew-invite-code/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('groups.join should join a group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  await client.groups.join(1, 'invite-code');

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/groups/1/join/invite-code/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('groups.leave should leave a group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  await client.groups.leave(1);

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/groups/1/leave/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('groups.removeMember should remove a member from a group', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  await client.groups.removeMember(1, 2);

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/groups/1/members/2/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('DELETE');

  fetchSpy.mockRestore();
});

test('groups.listChallengeTemplates should fetch challenge templates', async () => {
    const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockChallengeTemplate],
    };
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        })
    );
    
    const client = new ObservationClient();
    client.setAccessToken('test-token');
    const templates = await client.groups.listChallengeTemplates();
    
    expect(templates).toEqual(mockResponse);
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/v1/groups/challenge-templates/');
    
    fetchSpy.mockRestore();
});

test('groups.listChallenges should fetch challenges for a group', async () => {
    const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockChallenge],
    };
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        })
    );
    
    const client = new ObservationClient();
    client.setAccessToken('test-token');
    const challenges = await client.groups.listChallenges(1);
    
    expect(challenges).toEqual(mockResponse);
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/v1/groups/1/challenges/');
    
    fetchSpy.mockRestore();
});

test('groups.createChallenge should create a new challenge for a group', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockChallenge), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        })
    );
    
    const client = new ObservationClient();
    client.setAccessToken('test-token');
    const challengeData = {
        template: 1,
        start_date_time: '2023-01-01T00:00:00Z',
        end_date_time: '2023-01-31T23:59:59Z',
    };
    const challenge = await client.groups.createChallenge(1, challengeData);
    
    expect(challenge).toEqual(mockChallenge);
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/v1/groups/1/challenges/');
    const options = fetchSpy.mock.calls[0][1];
    expect(options?.method).toBe('POST');
    
    fetchSpy.mockRestore();
});

test('groups.updateChallenge should update an existing challenge', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockChallenge), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        })
    );
    
    const client = new ObservationClient();
    client.setAccessToken('test-token');
    const challengeData = {
        start_date_time: '2023-02-01T00:00:00Z',
    };
    const challenge = await client.groups.updateChallenge(1, 1, challengeData);
    
    expect(challenge).toEqual(mockChallenge);
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/v1/groups/1/challenges/1/');
    const options = fetchSpy.mock.calls[0][1];
    expect(options?.method).toBe('PATCH');
    
    fetchSpy.mockRestore();
});

test('groups.deleteChallenge should delete a challenge', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(null, { status: 204 })
    );
    
    const client = new ObservationClient();
    client.setAccessToken('test-token');
    await client.groups.deleteChallenge(1, 1);
    
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/v1/groups/1/challenges/1/');
    const options = fetchSpy.mock.calls[0][1];
    expect(options?.method).toBe('DELETE');
    
    fetchSpy.mockRestore();
});

test('groups.getObservations should fetch observations for a group', async () => {
    const mockResponse = {
        next: null,
        previous: null,
        results: [],
    };
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        })
    );
    
    const client = new ObservationClient();
    client.setAccessToken('test-token');
    const observations = await client.groups.getObservations(1);
    
    expect(observations).toEqual(mockResponse);
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/v1/groups/1/observations/');
    
    fetchSpy.mockRestore();
}); 