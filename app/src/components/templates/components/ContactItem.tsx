import type React from 'react';
import type { LucideProps } from 'lucide-react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Github, 
  Flag, 
  Car, 
  Calendar
} from 'lucide-react';

interface ContactItemProps {
  icon: 'email' | 'phone' | 'location' | 'linkedin' | 'portfolio' | 'github' | 'nationality' | 'driving' | 'birthdate';
  value?: string;
  variant?: 'default' | 'sidebar' | 'inline';
  accentColor?: string;
  textColor?: string;
  className?: string;
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  linkedin: Linkedin,
  portfolio: Globe,
  github: Github,
  nationality: Flag,
  driving: Car,
  birthdate: Calendar
};

export function ContactItem({
  icon,
  value,
  variant = 'default',
  accentColor,
  textColor,
  className = ''
}: ContactItemProps) {
  const Icon = iconMap[icon];

  if (!value) return null;

  const variantStyles = {
    default: 'flex items-center gap-2.5 text-sm text-gray-700',
    sidebar: 'flex items-center gap-2.5 text-sm',
    inline: 'inline-flex items-center gap-1.5 text-sm text-gray-600'
  };

  const iconStyles = {
    default: 'w-4 h-4 flex-shrink-0 opacity-75',
    sidebar: 'w-4 h-4 flex-shrink-0 opacity-80',
    inline: 'w-3.5 h-3.5 flex-shrink-0'
  };

  const iconColor = variant === 'sidebar' && textColor ? textColor : (accentColor && variant !== 'sidebar' ? accentColor : undefined);
  const textStyle = variant === 'sidebar' && textColor ? { color: textColor } : undefined;

  return (
    <div className={`${variantStyles[variant]} min-w-0 ${className}`} style={textStyle}>
      <Icon
        className={`${iconStyles[variant]} flex-shrink-0`}
        style={iconColor ? { color: iconColor } : undefined}
      />
      <span className="text-[11px] break-words leading-snug" style={{ overflowWrap: 'anywhere' }}>{value}</span>
    </div>
  );
}
