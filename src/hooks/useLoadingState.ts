import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useLoadingState - Hook để quản lý loading state của async operations
 * Hỗ trợ multiple concurrent loads, error handling, retry logic
 * Vibe: Đơn giản, ổn định, không crash! 🚀\n */

interface LoadingConfig {
  /** Timeout cho mỗi load (ms) */
  timeout?: number;
  /** Có retry tự động không (nếu fail) */
  autoRetry?: boolean;
  /** Số lần retry tối đa */
  maxRetries?: number;
  /** Delay giữa các retries (ms) */
  retryDelay?: number;
}

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
}

interface UseLoadingStateReturn extends LoadingState {
  /** Start loading với async function */
  load: <T,>(fn: () => Promise<T>) => Promise<T | null>;
  /** Reset state */
  reset: () => void;
  /** Retry last failed operation */
  retry: () => Promise<void>;
}

/**
 * Hook quản lý loading state - Như lính canh bảo vệ async operations! 🛡️
 */
export const useLoadingState = (config: LoadingConfig = {}): UseLoadingStateReturn => {
  const {
    timeout = 10000,
    autoRetry = true,
    maxRetries = 3,
    retryDelay = 1000,
  } = config;

  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    retryCount: 0,
  });

  // Store last function để retry
  const lastFnRef = useRef<(() => Promise<any>) | null>(null);

  /**
   * Load async function với timeout + retry logic
   */
  const load = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      lastFnRef.current = fn;

      return new Promise((resolve) => {
        const executeLoad = async (attempt: number = 1) => {
          try {
            setState({
              isLoading: true,
              error: null,
              retryCount: attempt - 1,
            });

            // Create timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
              const timer = setTimeout(
                () => reject(new Error(`Load timeout sau ${timeout}ms`)),
                timeout
              );
              return () => clearTimeout(timer);
            });

            // Race between actual load và timeout
            const result = await Promise.race([fn(), timeoutPromise]);

            setState({
              isLoading: false,
              error: null,
              retryCount: 0,
            });

            resolve(result);
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));

            // Retry logic
            if (autoRetry && attempt < maxRetries) {
              setState((prev) => ({
                ...prev,
                error,
                retryCount: attempt,
              }));

              // Wait before retry
              setTimeout(() => executeLoad(attempt + 1), retryDelay * attempt);
            } else {
              setState({
                isLoading: false,
                error,
                retryCount: attempt,
              });

              resolve(null);
            }
          }
        };

        executeLoad();
      });
    },
    [timeout, autoRetry, maxRetries, retryDelay]
  );

  /**
   * Reset state về default
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  /**
   * Retry last failed operation
   */
  const retry = useCallback(async () => {
    if (lastFnRef.current) {
      await load(lastFnRef.current);
    }
  }, [load]);

  return {
    ...state,
    load,
    reset,
    retry,
  };
};

export default useLoadingState;
