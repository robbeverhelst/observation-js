import { Badges } from '../lib/badges';
import { Challenges } from '../lib/challenges';
import { Countries } from '../lib/countries';
import { Exports } from '../lib/exports';
import { Groups } from '../lib/groups';
import { Languages } from '../lib/languages';
import { Locations } from '../lib/locations';
import { Lookups } from '../lib/lookups';
import { Media } from '../lib/media';
import { Nia } from '../lib/nia';
import { Observations } from '../lib/observations';
import { Regions } from '../lib/regions';
import { RegionSpeciesLists } from '../lib/regionSpeciesLists';
import { Sessions } from '../lib/sessions';
import { Species } from '../lib/species';
import { Transects } from '../lib/transects';
import { Users } from '../lib/users';
import type {
  ObservationClientOptions,
  PasswordGrantOptions,
  TokenResponse,
} from '../types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

export class ObservationClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private options: ObservationClientOptions | undefined;
  private language: string = 'en'; // Default to English

  public readonly observations: Observations;
  public readonly species: Species;
  public readonly regions: Regions;
  public readonly locations: Locations;
  public readonly regionSpeciesLists: RegionSpeciesLists;
  public readonly users: Users;
  public readonly countries: Countries;
  public readonly badges: Badges;
  public readonly groups: Groups;
  public readonly exports: Exports;
  public readonly languages: Languages;
  public readonly lookups: Lookups;
  public readonly nia: Nia;
  public readonly media: Media;
  public readonly sessions: Sessions;
  public readonly transects: Transects;
  public readonly challenges: Challenges;

  constructor(options?: ObservationClientOptions) {
    this.options = options;
    this.observations = new Observations(this);
    this.species = new Species(this);
    this.regions = new Regions(this);
    this.locations = new Locations(this);
    this.regionSpeciesLists = new RegionSpeciesLists(this);
    this.users = new Users(this);
    this.countries = new Countries(this);
    this.badges = new Badges(this);
    this.groups = new Groups(this);
    this.exports = new Exports(this);
    this.languages = new Languages(this);
    this.lookups = new Lookups(this);
    this.nia = new Nia(this);
    this.media = new Media(this);
    this.sessions = new Sessions(this);
    this.transects = new Transects(this);
    this.challenges = new Challenges(this);
  }

  /**
   * Sets the language for all subsequent API requests.
   * @param language The two-letter language code (e.g., 'nl', 'en', 'de').
   */
  public setLanguage(language: string) {
    this.language = language;
  }

  public getApiBaseUrl(): string {
    return API_BASE_URL;
  }

  /**
   * Generates the authorization URL for the OAuth2 Authorization Code Grant flow.
   * Users should be redirected to this URL to authorize the application.
   * @param params - The parameters for generating the URL.
   * @returns The full authorization URL.
   */
  public getAuthorizationUrl(state: string, scope: string[]): string {
    if (!this.options) {
      throw new Error('Client options are not set.');
    }
    const urlParams = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.clientId,
      redirect_uri: this.options.redirectUri,
      scope: scope.join(' '),
      state: state,
    });
    return `https://waarneming.nl/accounts/oauth2/authorize/?${urlParams.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param code The authorization code received from the callback.
   * @returns The token response.
   */
  public async getAccessToken(code: string): Promise<TokenResponse> {
    if (!this.options) {
      throw new Error('Client options are not set.');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.options.redirectUri,
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
    });

    const response = await fetch(
      'https://waarneming.nl/accounts/oauth2/token/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${await response.text()}`);
    }

    const tokenData = (await response.json()) as TokenResponse;
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    return tokenData;
  }

  public async getAccessTokenWithPassword(
    options: PasswordGrantOptions
  ): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: options.clientId,
      username: options.email,
      password: options.password,
    });

    if (options.clientSecret) {
      body.set('client_secret', options.clientSecret);
    }

    const response = await fetch(
      'https://waarneming.nl/accounts/oauth2/token/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get access token with password: ${await response.text()}`
      );
    }

    const tokenData = (await response.json()) as TokenResponse;
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    return tokenData;
  }

  /**
   * Refreshes an expired access token using a refresh token.
   * @returns The new token response.
   */
  public async refreshAccessToken(): Promise<TokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available.');
    }
    if (!this.options) {
      throw new Error('Client options are not set.');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
    });

    const response = await fetch(
      'https://waarneming.nl/accounts/oauth2/token/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${await response.text()}`);
    }

    const tokenData = (await response.json()) as TokenResponse;
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    return tokenData;
  }

  /**
   * Sets the access token for authenticated requests.
   * @param token The access token.
   */
  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  public hasAccessToken(): boolean {
    return this.accessToken !== null;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string | number> } = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Access token is not set. Please authenticate first.');
    }

    const url = new URL(
      endpoint.startsWith('/')
        ? `https://waarneming.nl${endpoint}`
        : `${this.getApiBaseUrl()}/${endpoint}`
    );
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
      );
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Accept-Language': this.language,
        Accept: 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      if (options.body instanceof FormData) {
        fetchOptions.body = options.body;
        delete (fetchOptions.headers as Record<string, string>)['Content-Type'];
      } else {
        fetchOptions.body = JSON.stringify(options.body);
        (fetchOptions.headers as Record<string, string>)['Content-Type'] =
          'application/json';
      }
    } else if (options.method === 'POST' || options.method === 'PUT') {
      // Ensure content-type is set for empty body on POST/PUT
      (fetchOptions.headers as Record<string, string>)['Content-Type'] =
        'application/json';
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`API request failed: ${await response.text()}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    // For non-JSON responses (like file downloads), return the raw response
    return response as unknown as T;
  }

  public async publicRequest<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string | number> } = {}
  ): Promise<T> {
    const url = new URL(
      endpoint.startsWith('/')
        ? `https://waarneming.nl${endpoint}`
        : `${this.getApiBaseUrl()}/${endpoint}`
    );
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
      );
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Accept-Language': this.language,
        Accept: 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      if (options.body instanceof FormData) {
        fetchOptions.body = options.body;
        delete (fetchOptions.headers as Record<string, string>)['Content-Type'];
      } else {
        fetchOptions.body = JSON.stringify(options.body);
        (fetchOptions.headers as Record<string, string>)['Content-Type'] =
          'application/json';
      }
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`API request failed: ${await response.text()}`);
    }
    return response.json() as Promise<T>;
  }
} 