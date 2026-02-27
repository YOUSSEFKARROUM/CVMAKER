import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Keyboard, CornerDownLeft, ArrowLeft, ArrowRight, RotateCcw, Redo2, Save, FilePlus, Printer, Focus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Shortcut {
  key: string;
  keys: string[];
  action: string;
  category: 'navigation' | 'editing' | 'view' | 'file';
  icon?: React.ElementType;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { key: 'Tab', keys: ['Tab'], action: 'Champ suivant', category: 'navigation', icon: CornerDownLeft },
  { key: 'Shift+Tab', keys: ['Shift', 'Tab'], action: 'Champ précédent', category: 'navigation', icon: CornerDownLeft },
  { key: 'ArrowRight', keys: ['→'], action: 'Étape suivante', category: 'navigation', icon: ArrowRight },
  { key: 'ArrowLeft', keys: ['←'], action: 'Étape précédente', category: 'navigation', icon: ArrowLeft },
  
  // Editing
  { key: 'Ctrl+Z', keys: ['Ctrl', 'Z'], action: 'Annuler', category: 'editing', icon: RotateCcw },
  { key: 'Ctrl+Shift+Z', keys: ['Ctrl', 'Shift', 'Z'], action: 'Rétablir', category: 'editing', icon: Redo2 },
  { key: 'Ctrl+Enter', keys: ['Ctrl', '↵'], action: 'Sauvegarder', category: 'editing', icon: Save },
  
  // File
  { key: 'Ctrl+N', keys: ['Ctrl', 'N'], action: 'Nouveau CV', category: 'file', icon: FilePlus },
  { key: 'Ctrl+P', keys: ['Ctrl', 'P'], action: 'Aperçu impression', category: 'file', icon: Printer },
  { key: 'Ctrl+S', keys: ['Ctrl', 'S'], action: 'Sauvegarder', category: 'file', icon: Save },
  
  // View
  { key: 'F11', keys: ['F11'], action: 'Mode Zen', category: 'view', icon: Focus },
  { key: '?', keys: ['?'], action: 'Aide raccourcis', category: 'view', icon: HelpCircle },
];

const categories = {
  navigation: { label: 'Navigation', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  editing: { label: 'Édition', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  file: { label: 'Fichier', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  view: { label: 'Affichage', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

function getModifierKey(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
  }
  return 'Ctrl';
}

export function KeyboardShortcutsHelp() {
  useTranslation(); // Hook pour future internationalisation
  const [isOpen, setIsOpen] = useState(false);
  const [modifier, setModifier] = useState('Ctrl');

  useEffect(() => {
    setModifier(getModifierKey());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ouvrir avec ? (mais pas quand on tape dans un input)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      // Fermer avec Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const formatKeys = useCallback((keys: string[]) => {
    return keys.map(k => k.replace('Ctrl', modifier).replace('Command', '⌘'));
  }, [modifier]);

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        title="Raccourcis clavier (?)"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Command className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Raccourcis clavier
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Gagnez du temps avec ces raccourcis
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {(Object.keys(categories) as Array<keyof typeof categories>).map((category) => {
                    const categoryShortcuts = shortcuts.filter(s => s.category === category);
                    if (categoryShortcuts.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categories[category].color}`}>
                            {categories[category].label}
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {categoryShortcuts.map((shortcut) => (
                            <motion.div
                              key={shortcut.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {shortcut.icon && (
                                  <shortcut.icon className="w-4 h-4 text-slate-400" />
                                )}
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                  {shortcut.action}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {formatKeys(shortcut.keys).map((key, index) => (
                                  <kbd
                                    key={index}
                                    className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm"
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Appuyez sur <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded font-mono">?</kbd> à tout moment pour afficher cette aide
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Composant pour afficher un raccourci inline
export function ShortcutBadge({ keys, className = '' }: { keys: string[]; className?: string }) {
  const [modifier, setModifier] = useState('Ctrl');

  useEffect(() => {
    setModifier(getModifierKey());
  }, []);

  const formatKeys = (k: string[]) => {
    return k.map(key => key.replace('Ctrl', modifier).replace('Command', '⌘'));
  };

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {formatKeys(keys).map((key, i) => (
        <kbd
          key={i}
          className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}
