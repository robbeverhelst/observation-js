# observation-js

[![npm version](https://img.shields.io/npm/v/observation-js.svg)](https://www.npmjs.com/package/observation-js)
[![CI](https://github.com/RobbeVerhelst/observation-js/actions/workflows/ci.yml/badge.svg)](https://github.com/RobbeVerhelst/observation-js/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/badge/documentation-brightgreen.svg)](https://robbeverhelst.github.io/observation-js/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully-typed TypeScript client for the [waarneming.nl](https://waarneming.nl/api/docs/) API. This library provides an easy-to-use interface for interacting with the API, handling both public (unauthenticated) and private (authenticated) endpoints.

## Features

- ✅ **Fully Typed**: Written in TypeScript for a great developer experience with auto-completion and type safety.
- ✅ **Comprehensive API Coverage**: Implements a wide range of API resources, including Observations, Species, Users, Locations, and more.
- ✅ **Modern & Simple**: Uses a clean, resource-based architecture (`client.species`, `client.observations`, etc.).
- ✅ **Authentication Handled**: Built-in support for the OAuth2 Authorization Code Grant and Password Grant flows.
- ✅ **Custom Error Handling**: Throws detailed, custom errors to simplify debugging.
- ✅ **Multi-language Support**: Easily fetch API responses in different languages.
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

### 1. Initializing the Client

The client can be initialized without any options for accessing public, unauthenticated endpoints.

```typescript
import { ObservationClient } from 'observation-js';

const client = new ObservationClient();
```

For authenticated endpoints, you'll need to provide your OAuth2 client credentials, which you can get by registering your application on waarneming.nl.

```typescript
const client = new ObservationClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_CALLBACK_URL',
});
```

### 2. Authenticating a User

This library supports the OAuth2 **Authorization Code Grant**.

First, redirect the user to the authorization URL:

```typescript
const scopes = ['read_observations', 'write_observations'];
const state = 'a-random-string-for-security'; // Generate and store this securely
const authUrl = client.getAuthorizationUrl(state, scopes);

// Redirect your user to authUrl
console.log('Redirect user to:', authUrl);
```

After the user authorizes your application, they will be redirected back to your `redirectUri` with a `code` and the `state` in the query parameters. You can then exchange this code for an access token:

```typescript
// On your callback page
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const returnedState = urlParams.get('state');

if (code && returnedState === state) {
  try {
    const tokenResponse = await client.getAccessToken(code);
    console.log('Access Token:', tokenResponse.access_token);

    // Securely store the token and use it for authenticated requests
    client.setAccessToken(tokenResponse.access_token);
  } catch (error) {
    console.error('Error getting access token:', error);
  }
}
```

### 3. Making API Calls

Once the client is initialized (and authenticated, if needed), you can start making API calls.

```typescript
async function getSpeciesDetails(id: number) {
  try {
    // Set language for results (optional, defaults to 'en')
    client.setLanguage('nl');

    const species = await client.species.get(id);
    console.log(`Successfully fetched: ${species.name} (${species.scientific_name})`);
    console.log(`Group: ${species.group_name}`);
  } catch (error) {
    console.error('Error fetching species details:', error);
  }
}

// Get details for Little Grebe (Dodaars)
getSpeciesDetails(2);
```

## Error Handling

The library throws custom errors to help you handle different failure scenarios:

- `ObservationError`: The base error class for all errors from this library.
- `ApiError`: Thrown for general API errors (e.g., server errors, invalid requests). It contains the `response` and `body` from the API for inspection.
- `AuthenticationError`: A subclass of `ApiError`, specifically for authentication issues (e.g., invalid token, insufficient permissions).

```typescript
import { ApiError, AuthenticationError } from 'observation-js';

async function getMyObservations() {
  try {
    const observations = await client.observations.list(); // Example authenticated request
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed!', error.body);
      // Handle re-authentication or token refresh here
    } else if (error instanceof ApiError) {
      console.error(`API Error: ${error.message}`, error.response.status, error.body);
    } else {
      console.error('A generic error occurred:', error);
    }
  }
}
```

## Examples

For more detailed, runnable examples of how to use the various API resources, please see the files in the [`/examples`](https://github.com/RobbeVerhelst/observation-js/tree/main/examples) directory of this repository.

## License

This project is licensed under the MIT License.
