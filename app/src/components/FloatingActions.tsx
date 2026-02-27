import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileJson, Trash2, RotateCcw, Redo2, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface FloatingActionsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onExport?: () => void;
  onReset?: () => void;
  showInZenMode?: boolean;
}

export function FloatingActions({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onExport,
  onReset,
  showInZenMode = false,
}: FloatingActionsProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      id: 'undo',
      icon: RotateCcw,
      label: t('actions.undo') || 'Annuler',
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: '⌘Z',
    },
    {
      id: 'redo',
      icon: Redo2,
      label: t('actions.redo') || 'Rétablir',
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: '⌘⇧Z',
    },
    {
      id: 'export',
      icon: FileJson,
      label: t('actions.export') || 'Exporter JSON',
      onClick: onExport,
      disabled: false,
    },
    {
      id: 'reset',
      icon: Trash2,
      label: t('actions.reset') || 'Réinitialiser',
      onClick: onReset,
      disabled: false,
      variant: 'destructive' as const,
    },
  ].filter(action => action.onClick);

  if (actions.length === 0) return null;

  return (
    <div className={`fixed right-6 bottom-6 z-40 flex flex-col items-end gap-2 ${showInZenMode ? '' : 'zen:hidden'}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-2 mb-2"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-full shadow-sm">
                  {action.label}
                </span>
                <Button
                  variant={action.variant || 'secondary'}
                  size="icon"
                  onClick={() => {
                    action.onClick?.();
                    if (action.id === 'reset') {
                      setIsExpanded(false);
                    }
                  }}
                  disabled={action.disabled}
                  className="h-10 w-10 rounded-full shadow-lg"
                >
                  <action.icon className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="icon"
          className={`h-12 w-12 rounded-full shadow-xl transition-all duration-300 ${
            isExpanded 
              ? 'bg-slate-700 hover:bg-slate-800 rotate-45' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          }`}
        >
          {isExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <MoreHorizontal className="w-5 h-5" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}

// Version compacte pour la barre d'outils
export function CompactActions({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: FloatingActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-8 w-8"
        title={t('actions.undo') || 'Annuler (⌘Z)'}
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        className="h-8 w-8"
        title={t('actions.redo') || 'Rétablir (⌘⇧Z)'}
      >
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
