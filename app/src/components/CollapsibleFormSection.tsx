import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, AlertCircle, type LucideIcon } from 'lucide-react';

interface CollapsibleFormSectionProps {
  id?: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isRequired?: boolean;
  isCompleted?: boolean;
  hasErrors?: boolean;
  completionPercent?: number;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function CollapsibleFormSection({
  id: _id,
  title,
  icon: Icon,
  children,
  isRequired = false,
  isCompleted = false,
  hasErrors = false,
  completionPercent = 0,
  defaultExpanded = false,
  onToggle,
}: CollapsibleFormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const getStatusIcon = () => {
    if (hasErrors) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (isCompleted) return <Check className="w-4 h-4 text-green-500" />;
    return null;
  };

  const getStatusColor = () => {
    if (hasErrors) return 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10';
    if (isCompleted) return 'border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10';
    if (isExpanded) return 'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/30 dark:bg-indigo-900/10';
    return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50';
  };

  return (
    <div 
      className={`
        rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${getStatusColor()}
      `}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        {/* Icon */}
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${hasErrors 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
            : isCompleted
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : isExpanded
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }
        `}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Title & Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {title}
            </h3>
            {isRequired && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                Requis
              </span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  hasErrors 
                    ? 'bg-red-500' 
                    : isCompleted 
                    ? 'bg-green-500' 
                    : 'bg-indigo-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 min-w-[2.5rem] text-right">
              {Math.round(completionPercent)}%
            </span>
          </div>
        </div>

        {/* Status Icon & Chevron */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700">
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
                className="pt-4"
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook pour calculer le pourcentage de complétion
export function useSectionCompletion(fields: Record<string, string | undefined>): number {
  const totalFields = Object.keys(fields).length;
  if (totalFields === 0) return 0;
  
  const filledFields = Object.values(fields).filter(
    value => value && value.trim() !== ''
  ).length;
  
  return (filledFields / totalFields) * 100;
}
