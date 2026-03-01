import { useTranslation } from 'react-i18next';
import { formatDate } from '../utils';

interface TimelineItemProps {
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  color?: string;
  layout?: 'default' | 'split' | 'bordered';
}

export function TimelineItem({
  title,
  subtitle,
  startDate,
  endDate,
  currentlyWorking,
  description,
  color,
  layout = 'default'
}: TimelineItemProps) {
  const { t } = useTranslation();

  const dateRange = startDate 
    ? `${formatDate(startDate)} - ${currentlyWorking ? t('common.present') : formatDate(endDate)}`
    : '';

  if (layout === 'split') {
    return (
      <div className="flex gap-5">
        <div className="w-24 flex-shrink-0 text-right pt-0.5">
          {startDate && <p className="text-xs font-medium text-gray-500 tracking-wide">{formatDate(startDate)}</p>}
          {endDate && (
            <p className="text-xs text-gray-400">
              {currentlyWorking ? t('common.present') : formatDate(endDate)}
            </p>
          )}
        </div>
        <div className="flex-1 pb-6 relative pl-5 border-l-2" style={{ borderColor: color || '#e5e7eb' }}>
          <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color || '#9ca3af' }} />
          <h4 className="font-semibold text-gray-900 text-[15px]">{title}</h4>
          {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
          {description && <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{description}</p>}
        </div>
      </div>
    );
  }

  if (layout === 'bordered') {
    return (
      <div 
        className="border-l-2 pl-4 py-0.5"
        style={{ borderColor: color || '#e5e7eb' }}
      >
        <h4 className="font-semibold text-gray-900 text-[15px]">{title}</h4>
        {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
        {dateRange && <p className="text-xs text-gray-500 mb-1">{dateRange}</p>}
        {description && <p className="text-sm text-gray-700 leading-relaxed">{description}</p>}
      </div>
    );
  }

  return (
    <div className="py-0.5">
      <div className="flex justify-between items-start gap-3">
        <h4 className="font-semibold text-gray-900 text-[15px]">{title}</h4>
        {dateRange && <span className="text-xs text-gray-500 whitespace-nowrap">{dateRange}</span>}
      </div>
      {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
      {description && <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{description}</p>}
    </div>
  );
}
