import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { useDownloadRequest } from '@/hooks/useDownloadRequest';
import {
  User, Mail, Lock, AlertTriangle,
  Check, Loader2, Calendar, FileText, Download, CreditCard,
  Clock, Info, X
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { success, error: toastError } = useToast();
  const { canUserDownload, getMyRequests } = useDownloadRequest();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stats, setStats] = useState({ cvCount: 0, downloadCount: 0, memberSince: '' });
  const [pdfStatus, setPdfStatus] = useState<{
    hasAccess: boolean;
    requestStatus: string;
    adminNote?: string;
  }>({ hasAccess: false, requestStatus: 'none' });

  useEffect(() => {
    if (!user) return;
    loadStats();
    loadPdfStatus();
  }, [user?.uid]);

  async function loadPdfStatus() {
    try {
      const [hasAccess, requests] = await Promise.all([canUserDownload(), getMyRequests()]);
      const latest = requests[0] as { status: string; admin_note?: string } | undefined;
      setPdfStatus({
        hasAccess,
        requestStatus: latest?.status ?? 'none',
        adminNote: latest?.admin_note,
      });
    } catch {
      // non-bloquant
    }
  }

  async function loadStats() {
    const { data } = await supabase
      .from('profiles')
      .select('total_cvs_created, total_downloads, created_at')
      .eq('id', user?.uid)
      .single();

    if (data) {
      setStats({
        cvCount: data.total_cvs_created || 0,
        downloadCount: data.total_downloads || 0,
        memberSince: new Date(data.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
      });
    }
  }

  async function handleUpdateName() {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { displayName: displayName.trim() },
      });
      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
        .eq('id', user?.uid);

      success(t('profile.nameUpdated', 'Nom mis à jour'));
    } catch {
      toastError(t('profile.nameError', 'Erreur lors de la mise à jour'));
    }
    setSaving(false);
  }

  async function handleChangePassword(newPwd: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) throw error;
      success(t('profile.passwordChanged', 'Mot de passe modifié'));
      setShowPasswordForm(false);
    } catch {
      toastError(t('profile.passwordError', 'Erreur lors du changement de mot de passe'));
    }
  }

  function handleDeleteAccount() {
    toastError(t('profile.deleteContact', 'Pour supprimer votre compte, contactez-nous à support@cvmaker.com'));
    setShowDeleteConfirm(false);
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header profil */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {user?.displayName || user?.email?.split('@')[0]}
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={FileText} value={stats.cvCount} label={t('profile.stats.cvs', 'CVs créés')} />
        <StatCard icon={Download} value={stats.downloadCount} label={t('profile.stats.downloads', 'Téléchargements')} />
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <div className="text-xs font-medium text-foreground leading-tight">{stats.memberSince || '—'}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{t('profile.stats.member', 'Membre depuis')}</div>
        </div>
      </div>

      {/* Informations personnelles */}
      <section className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          {t('profile.personalInfo', 'Informations personnelles')}
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t('profile.displayName', "Nom d'affichage")}
          </label>
          <div className="flex gap-2">
            <Input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder={t('profile.namePlaceholder', 'Votre nom complet')}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleUpdateName}
              disabled={saving || displayName === (user?.displayName || '')}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t('profile.email', 'Adresse e-mail')}
          </label>
          <div className="flex items-center gap-2">
            <Input value={user?.email || ''} disabled className="flex-1 opacity-60" />
            <Mail className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          {t('profile.security', 'Sécurité')}
        </h2>

        {!showPasswordForm ? (
          <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
            {t('profile.changePassword', 'Changer le mot de passe')}
          </Button>
        ) : (
          <PasswordChangeForm
            onSubmit={handleChangePassword}
            onCancel={() => setShowPasswordForm(false)}
          />
        )}
      </section>

      {/* Plan & Accès PDF */}
      <section className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          {t('profile.plan', 'Mon plan')}
        </h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium text-foreground">
              {t('profile.freePlan', 'Plan gratuit')}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t('profile.freePlanDesc', 'Création illimitée de CVs')}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {t('profile.free', 'Gratuit')}
          </span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="text-sm font-medium text-foreground mb-2">
            {t('profile.pdfAccess', 'Accès téléchargement PDF')}
          </div>
          {pdfStatus.hasAccess ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                {t('profile.pdfActive', 'Actif — vous pouvez télécharger vos CVs en PDF')}
              </span>
            </div>
          ) : pdfStatus.requestStatus === 'pending' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">
                {t('profile.pdfPending', 'Demande en attente de validation')}
              </span>
            </div>
          ) : pdfStatus.requestStatus === 'rejected' ? (
            <div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10">
                <X className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">
                  {t('profile.pdfRejected', 'Demande refusée')}
                </span>
              </div>
              {pdfStatus.adminNote && (
                <p className="text-xs text-muted-foreground mt-2 ml-1">
                  {t('profile.rejectionReason', 'Raison')} : {pdfStatus.adminNote}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('profile.pdfNotRequested', 'Pas encore demandé — téléchargez un CV pour soumettre une demande')}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Zone dangereuse */}
      <section className="bg-card border border-destructive/20 rounded-xl p-6">
        <h2 className="text-base font-medium text-destructive mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {t('profile.dangerZone', 'Zone dangereuse')}
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">
              {t('profile.deleteAccount', 'Supprimer mon compte')}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t('profile.deleteDesc', 'Cette action est irréversible. Tous vos CVs seront supprimés.')}
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              {t('profile.delete', 'Supprimer')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                {t('common.cancel', 'Annuler')}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                {t('profile.confirmDelete', 'Confirmer')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Déconnexion */}
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={async () => await logout()}
        >
          {t('menu.logout', 'Se déconnecter')}
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <Icon className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function PasswordChangeForm({ onSubmit, onCancel }: {
  onSubmit: (newPwd: string) => Promise<void>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    setFormError('');
    if (newPwd.length < 8) {
      setFormError(t('profile.pwdTooShort', 'Le mot de passe doit faire au moins 8 caractères'));
      return;
    }
    if (newPwd !== confirmPwd) {
      setFormError(t('profile.pwdMismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }
    setLoading(true);
    await onSubmit(newPwd);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">
          {t('profile.newPassword', 'Nouveau mot de passe')}
        </label>
        <Input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">
          {t('profile.confirmPassword', 'Confirmer le nouveau mot de passe')}
        </label>
        <Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
      </div>
      {formError && <p className="text-xs text-destructive">{formError}</p>}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {t('common.cancel', 'Annuler')}
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
          {t('profile.updatePassword', 'Mettre à jour')}
        </Button>
      </div>
    </div>
  );
}
