import { expect, test, describe, beforeAll } from 'bun:test';
import { createPublicClient } from './setup';
import { ObservationClient } from '../../src/index';

describe('E2E: Data Validation & Schema', () => {
  let publicClient: ObservationClient;

  beforeAll(async () => {
    console.log('🚀 Setting up E2E Data Validation tests...');
    publicClient = createPublicClient();
  });

  test('should return valid species data structure', async () => {
    const species = await publicClient.species.get(2);
    
    // Required fields
    expect(species.id).toBeDefined();
    expect(typeof species.id).toBe('number');
    expect(species.id).toBeGreaterThan(0);
    
    expect(species.name).toBeDefined();
    expect(typeof species.name).toBe('string');
    expect(species.name.trim().length).toBeGreaterThan(0);
    
    expect(species.scientific_name).toBeDefined();
    expect(typeof species.scientific_name).toBe('string');
    expect(species.scientific_name.trim().length).toBeGreaterThan(0);
    
    expect(species.group).toBeDefined();
    expect(typeof species.group).toBe('number');
    expect(species.group).toBeGreaterThan(0);
    
    expect(species.group_name).toBeDefined();
    expect(typeof species.group_name).toBe('string');
    
    // Fields that were corrected based on E2E findings
    expect(species.rarity).toBeDefined();
    expect(typeof species.rarity).toBe('string');
    expect(species.rarity.length).toBeGreaterThan(0);
    
    // rarity_text is optional - might be undefined in some cases
    if (species.rarity_text !== undefined) {
      expect(typeof species.rarity_text).toBe('string');
      expect(species.rarity_text.length).toBeGreaterThan(0);
    }
    
    expect(typeof species.status).toBe('string');
    
    expect(typeof species.type).toBe('string');
    
    // url is optional - might be undefined in some cases
    if (species.url !== undefined) {
      expect(typeof species.url).toBe('string');
      expect(species.url).toMatch(/^https?:\/\//);
    }
    
    // Array fields (optional based on E2E findings)
    if (species.photos !== undefined) {
      expect(Array.isArray(species.photos)).toBe(true);
    }
    if (species.sounds !== undefined) {
      expect(Array.isArray(species.sounds)).toBe(true);
    }
    
    console.log(`✅ Species data structure validated for: ${species.name}`);
  });

  test('should return valid paginated search results', async () => {
    const searchResults = await publicClient.species.search({ q: 'bird' });
    
    // Pagination structure
    expect(searchResults.count).toBeDefined();
    expect(typeof searchResults.count).toBe('number');
    expect(searchResults.count).toBeGreaterThanOrEqual(0);
    
    expect(searchResults.results).toBeDefined();
    expect(Array.isArray(searchResults.results)).toBe(true);
    
    // next and previous can be null or string
    if (searchResults.next !== null) {
      expect(typeof searchResults.next).toBe('string');
      expect(searchResults.next).toMatch(/^https?:\/\//);
    }
    
    if (searchResults.previous !== null) {
      expect(typeof searchResults.previous).toBe('string');
      expect(searchResults.previous).toMatch(/^https?:\/\//);
    }
    
    // Validate each result has proper structure
    searchResults.results.slice(0, 3).forEach((species, index) => {
      expect(species.id).toBeDefined();
      expect(typeof species.id).toBe('number');
      expect(species.name).toBeDefined();
      expect(typeof species.name).toBe('string');
      expect(species.scientific_name).toBeDefined();
      expect(typeof species.scientific_name).toBe('string');
    });
    
    console.log(`✅ Search pagination structure validated (${searchResults.results.length} results)`);
  });

  test('should return valid countries data', async () => {
    const countries = await publicClient.countries.list();
    
    expect(countries.results).toBeDefined();
    expect(Array.isArray(countries.results)).toBe(true);
    expect(countries.results.length).toBeGreaterThan(0);
    
    // Check first few countries
    countries.results.slice(0, 5).forEach((country) => {
      expect(country.code).toBeDefined();
      expect(typeof country.code).toBe('string');
      expect(country.code.length).toBe(2); // ISO country codes are 2 characters
      expect(country.code).toMatch(/^[A-Z]{2}$/);
      
      expect(country.name).toBeDefined();
      expect(typeof country.name).toBe('string');
      expect(country.name.trim().length).toBeGreaterThan(0);
    });
    
    // Verify some expected countries exist
    const countryCodes = countries.results.map(c => c.code);
    expect(countryCodes).toContain('NL'); // Netherlands
    expect(countryCodes).toContain('BE'); // Belgium
    expect(countryCodes).toContain('DE'); // Germany
    
    console.log(`✅ Countries data validated (${countries.results.length} countries)`);
  });

  test('should return valid languages data', async () => {
    const languages = await publicClient.languages.list();
    
    expect(languages.results).toBeDefined();
    expect(Array.isArray(languages.results)).toBe(true);
    expect(languages.results.length).toBeGreaterThan(0);
    
    languages.results.slice(0, 5).forEach((language) => {
      expect(language.code).toBeDefined();
      expect(typeof language.code).toBe('string');
      expect(language.code.length).toBeGreaterThanOrEqual(2);
      expect(language.code.length).toBeLessThanOrEqual(5); // e.g., 'en', 'nl', 'en-US'
      
      expect(language.name_en).toBeDefined();
      expect(typeof language.name_en).toBe('string');
    });
    
    // Verify some expected languages exist
    const languageCodes = languages.results.map(l => l.code);
    expect(languageCodes).toContain('en');
    expect(languageCodes).toContain('nl');
    
    console.log(`✅ Languages data validated (${languages.results.length} languages)`);
  });

  test('should return valid lookup tables', async () => {
    const lookups = await publicClient.lookups.get();
    
    // Validation status lookup
    expect(lookups.validation_status).toBeDefined();
    expect(Array.isArray(lookups.validation_status)).toBe(true);
    expect(lookups.validation_status.length).toBeGreaterThan(0);
    
    lookups.validation_status.forEach((status) => {
      expect(status.id).toBeDefined();
      expect(typeof status.id).toBe('string');
      expect(status.name).toBeDefined();
      expect(typeof status.name).toBe('string');
      expect(typeof status.is_active).toBe('boolean');
    });
    
    // Rarity lookup
    expect(lookups.rarity).toBeDefined();
    expect(Array.isArray(lookups.rarity)).toBe(true);
    expect(lookups.rarity.length).toBeGreaterThan(0);
    
    lookups.rarity.forEach((rarity) => {
      expect(rarity.id).toBeDefined();
      expect(typeof rarity.id).toBe('number');
      expect(rarity.name).toBeDefined();
      expect(typeof rarity.name).toBe('string');
      expect(typeof rarity.is_active).toBe('boolean');
    });
    
    console.log(`✅ Lookup tables validated`);
    console.log(`   Validation statuses: ${lookups.validation_status.length}`);
    console.log(`   Rarity levels: ${lookups.rarity.length}`);
  });

  test('should handle invalid species IDs appropriately', async () => {
    const invalidIds = [0, -1, 999999999, 'invalid' as any];
    
    for (const invalidId of invalidIds) {
      try {
        await publicClient.species.get(invalidId);
        // If we get here, the API didn't reject the invalid ID
        console.warn(`⚠️ API accepted invalid species ID: ${invalidId}`);
      } catch (error) {
        // This is expected behavior
        expect(error).toBeDefined();
        console.log(`✅ API correctly rejected invalid species ID: ${invalidId}`);
      }
    }
  });

  test('should return consistent data types across multiple requests', async () => {
    const speciesIds = [2, 3, 4, 5];
    const speciesData: any[] = [];
    
    for (const id of speciesIds) {
      try {
        const species = await publicClient.species.get(id);
        speciesData.push(species);
      } catch (error) {
        console.log(`Species ${id} not found (this is okay)`);
      }
    }
    
    expect(speciesData.length).toBeGreaterThan(0);
    
    // All species should have the same data structure
    const firstSpecies = speciesData[0];
    speciesData.forEach((species) => {
      expect(typeof species.id).toBe(typeof firstSpecies.id);
      expect(typeof species.name).toBe(typeof firstSpecies.name);
      expect(typeof species.scientific_name).toBe(typeof firstSpecies.scientific_name);
      expect(typeof species.group).toBe(typeof firstSpecies.group);
      expect(typeof species.rarity).toBe(typeof firstSpecies.rarity);
      expect(Array.isArray(species.photos)).toBe(Array.isArray(firstSpecies.photos));
      expect(Array.isArray(species.sounds)).toBe(Array.isArray(firstSpecies.sounds));
    });
    
    console.log(`✅ Data type consistency validated across ${speciesData.length} species`);
  });
}); 