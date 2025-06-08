export interface ObservationClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl?: string;
}

export interface PasswordGrantOptions {
  clientId: string;
  clientSecret?: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: string;
  refresh_token: string;
} 