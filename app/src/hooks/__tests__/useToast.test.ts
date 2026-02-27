import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message', 'success', 0);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('should remove a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message', 'info', 0);
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should create success toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message', 0);
    });

    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Success message');
  });

  it('should create error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error message', 0);
    });

    expect(result.current.toasts[0].type).toBe('error');
  });

  it('should create warning toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.warning('Warning message', 0);
    });

    expect(result.current.toasts[0].type).toBe('warning');
  });

  it('should create info toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('Info message', 0);
    });

    expect(result.current.toasts[0].type).toBe('info');
  });

  it('should store multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Message 1', 'info', 0);
      result.current.addToast('Message 2', 'info', 0);
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].message).toBe('Message 1');
    expect(result.current.toasts[1].message).toBe('Message 2');
  });
});
