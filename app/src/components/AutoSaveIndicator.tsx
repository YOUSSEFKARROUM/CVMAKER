import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cloud, CloudOff, Loader2, History, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SaveVersion {
  id: string;
  timestamp: Date;
  changes: string;
}

interface AutoSaveIndicatorProps {
  lastSaved?: Date;
  isSaving?: boolean;
  isCloudEnabled?: boolean;
  versions?: SaveVersion[];
  onRestore?: (version: SaveVersion) => void;
}

export function AutoSaveIndicator({
  lastSaved, isSaving = false, isCloudEnabled = false, versions = [], onRestore,
}: AutoSaveIndicatorProps) {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSaved) { setTimeAgo(''); return; }
      const diff    = Date.now() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours   = Math.floor(minutes / 60);

      if (seconds < 10)    setTimeAgo(t('autoSave.justNow') || 'À l\'instant');
      else if (seconds < 60) setTimeAgo(`${seconds}s`);
      else if (minutes < 60) setTimeAgo(`${minutes}min`);
      else if (hours < 24)   setTimeAgo(`${hours}h`);
      else                   setTimeAgo(lastSaved.toLocaleDateString());
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);
    return () => clearInterval(interval);
  }, [lastSaved, t]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Status */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div key="saving"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 text-blue"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{t('autoSave.saving') || 'Sauvegarde...'}</span>
              </motion.div>
            ) : lastSaved ? (
              <motion.div key="saved"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <Check className="w-3 h-3 text-success" strokeWidth={2.5} />
                </motion.div>
                <span>
                  {t('autoSave.saved') || 'Sauvegardé'}{timeAgo && ` · ${timeAgo}`}
                </span>
                {isCloudEnabled
                  ? <Cloud className="w-3 h-3 text-blue" />
                  : <CloudOff className="w-3 h-3 text-muted-foreground/50" />}
              </motion.div>
            ) : (
              <motion.div key="unsaved"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 text-warning"
              >
                <span>{t('autoSave.unsaved') || 'Modifications non sauvegardées'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History button */}
        {versions.length > 0 && (
          <button
            onClick={() => setShowHistory(o => !o)}
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-accent rounded-md transition-colors"
          >
            <History className="w-3 h-3" />
            <span>{versions.length}</span>
          </button>
        )}
      </div>

      {/* History dropdown */}
      <AnimatePresence>
        {showHistory && versions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-overlay z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-border">
              <h4 className="text-xs font-semibold text-foreground">
                {t('autoSave.history') || 'Historique'}
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {versions.map((version, index) => (
                <motion.button
                  key={version.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => { onRestore?.(version); setShowHistory(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left border-b border-border/50 last:border-0"
                >
                  <div className="w-7 h-7 rounded-md bg-blue/10 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-3.5 h-3.5 text-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{version.changes}</p>
                    <p className="text-xs text-muted-foreground">{version.timestamp.toLocaleTimeString()}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
