import { useEffect, useCallback, useState } from 'react';
import type { RefObject } from 'react';

const A4_HEIGHT = 1123;

export interface AutoFitState {
  naturalHeight: number;
  pageCount: number;
  isOverflowing: boolean;
}

export function useAutoFit(containerRef: RefObject<HTMLDivElement | null>): AutoFitState {
  const [state, setState] = useState<AutoFitState>({
    naturalHeight: A4_HEIGHT,
    pageCount: 1,
    isOverflowing: false,
  });

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const h = containerRef.current.scrollHeight;
    setState({
      naturalHeight: h,
      pageCount: Math.ceil(h / A4_HEIGHT),
      isOverflowing: h > A4_HEIGHT,
    });
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(el);
    const t = setTimeout(measure, 100);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [containerRef, measure]);

  return state;
}
