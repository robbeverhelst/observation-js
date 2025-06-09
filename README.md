# observation-js

[![npm version](https://img.shields.io/npm/v/observation-js.svg)](https://www.npmjs.com/package/observation-js)
[![CI](https://github.com/RobbeVerhelst/observation-js/actions/workflows/ci.yml/badge.svg)](https://github.com/RobbeVerhelst/observation-js/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/RobbeVerhelst/observation-js/graph/badge.svg?token=YOUR_CODECOV_TOKEN_PLACEHOLDER)](https://codecov.io/gh/RobbeVerhelst/observation-js)
[![Documentation](https://img.shields.io/badge/documentation-brightgreen.svg)](https://robbeverhelst.github.io/observation-js/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully-typed TypeScript client for the [waarneming.nl](https://waarneming.nl/api/docs/) API. This library provides an easy-to-use interface for interacting with the API, handling both public (unauthenticated) and private (authenticated) endpoints.

This library supports all websites in the Observation International network:
- **[waarneming.nl](https://waarneming.nl)** (The Netherlands)
- **[waarnemingen.be](https://waarnemingen.be)** (Belgium)
- **[observation.org](https://observation.org)** (International)

By default, the client connects to the **test environment** of `waarneming.nl` to prevent accidental operations on production data. You can easily switch to another site or to the production environment by providing the `platform` and `test` options.

```typescript
import { ObservationClient } from 'observation-js';

// Connect to the Belgian production site
const client = new ObservationClient({
  platform: 'be',
  test: false, // Explicitly opt-in to production
  // other options like clientId, etc.
});

// Connect to the international test environment
const testClient = new ObservationClient({
  platform: 'org',
  test: true, // This is the default, but can be explicit
  // other options
});
```

You can still use the `baseUrl` option to connect to a custom instance, which will take precedence over the `platform` setting.

## Features

- ✅ **Fully Typed**: Written in TypeScript for a great developer experience with auto-completion and type safety.
- ✅ **Comprehensive API Coverage**: Implements a wide range of API resources, including Observations, Species, Users, Locations, and more.
- ✅ **Modern & Simple**: Uses a clean, resource-based architecture (`client.species`, `client.observations`, etc.).
- ✅ **Authentication Handled**: Built-in support for the OAuth2 Authorization Code Grant and Password Grant flows.
- ✅ **Custom Error Handling**: Throws detailed, custom errors to simplify debugging.
- ✅ **Multi-language Support**: Easily fetch API responses in different languages.
- ✅ **Configurable Caching**: Built-in, configurable in-memory cache to reduce redundant API calls.
- ✅ **Powered by Bun**: Built and tested with the modern [Bun](https://bun.sh/) runtime.

## Installation

```bash
# Using bun
bun add observation-js

# Using npm
npm install observation-js

# Using yarn
yarn add observation-js
```

## Getting Started

Get details for a species in just a few lines of code. The client can be used without any options for accessing public, unauthenticated endpoints.

```typescript
import { ObservationClient } from 'observation-js';

const client = new ObservationClient();

async function getSpeciesDetails(id: number) {
  try {
    // Set language for results (optional, defaults to 'en')
    client.setLanguage('nl');

    const species = await client.species.get(id);
    console.log(`Successfully fetched: ${species.name} (${species.scientific_name})`);
    console.log(`Group: ${species.group_name}`);
    console.log(`Photos:`, species.photos.map(p => p.url));
  } catch (error) {
    console.error('Error fetching species details:', error);
  }
}

// Get details for the Little Grebe (Dodaars)
getSpeciesDetails(2);
```

## Usage Examples

The client is organized into resources, making the API intuitive to use.

### Search for locations

```typescript
const locations = await client.locations.search({ q: 'Amsterdam' });
console.log('Found locations:', locations.results);
```

### Get observations for a species

```typescript
const observations = await client.species.getObservations(2); // Species ID for Little Grebe
console.log(`Found ${observations.count} observations.`);
```

### Get the current user's info (requires authentication)

```typescript
// First, authenticate the client (see Authentication section)
await client.setAccessToken('YOUR_ACCESS_TOKEN');

const userInfo = await client.users.getInfo();
console.log(`Hello, ${userInfo.name}`);
```

## Authentication

For endpoints that require authentication (like creating or updating data), you'll need to authenticate the user using OAuth2.

First, initialize the client with your application's credentials:

```typescript
const client = new ObservationClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_CALLBACK_URL',
});
```

Next, redirect the user to the generated authorization URL:

```typescript
const scopes = ['read_observations', 'write_observations'];
const state = 'a-random-string-for-security'; // Generate and store this securely
const authUrl = client.getAuthorizationUrl(state, scopes);

// Redirect your user to authUrl
```

After the user authorizes your app, they will be sent to your `redirectUri`, where you can exchange the received `code` for an access token:

```typescript
const code = '...'; // Get code from URL query parameters
const tokenResponse = await client.getAccessToken(code);
client.setAccessToken(tokenResponse.access_token);
```

## Caching

To improve performance, `observation-js` includes a configurable in-memory cache for `GET` requests. It's enabled by default with a 1-hour TTL. You can easily configure it when initializing the client.

```typescript
const client = new ObservationClient({
  // ...other options

  // Example: Disable the cache entirely
  cache: {
    enabled: false,
  },

  // Example: Set a default TTL of 15 minutes for all cacheable requests
  cache: {
    defaultTTL: 900, // TTL in seconds
  },
});
```

For more advanced caching options, such as injecting your own cache implementation, please refer to the `ObservationClientOptions` in the generated [API documentation](https://robbeverhelst.github.io/observation-js/).

## Error Handling

The library throws custom errors to help you handle different failure scenarios. All errors extend from `ObservationError`.

- **`ApiError`**: Thrown for general API errors (e.g., server errors, invalid requests).
- **`AuthenticationError`**: A subclass of `ApiError`, specifically for authentication issues.

```typescript
import { ApiError, AuthenticationError } from 'observation-js';

try {
  const myObservations = await client.observations.list();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed!', error.body);
    // Handle re-authentication or token refresh here
  } else if (error instanceof ApiError) {
    console.error(`API Error: ${error.message}`, error.response.status, error.body);
  }
}
```

## Examples

For more detailed, runnable examples of how to use the various API resources, please see the files in the [`/examples`](https://github.com/RobbeVerhelst/observation-js/tree/main/examples) directory of this repository.

## License

This project is licensed under the MIT License.
