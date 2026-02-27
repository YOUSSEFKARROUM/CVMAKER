import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-xl' },
  lg: { icon: 40, text: 'text-2xl' },
  xl: { icon: 56, text: 'text-4xl' },
};

export function Logo({ size = 'md', animated = true, showText = true, className = '' }: LogoProps) {
  const { icon, text } = sizes[size];

  const IconComponent = (
    <div className="relative">
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
        animate={animated ? {
          background: [
            'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
            'linear-gradient(135deg, #ec4899, #6366f1, #a855f7)',
            'linear-gradient(135deg, #a855f7, #ec4899, #6366f1)',
            'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
          ]
        } : {}}
        transition={animated ? { duration: 5, repeat: Infinity, ease: 'linear' } : {}}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-50 blur-sm"
        style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
        animate={animated ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={animated ? { duration: 2, repeat: Infinity } : {}}
      />

      {/* Icon container */}
      <motion.div
        className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white"
        whileHover={animated ? { scale: 1.05, rotate: 5 } : {}}
        whileTap={{ scale: 0.95 }}
      >
        <FileText size={icon} strokeWidth={2.5} />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={animated ? { x: ['-100%', '100%'] } : {}}
            transition={animated ? { duration: 1.5, repeat: Infinity, repeatDelay: 3 } : {}}
          />
        </motion.div>
      </motion.div>
    </div>
  );

  if (!showText) {
    return (
      <div className={`flex items-center ${className}`}>
        {IconComponent}
      </div>
    );
  }

  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={animated ? { opacity: 0, y: -10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {IconComponent}
      <div className="flex flex-col">
        <motion.span 
          className={`font-bold ${text} bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          CV Maker
        </motion.span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 -mt-1 hidden sm:block">
          Créez votre avenir
        </span>
      </div>
    </motion.div>
  );
}

// Animated logo for loading states
export function LogoLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ borderRadius: '30%' }}
      />
      <motion.div
        className="absolute inset-1 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center"
        style={{ borderRadius: '25%' }}
      >
        <FileText className="text-indigo-500" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} />
      </motion.div>
    </div>
  );
}

// Simple inline logo for buttons/nav
export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ${className}`}>
      <FileText size={18} strokeWidth={2.5} />
    </div>
  );
}
