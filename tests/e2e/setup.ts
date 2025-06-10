import { ObservationClient } from '../../src/index';
import { RateLimitError } from '../../src/core/errors';

// E2E Test Configuration
export const E2E_CONFIG = {
  // Use test environment by default
  baseUrl: process.env.E2E_BASE_URL || 'https://waarneming-test.nl',
  platform: (process.env.E2E_PLATFORM as 'nl' | 'be' | 'org') || 'nl',
  
  // Test credentials - these should be set in environment variables
  clientId: process.env.E2E_CLIENT_ID,
  clientSecret: process.env.E2E_CLIENT_SECRET,
  redirectUri: process.env.E2E_REDIRECT_URI || 'http://localhost:3000/callback',
  
  // Test user credentials for password flow
  testEmail: process.env.E2E_TEST_EMAIL,
  testPassword: process.env.E2E_TEST_PASSWORD,
  
  // Test data IDs (these should exist in your test environment)
  testSpeciesId: parseInt(process.env.E2E_TEST_SPECIES_ID || '2'), // Default to a common species
  testLocationId: parseInt(process.env.E2E_TEST_LOCATION_ID || '1'),
  testUserId: parseInt(process.env.E2E_TEST_USER_ID || '1'),
};

// Validate required environment variables
export function validateE2EConfig() {
  const required = [
    'E2E_CLIENT_ID',
    'E2E_TEST_EMAIL', 
    'E2E_TEST_PASSWORD'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required E2E environment variables: ${missing.join(', ')}\n` +
      'Please set these in your .env file or environment.\n' +
      'Example .env:\n' +
      'E2E_CLIENT_ID=your-test-client-id\n' +
      'E2E_TEST_EMAIL=your-test-email@example.com\n' +
      'E2E_TEST_PASSWORD=your-test-password'
    );
  }
}

// Create authenticated client for E2E tests
export async function createAuthenticatedClient(): Promise<ObservationClient> {
  validateE2EConfig();
  
  const client = new ObservationClient({
    baseUrl: E2E_CONFIG.baseUrl,
    platform: E2E_CONFIG.platform,
    test: true, // Use test environment
    clientId: E2E_CONFIG.clientId!,
    clientSecret: E2E_CONFIG.clientSecret || '',
    redirectUri: E2E_CONFIG.redirectUri,
  });

  // Authenticate using password flow (easier for E2E tests)
  try {
    await client.getAccessTokenWithPassword({
      clientId: E2E_CONFIG.clientId!,
      email: E2E_CONFIG.testEmail!,
      password: E2E_CONFIG.testPassword!,
    });
    
    console.log('✅ E2E client authenticated successfully');
    return client;
  } catch (error) {
    console.error('❌ E2E authentication failed:', error);
    throw new Error('Failed to authenticate E2E test client. Check your credentials.');
  }
}

// Create unauthenticated client for public API tests
export function createPublicClient(): ObservationClient {
  return new ObservationClient({
    baseUrl: E2E_CONFIG.baseUrl,
    platform: E2E_CONFIG.platform,
    test: false, // Use production API for public endpoints
    // Provide minimal required options for public client
    clientId: 'public-client',
    clientSecret: '',
    redirectUri: 'http://localhost:3000/callback',
  });
}

// Test data cleanup utilities
export class E2ETestData {
  private createdObservations: number[] = [];
  private createdGroups: number[] = [];
  
  // Track created observations for cleanup
  trackObservation(id: number) {
    this.createdObservations.push(id);
  }
  
  // Track created groups for cleanup
  trackGroup(id: number) {
    this.createdGroups.push(id);
  }
  
  // Clean up all created test data
  async cleanup(client: ObservationClient) {
    console.log('🧹 Cleaning up E2E test data...');
    
    // Clean up observations
    for (const id of this.createdObservations) {
      try {
        await client.observations.delete(id);
        console.log(`✅ Deleted observation ${id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to delete observation ${id}:`, error);
      }
    }
    
    // Clean up groups
    for (const id of this.createdGroups) {
      try {
        await client.groups.delete(id);
        console.log(`✅ Deleted group ${id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to delete group ${id}:`, error);
      }
    }
    
    this.createdObservations = [];
    this.createdGroups = [];
  }
}

// Retry utility for flaky network operations with smart rate limit handling
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      const result = await operation();
      if (attempt > 1) {
        console.log(`✅ Request succeeded after ${attempt} attempt(s)`);
      }
      return result;
    } catch (error) {
      lastError = error as Error;
      
      // Handle rate limiting with smart backoff
      if (error instanceof RateLimitError) {
        const retryDelay = error.getRetryDelayMs();
        console.warn(`⏱️ Rate limit hit. Waiting ${Math.round(retryDelay / 1000)}s before retry...`);
        
        if (attempt === maxRetries) {
          console.error(`❌ Rate limit exceeded after ${maxRetries} attempts. Consider reducing request frequency.`);
          throw new Error(
            `Rate limit exceeded: ${error.message}\n` +
            `This is expected behavior when making too many requests. ` +
            `The API is protecting itself from overload.`
          );
        }
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // For other errors, use standard retry logic
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError!;
}

// Skip E2E tests if environment variables are not set
export function skipIfNoE2EConfig() {
  try {
    validateE2EConfig();
    return false; // Don't skip
  } catch (error) {
    return true; // Skip
  }
}

// Check if E2E config is available (for conditional test execution)
export function hasE2EConfig(): boolean {
  try {
    validateE2EConfig();
    return true;
  } catch (error) {
    return false;
  }
} 