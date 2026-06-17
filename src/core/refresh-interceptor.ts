import type { ObservationClient } from './client';
import { ApiError, AuthenticationError, RateLimitError } from './errors';

interface RequestConfig extends RequestInit {
  _retry?: boolean;
  _retryCount?: number;
  url?: string;
}

interface ResponseWithConfig extends Response {
  config?: RequestConfig;
}

interface QueuedRequest {
  config: RequestConfig;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

/**
 * @internal
 * Interceptor that automatically refreshes access tokens when a 401 error occurs.
 */
export class RefreshTokenInterceptor {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  private readonly maxRetries = 1;
  private failedQueue: QueuedRequest[] = [];

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
      if (
        !response ||
        response.status !== 401 ||
        !this.client.hasRefreshToken()
      ) {
        throw error;
      }

      const originalConfig = (response as ResponseWithConfig).config;
      if (!originalConfig || originalConfig._retry) {
        throw error;
      }

      // Mark as retried up-front so a second 401 on the retried request (or on a
      // queued request) doesn't trigger another refresh cycle.
      originalConfig._retry = true;

      if (this.isRefreshing) {
        // A refresh is already in flight; queue this request and retry it with
        // the fresh token once the refresh resolves.
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ config: originalConfig, resolve, reject });
        });
      }

      this.isRefreshing = true;

      try {
        await this.client.refreshAccessToken();
        const result = await this.retryOriginalRequest(originalConfig);
        // Refresh succeeded: drain the queue by actually retrying each request.
        this.processQueue(null);
        return result;
      } catch (refreshError) {
        // Refresh failed: reject every queued request with the original error.
        this.processQueue(refreshError);
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    };
  }

  /**
   * Process all queued requests after a token refresh attempt. On success each
   * queued request is retried with the new token and resolved with its real
   * result; on failure they are all rejected with the refresh error.
   */
  private processQueue(error: unknown) {
    const queue = this.failedQueue;
    this.failedQueue = [];

    for (const { config, resolve, reject } of queue) {
      if (error) {
        reject(error);
      } else {
        this.retryOriginalRequest(config).then(resolve, reject);
      }
    }
  }

  /**
   * Retries the original request with the new access token.
   */
  private async retryOriginalRequest(config: RequestConfig): Promise<unknown> {
    const headers = new Headers(config.headers);

    if (this.client.hasAccessToken()) {
      headers.set(
        'Authorization',
        `Bearer ${this.client.getCurrentAccessToken()}`,
      );
    }

    const url = config.url;
    if (!url) {
      throw new Error('Original request URL not found');
    }

    const newConfig: RequestConfig = {
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
      if (response.status === 429) {
        throw new RateLimitError(response, errorBody);
      }
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response,
        errorBody,
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
}
