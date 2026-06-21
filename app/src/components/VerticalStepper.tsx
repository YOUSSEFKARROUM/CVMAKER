import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User, Briefcase, GraduationCap, Wrench, Globe, Award, FolderHeart, Sparkles, FileText, Flag } from 'lucide-react';
import type { Step } from '../types/cv';
import { slideInLeft } from '../styles/design-system';

interface VerticalStepperProps {
  steps: Exclude<Step, 'landing' | 'download'>[];
  currentStep: Exclude<Step, 'landing' | 'download'>;
  completedSteps: Set<string>;
  onStepClick: (step: Exclude<Step, 'landing' | 'download'>) => void;
  stepData: Record<string, { isFilled: boolean; summary?: string }>;
}

// Connector line positioning — derived from badge dimensions (w-7 = 28px, gap = 8px)
const CONNECTOR_LEFT = 22; // badge half-width: 28/2 - strokeWidth/2 ≈ 22px from left
const CONNECTOR_TOP  = 36; // badge height (28px) + gap (8px) = 36px from step top

const stepIcons: Record<string, React.ElementType> = {
  contact:        User,
  experience:     Briefcase,
  education:      GraduationCap,
  skills:         Wrench,
  languages:      Globe,
  certifications: Award,
  projects:       FolderHeart,
  interests:      Sparkles,
  profile:        FileText,
  finish:         Flag,
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

  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="w-64 bg-sidebar border-r border-sidebar-border h-full overflow-y-auto flex flex-col"
    >
      {/* ── Header with mini progress ──────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {t('nav.progress')}
          </span>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {currentIndex + 1} / {steps.length}
          </span>
        </div>
        <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Steps list ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-3 py-3 space-y-0.5">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent   = step === currentStep;
          const isUpcoming  = index > currentIndex;
          const Icon        = stepIcons[step];
          const data        = stepData[step];

          return (
            <div key={step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  style={{ left: CONNECTOR_LEFT, top: CONNECTOR_TOP }}
                  className={`absolute w-0.5 h-[14px] z-0 transition-colors duration-200 ${
                    isCompleted ? 'bg-blue/30' : 'bg-border'
                  }`}
                />
              )}

              <motion.button
                onClick={() => !isUpcoming && onStepClick(step)}
                disabled={isUpcoming}
                whileHover={!isUpcoming ? { x: 2 } : {}}
                whileTap={!isUpcoming ? { scale: 0.99 } : {}}
                className={`relative z-10 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                  isCurrent
                    ? 'bg-blue/8 text-foreground'
                    : isCompleted
                    ? 'hover:bg-accent text-foreground'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Icon badge */}
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                    isCurrent
                      ? 'bg-blue text-blue-foreground shadow-sm'
                      : isCompleted
                      ? 'bg-blue/10 text-blue'
                      : 'bg-surface-2 text-muted-foreground'
                  }`}
                >
                  {isCompleted && !isCurrent
                    ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    : <Icon  className="w-3.5 h-3.5" />
                  }
                </div>

                {/* Label + summary */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm truncate ${
                      isCurrent ? 'font-medium text-foreground'
                      : isCompleted ? 'text-foreground'
                      : 'text-muted-foreground'
                    }`}>
                      {t(`steps.${step}`)}
                    </span>
                    {isCurrent && (
                      <span className="flex-shrink-0 px-1.5 py-px text-[10px] font-medium rounded bg-blue/10 text-blue">
                        {t('common.current')}
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {data?.summary && (isCompleted || isCurrent) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-xs text-muted-foreground truncate"
                      >
                        {data.summary}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Completed dot */}
                {isCompleted && !isCurrent && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue/40 flex-shrink-0" />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* ── Tip box ────────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 mt-auto">
        <div className="px-3 py-2.5 rounded-lg bg-muted border border-border">
          <p className="text-xs font-medium text-foreground">
            {t('tips.proTip')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {t('tips.keyboardShortcuts')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
