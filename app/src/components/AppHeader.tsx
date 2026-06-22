import { useTranslation } from 'react-i18next';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, CreditCard, Shield, ChevronDown, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import type { Step } from '@/types/cv';

interface AppHeaderProps {
  onNavigate: (step: Step) => void;
  currentStep: Step;
}

export default function AppHeader({ onNavigate, currentStep }: AppHeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAdmin();

  if (!isAuthenticated) return null;

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Gauche : Logo + nav */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('my-cvs')}
          className="flex items-center gap-2 font-bold text-foreground hover:opacity-80 transition-opacity"
        >
          <span className="text-blue-500 text-lg">◈</span>
          <span className="text-sm font-semibold hidden sm:inline">CV Maker</span>
        </button>

        {(currentStep === 'my-cvs' || currentStep === 'profile-page' || currentStep === 'settings-page') && (
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink active={currentStep === 'my-cvs'} onClick={() => onNavigate('my-cvs')}>
              {t('nav.myCVs', 'Mes CVs')}
            </NavLink>
            <NavLink active={currentStep === 'profile-page'} onClick={() => onNavigate('profile-page')}>
              {t('nav.profile', 'Mon profil')}
            </NavLink>
          </nav>
        )}
      </div>

      {/* Droite : User menu */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground leading-tight">
                  {user?.displayName || t('user.anonymous', 'Utilisateur')}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">{user?.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            {/* En-tête du menu */}
            <div className="px-3 py-2.5">
              <div className="text-sm font-medium text-foreground">
                {user?.displayName || user?.email?.split('@')[0]}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{user?.email}</div>
              <div className="mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                  Plan gratuit
                </span>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onNavigate('profile-page')}>
              <User className="w-4 h-4 mr-2" />
              {t('menu.profile', 'Mon profil')}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onNavigate('settings-page')}>
              <Settings className="w-4 h-4 mr-2" />
              {t('menu.settings', 'Paramètres')}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onNavigate('my-cvs')}>
              <CreditCard className="w-4 h-4 mr-2" />
              {t('menu.plan', 'Mon plan')}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Thème */}
            <div className="px-2 py-1.5">
              <div className="text-xs text-muted-foreground mb-1.5 px-1">{t('menu.theme', 'Thème')}</div>
              <div className="flex gap-1">
                <ThemeButton icon={Sun} label="Clair" value="light" />
                <ThemeButton icon={Moon} label="Sombre" value="dark" />
                <ThemeButton icon={Monitor} label="Auto" value="system" />
              </div>
            </div>

            {/* Langue */}
            <div className="px-2 py-1.5">
              <div className="text-xs text-muted-foreground mb-1.5 px-1">{t('menu.language', 'Langue')}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => i18n.changeLanguage('fr')}
                  className={cn(
                    'flex-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                    i18n.language === 'fr'
                      ? 'bg-blue-500/10 text-blue-600'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={cn(
                    'flex-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                    i18n.language === 'en'
                      ? 'bg-blue-500/10 text-blue-600'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <DropdownMenuSeparator />

            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={() => onNavigate('admin')}
                  className="text-red-600 focus:text-red-600"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t('menu.admin', 'Dashboard Admin')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              onClick={async () => {
                await logout();
                onNavigate('landing');
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('menu.logout', 'Se déconnecter')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function NavLink({ children, active, onClick }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm transition-colors',
        active
          ? 'bg-muted font-medium text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {children}
    </button>
  );
}

function ThemeButton({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
      className={cn(
        'flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs transition-colors',
        theme === value
          ? 'bg-blue-500/10 text-blue-600 font-medium'
          : 'text-muted-foreground hover:bg-muted'
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}
