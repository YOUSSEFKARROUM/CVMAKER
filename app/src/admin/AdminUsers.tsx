import { useEffect, useState } from 'react';
import { Search, Download, CheckCircle, Ban, MoreHorizontal, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdmin } from '../hooks/useAdmin';
import AdminPromptModal from './AdminPromptModal';

type FilterType = 'all' | 'active' | 'banned' | 'pdf-access';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  is_banned: boolean;
  ban_reason: string | null;
  can_download_pdf: boolean;
  total_cvs_created: number;
  total_downloads: number;
  created_at: string;
}

export default function AdminUsers() {
  const { getAllUsers, banUser, unbanUser, toggleDownloadAccess } = useAdmin();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [banTarget, setBanTarget] = useState<Profile | null>(null);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data as Profile[]);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleDownload(user: Profile) {
    setActionLoading(user.id);
    try {
      await toggleDownloadAccess(user.id, !user.can_download_pdf);
      await loadUsers();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBanConfirm(reason: string) {
    if (!banTarget) return;
    setActionLoading(banTarget.id);
    try {
      await banUser(banTarget.id, reason);
      await loadUsers();
    } finally {
      setActionLoading(null);
      setBanTarget(null);
    }
  }

  async function handleUnban(user: Profile) {
    setActionLoading(user.id);
    try {
      await unbanUser(user.id);
      await loadUsers();
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.email.toLowerCase().includes(q) ||
                        (u.display_name?.toLowerCase() ?? '').includes(q);
    if (!matchSearch) return false;
    if (filter === 'banned') return u.is_banned;
    if (filter === 'active') return !u.is_banned;
    if (filter === 'pdf-access') return u.can_download_pdf;
    return true;
  });

  const filterLabels: Record<FilterType, string> = {
    all: 'Tous',
    active: 'Actifs',
    banned: 'Bannis',
    'pdf-access': 'Accès PDF',
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Utilisateurs</h1>
      <p className="text-sm text-muted-foreground mb-6">{users.length} utilisateurs inscrits</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou nom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(Object.keys(filterLabels) as FilterType[]).map(f => (
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
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Chargement...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Utilisateur</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Inscrit le</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">CVs</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">PDF</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Statut</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                        {(u.display_name?.[0] ?? u.email[0]).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {u.display_name ?? 'Sans nom'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-center text-sm hidden md:table-cell">
                    {u.total_cvs_created}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleDownload(u)}
                      disabled={actionLoading === u.id || u.role === 'admin'}
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                        u.can_download_pdf
                          ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80',
                        (u.role === 'admin') && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {u.can_download_pdf ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {u.can_download_pdf ? 'Actif' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      u.is_banned
                        ? 'bg-red-500/10 text-red-600'
                        : u.role === 'admin'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-green-500/10 text-green-600'
                    )}>
                      {u.is_banned ? 'Banni' : u.role === 'admin' ? 'Admin' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={actionLoading === u.id}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleDownload(u)}
                            className="gap-2 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            {u.can_download_pdf ? 'Révoquer accès PDF' : 'Accorder accès PDF'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {u.is_banned ? (
                            <DropdownMenuItem
                              onClick={() => handleUnban(u)}
                              className="gap-2 cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Débannir
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setBanTarget(u)}
                              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Ban className="w-4 h-4" />
                              Bannir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      <AdminPromptModal
        open={banTarget !== null}
        onClose={() => setBanTarget(null)}
        onConfirm={handleBanConfirm}
        title="Bannir l'utilisateur"
        description="Cette action empêchera l'utilisateur de se connecter."
        placeholder="Raison du bannissement..."
        confirmLabel="Bannir"
        confirmVariant="destructive"
        required
      />
    </div>
  );
}
