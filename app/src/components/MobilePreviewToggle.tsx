import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Eye, EyeOff, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface MobilePreviewToggleProps {
  preview: React.ReactNode;
  isVisible?: boolean; // eslint-disable-line @typescript-eslint/no-unused-vars
  onToggle?: () => void; // eslint-disable-line @typescript-eslint/no-unused-vars
}

export function MobilePreviewToggle({
  preview,
  isVisible: _isVisible,
  onToggle: _onToggle,
}: MobilePreviewToggleProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile Preview Button - Fixed at bottom */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden"
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shadow-lg rounded-full px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <Smartphone className="w-4 h-4" />
          <span>{t('preview.mobile') || 'Aperçu CV'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="w-4 h-4" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Mobile Preview Sheet */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Preview Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl lg:hidden"
              style={{ maxHeight: '80vh' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {t('preview.title') || 'Aperçu de votre CV'}
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                  {preview}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Composant pour desktop - Toggle simple
export function DesktopPreviewToggle({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="hidden xl:flex items-center gap-2"
    >
      {isVisible ? (
        <>
          <EyeOff className="w-4 h-4" />
          <span>{t('preview.hide') || 'Masquer'}</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span>{t('preview.show') || 'Afficher CV'}</span>
        </>
      )}
    </Button>
  );
}
