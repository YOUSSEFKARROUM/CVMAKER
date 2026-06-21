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
  onUndo, onRedo, canUndo = false, canRedo = false, onExport, onReset, showInZenMode = false,
}: FloatingActionsProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { id: 'undo',   icon: RotateCcw, label: t('actions.undo')   || 'Annuler',         onClick: onUndo,   disabled: !canUndo,  variant: 'secondary' as const },
    { id: 'redo',   icon: Redo2,     label: t('actions.redo')   || 'Rétablir',         onClick: onRedo,   disabled: !canRedo,  variant: 'secondary' as const },
    { id: 'export', icon: FileJson,  label: t('actions.export') || 'Exporter JSON',    onClick: onExport, disabled: false,     variant: 'secondary' as const },
    { id: 'reset',  icon: Trash2,    label: t('actions.reset')  || 'Réinitialiser',    onClick: onReset,  disabled: false,     variant: 'destructive' as const },
  ].filter(a => a.onClick);

  if (actions.length === 0) return null;

  return (
    <div className={`fixed right-5 bottom-5 z-40 flex flex-col items-end gap-2 lg:hidden ${showInZenMode ? '' : 'zen:hidden'}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex flex-col gap-1.5 mb-1"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: index * 0.05, duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground bg-card border border-border px-2.5 py-1 rounded-md shadow-sm">
                  {action.label}
                </span>
                <Button
                  variant={action.variant}
                  size="icon"
                  onClick={() => {
                    action.onClick?.();
                    if (action.id === 'reset') setIsExpanded(false);
                  }}
                  disabled={action.disabled}
                  className="h-9 w-9 rounded-lg shadow-md"
                >
                  <action.icon className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="icon"
          className={`h-11 w-11 rounded-lg shadow-lg transition-colors duration-150 ${
            isExpanded
              ? 'bg-muted hover:bg-accent text-foreground'
              : 'bg-blue hover:bg-blue/90 text-blue-foreground'
          }`}
        >
          {isExpanded ? <X className="size-[18px]" /> : <MoreHorizontal className="size-[18px]" />}
        </Button>
      </motion.div>
    </div>
  );
}

export function CompactActions({ onUndo, onRedo, canUndo = false, canRedo = false }: FloatingActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-0.5">
      <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} className="h-8 w-8"
        title={t('actions.undo') || 'Annuler (⌘Z)'}>
        <RotateCcw className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} className="h-8 w-8"
        title={t('actions.redo') || 'Rétablir (⌘⇧Z)'}>
        <Redo2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
