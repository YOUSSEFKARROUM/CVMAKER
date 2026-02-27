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
      <div className="flex gap-4">
        <div className="w-24 flex-shrink-0 text-right">
          {startDate && <p className="text-sm text-gray-500">{formatDate(startDate)}</p>}
          {endDate && (
            <p className="text-sm text-gray-500">
              {currentlyWorking ? t('common.present') : formatDate(endDate)}
            </p>
          )}
        </div>
        <div 
          className="flex-1 pb-6 border-l-2 pl-4"
          style={{ borderColor: color }}
        >
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
          {description && <p className="text-sm text-gray-700 mt-1">{description}</p>}
        </div>
      </div>
    );
  }

  if (layout === 'bordered') {
    return (
      <div 
        className="border-l-2 pl-4"
        style={{ borderColor: color }}
      >
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        {dateRange && <p className="text-sm text-gray-500 mb-1">{dateRange}</p>}
        {description && <p className="text-sm text-gray-700">{description}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {dateRange && <span className="text-sm text-gray-500">{dateRange}</span>}
      </div>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      {description && <p className="text-sm text-gray-700 mt-1">{description}</p>}
    </div>
  );
}
