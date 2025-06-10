import { expect, test, describe } from 'bun:test';
import { 
  ObservationError, 
  ApiError, 
  AuthenticationError, 
  RateLimitError,
  withRateLimitRetry 
} from '../../src/core/errors';

describe('Errors Integration Tests', () => {
  describe('ObservationError', () => {
    test('should create error with correct name and message', () => {
      const error = new ObservationError('Test error message');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ObservationError);
      expect(error.name).toBe('ObservationError');
      expect(error.message).toBe('Test error message');
    });

    test('should maintain error stack trace', () => {
      const error = new ObservationError('Stack test');
      
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ObservationError');
    });
  });

  describe('ApiError', () => {
    test('should create error with response and body', () => {
      const mockResponse = new Response('{"error": "Not found"}', { 
        status: 404, 
        statusText: 'Not Found' 
      });
      const mockBody = { error: 'Not found' };
      
      const error = new ApiError('API request failed', mockResponse, mockBody);
      
      expect(error).toBeInstanceOf(ObservationError);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('API request failed');
      expect(error.response).toBe(mockResponse);
      expect(error.body).toBe(mockBody);
    });

    test('should handle null response', () => {
      const error = new ApiError('Network error', null, null);
      
      expect(error.response).toBeNull();
      expect(error.body).toBeNull();
    });

    test('should handle various body types', () => {
      const stringBody = 'Error string';
      const objectBody = { code: 500, message: 'Server error' };
      const numberBody = 404;
      
      const error1 = new ApiError('Test', null, stringBody);
      const error2 = new ApiError('Test', null, objectBody);
      const error3 = new ApiError('Test', null, numberBody);
      
      expect(error1.body).toBe(stringBody);
      expect(error2.body).toEqual(objectBody);
      expect(error3.body).toBe(numberBody);
    });
  });

  describe('AuthenticationError', () => {
    test('should create authentication error with correct message', () => {
      const mockResponse = new Response('{"error": "Unauthorized"}', { 
        status: 401, 
        statusText: 'Unauthorized' 
      });
      const mockBody = { error: 'Unauthorized' };
      
      const error = new AuthenticationError(mockResponse, mockBody);
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Authentication failed');
      expect(error.response).toBe(mockResponse);
      expect(error.body).toBe(mockBody);
    });

    test('should handle 403 Forbidden responses', () => {
      const mockResponse = new Response('{"error": "Forbidden"}', { 
        status: 403, 
        statusText: 'Forbidden' 
      });
      
      const error = new AuthenticationError(mockResponse, { error: 'Forbidden' });
      
      expect(error.message).toBe('Authentication failed');
      expect(error.response?.status).toBe(403);
    });
  });

  describe('RateLimitError', () => {
    test('should create rate limit error with retry headers', () => {
      const mockResponse = new Response('{"error": "Too Many Requests"}', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Reset': '1640995200' // Unix timestamp
        }
      });
      
      const error = new RateLimitError(mockResponse, { error: 'Too Many Requests' });
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.name).toBe('RateLimitError');
      expect(error.message).toContain('Rate limit exceeded');
      expect(error.message).toContain('Retry after 60 seconds');
      expect(error.retryAfter).toBe(60);
      expect(error.resetTime).toBeInstanceOf(Date);
    });

    test('should handle missing retry headers', () => {
      const mockResponse = new Response('{"error": "Too Many Requests"}', {
        status: 429
      });
      
      const error = new RateLimitError(mockResponse, null);
      
      expect(error.retryAfter).toBeUndefined();
      expect(error.resetTime).toBeUndefined();
      expect(error.message).toBe('Rate limit exceeded. Please wait before making more requests.');
    });

    test('should calculate retry delay correctly', () => {
      const mockResponse1 = new Response('', {
        status: 429,
        headers: { 'Retry-After': '30' }
      });
      
      const mockResponse2 = new Response('', { status: 429 });
      
      const error1 = new RateLimitError(mockResponse1, null);
      const error2 = new RateLimitError(mockResponse2, null);
      
      expect(error1.getRetryDelayMs()).toBe(30000); // 30 seconds
      expect(error2.getRetryDelayMs()).toBe(60000); // Default 60 seconds
    });

    test('should check if retry is allowed', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      
      const mockResponse1 = new Response('', {
        status: 429,
        headers: { 'X-RateLimit-Reset': pastTime.toString() }
      });
      
      const mockResponse2 = new Response('', {
        status: 429,
        headers: { 'X-RateLimit-Reset': futureTime.toString() }
      });
      
      const mockResponse3 = new Response('', { status: 429 });
      
      const error1 = new RateLimitError(mockResponse1, null);
      const error2 = new RateLimitError(mockResponse2, null);
      const error3 = new RateLimitError(mockResponse3, null);
      
      expect(error1.canRetryNow()).toBe(true);  // Past time - can retry
      expect(error2.canRetryNow()).toBe(false); // Future time - cannot retry
      expect(error3.canRetryNow()).toBe(false); // No reset time - cannot retry
    });
  });

  describe('withRateLimitRetry utility', () => {
    test('should succeed on first attempt', async () => {
      const mockOperation = () => Promise.resolve('success');
      
      const result = await withRateLimitRetry(mockOperation);
      
      expect(result).toBe('success');
    });

    test('should retry on RateLimitError and eventually succeed', async () => {
      let attempts = 0;
      const mockOperation = () => {
        attempts++;
        if (attempts < 3) {
          const mockResponse = new Response('', {
            status: 429,
            headers: { 'Retry-After': '0.001' } // 1ms delay for testing
          });
          throw new RateLimitError(mockResponse, null);
        }
        return Promise.resolve('success after retries');
      };
      
      const result = await withRateLimitRetry(mockOperation, 3);
      
      expect(result).toBe('success after retries');
      expect(attempts).toBe(3);
    });

    test('should throw error after max retries exceeded', async () => {
      let attempts = 0;
      const mockOperation = () => {
        attempts++;
        const mockResponse = new Response('', {
          status: 429,
          headers: { 'Retry-After': '0.001' }
        });
        throw new RateLimitError(mockResponse, null);
      };
      
      await expect(withRateLimitRetry(mockOperation, 2)).rejects.toThrow(
        'Rate limit exceeded after 2 attempts'
      );
      
      expect(attempts).toBe(2);
    });

    test('should immediately throw non-RateLimitError', async () => {
      const mockError = new Error('Network error');
      let attempts = 0;
      const mockOperation = () => {
        attempts++;
        return Promise.reject(mockError);
      };
      
      await expect(withRateLimitRetry(mockOperation, 3)).rejects.toThrow('Network error');
      
      expect(attempts).toBe(1);
    });

    test('should use default maxRetries when not specified', async () => {
      let attempts = 0;
      const mockOperation = () => {
        attempts++;
        const mockResponse = new Response('', {
          status: 429,
          headers: { 'Retry-After': '0.001' }
        });
        throw new RateLimitError(mockResponse, null);
      };
      
      await expect(withRateLimitRetry(mockOperation)).rejects.toThrow(
        'Rate limit exceeded after 3 attempts'
      );
      
      expect(attempts).toBe(3);
    });

    test('should handle zero maxRetries', async () => {
      let attempts = 0;
      const mockOperation = () => {
        attempts++;
        const mockResponse = new Response('', { status: 429 });
        throw new RateLimitError(mockResponse, null);
      };
      
      await expect(withRateLimitRetry(mockOperation, 0)).rejects.toThrow(
        'Maximum retries exceeded'
      );
      
      expect(attempts).toBe(0);
    });
  });
}); 