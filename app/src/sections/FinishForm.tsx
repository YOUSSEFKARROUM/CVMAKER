import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, LayoutGrid, User, Check, RotateCcw, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhotoUpload } from '../components/PhotoUpload';
import type { CVData, CVSettings, ContactInfo } from '../types/cv';

interface FinishFormProps {
  cvData: CVData;
  settings: CVSettings;
  setSettings: (settings: CVSettings) => void;
  updateContact: (field: keyof ContactInfo, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  onExport: () => void;
}

const templates = [
  { id: 'budapest', name: 'Budapest', description: 'Sidebar colorée à gauche', badge: 'Recommandé' },
  { id: 'chicago', name: 'Chicago', description: 'Header centré classique', badge: 'Recommandé' },
  { id: 'brunei', name: 'Brunei', description: 'Minimaliste élégant' },
  { id: 'vladivostok', name: 'Vladivostok', description: 'Moderne sidebar droite' },
  { id: 'sydney', name: 'Sydney', description: 'Épuré avec timeline', badge: 'Nouveau' },
  { id: 'shanghai', name: 'Shanghai', description: 'Professionnel corporate' },
  { id: 'kiev', name: 'Kiev', description: 'Créatif avec grande photo' },
  { id: 'rotterdam', name: 'Rotterdam', description: 'Technique compétences visibles' },
  { id: 'tokyo', name: 'Tokyo', description: 'Compact 2 colonnes' },
  { id: 'stanford', name: 'Stanford', description: 'Sidebar foncée élégante', badge: 'Nouveau' },
  { id: 'cambridge', name: 'Cambridge', description: 'Header bleu classique', badge: 'Nouveau' },
  { id: 'oxford', name: 'Oxford', description: 'Sidebar droite structurée', badge: 'Nouveau' },
  { id: 'otago', name: 'Otago', description: 'Minimaliste professionnel', badge: 'Nouveau' },
  { id: 'berkeley', name: 'Berkeley', description: 'Design avec icônes', badge: 'Nouveau' },
  { id: 'harvard', name: 'Harvard', description: 'Sidebar bleue avec timeline', badge: 'Nouveau' },
  { id: 'auckland', name: 'Auckland', description: '2 colonnes équilibrées', badge: 'Nouveau' },
  { id: 'edinburgh', name: 'Edinburgh', description: 'Header violet moderne', badge: 'Nouveau' },
  { id: 'princeton', name: 'Princeton', description: 'Classique centré', badge: 'Nouveau' },
];

const titleFonts = [
  'Bebas Neue', 'Roboto', 'Arial', 'Roboto Mono', 'Bebas Kai',
  'Source Sans Pro', 'Ubuntu', 'Open Sans', 'Cabin',
];

const bodyFonts = [
  'Lato', 'Open Sans', 'Playfair Display', 'Arial', 'Roboto',
  'Roboto Mono', 'Source Sans Pro', 'Butler',
];

// Template Preview Component
function TemplatePreview({ templateId }: { templateId: string }) {
  const previews: Record<string, JSX.Element> = {
    budapest: (
      <div className="h-full flex">
        <div className="w-1/3 bg-emerald-500 p-2">
          <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2" />
          <div className="h-1 bg-white/50 rounded w-full mb-1" />
          <div className="h-1 bg-white/50 rounded w-2/3" />
        </div>
        <div className="flex-1 p-2 bg-white">
          <div className="h-2 bg-gray-800 rounded w-3/4 mb-1" />
          <div className="h-1 bg-gray-400 rounded w-1/2" />
        </div>
      </div>
    ),
    chicago: (
      <div className="h-full bg-white p-2 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500 mb-2" />
        <div className="h-2 bg-gray-800 rounded w-2/3 mb-1" />
        <div className="h-1 bg-gray-400 rounded w-1/3" />
      </div>
    ),
    brunei: (
      <div className="h-full bg-white p-2">
        <div className="flex gap-2 mb-2">
          <div className="h-2 bg-gray-800 rounded w-1/3" />
          <div className="h-2 bg-gray-400 rounded w-1/4" />
        </div>
        <div className="h-1 bg-gray-300 rounded w-full" />
      </div>
    ),
    vladivostok: (
      <div className="h-full flex">
        <div className="flex-1 p-2 bg-white">
          <div className="h-2 bg-gray-800 rounded w-3/4" />
        </div>
        <div className="w-1/3 bg-rose-500 p-2">
          <div className="h-1 bg-white/50 rounded w-full" />
        </div>
      </div>
    ),
    sydney: (
      <div className="h-full bg-white p-2 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-300 mb-2" />
        <div className="h-2 bg-gray-800 rounded w-1/2 mb-2" />
        <div className="w-full border-l-2 border-indigo-500 pl-2">
          <div className="h-1 bg-gray-400 rounded w-full" />
        </div>
      </div>
    ),
    shanghai: (
      <div className="h-full">
        <div className="h-1/3 bg-blue-600 p-2">
          <div className="h-2 bg-white rounded w-1/2" />
        </div>
        <div className="h-2/3 p-2 bg-white">
          <div className="h-1 bg-gray-300 rounded w-full" />
        </div>
      </div>
    ),
    kiev: (
      <div className="h-full flex">
        <div className="w-1/3 bg-purple-600 p-2">
          <div className="w-full aspect-[3/4] bg-white/20 mb-2" />
          <div className="h-2 bg-white rounded w-3/4" />
        </div>
        <div className="flex-1 p-2 bg-white">
          <div className="h-1 bg-gray-300 rounded w-full" />
        </div>
      </div>
    ),
    rotterdam: (
      <div className="h-full bg-white p-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-3 bg-gray-800 rounded w-1/3" />
          <div className="w-8 h-8 bg-gray-300" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="h-1 bg-gray-400 rounded" />
          <div className="h-1 bg-gray-400 rounded" />
          <div className="h-1 bg-gray-400 rounded" />
        </div>
      </div>
    ),
    tokyo: (
      <div className="h-full bg-white p-2">
        <div className="flex gap-2 mb-2">
          <div className="w-6 h-6 bg-gray-300" />
          <div className="h-2 bg-gray-800 rounded w-1/3" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-300 rounded" />
        </div>
      </div>
    ),
    stanford: (
      <div className="h-full flex">
        <div className="w-1/3 bg-slate-700 p-2">
          <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2" />
          <div className="h-1 bg-white/50 rounded w-full" />
          <div className="mt-2 h-1 bg-white/30 rounded-full w-full" />
        </div>
        <div className="flex-1 p-2 bg-white">
          <div className="h-2 bg-gray-800 rounded w-2/3 mb-1" />
          <div className="h-1 bg-gray-400 rounded w-full" />
        </div>
      </div>
    ),
    cambridge: (
      <div className="h-full">
        <div className="h-1/4 bg-blue-700 p-2 flex items-center justify-center">
          <div className="h-2 bg-white rounded w-1/2" />
        </div>
        <div className="h-3/4 p-2 bg-white">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-1 bg-gray-300 rounded" />
            <div className="h-1 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    ),
    oxford: (
      <div className="h-full flex">
        <div className="flex-1 p-2 bg-white border-r border-gray-200">
          <div className="h-2 bg-gray-800 rounded w-1/2 mb-1" />
          <div className="border-l-2 border-gray-300 pl-2">
            <div className="h-1 bg-gray-400 rounded w-full" />
          </div>
        </div>
        <div className="w-1/3 p-2 bg-gray-50">
          <div className="h-1 bg-gray-500 rounded w-full" />
        </div>
      </div>
    ),
    otago: (
      <div className="h-full bg-white p-2">
        <div className="flex justify-between items-center border-b-2 border-gray-800 pb-1 mb-2">
          <div className="h-2 bg-gray-800 rounded w-1/3" />
          <div className="w-4 h-4 bg-gray-400" />
        </div>
        <div className="grid grid-cols-4 gap-1">
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-300 rounded" />
        </div>
      </div>
    ),
    berkeley: (
      <div className="h-full bg-white p-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500" />
          <div className="h-2 bg-gray-800 rounded w-1/3" />
        </div>
        <div className="bg-gray-100 p-1 rounded">
          <div className="h-1 bg-gray-500 rounded w-1/4" />
        </div>
      </div>
    ),
    harvard: (
      <div className="h-full flex">
        <div className="w-1/3 bg-blue-600 p-2">
          <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2" />
          <div className="h-1 bg-white/50 rounded w-full" />
          <div className="mt-1 h-1 bg-white/50 rounded-full w-3/4" />
        </div>
        <div className="flex-1 p-2 bg-white">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-blue-500" />
            <div className="h-1 bg-gray-300 rounded w-full" />
          </div>
        </div>
      </div>
    ),
    auckland: (
      <div className="h-full bg-white p-2">
        <div className="border-2 border-gray-800 p-1 mb-2 text-center">
          <div className="h-2 bg-gray-800 rounded w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-300 rounded" />
        </div>
      </div>
    ),
    edinburgh: (
      <div className="h-full">
        <div className="h-1/4 bg-indigo-800 p-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/30" />
          <div className="h-2 bg-white rounded w-1/3" />
        </div>
        <div className="h-3/4 flex">
          <div className="w-1/3 bg-gray-100 p-2">
            <div className="h-1 bg-gray-500 rounded w-full" />
          </div>
          <div className="flex-1 p-2 bg-white">
            <div className="h-1 bg-gray-300 rounded w-full" />
          </div>
        </div>
      </div>
    ),
    princeton: (
      <div className="h-full bg-white p-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-gray-300" />
          <div className="h-2 bg-gray-800 rounded w-1/3" />
        </div>
        <div className="border-l-2 border-gray-300 pl-2">
          <div className="h-1 bg-gray-400 rounded w-full" />
        </div>
      </div>
    ),
  };

  return previews[templateId] || <div className="h-full bg-gray-200" />;
}

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ru', name: 'Русский' },
];

const colors = [
  '#1a1a1a', '#2c3e50', '#6b2c91', '#1e3a8a', '#4CAF50', '#c62828',
];

export function FinishForm({
  cvData,
  settings,
  setSettings,
  updateContact,
  onNext,
  onBack,
  onReset,
  onExport,
}: FinishFormProps) {
  const { t } = useTranslation();
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showTitleFontDropdown, setShowTitleFontDropdown] = useState(false);
  const [showBodyFontDropdown, setShowBodyFontDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('finishForm.title')}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-gray-600"
          >
            <FileJson className="w-4 h-4 mr-2" />
            {t('finishForm.export')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-red-600 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('finishForm.reset')}
          </Button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <p className="text-green-800 text-sm">
          {t('finishForm.optimizeText')}
        </p>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          {t('finishForm.optimize')}
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="w-5 h-5 text-[#2196F3]" />
          <h3 className="text-lg font-semibold">{t('finishForm.layoutTitle')}</h3>
        </div>

        {/* Template Grid */}
        <div className="mb-6">
          <Label className="text-xs uppercase text-gray-500 mb-3 block">{t('finishForm.template')}</Label>
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSettings({ ...settings, template: template.id })}
                className={`relative p-3 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  settings.template === template.id 
                    ? 'border-[#2196F3] bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Template Preview Thumbnail */}
                <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 overflow-hidden">
                  <TemplatePreview templateId={template.id} />
                </div>
                
                {/* Template Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-gray-900">{template.name}</p>
                      {template.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          template.badge === 'Recommandé' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {template.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </div>
                  {settings.template === template.id && (
                    <div className="w-6 h-6 rounded-full bg-[#2196F3] flex items-center justify-center flex-shrink-0 ml-2">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div className="mb-6">
          <Label className="text-xs uppercase text-gray-500 mb-3 block">{t('finishForm.primaryColor')}</Label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSettings({ ...settings, primaryColor: color })}
                className={`w-10 h-10 rounded-full transition-all ${settings.primaryColor === color ? 'ring-2 ring-offset-2 ring-[#2196F3] scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: color }}
              >
                {settings.primaryColor === color && (
                  <Check className="w-5 h-5 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.titleFont')}</Label>
            <button
              onClick={() => setShowTitleFontDropdown(!showTitleFontDropdown)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-left flex items-center justify-between bg-white"
            >
              <span>{settings.titleFont}</span>
              <span className="text-[#2196F3]">▼</span>
            </button>
            {showTitleFontDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                {titleFonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      setSettings({ ...settings, titleFont: font });
                      setShowTitleFontDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.bodyFont')}</Label>
            <button
              onClick={() => setShowBodyFontDropdown(!showBodyFontDropdown)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-left flex items-center justify-between bg-white"
            >
              <span>{settings.bodyFont}</span>
              <span className="text-[#2196F3]">▼</span>
            </button>
            {showBodyFontDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                {bodyFonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      setSettings({ ...settings, bodyFont: font });
                      setShowBodyFontDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <Label className="text-xs uppercase text-gray-500">{t('finishForm.cvLanguage')}</Label>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-left flex items-center justify-between bg-white"
          >
            <span>{languages.find(l => l.code === settings.language)?.name || 'Français'}</span>
            <span className="text-[#2196F3]">▼</span>
          </button>
          {showLanguageDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSettings({ ...settings, language: lang.code });
                    setShowLanguageDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#2196F3]" />
          <h3 className="text-lg font-semibold">{t('finishForm.personalData')}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.jobTitle')}</Label>
            <Input
              value={cvData.contact.jobTitle || ''}
              onChange={(e) => updateContact('jobTitle', e.target.value)}
              placeholder={t('finishForm.jobTitlePlaceholder')}
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <PhotoUpload
              photo={cvData.contact.photo}
              onPhotoChange={(photo) => updateContact('photo', photo || '')}
              firstName={cvData.contact.firstName}
              lastName={cvData.contact.lastName}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.firstName')}</Label>
            <Input
              value={cvData.contact.firstName}
              onChange={(e) => updateContact('firstName', e.target.value)}
              className="mt-1"
            />
            {cvData.contact.firstName && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.lastName')}</Label>
            <Input
              value={cvData.contact.lastName}
              onChange={(e) => updateContact('lastName', e.target.value)}
              className="mt-1"
            />
            {cvData.contact.lastName && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.email')}</Label>
            <Input
              value={cvData.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="mt-1"
            />
            {cvData.contact.email && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">{t('finishForm.phone')}</Label>
            <Input
              value={cvData.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="mt-1"
            />
            {cvData.contact.phone && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Label className="text-xs uppercase text-gray-500">{t('finishForm.address')}</Label>
          <Input
            value={cvData.contact.address || ''}
            onChange={(e) => updateContact('address', e.target.value)}
            placeholder={t('finishForm.addressPlaceholder')}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('nav.back')}
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {t('finishForm.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

