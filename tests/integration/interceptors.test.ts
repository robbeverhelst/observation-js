import { expect, test, describe } from 'bun:test';
import { InterceptorManager, Interceptor } from '../../src/core/interceptors';

describe('Interceptors Integration Tests', () => {
  describe('InterceptorManager', () => {
    test('should create empty interceptor manager', () => {
      const manager = new InterceptorManager<string>();
      
      expect(manager).toBeDefined();
      expect(manager).toBeInstanceOf(InterceptorManager);
    });

    test('should add interceptor and return ID', () => {
      const manager = new InterceptorManager<string>();
      
      const onFulfilled = (value: string) => value.toUpperCase();
      const onRejected = (error: unknown) => error;
      
      const id = manager.use(onFulfilled, onRejected);
      
      expect(typeof id).toBe('number');
      expect(id).toBe(0); // First interceptor should have ID 0
    });

    test('should add multiple interceptors with sequential IDs', () => {
      const manager = new InterceptorManager<number>();
      
      const interceptor1 = (value: number) => value * 2;
      const interceptor2 = (value: number) => value + 1;
      const interceptor3 = (value: number) => value - 1;
      
      const id1 = manager.use(interceptor1);
      const id2 = manager.use(interceptor2);
      const id3 = manager.use(interceptor3);
      
      expect(id1).toBe(0);
      expect(id2).toBe(1);
      expect(id3).toBe(2);
    });

    test('should add interceptor with only onFulfilled handler', () => {
      const manager = new InterceptorManager<string>();
      
      const onFulfilled = (value: string) => `processed: ${value}`;
      
      const id = manager.use(onFulfilled);
      
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThanOrEqual(0);
    });

    test('should remove interceptor by ID', () => {
      const manager = new InterceptorManager<string>();
      
      const interceptor1 = (value: string) => value;
      const interceptor2 = (value: string) => value;
      
      const id1 = manager.use(interceptor1);
      const id2 = manager.use(interceptor2);
      
      // Remove first interceptor
      manager.eject(id1);
      
      // Should be able to remove without error
      expect(() => manager.eject(id1)).not.toThrow();
    });

    test('should handle ejecting non-existent interceptor', () => {
      const manager = new InterceptorManager<string>();
      
      // Should not throw when ejecting non-existent ID
      expect(() => manager.eject(999)).not.toThrow();
      expect(() => manager.eject(-1)).not.toThrow();
    });

    test('should iterate over active interceptors with forEach', () => {
      const manager = new InterceptorManager<string>();
      
      const interceptor1 = (value: string) => `1: ${value}`;
      const interceptor2 = (value: string) => `2: ${value}`;
      const interceptor3 = (value: string) => `3: ${value}`;
      
      const id1 = manager.use(interceptor1);
      const id2 = manager.use(interceptor2);
      const id3 = manager.use(interceptor3);
      
      const collectedInterceptors: Interceptor<string>[] = [];
      
      manager.forEach((interceptor) => {
        collectedInterceptors.push(interceptor);
      });
      
      expect(collectedInterceptors).toHaveLength(3);
      expect(collectedInterceptors[0].onFulfilled).toBe(interceptor1);
      expect(collectedInterceptors[1].onFulfilled).toBe(interceptor2);
      expect(collectedInterceptors[2].onFulfilled).toBe(interceptor3);
    });

    test('should skip ejected interceptors in forEach', () => {
      const manager = new InterceptorManager<string>();
      
      const interceptor1 = (value: string) => `1: ${value}`;
      const interceptor2 = (value: string) => `2: ${value}`;
      const interceptor3 = (value: string) => `3: ${value}`;
      
      const id1 = manager.use(interceptor1);
      const id2 = manager.use(interceptor2);
      const id3 = manager.use(interceptor3);
      
      // Remove middle interceptor
      manager.eject(id2);
      
      const collectedInterceptors: Interceptor<string>[] = [];
      
      manager.forEach((interceptor) => {
        collectedInterceptors.push(interceptor);
      });
      
      expect(collectedInterceptors).toHaveLength(2);
      expect(collectedInterceptors[0].onFulfilled).toBe(interceptor1);
      expect(collectedInterceptors[1].onFulfilled).toBe(interceptor3);
    });

    test('should handle forEach with no interceptors', () => {
      const manager = new InterceptorManager<string>();
      
      let callCount = 0;
      
      manager.forEach(() => {
        callCount++;
      });
      
      expect(callCount).toBe(0);
    });

    test('should handle forEach after all interceptors are ejected', () => {
      const manager = new InterceptorManager<string>();
      
      const id1 = manager.use((value: string) => value);
      const id2 = manager.use((value: string) => value);
      
      manager.eject(id1);
      manager.eject(id2);
      
      let callCount = 0;
      
      manager.forEach(() => {
        callCount++;
      });
      
      expect(callCount).toBe(0);
    });

    test('should work with different value types', () => {
      // Test with numbers
      const numberManager = new InterceptorManager<number>();
      const numberId = numberManager.use((value: number) => value * 2);
      expect(typeof numberId).toBe('number');
      
      // Test with objects
      interface TestObject {
        name: string;
        value: number;
      }
      
      const objectManager = new InterceptorManager<TestObject>();
      const objectId = objectManager.use((obj: TestObject) => ({
        ...obj,
        name: obj.name.toUpperCase()
      }));
      expect(typeof objectId).toBe('number');
      
      // Test with arrays
      const arrayManager = new InterceptorManager<string[]>();
      const arrayId = arrayManager.use((arr: string[]) => [...arr, 'added']);
      expect(typeof arrayId).toBe('number');
    });

    test('should handle async interceptors', () => {
      const manager = new InterceptorManager<string>();
      
      const asyncInterceptor = async (value: string): Promise<string> => {
        return new Promise(resolve => {
          setTimeout(() => resolve(`async: ${value}`), 10);
        });
      };
      
      const id = manager.use(asyncInterceptor);
      
      expect(typeof id).toBe('number');
      
      // Test that forEach works with async interceptors
      let interceptorFound = false;
      manager.forEach((interceptor) => {
        if (interceptor.onFulfilled === asyncInterceptor) {
          interceptorFound = true;
        }
      });
      
      expect(interceptorFound).toBe(true);
    });

    test('should handle error interceptors', () => {
      const manager = new InterceptorManager<string>();
      
      const onFulfilled = (value: string) => value;
      const onRejected = (error: unknown) => {
        if (error instanceof Error) {
          throw new Error(`Handled: ${error.message}`);
        }
        throw error;
      };
      
      const id = manager.use(onFulfilled, onRejected);
      
      expect(typeof id).toBe('number');
      
      // Verify both handlers are stored
      let foundInterceptor: Interceptor<string> | null = null;
      manager.forEach((interceptor) => {
        foundInterceptor = interceptor;
      });
      
      expect(foundInterceptor).not.toBeNull();
      expect(foundInterceptor!.onFulfilled).toBe(onFulfilled);
      expect(foundInterceptor!.onRejected).toBe(onRejected);
    });

    test('should maintain interceptor order', () => {
      const manager = new InterceptorManager<string>();
      
      const order: string[] = [];
      
      const interceptor1 = (value: string) => {
        order.push('first');
        return value;
      };
      
      const interceptor2 = (value: string) => {
        order.push('second');
        return value;
      };
      
      const interceptor3 = (value: string) => {
        order.push('third');
        return value;
      };
      
      manager.use(interceptor1);
      manager.use(interceptor2);
      manager.use(interceptor3);
      
      const executionOrder: string[] = [];
      
      manager.forEach((interceptor) => {
        // Simulate execution
        if (interceptor.onFulfilled === interceptor1) {
          executionOrder.push('first');
        } else if (interceptor.onFulfilled === interceptor2) {
          executionOrder.push('second');
        } else if (interceptor.onFulfilled === interceptor3) {
          executionOrder.push('third');
        }
      });
      
      expect(executionOrder).toEqual(['first', 'second', 'third']);
    });
  });
}); 