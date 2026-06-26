import type { ReactNode } from 'react';
import { LayoutDashboard, Users, FileCheck, ScrollText, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
}

const tabs = [
  { id: 'overview', label: "Vue d'ensemble", Icon: LayoutDashboard },
  { id: 'users', label: 'Utilisateurs', Icon: Users },
  { id: 'requests', label: 'Demandes PDF', Icon: FileCheck },
  { id: 'audit', label: "Journal d'audit", Icon: ScrollText },
];

export default function AdminLayout({ children, activeTab, onTabChange, onBack }: AdminLayoutProps) {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const activeLabel = tabs.find(tab => tab.id === activeTab)?.label ?? 'Administration';

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 fixed inset-0 z-50 overflow-auto text-slate-950">
      <header className="h-[72px] bg-white/95 border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shadow-sm shadow-red-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-950 tracking-tight">CV Maker</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-sm font-medium text-red-600">Admin</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{activeLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden md:flex flex-col items-end min-w-0">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">Connecté</span>
            <span className="text-sm text-slate-600 truncate max-w-[280px]">{user?.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2 bg-white border-slate-200 hover:bg-slate-100">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'app
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-72px)] p-4 sticky top-[72px] shrink-0">
          <div className="mb-5 px-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Navigation</p>
          </div>
          <nav className="space-y-1">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                  activeTab === id
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-[inset_3px_0_0_rgb(37_99_235)]'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              Accès administrateur
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Gérez les utilisateurs, les demandes PDF et les actions sensibles.
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
