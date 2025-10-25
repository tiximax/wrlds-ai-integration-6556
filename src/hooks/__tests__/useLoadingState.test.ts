import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useLoadingState from '../useLoadingState';

describe('useLoadingState - Loading state hook', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useLoadingState());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.retryCount).toBe(0);
  });

  it('should handle successful async operation', async () => {
    const { result } = renderHook(() => useLoadingState());
    const mockFn = vi.fn().mockResolvedValue({ data: 'test' });

    act(() => {
      result.current.load(mockFn);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useLoadingState({ autoRetry: false }));
    const mockError = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(mockError);

    act(() => {
      result.current.load(mockFn);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error?.message).toContain('Test error');
  });

  it('should retry on failure', async () => {
    const { result } = renderHook(() =>
      useLoadingState({ autoRetry: true, maxRetries: 2, retryDelay: 10 })
    );

    const mockFn = vi.fn().mockRejectedValue(new Error('Fail'));

    act(() => {
      result.current.load(mockFn);
    });

    await waitFor(
      () => {
        expect(result.current.retryCount).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it('should reset state', async () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.retryCount).toBe(0);
  });

  it('should handle timeout', async () => {
    const { result } = renderHook(() =>
      useLoadingState({ timeout: 100 })
    );

    const slowFn = () =>
      new Promise(() => {
        // Never resolves
      });

    act(() => {
      result.current.load(slowFn);
    });

    await waitFor(
      () => {
        expect(result.current.error).not.toBeNull();
      },
      { timeout: 3000 }
    );

    expect(result.current.error?.message).toContain('timeout');
  });

  it('should support retry method', async () => {
    const { result } = renderHook(() =>
      useLoadingState({ autoRetry: false })
    );

    const mockFn = vi.fn().mockRejectedValue(new Error('Fail'));

    act(() => {
      result.current.load(mockFn);
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    // Retry
    mockFn.mockResolvedValueOnce({ data: 'success' });

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
