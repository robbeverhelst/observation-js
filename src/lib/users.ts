import type { ObservationClient } from '../core/client';
import type { Terms, User, UserStats } from '../types';

export class Users {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Retrieves the current terms of service and privacy policy.
   * This is a public endpoint and does not require authentication.
   *
   * @returns A promise that resolves to the terms and privacy policy documents.
   * @throws {ApiError} If the request fails.
   */
  public async getTerms(): Promise<Terms> {
    return this.#client.publicRequest<Terms>('user/terms/');
  }

  /**
   * Registers a new user account.
   * This is a public endpoint and does not require authentication.
   *
   * @param details - The registration details, including name, email, and password.
   * @param appName - The name of the application registering the user.
   * @param appVersion - The version of the application.
   * @returns A promise that resolves to the newly created user's public details.
   * @throws {ApiError} If the registration fails (e.g., email already exists).
   */
  public async register(
    details: {
      name: string;
      email: string;
      password: string;
      is_mail_allowed?: boolean;
      country?: string;
    },
    appName: string,
    appVersion: string,
  ): Promise<{
    name: string;
    email: string;
    permalink: string;
    country: string;
  }> {
    const headers = {
      'User-Agent': `${appName}/${appVersion}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const bodyParams: Record<string, string> = {};
    for (const key in details) {
      bodyParams[key] = String(details[key as keyof typeof details]);
    }
    const body = new URLSearchParams(bodyParams).toString();

    return this.#client.publicRequest<{
      name: string;
      email: string;
      permalink: string;
      country: string;
    }>('user/register/', {
      method: 'POST',
      headers,
      body,
    });
  }

  /**
   * Sends a password reset email to a user.
   * This is a public endpoint and does not require authentication.
   *
   * @param email The user's email address.
   * @returns A promise that resolves to an object with a confirmation message.
   * @throws {ApiError} If the request fails.
   */
  public async resetPassword(email: string): Promise<{ detail: string }> {
    const body = new URLSearchParams({ email }).toString();
    return this.#client.publicRequest<{ detail: string }>(
      'user/password-reset/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    );
  }

  /**
   * Gets the full profile details of the current authenticated user.
   *
   * @returns A promise that resolves to the current user's full profile object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getInfo(): Promise<User> {
    return this.#client.request<User>('user/info/');
  }

  /**
   * Updates the profile details of the current authenticated user.
   *
   * @param details - The details to update (name and/or country).
   * @returns A promise that resolves to the updated user object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async updateInfo(details: {
    name: string;
    country?: string;
  }): Promise<User> {
    const body = new URLSearchParams(details).toString();
    return this.#client.request<User>('user/info/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  }

  /**
   * Resends the email confirmation to the current authenticated user.
   *
   * @returns A promise that resolves to an object with a confirmation message.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async resendEmailConfirmation(): Promise<{ detail: string }> {
    return this.#client.request<{ detail: string }>(
      'user/resend-email-confirmation/',
      { method: 'POST' },
    );
  }

  /**
   * Gets aggregated observation statistics for the current authenticated user.
   *
   * @param params - The aggregation parameters (by day, month, or year, with optional date range).
   * @returns A promise that resolves to the user's statistics.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getStats(params: {
    aggregation: 'day' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
  }): Promise<UserStats> {
    return this.#client.request<UserStats>('user/stats/observations/', {
      params,
    });
  }

  /**
   * Gets a magic login link key for the current authenticated user.
   * This key can be used to log in without a password.
   *
   * @returns A promise that resolves to an object containing the magic login key (`sesame`).
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getMagicLoginLink(): Promise<{ sesame: string }> {
    return this.#client.request<{ sesame: string }>('auth/magic-login-link/', {
      method: 'POST',
    });
  }

  /**
   * Gets the URL of the current user's avatar.
   *
   * @returns A promise that resolves to an object with the avatar URL, or null if not set.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async getAvatar(): Promise<{ avatar: string | null }> {
    return this.#client.request<{ avatar: string | null }>('user/avatar/');
  }

  /**
   * Uploads a new avatar for the current user.
   * The image must be a square JPG, max 1000x1000px.
   *
   * @param avatar - A Blob or Buffer representing the image.
   * @returns A promise that resolves to an object with the new avatar URL.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the upload fails.
   */
  public async updateAvatar(
    avatar: Blob | Buffer,
  ): Promise<{ avatar: string | null }> {
    const formData = new FormData();
    formData.append('avatar', new Blob([avatar]));
    return this.#client.request<{ avatar: string | null }>('user/avatar/', {
      method: 'PUT',
      body: formData,
    });
  }

  /**
   * Deletes the current user's avatar.
   *
   * @returns A promise that resolves to an object with a null avatar URL.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async deleteAvatar(): Promise<{ avatar: string | null }> {
    return this.#client.request<{ avatar: string | null }>('user/avatar/', {
      method: 'DELETE',
    });
  }
}
