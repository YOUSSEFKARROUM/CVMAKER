import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Step, CVData, CVSettings } from '../types/cv';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

interface ProgressBarProps {
  steps: Exclude<Step, 'landing' | 'download'>[];
  currentStep: Exclude<Step, 'landing' | 'download'>;
  onHomeClick?: () => void;
  cvData?: CVData;
  settings?: CVSettings;
  setSettings?: (settings: CVSettings) => void;
  onLoadCV?: (cv: { cvData: CVData; settings: CVSettings }) => void;
  onEditCV?: (cvId: string, cvData: CVData, settings: CVSettings) => void;
  onCreateNew?: () => void;
}



export function ProgressBar({ steps, currentStep, onHomeClick, cvData, settings, setSettings, onLoadCV, onEditCV, onCreateNew }: ProgressBarProps) {
  const { t } = useTranslation();
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const getStepLabel = (step: Exclude<Step, 'landing' | 'download'>): string => {
    const labelMap: Record<Exclude<Step, 'landing' | 'download'>, string> = {
      contact: t('steps.contact'),
      experience: t('steps.experience'),
      education: t('steps.education'),
      skills: t('steps.skills'),
      languages: t('steps.languages'),
      certifications: t('steps.certifications'),
      projects: t('steps.projects'),
      interests: t('steps.interests'),
      profile: t('steps.profile'),
      finish: t('steps.finish'),
    };
    return labelMap[step];
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left - Logo & Home */}
          <motion.button
            onClick={onHomeClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            title={t('nav.home')}
          >
            <Logo size="sm" animated={false} showText={false} />
            <span className="hidden sm:block font-semibold text-slate-700 dark:text-slate-200">CV Maker</span>
          </motion.button>

          {/* Center - Current Step Info */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
              <span className="hidden sm:inline">{t('common.step')}</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {currentIndex + 1} / {steps.length}
              </span>
              <ChevronRight className="w-4 h-4 hidden sm:inline" />
              <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-[150px] sm:max-w-[200px]">
                {getStepLabel(currentStep)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-xs sm:max-w-sm h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <ThemeToggle />
            {settings && setSettings && (
              <LanguageSwitcher 
                settings={settings} 
                setSettings={setSettings} 
              />
            )}
            {cvData && settings && onLoadCV && onEditCV && onCreateNew && (
              <UserMenu
                cvData={cvData}
                settings={settings}
                onLoadCV={onLoadCV}
                onEditCV={onEditCV}
                onCreateNew={onCreateNew}
              />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
