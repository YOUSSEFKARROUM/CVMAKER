import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ZenModeProps {
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  preview?: React.ReactNode;
  currentStep: string;
  onStepChange: (direction: 'prev' | 'next') => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function ZenMode({
  isActive,
  onToggle,
  children,
  preview,
  currentStep,
  onStepChange,
  hasNext,
  hasPrev,
}: ZenModeProps) {
  useTranslation(); // Hook pour future internationalisation
  const [showPreview, setShowPreview] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape' && isActive) {
        onToggle();
      }
      if (isActive) {
        if (e.key === 'ArrowRight' && hasNext) {
          onStepChange('next');
        }
        if (e.key === 'ArrowLeft' && hasPrev) {
          onStepChange('prev');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onToggle, onStepChange, hasNext, hasPrev]);

  // Bloquer le scroll du body quand Zen Mode est actif
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <>
      {/* Zen Mode Toggle Button (visible quand inactif) */}
      {!isActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Mode Zen</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 rounded">
            F11
          </kbd>
        </motion.button>
      )}

      {/* Zen Mode Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              fixed inset-0 z-50
              ${isDark ? 'bg-slate-950' : 'bg-slate-50'}
            `}
          >
            {/* Top Bar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50"
            >
              {/* Left: Step Info */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-900 dark:text-white capitalize">
                    {currentStep}
                  </span>
                  <span>•</span>
                  <span>Mode Zen</span>
                </div>
              </div>

              {/* Center: Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStepChange('prev')}
                  disabled={!hasPrev}
                  className="gap-1"
                >
                  ← Précédent
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStepChange('next')}
                  disabled={!hasNext}
                  className="gap-1"
                >
                  Suivant →
                </Button>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-2">
                {/* Toggle Preview */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                  title={showPreview ? 'Masquer preview' : 'Afficher preview'}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>

                {/* Toggle Theme */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  title={isDark ? 'Mode clair' : 'Mode sombre'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                {/* Exit */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="gap-1 text-slate-500"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Quitter</span>
                  <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded ml-1">
                    ESC
                  </kbd>
                </Button>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-73px)]">
              {/* Form Area */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`
                  overflow-y-auto p-6
                  ${showPreview ? 'w-1/2' : 'w-full max-w-3xl mx-auto'}
                `}
              >
                <div className={isDark ? 'dark' : ''}>
                  {children}
                </div>
              </motion.div>

              {/* Preview Area */}
              <AnimatePresence mode="wait">
                {showPreview && preview && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.2 }}
                    className="w-1/2 border-l border-slate-200/50 dark:border-slate-800/50 bg-slate-100/50 dark:bg-slate-900/50 overflow-y-auto p-6"
                  >
                    <div className="sticky top-0">
                      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 min-h-[800px]">
                        {preview}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full shadow-lg text-xs text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">→</kbd>
                Navigation
              </span>
              <span className="w-px h-3 bg-slate-300 dark:bg-slate-600" />
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">ESC</kbd>
                Quitter
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
