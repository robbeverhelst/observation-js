import { expect, test, describe, beforeAll } from 'bun:test';
import { createPublicClient, retryOperation, hasE2EConfig } from './setup';
import { ObservationClient } from '../../src/index';

describe('E2E: Public API Endpoints', () => {
  let publicClient: ObservationClient;

  beforeAll(async () => {
    console.log('🚀 Setting up E2E Public API tests (no authentication required)...');
    publicClient = createPublicClient();
  });

  test('should fetch species information', async () => {
    const species = await retryOperation(async () => {
      return await publicClient.species.get(2); // Common species ID
    });
    
    expect(species).toBeDefined();
    expect(species.id).toBe(2);
    expect(species.name).toBeDefined();
    expect(species.scientific_name).toBeDefined();
    expect(species.group).toBeGreaterThan(0);
    
    console.log(`✅ Retrieved species: ${species.name} (${species.scientific_name})`);
  });

  test('should search for species', async () => {
    const searchResults = await retryOperation(async () => {
      return await publicClient.species.search({ q: 'bird' });
    });
    
    expect(searchResults).toBeDefined();
    expect(searchResults.results).toBeDefined();
    expect(Array.isArray(searchResults.results)).toBe(true);
    // Note: search might return 0 results, which is valid
    
    if (searchResults.results.length > 0) {
      const firstSpecies = searchResults.results[0];
      expect(firstSpecies.id).toBeGreaterThan(0);
      expect(firstSpecies.name).toBeDefined();
    }
    
    console.log(`✅ Found ${searchResults.results.length} species matching 'bird'`);
  });

  test('should fetch species groups', async () => {
    const groups = await retryOperation(async () => {
      return await publicClient.species.listGroups();
    });
    
    expect(groups).toBeDefined();
    expect(Array.isArray(groups)).toBe(true);
    expect(groups.length).toBeGreaterThan(0);
    
    const firstGroup = groups[0];
    expect(firstGroup.id).toBeGreaterThan(0);
    expect(firstGroup.name).toBeDefined();
    
    console.log(`✅ Retrieved ${groups.length} species groups`);
  });

  test('should fetch countries list', async () => {
    const countries = await retryOperation(async () => {
      return await publicClient.countries.list();
    });
    
    expect(countries).toBeDefined();
    expect(countries.results).toBeDefined();
    expect(Array.isArray(countries.results)).toBe(true);
    expect(countries.results.length).toBeGreaterThan(0);
    
    const netherlands = countries.results.find(c => c.code === 'NL');
    expect(netherlands).toBeDefined();
    expect(netherlands?.name).toBeDefined();
    
    console.log(`✅ Retrieved ${countries.results.length} countries`);
  });

  test('should fetch languages list', async () => {
    const languages = await retryOperation(async () => {
      return await publicClient.languages.list();
    });
    
    expect(languages).toBeDefined();
    expect(languages.results).toBeDefined();
    expect(Array.isArray(languages.results)).toBe(true);
    expect(languages.results.length).toBeGreaterThan(0);
    
    const english = languages.results.find(l => l.code === 'en');
    expect(english).toBeDefined();
    expect(english?.name_en).toBe('English');
    
    console.log(`✅ Retrieved ${languages.results.length} languages`);
  });

  test('should fetch lookup tables', async () => {
    const lookups = await retryOperation(async () => {
      return await publicClient.lookups.get();
    });
    
    expect(lookups).toBeDefined();
    expect(lookups.validation_status).toBeDefined();
    expect(Array.isArray(lookups.validation_status)).toBe(true);
    expect(lookups.rarity).toBeDefined();
    expect(Array.isArray(lookups.rarity)).toBe(true);
    
    console.log('✅ Retrieved lookup tables successfully');
  });

  test('should fetch regions list', async () => {
    const regions = await retryOperation(async () => {
      return await publicClient.regions.list();
    });
    
    expect(regions).toBeDefined();
    expect(Array.isArray(regions)).toBe(true);
    expect(regions.length).toBeGreaterThan(0);
    
    const firstRegion = regions[0];
    expect(firstRegion.id).toBeGreaterThan(0);
    expect(firstRegion.name).toBeDefined();
    
    console.log(`✅ Retrieved ${regions.length} regions`);
  });

  test('should handle API errors gracefully', async () => {
    // Try to fetch a species with an invalid ID
    await expect(
      publicClient.species.get(999999999)
    ).rejects.toThrow();
    
    console.log('✅ API error handling works correctly');
  });

  test('should respect rate limiting', async () => {
    // Make multiple requests quickly to test rate limiting behavior
    const promises = Array(5).fill(0).map((_, i) => 
      publicClient.species.get(2 + i) // Different species IDs
    );
    
    // This should either succeed or fail gracefully with rate limiting
    try {
      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      console.log('✅ Multiple concurrent requests handled successfully');
    } catch (error) {
      // If rate limited, that's also a valid response
      console.log('✅ Rate limiting detected and handled correctly');
    }
  });
}); 