import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { User, LogOut, FileText, Cloud, ChevronDown, LayoutGrid, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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
    if (!cvData || !settings) { showError('Aucune donnée à sauvegarder'); return; }
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
    } catch {
      showError('Erreur lors de la déconnexion');
    }
  }, [logout, success, showError]);

  /* ── Unauthenticated ──────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)} className="gap-1.5">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">{t('auth.login')}</span>
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  /* ── Authenticated ────────────────────────────────────── */
  const initial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?';

  return (
    <>
      <div className="flex items-center gap-1">
        {cvData && settings && isCloudEnabled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-1.5 hidden sm:flex text-muted-foreground"
          >
            {isSaving
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Cloud className="w-3.5 h-3.5" />}
            {t('cloud.save')}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 px-2">
              {/* Avatar */}
              <div className="w-7 h-7 rounded-md bg-blue flex items-center justify-center text-blue-foreground text-xs font-semibold flex-shrink-0">
                {initial.toUpperCase()}
              </div>
              <span className="hidden md:inline text-sm text-foreground max-w-[100px] truncate">
                {user?.displayName || user?.email}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Email header */}
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
              {user?.email}
            </div>

            <DropdownMenuItem onClick={() => setShowDashboard(true)} className="gap-2 cursor-pointer">
              <LayoutGrid className="w-3.5 h-3.5 text-blue" />
              {t('cloud.myCVs')}
              {cvs.length > 0 && (
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-blue/10 text-blue rounded font-medium">
                  {cvs.length}
                </span>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onCreateNew} className="gap-2 cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-success" />
              {t('landing.createCV')}
            </DropdownMenuItem>

            {cvData && settings && isCloudEnabled && (
              <DropdownMenuItem onClick={handleSave} disabled={isSaving} className="gap-2 cursor-pointer sm:hidden">
                {isSaving
                  ? <Loader2 className="w-3.5 h-3.5 text-blue animate-spin" />
                  : <Cloud className="w-3.5 h-3.5 text-blue" />}
                {t('cloud.save')}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer text-destructive hover:text-destructive focus:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('auth.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {showDashboard && (
          <CVDashboard
            isOpen={showDashboard}
            onClose={() => setShowDashboard(false)}
            onCreateNew={() => { setShowDashboard(false); onCreateNew?.(); }}
            onLoadCV={handleLoadCV}
            onEditCV={handleEditCV}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
