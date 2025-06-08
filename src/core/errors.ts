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
  public readonly response: Response;
  public readonly body: any;

  constructor(message: string, response: Response, body: any) {
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
  constructor(response: Response, body: any) {
    super('Authentication failed', response, body);
    this.name = 'AuthenticationError';
  }
} 