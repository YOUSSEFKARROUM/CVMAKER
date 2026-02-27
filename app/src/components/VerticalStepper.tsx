import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User, Briefcase, GraduationCap, Wrench, Globe, Award, FolderHeart, Sparkles, FileText, Flag } from 'lucide-react';
import type { Step } from '../types/cv';

interface VerticalStepperProps {
  steps: Exclude<Step, 'landing' | 'download'>[];
  currentStep: Exclude<Step, 'landing' | 'download'>;
  completedSteps: Set<string>;
  onStepClick: (step: Exclude<Step, 'landing' | 'download'>) => void;
  stepData: Record<string, { isFilled: boolean; summary?: string }>;
}

const stepIcons: Record<string, React.ElementType> = {
  contact: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  languages: Globe,
  certifications: Award,
  projects: FolderHeart,
  interests: Sparkles,
  profile: FileText,
  finish: Flag,
};

const stepGradients: Record<string, string> = {
  contact: 'from-blue-500 to-indigo-600',
  experience: 'from-indigo-500 to-purple-600',
  education: 'from-purple-500 to-pink-600',
  skills: 'from-pink-500 to-rose-600',
  languages: 'from-rose-500 to-orange-600',
  certifications: 'from-orange-500 to-amber-600',
  projects: 'from-amber-500 to-yellow-600',
  interests: 'from-emerald-500 to-teal-600',
  profile: 'from-teal-500 to-cyan-600',
  finish: 'from-cyan-500 to-blue-600',
};

export function VerticalStepper({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  stepData,
}: VerticalStepperProps) {
  const { t } = useTranslation();
  const currentIndex = steps.indexOf(currentStep);

  const getStepLabel = (step: string): string => {
    return t(`steps.${step}`);
  };

  return (
    <div className="w-72 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-700/50 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('nav.progress')}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {currentIndex + 1}/{steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = step === currentStep;
          const isUpcoming = index > currentIndex;
          const Icon = stepIcons[step];
          const data = stepData[step];

          return (
            <motion.button
              key={step}
              onClick={() => !isUpcoming && onStepClick(step)}
              disabled={isUpcoming}
              className={`
                w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left
                ${isCurrent 
                  ? 'bg-white dark:bg-slate-800 shadow-lg ring-2 ring-indigo-500/20 dark:ring-indigo-400/20' 
                  : isCompleted
                  ? 'hover:bg-white/60 dark:hover:bg-slate-800/60'
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
              whileHover={!isUpcoming ? { x: 4 } : {}}
              whileTap={!isUpcoming ? { scale: 0.98 } : {}}
            >
              {/* Step Indicator */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md
                    ${isCompleted || isCurrent
                      ? `bg-gradient-to-br ${stepGradients[step]}`
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }
                  `}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-10 left-1/2 w-0.5 h-6 -translate-x-1/2
                    ${isCompleted ? 'bg-gradient-to-b from-green-500 to-green-300' : 'bg-slate-200 dark:bg-slate-700'}
                  `} />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <span className={`
                    font-semibold text-sm
                    ${isCurrent 
                      ? 'text-slate-900 dark:text-white' 
                      : isCompleted
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                    }
                  `}>
                    {getStepLabel(step)}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                      {t('common.current')}
                    </span>
                  )}
                </div>

                {/* Miniature des données */}
                <AnimatePresence mode="wait">
                  {data?.summary && (isCompleted || isCurrent) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate"
                    >
                      {data.summary}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Status Badge */}
                {data?.isFilled && !isCurrent && (
                  <span className="mt-1 inline-flex items-center text-[10px] text-green-600 dark:text-green-400">
                    <Check className="w-3 h-3 mr-0.5" />
                    {t('common.completed')}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Tips */}
      <div className="p-4 mt-auto">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
            💡 {t('tips.proTip')}
          </p>
          <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1">
            {t('tips.keyboardShortcuts')}
          </p>
        </div>
      </div>
    </div>
  );
}
