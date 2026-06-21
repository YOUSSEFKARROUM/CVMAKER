import { useRef, useState, useEffect } from 'react';
import { CVPreview } from './CVPreview';
import type { CVData, CVSettings } from '../types/cv';

// A4 width in px at 96 dpi — used to compute scale dynamically.
const A4_WIDTH_PX = 794;

interface CVThumbnailProps {
  cvData: CVData;
  settings: CVSettings;
  /** Width of the container in px. If omitted, a ResizeObserver measures it. */
  containerWidth?: number;
  className?: string;
}

export function CVThumbnail({ cvData, settings, containerWidth, className = '' }: CVThumbnailProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(containerWidth ?? 0);

  useEffect(() => {
    if (containerWidth !== undefined) return; // controlled externally

    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setMeasuredWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerWidth]);

  const width = containerWidth ?? measuredWidth;
  const scale = width > 0 ? width / A4_WIDTH_PX : 0;

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {scale > 0 && (
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: A4_WIDTH_PX,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <CVPreview cvData={cvData} settings={settings} />
        </div>
      )}
    </div>
  );
}
