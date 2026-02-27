import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { User, LogOut, FileText, Cloud, ChevronDown, LayoutGrid, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCloudCV } from '../hooks/useCloudCV';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/useToast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthModal } from './AuthModal';
import { CVDashboard } from './CVDashboard';
import type { CVData, CVSettings } from '../types/cv';

interface UserMenuProps {
  cvData?: CVData;
  settings?: CVSettings;
  onLoadCV?: (cv: { cvData: CVData; settings: CVSettings }) => void;
  onCreateNew?: () => void;
  onEditCV?: (cvId: string, cvData: CVData, settings: CVSettings) => void;
}

export function UserMenu({ cvData, settings, onLoadCV, onCreateNew, onEditCV }: UserMenuProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cvs, saveToCloud, loadFromCloud, loading, isCloudEnabled } = useCloudCV();
  const { success, error: showError } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!cvData || !settings) {
      showError('Aucune donnée à sauvegarder');
      return;
    }
    
    const name = cvData.contact.firstName || cvData.contact.lastName
      ? `${cvData.contact.firstName} ${cvData.contact.lastName} - CV`.trim()
      : 'Mon CV';
      
    setIsSaving(true);
    try {
      await saveToCloud(name, cvData, settings);
      success('CV sauvegardé avec succès dans le cloud');
    } catch (err: any) {
      showError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }, [cvData, settings, saveToCloud, success, showError]);

  const handleLoadCV = useCallback((cv: { cvData: CVData; settings: CVSettings }) => {
    onLoadCV?.(cv);
    success('CV chargé avec succès');
  }, [onLoadCV, success]);

  const handleEditCV = useCallback(async (cvId: string) => {
    try {
      const loadedCV = await loadFromCloud(cvId);
      if (loadedCV) {
        onEditCV?.(cvId, loadedCV.cvData, loadedCV.settings);
        setShowDashboard(false);
        success('CV chargé en mode édition');
      } else {
        showError('CV non trouvé');
      }
    } catch (err: any) {
      showError(err.message || 'Erreur lors du chargement du CV');
    }
  }, [loadFromCloud, onEditCV, success, showError]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      success('Déconnexion réussie');
    } catch (err) {
      showError('Erreur lors de la déconnexion');
    }
  }, [logout, success, showError]);

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAuthModal(true)}
          className="gap-2"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{t('auth.login')}</span>
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {cvData && settings && isCloudEnabled && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 hidden sm:flex"
              title={isCloudEnabled ? undefined : "Stockage cloud non disponible"}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              {t('cloud.save')}
            </Button>
          </motion.div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
              >
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
              <span className="hidden md:inline max-w-[100px] truncate text-slate-700 dark:text-slate-300">
                {user?.displayName || user?.email}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 mb-1">
              {user?.email}
            </div>
            
            <DropdownMenuItem 
              onClick={() => setShowDashboard(true)} 
              className="gap-2 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-500" />
              {t('cloud.myCVs')}
              {cvs.length > 0 && (
                <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                  {cvs.length}
                </span>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={onCreateNew} 
              className="gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              {t('landing.createCV')}
            </DropdownMenuItem>

            {cvData && settings && isCloudEnabled && (
              <DropdownMenuItem 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2 cursor-pointer sm:hidden"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4 text-blue-500" />
                )}
                {t('cloud.save')}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CV Dashboard Modal */}
      <AnimatePresence>
        {showDashboard && (
          <CVDashboard
            isOpen={showDashboard}
            onClose={() => setShowDashboard(false)}
            onCreateNew={() => {
              setShowDashboard(false);
              onCreateNew?.();
            }}
            onLoadCV={handleLoadCV}
            onEditCV={handleEditCV}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
