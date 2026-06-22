import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdmin } from '../hooks/useAdmin';

interface AuditEntry {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  profiles: { email: string } | null;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  ban_user:                   { label: 'Bannissement',      color: 'text-red-600 bg-red-500/10' },
  unban_user:                 { label: 'Débannissement',    color: 'text-green-600 bg-green-500/10' },
  grant_download:             { label: 'Accès PDF accordé', color: 'text-blue-600 bg-blue-500/10' },
  revoke_download:            { label: 'Accès PDF révoqué', color: 'text-amber-600 bg-amber-500/10' },
  approve_download_request:   { label: 'Demande approuvée', color: 'text-green-600 bg-green-500/10' },
  reject_download_request:    { label: 'Demande refusée',   color: 'text-red-600 bg-red-500/10' },
};

export default function AdminAuditLog() {
  const { getAuditLog } = useAdmin();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLog(100).then(data => setLogs(data as AuditEntry[])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Journal d'audit</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Historique de toutes les actions administratives
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Chargement...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aucune action enregistrée
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map(log => {
              const action = actionLabels[log.action] ?? {
                label: log.action,
                color: 'text-muted-foreground bg-muted',
              };
              return (
                <div key={log.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', action.color)}>
                      {action.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-sm text-muted-foreground">
                    {log.target_user_id && (
                      <span className="font-mono text-xs">
                        User&nbsp;{log.target_user_id.slice(0, 8)}…
                      </span>
                    )}
                    {log.details && (
                      <span className="ml-2 text-xs opacity-70">
                        {JSON.stringify(log.details).slice(0, 100)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
