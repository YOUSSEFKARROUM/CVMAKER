import { useEffect, useState } from 'react';
import { Users, FileText, Download, Clock, TrendingUp, CheckCircle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '../hooks/useAdmin';

interface Stats {
  total: number;
  banned: number;
  withAccess: number;
  totalCVs: number;
  totalDownloads: number;
  pending: number;
  newThisWeek: number;
}

interface StatCardProps {
  label: string;
  value: number;
  Icon: React.ElementType;
  highlight?: boolean;
}

function StatCard({ label, value, Icon, highlight }: StatCardProps) {
  return (
    <div className={cn(
      'bg-card border rounded-xl p-5',
      highlight ? 'border-blue-500/50 bg-blue-500/5' : 'border-border'
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={cn('w-4 h-4', highlight ? 'text-blue-500' : 'text-muted-foreground')} />
      </div>
      <span className={cn('text-2xl font-semibold', highlight ? 'text-blue-600' : 'text-foreground')}>
        {value.toLocaleString('fr-FR')}
      </span>
    </div>
  );
}

interface AdminOverviewProps {
  onTabChange: (tab: string) => void;
}

export default function AdminOverview({ onTabChange }: AdminOverviewProps) {
  const { getDashboardStats } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-8">Vue d'ensemble</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Utilisateurs" value={stats.total} Icon={Users} />
        <StatCard label="CVs créés" value={stats.totalCVs} Icon={FileText} />
        <StatCard label="Téléchargements" value={stats.totalDownloads} Icon={Download} />
        <StatCard label="Demandes en attente" value={stats.pending} Icon={Clock} highlight={stats.pending > 0} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Nouveaux cette semaine" value={stats.newThisWeek} Icon={TrendingUp} />
        <StatCard label="Accès PDF actifs" value={stats.withAccess} Icon={CheckCircle} />
        <StatCard label="Utilisateurs bannis" value={stats.banned} Icon={Ban} />
      </div>

      {stats.pending > 0 && (
        <div className="bg-card border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-medium text-foreground">Demandes en attente</h2>
            <button
              onClick={() => onTabChange('requests')}
              className="text-xs text-blue-600 hover:underline"
            >
              Voir tout →
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.pending} demande{stats.pending > 1 ? 's' : ''} de téléchargement PDF
            {stats.pending > 1 ? ' attendent' : ' attend'} votre validation.
          </p>
        </div>
      )}
    </div>
  );
}
