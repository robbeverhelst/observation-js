# End-to-End (E2E) Tests

These tests make real API calls to the waarneming.nl test environment to verify that the client works correctly with the actual API.

## Setup

1. **Get Test Credentials**: You'll need test application credentials from the waarneming.nl platform.

2. **Create Environment Variables**: Set the following environment variables (or create a `.env` file):

```bash
# Required: Your test application credentials
E2E_CLIENT_ID=your-test-client-id
E2E_CLIENT_SECRET=your-test-client-secret
E2E_REDIRECT_URI=http://localhost:3000/callback

# Required: Test user credentials
E2E_TEST_EMAIL=your-test-email@example.com
E2E_TEST_PASSWORD=your-test-password

# Optional: Test environment configuration
E2E_BASE_URL=https://waarneming-test.nl
E2E_PLATFORM=nl

# Optional: Test data IDs (these should exist in your test environment)
E2E_TEST_SPECIES_ID=2
E2E_TEST_LOCATION_ID=1
E2E_TEST_USER_ID=1
```

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test file
bun test tests/e2e/public-api.e2e.test.ts
```

## What E2E Tests Cover

- **Public API Endpoints**: Tests that don't require authentication
  - Species information and search
  - Countries and languages
  - Lookup tables
  - Regions
  - Error handling and rate limiting

- **Future**: When you have test credentials, we can add:
  - Authentication flows
  - Protected endpoints
  - CRUD operations
  - File uploads

## Test Environment

E2E tests run against the **test environment** by default:
- `https://waarneming-test.nl` (Netherlands)
- `https://waarnemingen-test.be` (Belgium)  
- `https://observation-test.org` (International)

This ensures tests don't affect production data.

## Skipping Tests

If environment variables are not set, E2E tests will be automatically skipped with a warning message. This allows the test suite to run in CI/CD environments where E2E credentials might not be available. 