import { useRef, useState, useEffect, memo } from 'react';
import { CVPreview } from './CVPreview';
import type { CVData, CVSettings } from '../types/cv';

interface CVThumbnailProps {
  cvData: CVData;
  settings: CVSettings;
  className?: string;
}

export const CVThumbnail = memo(function CVThumbnail({ cvData, settings, className }: CVThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        io.disconnect();
      }
    }, { rootMargin: '100px' });
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / 794);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-white ${className || ''}`}
      style={{ aspectRatio: '210/297', width: '100%' }}
    >
      {isVisible ? (
        <div
          className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
          style={{ width: '794px', height: '1123px', transform: `scale(${scale})` }}
        >
          <CVPreview cvData={cvData} settings={settings} />
        </div>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      )}
    </div>
  );
});
