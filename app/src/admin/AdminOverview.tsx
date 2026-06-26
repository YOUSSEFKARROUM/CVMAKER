import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  FileText,
  Download,
  Clock,
  TrendingUp,
  CheckCircle,
  Ban,
  ArrowRight,
  Activity,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
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
  tone: 'blue' | 'emerald' | 'amber' | 'red' | 'slate';
  description?: string;
  highlight?: boolean;
}

const toneStyles = {
  blue: {
    icon: 'bg-blue-50 text-blue-600 ring-blue-100',
    accent: 'bg-blue-500',
    value: 'text-blue-700',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    accent: 'bg-emerald-500',
    value: 'text-emerald-700',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 ring-amber-100',
    accent: 'bg-amber-500',
    value: 'text-amber-700',
  },
  red: {
    icon: 'bg-red-50 text-red-600 ring-red-100',
    accent: 'bg-red-500',
    value: 'text-red-700',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-600 ring-slate-200',
    accent: 'bg-slate-400',
    value: 'text-slate-950',
  },
};

function StatCard({ label, value, Icon, tone, description, highlight }: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-white p-5 shadow-sm transition-colors',
        highlight ? 'border-amber-300 ring-4 ring-amber-100/70' : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1', styles.accent)} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={cn('mt-4 text-3xl font-semibold tracking-tight', highlight ? styles.value : 'text-slate-950')}>
            {value.toLocaleString('fr-FR')}
          </p>
        </div>
        <div className={cn('rounded-lg p-2 ring-1', styles.icon)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
      )}
    </div>
  );
}

function SkeletonOverview() {
  return (
    <div className="space-y-6">
      <div className="h-24 rounded-lg bg-white border border-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-lg bg-white border border-slate-200 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-white border border-slate-200 animate-pulse" />
        ))}
      </div>
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
  }, [getDashboardStats]);

  const derived = useMemo(() => {
    if (!stats) {
      return { cvPerUser: 0, downloadPerUser: 0, accessRate: 0 };
    }

    return {
      cvPerUser: stats.total > 0 ? stats.totalCVs / stats.total : 0,
      downloadPerUser: stats.total > 0 ? stats.totalDownloads / stats.total : 0,
      accessRate: stats.total > 0 ? (stats.withAccess / stats.total) * 100 : 0,
    };
  }, [stats]);

  if (loading) return <SkeletonOverview />;
  if (!stats) return null;

  const primaryStats = [
    {
      label: 'Utilisateurs',
      value: stats.total,
      Icon: Users,
      tone: 'blue' as const,
      description: `${stats.newThisWeek.toLocaleString('fr-FR')} nouveau${stats.newThisWeek > 1 ? 'x' : ''} cette semaine`,
    },
    {
      label: 'CVs créés',
      value: stats.totalCVs,
      Icon: FileText,
      tone: 'slate' as const,
      description: `${derived.cvPerUser.toFixed(1)} CV par utilisateur en moyenne`,
    },
    {
      label: 'Téléchargements',
      value: stats.totalDownloads,
      Icon: Download,
      tone: 'emerald' as const,
      description: `${derived.downloadPerUser.toFixed(1)} téléchargement par utilisateur`,
    },
    {
      label: 'Demandes en attente',
      value: stats.pending,
      Icon: Clock,
      tone: stats.pending > 0 ? ('amber' as const) : ('slate' as const),
      description: stats.pending > 0 ? 'Validation admin requise' : 'File de validation vide',
      highlight: stats.pending > 0,
    },
  ];

  const secondaryStats = [
    { label: 'Nouveaux cette semaine', value: stats.newThisWeek, Icon: TrendingUp, tone: 'blue' as const },
    { label: 'Accès PDF actifs', value: stats.withAccess, Icon: CheckCircle, tone: 'emerald' as const },
    { label: 'Utilisateurs bannis', value: stats.banned, Icon: Ban, tone: stats.banned > 0 ? ('red' as const) : ('slate' as const) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Vue opérationnelle
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Vue d'ensemble</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Suivez les inscriptions, les créations de CV et les demandes PDF sans changer de flux de travail.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onTabChange('requests')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
            stats.pending > 0
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          )}
        >
          Traiter les demandes
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className={cn(
              'mt-0.5 rounded-lg p-2 ring-1',
              stats.pending > 0
                ? 'bg-amber-50 text-amber-600 ring-amber-100'
                : 'bg-emerald-50 text-emerald-600 ring-emerald-100'
            )}>
              {stats.pending > 0 ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                {stats.pending > 0 ? 'Action requise' : 'Opérations à jour'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {stats.pending > 0
                  ? `${stats.pending} demande${stats.pending > 1 ? 's' : ''} PDF ${stats.pending > 1 ? 'attendent' : 'attend'} une validation.`
                  : 'Aucune demande PDF en attente pour le moment.'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center lg:min-w-[360px]">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-lg font-semibold text-slate-950">{derived.accessRate.toFixed(0)}%</p>
              <p className="text-[11px] text-slate-500">Accès PDF</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-lg font-semibold text-slate-950">{stats.totalCVs}</p>
              <p className="text-[11px] text-slate-500">CVs</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-lg font-semibold text-slate-950">{stats.totalDownloads}</p>
              <p className="text-[11px] text-slate-500">PDFs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {primaryStats.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {secondaryStats.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
