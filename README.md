# observation-js

[![npm version](https://badge.fury.io/js/observation-js.svg)](https://badge.fury.io/js/observation-js)

A fully-typed TypeScript client for the [waarneming.nl](https://waarneming.nl/api/docs/) API. This library provides an easy-to-use interface for interacting with the API, handling both public (unauthenticated) and private (authenticated) endpoints.

## Features

- ✅ Fully typed with TypeScript for a great developer experience.
- ✅ Handles both public and authenticated API endpoints.
- ✅ Built-in support for the OAuth2 Authorization Code Grant flow.
- ✅ Resource-based architecture for a clean and intuitive API (`client.species`, `client.observations`, etc.).
- ✅ Multi-language support for API responses.

For a detailed list of implemented API endpoints, please see the [FEATURES.md](./FEATURES.md) file.

## Installation

```bash
# Using bun
bun add observation-js

# Using npm
npm install observation-js

# Using yarn
yarn add observation-js
```

## Usage

### Initializing the Client

The client can be initialized without any options for accessing public, unauthenticated endpoints.

```typescript
import { ObservationClient } from 'observation-js';

const client = new ObservationClient();
```

For authenticated endpoints, you'll need to provide your OAuth2 client credentials.

```typescript
const client = new ObservationClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_CALLBACK_URL',
});
```

### Setting the Language

The API can return language-specific data (e.g., common names for species). You can set the desired language for all subsequent requests.

```typescript
// For results in Dutch
client.setLanguage('nl');

// For results in English (default)
client.setLanguage('en');
```

### Examples

#### Get details for a single species

```typescript
async function getSpeciesDetails(id: number) {
  try {
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

#### Search for a species

```typescript
async function searchSpecies(query: string) {
  try {
    const searchResult = await client.species.search({ q: query });
    console.log(`Found ${searchResult.count} result(s).`);
    for (const species of searchResult.results) {
      console.log(`- ${species.name} (ID: ${species.id})`);
    }
  } catch (error) {
    console.error('Error searching for species:', error);
  }
}

// Search for "witkeelgors"
searchSpecies('witkeelgors');
```

#### Fetching an observation (Authenticated)

Fetching private resources, like a specific observation by ID, requires a valid access token.

```typescript
async function getObservation(id: number, accessToken: string) {
  // First, set the access token on the client
  client.setAccessToken(accessToken);

  try {
    const observation = await client.observations.get(id);
    console.log('--- Observation Found! ---');
    console.log(`ID: ${observation.id}`);
    console.log(`Species: ${observation.species_detail.name}`);
    console.log(`Date: ${observation.date}`);
    console.log(`Observer: ${observation.user_detail.name}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Example usage (replace with a real ID and token)
// getObservation(12345, 'YOUR_VALID_ACCESS_TOKEN');
```

## License

This project is licensed under the MIT License.
