import { useRef } from 'react';
import { useAutoFit } from '@/hooks/useAutoFit';
import type { CVSettings } from '@/types/cv';

const A4_HEIGHT = 1123;

interface CVPageWrapperProps {
  settings: CVSettings;
  children: React.ReactNode;
  onContentHeightChange?: (height: number) => void;
}

export default function CVPageWrapper({ settings, children, onContentHeightChange }: CVPageWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageMode = settings.pageMode ?? 'auto-fit';

  const { naturalHeight, pageCount, isOverflowing } = useAutoFit(containerRef);

  // Report height changes to parent
  const prevHeight = useRef(0);
  if (containerRef.current && naturalHeight !== prevHeight.current) {
    prevHeight.current = naturalHeight;
    onContentHeightChange?.(naturalHeight);
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}

      {/* Page break indicators — multi-page and auto-fit modes */}
      {pageMode !== 'single' && isOverflowing &&
        Array.from({ length: pageCount - 1 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{ top: `${(i + 1) * A4_HEIGHT}px` }}
          >
            <div className="border-t-2 border-dashed border-blue-400/50 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap border border-blue-400/20 shadow-sm">
                Page {i + 2} / {pageCount}
              </span>
            </div>
            <div className="h-2 bg-blue-50/40" />
          </div>
        ))
      }

      {/* 1-page boundary indicator — single mode */}
      {pageMode === 'single' && isOverflowing && (
        <>
          {/* Red gradient warning at 1-page boundary (visible in FinishForm clip) */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{ top: `${A4_HEIGHT - 48}px`, height: '48px' }}
          >
            <div className="w-full h-full bg-gradient-to-t from-red-100/60 to-transparent" />
          </div>
          {/* Dashed line exactly at A4 boundary */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{ top: `${A4_HEIGHT}px` }}
          >
            <div className="border-t-2 border-dashed border-red-400/60 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-red-500 text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap border border-red-300/50 shadow-sm">
                ⚠️ Limite 1 page — activez Auto-fit ou réduisez
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
