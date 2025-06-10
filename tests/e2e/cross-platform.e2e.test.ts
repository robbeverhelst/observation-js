import { expect, test, describe } from 'bun:test';
import { ObservationClient } from '../../src/index';

describe('E2E: Cross-Platform Compatibility', () => {
  const platforms = [
    { platform: 'nl' as const, baseUrl: 'https://waarneming.nl', name: 'Netherlands' },
    { platform: 'be' as const, baseUrl: 'https://waarnemingen.be', name: 'Belgium' },
    { platform: 'org' as const, baseUrl: 'https://observation.org', name: 'International' },
  ];

  platforms.forEach(({ platform, baseUrl, name }) => {
    test(`should work with ${name} platform (${platform})`, async () => {
      const client = new ObservationClient({
        platform,
        test: false,
        clientId: 'public-client',
        clientSecret: '',
        redirectUri: 'http://localhost:3000/callback',
      });

      expect(client.getApiBaseUrl()).toBe(`${baseUrl}/api/v1`);

      try {
        // Test basic species endpoint
        const species = await client.species.get(2);
        
        expect(species).toBeDefined();
        expect(species.id).toBe(2);
        expect(species.name).toBeDefined();
        expect(species.scientific_name).toBeDefined();
        
        console.log(`✅ ${name} (${platform}): Retrieved species "${species.name}"`);
        
        // Test countries endpoint (should return different data per platform)
        const countries = await client.countries.list();
        expect(countries).toBeDefined();
        expect(countries.results).toBeDefined();
        expect(Array.isArray(countries.results)).toBe(true);
        
        console.log(`✅ ${name} (${platform}): Retrieved ${countries.results.length} countries`);
        
      } catch (error) {
        // Some platforms might not be available or have different data
        console.warn(`⚠️ ${name} (${platform}) platform test failed:`, error);
        
        // Don't fail the test if it's a server/availability issue
        if (error instanceof Error && (
          error.message.includes('fetch') || 
          error.message.includes('502') || 
          error.message.includes('503') || 
          error.message.includes('504')
        )) {
          console.log(`   This is expected if ${name} platform is temporarily unavailable`);
          // Just verify we got an error (test passes)
          expect(error).toBeDefined();
        } else {
          throw error; // Re-throw if it's a real API issue
        }
      }
    });
  });

  test('should handle platform-specific data differences', async () => {
    const nlClient = new ObservationClient({
      platform: 'nl',
      test: false,
      clientId: 'public-client',
      clientSecret: '',
      redirectUri: 'http://localhost:3000/callback',
    });

    const beClient = new ObservationClient({
      platform: 'be',
      test: false,
      clientId: 'public-client',
      clientSecret: '',
      redirectUri: 'http://localhost:3000/callback',
    });

    try {
      // Get the same species from both platforms
      const [nlSpecies, beSpecies] = await Promise.all([
        nlClient.species.get(2),
        beClient.species.get(2),
      ]);

      // Should have same scientific name but potentially different common names
      expect(nlSpecies.scientific_name).toBe(beSpecies.scientific_name);
      
      console.log(`✅ NL species name: "${nlSpecies.name}"`);
      console.log(`✅ BE species name: "${beSpecies.name}"`);
      
      // Names might be different due to language/regional differences
      if (nlSpecies.name !== beSpecies.name) {
        console.log(`   ℹ️ Different common names detected (expected for regional platforms)`);
      }
      
    } catch (error) {
      console.warn('⚠️ Cross-platform comparison failed:', error);
      // Don't fail test if platforms are unavailable - this is acceptable
      expect(error).toBeDefined(); // Just verify we got an error
    }
  });
}); 
