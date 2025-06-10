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
