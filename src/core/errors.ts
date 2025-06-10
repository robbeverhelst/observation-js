/**
 * Base class for all errors thrown by the observation-js library.
 */
export class ObservationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ObservationError';
  }
}

/**
 * Represents an error returned by the Waarneming.nl API.
 */
export class ApiError extends ObservationError {
  public readonly response: Response | null;
  public readonly body: unknown;

  constructor(message: string, response: Response | null, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.body = body;
  }
}

/**
 * Represents an authentication-related error (e.g., 401 Unauthorized, 403 Forbidden).
 */
export class AuthenticationError extends ApiError {
  constructor(response: Response, body: unknown) {
    super('Authentication failed', response, body);
    this.name = 'AuthenticationError';
  }
}

/**
 * Represents a rate limiting error (429 Too Many Requests).
 * Contains information about retry timing if available.
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter?: number; // seconds to wait before retrying
  public readonly resetTime?: Date; // when the rate limit resets

  constructor(response: Response, body: unknown) {
    const retryAfter = response.headers.get('Retry-After');
    const resetHeader = response.headers.get('X-RateLimit-Reset');
    
    let message = 'Rate limit exceeded. Please wait before making more requests.';
    if (retryAfter) {
      message += ` Retry after ${retryAfter} seconds.`;
    }

    super(message, response, body);
    this.name = 'RateLimitError';
    
    // Parse retry timing information
    this.retryAfter = retryAfter ? parseFloat(retryAfter) : undefined;
    this.resetTime = resetHeader ? new Date(parseInt(resetHeader, 10) * 1000) : undefined;
  }

  /**
   * Get the recommended delay in milliseconds before retrying
   */
  getRetryDelayMs(): number {
    if (this.retryAfter) {
      return this.retryAfter * 1000;
    }
    // Default backoff: 60 seconds for rate limiting
    return 60000;
  }

  /**
   * Check if enough time has passed since the rate limit was hit to retry
   */
  canRetryNow(): boolean {
    if (!this.resetTime) {
      return false;
    }
    return new Date() >= this.resetTime;
  }
}

/**
 * Utility function to handle rate limiting with automatic retry
 * @param operation - The operation to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @returns Promise that resolves with the operation result
 */
export async function withRateLimitRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      if (error instanceof RateLimitError) {
        if (attempt >= maxRetries) {
          throw new Error(
            `Rate limit exceeded after ${maxRetries} attempts. ` +
            `Please wait ${Math.round(error.getRetryDelayMs() / 1000)} seconds before trying again.`
          );
        }
        
        const delay = error.getRetryDelayMs();
        console.warn(`Rate limit hit. Waiting ${Math.round(delay / 1000)}s before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // For non-rate-limit errors, throw immediately
      throw error;
    }
  }
  
  throw new Error('Maximum retries exceeded');
}
