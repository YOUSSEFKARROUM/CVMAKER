import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminPromptModal from './AdminPromptModal';
import {
  Check, X, Clock, Search, Mail, Calendar,
  FileText, Download, CreditCard, ExternalLink, Copy,
} from 'lucide-react';

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminRequests() {
  const { getDownloadRequests, approveRequest, rejectRequest, getAllUsers } = useAdmin();
  const { success, error: toastError } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<any | null>(null);
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);

  useEffect(() => { loadData(); }, [filter]);

  async function loadData() {
    setLoading(true);
    try {
      const [reqData, userData] = await Promise.all([
        getDownloadRequests(filter === 'all' ? undefined : filter),
        getAllUsers(),
      ]);
      setRequests(reqData);
      setUsers(userData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function getUserProfile(userId: string) {
    return users.find(u => u.id === userId);
  }

  async function handleApprove(req: any, note: string) {
    setProcessingId(req.id);
    try {
      await approveRequest(req.id, req.user_id, note || 'Paiement vérifié');
      success(`Accès accordé à ${req.profiles?.email || "l'utilisateur"} (4 téléchargements)`);
      await loadData();
    } catch {
      toastError("Erreur lors de l'approbation");
    }
    setProcessingId(null);
    setApproveTarget(null);
  }

  async function handleReject(req: any, note: string) {
    setProcessingId(req.id);
    try {
      await rejectRequest(req.id, req.user_id, note);
      success('Demande refusée');
      await loadData();
    } catch {
      toastError('Erreur lors du refus');
    }
    setProcessingId(null);
    setRejectTarget(null);
  }

  const filtered = requests.filter(r => {
    if (!search) return true;
    const email = (r.profiles?.email ?? '').toLowerCase();
    const name = (r.profiles?.display_name ?? '').toLowerCase();
    const q = search.toLowerCase();
    return email.includes(q) || name.includes(q);
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Demandes de téléchargement</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comparez les demandes avec les preuves de paiement reçues par WhatsApp
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium">
            {pendingCount} en attente
          </span>
        )}
      </div>

      {/* Lien WhatsApp */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-6 mt-4">
        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Vérifiez les paiements sur WhatsApp</p>
          <p className="text-xs text-muted-foreground">
            Les utilisateurs envoient leur reçu de virement au +212691719109
          </p>
        </div>
        <a
          href="https://wa.me/212691719109"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:bg-[#22c55e] transition-colors shrink-0"
        >
          Ouvrir WhatsApp
        </a>
      </div>

      {/* Filtres + Recherche */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou nom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-blue-500/10 text-blue-600' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {f === 'pending' && `En attente${pendingCount > 0 ? ` (${pendingCount})` : ''}`}
              {f === 'approved' && 'Approuvées'}
              {f === 'rejected' && 'Refusées'}
              {f === 'all' && 'Toutes'}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const profile = getUserProfile(req.user_id);
            const isPending = req.status === 'pending';
            const initial = (profile?.display_name || profile?.email || '?')[0].toUpperCase();

            return (
              <div
                key={req.id}
                className={`bg-card border rounded-xl overflow-hidden ${
                  isPending ? 'border-amber-500/30' : 'border-border'
                }`}
              >
                <div className="p-5">
                  {/* Ligne user + statut */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">
                          {profile?.display_name || 'Sans nom'}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">
                            {profile?.email || req.profiles?.email}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(profile?.email || '');
                              success('Email copié');
                            }}
                            className="p-0.5 hover:bg-muted rounded"
                          >
                            <Copy className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-[11px] font-medium shrink-0 ${
                      req.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                      req.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {req.status === 'pending' && 'En attente'}
                      {req.status === 'approved' && 'Approuvée'}
                      {req.status === 'rejected' && 'Refusée'}
                    </span>
                  </div>

                  {/* Détails */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 ml-[52px]">
                    <DetailItem icon={FileText} label="CV" value={req.cv_name} />
                    <DetailItem
                      icon={Calendar}
                      label="Demandé le"
                      value={new Date(req.requested_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    />
                    <DetailItem icon={CreditCard} label="Template" value={req.template_used} />
                    <DetailItem
                      icon={Download}
                      label="Downloads"
                      value={`${profile?.total_downloads || 0} total · ${profile?.downloads_remaining ?? 0} restants`}
                    />
                  </div>

                  {/* Badges historique */}
                  <div className="mt-3 ml-[52px] flex flex-wrap gap-2">
                    {profile?.created_at && (
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                        Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                      {profile?.total_cvs_created || 0} CVs créés
                    </span>
                    {profile?.has_paid && (
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-[10px] text-green-600">
                        A déjà payé
                      </span>
                    )}
                    {profile?.is_banned && (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-[10px] text-red-600">
                        Banni
                      </span>
                    )}
                  </div>

                  {/* Note admin */}
                  {req.admin_note && (
                    <div className="mt-3 ml-[52px] px-3 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground italic">
                      Note : {req.admin_note}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectTarget(req)}
                      disabled={processingId === req.id}
                      className="text-destructive hover:bg-destructive/10 gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Refuser
                    </Button>
                    <Button
                      variant="blue"
                      size="sm"
                      onClick={() => setApproveTarget(req)}
                      disabled={processingId === req.id}
                      className="gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approuver (4 PDFs)
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === 'pending' ? 'Aucune demande en attente' : 'Aucune demande trouvée'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      {approveTarget && (
        <AdminPromptModal
          open={true}
          onClose={() => setApproveTarget(null)}
          onConfirm={note => handleApprove(approveTarget, note)}
          title={`Approuver l'accès pour ${approveTarget.profiles?.display_name || approveTarget.profiles?.email || 'cet utilisateur'}`}
          description="L'utilisateur recevra 4 téléchargements PDF. Ajoutez une note optionnelle."
          placeholder="Ex : Paiement vérifié le 24/06"
          confirmLabel="Approuver (4 PDFs)"
          confirmVariant="blue"
          required={false}
        />
      )}

      {rejectTarget && (
        <AdminPromptModal
          open={true}
          onClose={() => setRejectTarget(null)}
          onConfirm={note => handleReject(rejectTarget, note)}
          title={`Refuser la demande de ${rejectTarget.profiles?.display_name || rejectTarget.profiles?.email || 'cet utilisateur'}`}
          description="L'utilisateur sera notifié du refus avec votre message."
          placeholder="Raison du refus (obligatoire)..."
          confirmLabel="Refuser"
          confirmVariant="destructive"
          required
        />
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-xs font-medium text-foreground truncate">{value}</p>
    </div>
  );
}
