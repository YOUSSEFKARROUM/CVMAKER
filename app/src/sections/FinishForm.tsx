import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, LayoutGrid, User, Check, RotateCcw, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhotoUpload } from '../components/PhotoUpload';
import type { CVData, CVSettings, ContactInfo } from '../types/cv';
import { SortableList } from '../components/SortableList';
import { DEFAULT_SECTION_ORDER, type LayoutSectionId } from '../components/templates/utils';

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

const titleFonts = [
  'Bebas Neue', 'Roboto', 'Arial', 'Roboto Mono', 'Bebas Kai',
  'Source Sans Pro', 'Ubuntu', 'Open Sans', 'Cabin',
];

const bodyFonts = [
  'Lato', 'Open Sans', 'Playfair Display', 'Arial', 'Roboto',
  'Roboto Mono', 'Source Sans Pro', 'Butler',
];

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
  const [showTitleFontDropdown, setShowTitleFontDropdown] = useState(false);
  const [showBodyFontDropdown, setShowBodyFontDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  type SectionItem = { id: LayoutSectionId; label: string };

  const sectionItems: SectionItem[] = useMemo(() => {
    const labels: Record<LayoutSectionId, string> = {
      profile: 'Profil',
      experience: 'Expérience professionnelle',
      education: 'Formation',
      projects: 'Projets',
      certifications: 'Certifications',
      languages: 'Langues',
    };

    const rawOrder =
      settings.sectionOrder && settings.sectionOrder.length > 0
        ? settings.sectionOrder
        : DEFAULT_SECTION_ORDER;

    const validOrder = rawOrder.filter(
      (id): id is LayoutSectionId =>
        (DEFAULT_SECTION_ORDER as string[]).includes(id)
    );

    return validOrder.map((id) => ({
      id,
      label: labels[id],
    }));
  }, [settings.sectionOrder]);

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

        <div className="mt-6">
          <Label className="text-xs uppercase text-gray-500 mb-2 block">
            Ordre des sections du CV
          </Label>
          <p className="text-xs text-gray-500 mb-3">
            Glissez-déposez l&apos;icône à gauche pour changer l&apos;ordre des blocs (Profil, Expérience, etc.).
          </p>
          <SortableList
            items={sectionItems}
            onReorder={(items) => {
              const newOrder = items.map((item) => item.id);
              setSettings({ ...settings, sectionOrder: newOrder });
            }}
            renderItem={(item) => (
              <div className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm">
                {item.label}
              </div>
            )}
          />
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

