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
  lastSaved,
  isSaving = false,
  isCloudEnabled = false,
  versions = [],
  onRestore,
}: AutoSaveIndicatorProps) {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSaved) {
        setTimeAgo('');
        return;
      }
      
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 10) {
        setTimeAgo(t('autoSave.justNow') || 'À l\'instant');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}min`);
      } else if (hours < 24) {
        setTimeAgo(`${hours}h`);
      } else {
        setTimeAgo(lastSaved.toLocaleDateString());
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);
    return () => clearInterval(interval);
  }, [lastSaved, t]);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Auto-save status */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
        >
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('autoSave.saving') || 'Sauvegarde...'}</span>
              </motion.div>
            ) : lastSaved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <Check className="w-3.5 h-3.5 text-green-500" />
                </motion.div>
                <span>
                  {t('autoSave.saved') || 'Sauvegardé'} {timeAgo && `• ${timeAgo}`}
                </span>
                {isCloudEnabled ? (
                  <Cloud className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <CloudOff className="w-3.5 h-3.5 text-slate-400" />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="unsaved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400"
              >
                <span>{t('autoSave.unsaved') || 'Modifications non sauvegardées'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* History button */}
        {versions.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <History className="w-3 h-3" />
            <span>{versions.length}</span>
          </motion.button>
        )}
      </div>

      {/* History dropdown */}
      <AnimatePresence>
        {showHistory && versions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t('autoSave.history') || 'Historique'}
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {versions.map((version, index) => (
                <motion.button
                  key={version.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onRestore?.(version);
                    setShowHistory(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {version.changes}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {version.timestamp.toLocaleTimeString()}
                    </p>
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
