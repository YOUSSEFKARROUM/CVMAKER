import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';

describe('useHistory', () => {
  it('should initialize with initial state', () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));

    expect(result.current.state).toEqual({ count: 0 });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should update state', () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));

    act(() => {
      result.current.setState({ count: 1 });
    });

    expect(result.current.state).toEqual({ count: 1 });
  });

  it('should reset history', () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));

    act(() => {
      result.current.setState({ count: 1 });
      result.current.reset({ count: 5 });
    });

    expect(result.current.state).toEqual({ count: 5 });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should update function state', () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));

    act(() => {
      result.current.setState((prev) => ({ count: prev.count + 1 }));
    });

    expect(result.current.state).toEqual({ count: 1 });
  });
});
