import { useTranslation } from 'react-i18next';

interface SectionTitleProps {
  titleKey: string;
  color?: string;
  variant?: 'default' | 'underline' | 'bordered' | 'sidebar';
  className?: string;
}

export function SectionTitle({ 
  titleKey, 
  color, 
  variant = 'default',
  className = '' 
}: SectionTitleProps) {
  const { t } = useTranslation();

  const baseStyles = 'font-semibold tracking-wide text-gray-800';
  
  const variantStyles = {
    default: 'text-base mb-3.5',
    underline: 'text-base mb-3.5 pb-2 border-b-2',
    bordered: 'text-base mb-4 pb-2.5 border-b-2',
    sidebar: 'text-xs uppercase tracking-widest mb-4 font-medium opacity-95 border-b border-white/40 pb-2'
  };

  return (
    <h3 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={color ? { color: variant === 'sidebar' ? 'inherit' : color, borderColor: variant === 'sidebar' ? 'rgba(255,255,255,0.4)' : color } : undefined}
    >
      {t(titleKey)}
    </h3>
  );
}
