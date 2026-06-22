import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Maximize2, MoreHorizontal, Sun, Moon, Monitor, Globe, Download, RotateCcw } from 'lucide-react';
import type { Step, CVData, CVSettings } from '../types/cv';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { fadeIn } from '../styles/design-system';
import { useTheme } from '../hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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
  isZenMode?: boolean;
  onZenToggle?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  onGoToAdmin?: () => void;
}

export function ProgressBar({
  steps,
  currentStep,
  onHomeClick,
  cvData,
  settings,
  setSettings,
  onLoadCV,
  onEditCV,
  onCreateNew,
  onZenToggle,
  onExport,
  onReset,
  onGoToAdmin,
}: ProgressBarProps) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const currentIndex = steps.indexOf(currentStep);
  const progress     = ((currentIndex + 1) / steps.length) * 100;

  const getStepLabel = (step: Exclude<Step, 'landing' | 'download'>): string => {
    const labelMap: Record<Exclude<Step, 'landing' | 'download'>, string> = {
      'my-cvs':       t('steps.myCvs', 'Mes CVs'),
      admin:          'Admin',
      contact:        t('steps.contact'),
      experience:     t('steps.experience'),
      education:      t('steps.education'),
      skills:         t('steps.skills'),
      languages:      t('steps.languages'),
      certifications: t('steps.certifications'),
      projects:       t('steps.projects'),
      interests:      t('steps.interests'),
      profile:        t('steps.profile'),
      finish:         t('steps.finish'),
    };
    return labelMap[step];
  };

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const themeLabel = theme === 'dark' ? 'Mode sombre' : theme === 'light' ? 'Mode clair' : 'Système';

  const currentLang = i18n.resolvedLanguage || i18n.language || 'fr';

  const toggleLanguage = () => {
    const next = currentLang.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(next);
    if (settings && setSettings) {
      setSettings({ ...settings, language: next });
    }
  };

  return (
    <motion.header
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-40 bg-background border-b border-border"
    >
      {/* Progress bar — h-1 at the very top of the header */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-surface-2 overflow-hidden">
        <div
          className="h-full bg-blue transition-all duration-[250ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Left — logo / home */}
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={t('nav.home')}
          >
            <Logo size="sm" animated={false} showText className="text-foreground" />
          </button>

          {/* Center — step indicator */}
          <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
              {t('common.step')}
              <span className="font-medium text-foreground">{currentIndex + 1}</span>
              <span>/</span>
              <span className="font-medium text-foreground">{steps.length}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-border hidden sm:block" />
            <span className="text-sm font-medium text-blue truncate max-w-[140px] sm:max-w-[220px]">
              {getStepLabel(currentStep)}
            </span>
          </div>

          {/* Right — actions compactes */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Zen Mode — icône seule, caché sur mobile */}
            {onZenToggle && (
              <button
                onClick={onZenToggle}
                className="hidden sm:flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Mode Zen (F11)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Kebab menu — thème, langue, export, reset */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={cycleTheme} className="gap-2 cursor-pointer">
                  <ThemeIcon className="w-4 h-4" />
                  {themeLabel}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleLanguage} className="gap-2 cursor-pointer">
                  <Globe className="w-4 h-4" />
                  {currentLang.startsWith('fr') ? 'English' : 'Français'}
                </DropdownMenuItem>
                {(onExport || onReset) && <DropdownMenuSeparator />}
                {onExport && (
                  <DropdownMenuItem onClick={onExport} className="gap-2 cursor-pointer">
                    <Download className="w-4 h-4" />
                    {t('actions.exportJSON', 'Exporter JSON')}
                  </DropdownMenuItem>
                )}
                {onReset && (
                  <DropdownMenuItem onClick={onReset} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <RotateCcw className="w-4 h-4" />
                    {t('actions.reset', 'Réinitialiser')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profil utilisateur */}
            {cvData && settings && onLoadCV && onEditCV && onCreateNew && (
              <UserMenu
                cvData={cvData}
                settings={settings}
                onLoadCV={onLoadCV}
                onEditCV={onEditCV}
                onCreateNew={onCreateNew}
                onGoToAdmin={onGoToAdmin}
              />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
