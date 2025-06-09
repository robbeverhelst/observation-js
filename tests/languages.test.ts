import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Language } from '../src/types';

const mockLanguage: Language = {
  code: 'en',
  name_en: 'English',
  name_native: 'English',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('languages.list should fetch a list of languages', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockLanguage],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const languages = await client.languages.list();

  expect(languages).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/languages/');

  fetchSpy.mockRestore();
});
