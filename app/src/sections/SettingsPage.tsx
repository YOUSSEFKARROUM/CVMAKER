import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Sun, Moon, Monitor, Globe, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground mb-8">
        {t('settings.title', 'Paramètres')}
      </h1>

      {/* Apparence */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-muted-foreground" />
          {t('settings.appearance', 'Apparence')}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'light', label: t('settings.light', 'Clair'), icon: Sun },
            { value: 'dark', label: t('settings.dark', 'Sombre'), icon: Moon },
            { value: 'system', label: t('settings.system', 'Système'), icon: Monitor },
          ] as const).map(opt => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors',
                theme === opt.value
                  ? 'border-blue bg-blue/5'
                  : 'border-border hover:border-blue/30'
              )}
            >
              <opt.icon className={cn(
                'w-5 h-5',
                theme === opt.value ? 'text-blue' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-sm',
                theme === opt.value ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Langue */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          {t('settings.language', 'Langue')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { code: 'fr', label: 'Français', flag: '🇫🇷' },
            { code: 'en', label: 'English', flag: '🇬🇧' },
          ].map(lang => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border transition-colors',
                i18n.language === lang.code
                  ? 'border-blue bg-blue/5'
                  : 'border-border hover:border-blue/30'
              )}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className={cn(
                'text-sm',
                i18n.language === lang.code ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {t('settings.notifications', 'Notifications')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('settings.notifDesc', 'Les notifications par email seront disponibles prochainement.')}
        </p>
      </div>

      {/* Raccourcis clavier */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          {t('settings.shortcuts', 'Raccourcis clavier')}
        </h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Annuler', key: 'Ctrl+Z' },
            { label: 'Rétablir', key: 'Ctrl+Y' },
            { label: 'Sauvegarder', key: 'Ctrl+S' },
          ].map(({ label, key }) => (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground">{label}</span>
              <kbd className="px-2 py-0.5 rounded bg-muted text-xs font-mono">{key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
