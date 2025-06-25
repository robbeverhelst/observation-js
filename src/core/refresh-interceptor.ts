import type { ObservationClient } from './client.js';
import { AuthenticationError } from './errors.js';

interface RequestConfig extends RequestInit {
  _retry?: boolean;
  _retryCount?: number;
  url?: string;
}

interface ResponseWithConfig extends Response {
  config?: RequestConfig;
}

/**
 * @internal
 * Interceptor that automatically refreshes access tokens when a 401 error occurs.
 */
export class RefreshTokenInterceptor {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  private readonly maxRetries = 1;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor(private client: ObservationClient) {}

  /**
   * Creates the response error handler for automatic token refresh.
   */
  public createResponseErrorHandler() {
    return async (error: unknown) => {
      if (!(error instanceof AuthenticationError)) {
        throw error;
      }

      const response = error.response;
      if (!response || response.status !== 401 || !this.client.hasRefreshToken()) {
        throw error;
      }

      const originalConfig = (response as ResponseWithConfig).config;
      if (!originalConfig || originalConfig._retry) {
        throw error;
      }

      if (this.isRefreshing) {
        // Queue the request to be retried after refresh completes
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        });
      }

      originalConfig._retry = true;
      this.isRefreshing = true;

      try {
        await this.client.refreshAccessToken();
        this.processQueue(null);
        return await this.retryOriginalRequest(originalConfig);
      } catch (refreshError) {
        this.processQueue(refreshError);
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    };
  }

  /**
   * Process all queued requests after token refresh
   */
  private processQueue(error: unknown) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Retries the original request with the new access token.
   */
  private async retryOriginalRequest(config: RequestConfig): Promise<unknown> {
    const headers = new Headers(config.headers);
    
    if (this.client.hasAccessToken()) {
      headers.set('Authorization', `Bearer ${this.client.getCurrentAccessToken()}`);
    }

    const url = config.url;
    if (!url) {
      throw new Error('Original request URL not found');
    }

    const newConfig: RequestInit = {
      ...config,
      headers,
    };

    const response = await fetch(url, newConfig);
    
    // Attach config to response for potential future retries
    (response as ResponseWithConfig).config = newConfig;
    
    if (!response.ok) {
      const body = await response.text();
      let errorBody: unknown = null;
      try {
        errorBody = body ? JSON.parse(body) : null;
      } catch {
        errorBody = body;
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(response, errorBody);
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
}