import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { CVSettings } from '../types/cv';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

interface LanguageSwitcherProps {
  settings?: CVSettings;
  setSettings?: (settings: CVSettings) => void;
}

export function LanguageSwitcher({ settings, setSettings }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  // Utiliser resolvedLanguage pour avoir la langue normalisée (en au lieu de en-US)
  const currentLangCode = i18n.resolvedLanguage || i18n.language || 'fr';
  const currentLanguage = languages.find((lang) => currentLangCode.startsWith(lang.code)) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    // Mettre à jour les settings si disponibles
    if (settings && setSettings) {
      setSettings({ ...settings, language: code });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline text-sm">{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="gap-2 cursor-pointer"
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
            {currentLangCode.startsWith(lang.code) && (
              <span className="ml-auto text-xs text-blue-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
