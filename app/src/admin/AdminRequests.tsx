import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../hooks/useAdmin';
import { toast } from 'sonner';

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all';

interface DownloadRequest {
  id: string;
  user_id: string;
  cv_name: string;
  template_used: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  requested_at: string;
  reviewed_at: string | null;
  profiles: { email: string; display_name: string | null } | null;
}

const filterLabels: Record<StatusFilter, string> = {
  pending: '⏳ En attente',
  approved: '✅ Approuvées',
  rejected: '❌ Refusées',
  all: 'Toutes',
};

const statusStyle: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  approved: 'bg-green-500/10 text-green-600',
  rejected: 'bg-red-500/10 text-red-600',
};

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Refusée',
};

export default function AdminRequests() {
  const { getDownloadRequests, approveRequest, rejectRequest } = useAdmin();
  const [requests, setRequests] = useState<DownloadRequest[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => { loadRequests(); }, [filter]);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await getDownloadRequests(filter === 'all' ? undefined : filter);
      setRequests(data as DownloadRequest[]);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(req: DownloadRequest) {
    setProcessingId(req.id);
    const note = window.prompt('Note pour l\'utilisateur (optionnel) :') ?? undefined;
    try {
      await approveRequest(req.id, req.user_id, note);
      await loadRequests();
      toast.success(`Demande approuvée pour ${req.profiles?.email ?? req.user_id}`);
    } catch {
      toast.error('Erreur lors de l\'approbation');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(req: DownloadRequest) {
    const note = window.prompt('Raison du refus :');
    if (!note) return;
    setProcessingId(req.id);
    try {
      await rejectRequest(req.id, req.user_id, note);
      await loadRequests();
      toast.success('Demande refusée');
    } catch {
      toast.error('Erreur lors du refus');
    } finally {
      setProcessingId(null);
    }
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Demandes de téléchargement</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Validez ou refusez les demandes d'accès PDF
          </p>
        </div>
        {pendingCount > 0 && filter !== 'pending' && (
          <button
            onClick={() => setFilter('pending')}
            className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium"
          >
            {pendingCount} en attente
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-6">
        {(Object.keys(filterLabels) as StatusFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filter === f
                ? 'bg-blue-500/10 text-blue-600'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <div
              key={req.id}
              className={cn(
                'bg-card border rounded-xl p-5 flex items-center justify-between gap-4',
                req.status === 'pending' ? 'border-blue-500/30' : 'border-border'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {req.profiles?.display_name ?? req.profiles?.email ?? req.user_id.slice(0, 8)}
                  </span>
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', statusStyle[req.status])}>
                    {statusLabel[req.status]}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  CV&nbsp;: {req.cv_name} · Template&nbsp;: {req.template_used} ·{' '}
                  {new Date(req.requested_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
                {req.admin_note && (
                  <div className="text-xs text-muted-foreground mt-1 italic">
                    Note&nbsp;: {req.admin_note}
                  </div>
                )}
              </div>

              {req.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(req)}
                    disabled={processingId === req.id}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Refuser
                  </Button>
                  <Button
                    variant="blue"
                    size="sm"
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id}
                  >
                    Approuver
                  </Button>
                </div>
              )}
            </div>
          ))}

          {requests.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {filter === 'pending' ? 'Aucune demande en attente' : 'Aucune demande trouvée'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
