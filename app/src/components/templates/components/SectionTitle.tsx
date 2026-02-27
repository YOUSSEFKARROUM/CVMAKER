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

  const baseStyles = 'font-semibold tracking-wider';
  
  const variantStyles = {
    default: 'text-lg mb-3',
    underline: 'text-lg mb-3 pb-2 border-b-2',
    bordered: 'text-lg mb-4 pb-2 border-b',
    sidebar: 'text-sm uppercase mb-4 opacity-80 border-b border-white/30 pb-2'
  };

  return (
    <h3 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={color ? { color, borderColor: variant !== 'sidebar' ? color : undefined } : undefined}
    >
      {t(titleKey)}
    </h3>
  );
}
