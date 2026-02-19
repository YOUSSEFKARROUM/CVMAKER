import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T, maxHistory: number = 50) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const setPresent = useCallback((newPresent: T | ((prev: T) => T)) => {
    setState((prevState) => {
      const resolvedPresent = typeof newPresent === 'function' 
        ? (newPresent as (prev: T) => T)(prevState.present)
        : newPresent;

      // Debounce history updates
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setState((current) => ({
          past: [...current.past.slice(-maxHistory + 1), current.present],
          present: resolvedPresent,
          future: [],
        }));
      }, 500);

      return {
        ...prevState,
        present: resolvedPresent,
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.past.length === 0) return prevState;

      const previous = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, prevState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prevState.present, ...prevState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.future.length === 0) return prevState;

      const next = prevState.future[0];
      const newFuture = prevState.future.slice(1);

      return {
        past: [...prevState.past, prevState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setState({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  return {
    state: state.present,
    setState: setPresent,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
