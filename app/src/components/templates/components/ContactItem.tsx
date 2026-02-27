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
  value: string;
  variant?: 'default' | 'sidebar' | 'inline';
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
  className = '' 
}: ContactItemProps) {
  const Icon = iconMap[icon];
  
  if (!value) return null;

  const variantStyles = {
    default: 'flex items-center gap-2 text-sm',
    sidebar: 'flex items-center gap-2 text-sm text-white',
    inline: 'inline-flex items-center gap-1 text-sm'
  };

  const iconStyles = {
    default: 'w-4 h-4 opacity-70',
    sidebar: 'w-4 h-4 opacity-70',
    inline: 'w-3 h-3'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <Icon className={iconStyles[variant]} />
      <span className={variant === 'sidebar' ? 'break-all' : ''}>{value}</span>
    </div>
  );
}
