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
  { id: 'overview',  label: "Vue d'ensemble",     Icon: LayoutDashboard },
  { id: 'users',     label: 'Utilisateurs',        Icon: Users },
  { id: 'requests',  label: 'Demandes PDF',        Icon: FileCheck },
  { id: 'audit',     label: "Journal d'audit",     Icon: ScrollText },
];

export default function AdminLayout({ children, activeTab, onTabChange, onBack }: AdminLayoutProps) {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30 fixed inset-0 z-50 overflow-auto">
      {/* Header */}
      <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">CV Maker — Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'app
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border bg-background min-h-[calc(100vh-64px)] p-4 sticky top-16 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  activeTab === id
                    ? 'bg-blue-500/10 text-blue-600 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
