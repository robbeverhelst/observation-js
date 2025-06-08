import type { ObservationClient } from '../core/client';
import type { Terms, User, UserStats } from '../types';

export class Users {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Retrieve the current terms of service and privacy policy.
   * This is a public endpoint.
   * @returns The terms and privacy policy.
   */
  public async getTerms(): Promise<Terms> {
    return this.client.publicRequest<Terms>('user/terms/');
  }

  /**
   * Register a new user.
   * This is a public endpoint.
   * @param details The registration details.
   * @param appName The name of the application registering the user.
   * @param appVersion The version of the application.
   * @returns The newly created user's public details.
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
    appVersion: string
  ): Promise<Pick<User, 'name' | 'email' | 'permalink' | 'country'>> {
    const headers = {
      'User-Agent': `${appName}/${appVersion}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const bodyParams: Record<string, string> = {};
    for (const key in details) {
      bodyParams[key] = String(
        details[key as keyof typeof details]
      );
    }
    const body = new URLSearchParams(bodyParams).toString();

    return this.client.publicRequest<
      Pick<User, 'name' | 'email' | 'permalink' | 'country'>
    >('user/register/', {
      method: 'POST',
      headers,
      body,
    });
  }

  /**
   * Request a password reset email.
   * This is a public endpoint.
   * @param email The user's email address.
   */
  public async resetPassword(email: string): Promise<{ detail: string }> {
    const body = new URLSearchParams({ email }).toString();
    return this.client.publicRequest<{ detail: string }>(
      'user/password-reset/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      }
    );
  }

  /**
   * Get the details of the current authenticated user.
   * @returns The current user's details.
   */
  public async getInfo(): Promise<User> {
    return this.client.request<User>('user/info/');
  }

  /**
   * Update the details of the current authenticated user.
   * @param details The details to update.
   * @returns The updated user object.
   */
  public async updateInfo(details: {
    name: string;
    country?: string;
  }): Promise<User> {
    const body = new URLSearchParams(details as Record<string, string>).toString();
    return this.client.request<User>('user/info/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  }

  /**
   * Resend the email confirmation to the current authenticated user.
   * @returns A confirmation message.
   */
  public async resendEmailConfirmation(): Promise<{ detail: string }> {
    return this.client.request<{ detail: string }>(
      'user/resend-email-confirmation/',
      { method: 'POST' }
    );
  }

  /**
   * Get statistics for the current authenticated user.
   * @param params The aggregation parameters.
   * @returns The user's statistics.
   */
  public async getStats(params: {
    aggregation: 'day' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
  }): Promise<UserStats> {
    return this.client.request<UserStats>('user/stats/observations/', {
      params,
    });
  }

  /**
   * Get a magic login link for the current authenticated user.
   * @returns An object containing the magic login key.
   */
  public async getMagicLoginLink(): Promise<{ sesame: string }> {
    return this.client.request<{ sesame: string }>('auth/magic-login-link/', {
      method: 'POST',
    });
  }

  /**
   * Get the URL of the current user's avatar.
   * @returns An object with the avatar URL.
   */
  public async getAvatar(): Promise<{ avatar: string | null }> {
    return this.client.request<{ avatar: string | null }>('user/avatar/');
  }

  /**
   * Upload a new avatar for the current user.
   * The image must be a square JPG, max 1000x1000px.
   * @param avatar A Blob or Buffer representing the image.
   * @returns An object with the new avatar URL.
   */
  public async updateAvatar(
    avatar: Blob | Buffer
  ): Promise<{ avatar: string | null }> {
    const formData = new FormData();
    formData.append('avatar', new Blob([avatar]));
    return this.client.request<{ avatar: string | null }>('user/avatar/', {
      method: 'PUT',
      body: formData,
    });
  }

  /**
   * Delete the current user's avatar.
   * @returns An object with a null avatar URL.
   */
  public async deleteAvatar(): Promise<{ avatar: string | null }> {
    return this.client.request<{ avatar: string | null }>('user/avatar/', {
      method: 'DELETE',
    });
  }
} 