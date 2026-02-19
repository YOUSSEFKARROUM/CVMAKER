import { useState } from 'react';
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
  { id: 'budapest', name: 'Budapest' },
  { id: 'chicago', name: 'Chicago' },
  { id: 'brunei', name: 'Brunei' },
  { id: 'vladivostok', name: 'Vladivostok' },
  { id: 'sydney', name: 'Sydney' },
  { id: 'shanghai', name: 'Shanghai' },
  { id: 'kiev', name: 'Kiev' },
  { id: 'rotterdam', name: 'Rotterdam' },
  { id: 'tokyo', name: 'Tokyo' },
];

const titleFonts = [
  'Bebas Neue',
  'Roboto',
  'Arial',
  'Roboto Mono',
  'Bebas Kai',
  'Source Sans Pro',
  'Ubuntu',
  'Open Sans',
  'Cabin',
];

const bodyFonts = [
  'Lato',
  'Open Sans',
  'Playfair Display',
  'Arial',
  'Roboto',
  'Roboto Mono',
  'Source Sans Pro',
  'Butler',
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
  '#1a1a1a',
  '#2c3e50',
  '#6b2c91',
  '#1e3a8a',
  '#4CAF50',
  '#c62828',
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
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showTitleFontDropdown, setShowTitleFontDropdown] = useState(false);
  const [showBodyFontDropdown, setShowBodyFontDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Finaliser votre CV</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-gray-600"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-red-600 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <p className="text-green-800 text-sm">
          Vous pouvez optimiser ce CV pour un rôle spécifique afin d'améliorer vos chances d'obtenir le poste.
        </p>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Optimiser
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="w-5 h-5 text-[#2196F3]" />
          <h3 className="text-lg font-semibold">Mise En Page Du CV</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">MODÈLE</Label>
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-left flex items-center justify-between bg-white"
            >
              <span>{templates.find(t => t.id === settings.template)?.name || 'Budapest'}</span>
              <span className="text-[#2196F3]">▼</span>
            </button>
            {showTemplateDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSettings({ ...settings, template: template.id });
                      setShowTemplateDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">COULEUR PRINCIPALE</Label>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSettings({ ...settings, primaryColor: color })}
                  className={`w-8 h-8 rounded-full ${settings.primaryColor === color ? 'ring-2 ring-offset-2 ring-[#2196F3]' : ''}`}
                  style={{ backgroundColor: color }}
                >
                  {settings.primaryColor === color && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">POLICE DU TITRE</Label>
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
            <Label className="text-xs uppercase text-gray-500">POLICE DU TEXTE</Label>
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
          <Label className="text-xs uppercase text-gray-500">LANGUE DU CV</Label>
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
          <h3 className="text-lg font-semibold">Données Personnelles</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs uppercase text-gray-500">INTITULÉ DU POSTE</Label>
            <Input
              value={cvData.contact.jobTitle || ''}
              onChange={(e) => updateContact('jobTitle', e.target.value)}
              placeholder="Chef de projet"
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
            <Label className="text-xs uppercase text-gray-500">PRÉNOM</Label>
            <Input
              value={cvData.contact.firstName}
              onChange={(e) => updateContact('firstName', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">NOM</Label>
            <Input
              value={cvData.contact.lastName}
              onChange={(e) => updateContact('lastName', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">E-MAIL</Label>
            <Input
              value={cvData.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">NUMÉRO DE TÉLÉPHONE</Label>
            <Input
              value={cvData.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label className="text-xs uppercase text-gray-500">ADRESSE</Label>
          <Input
            value={cvData.contact.address || ''}
            onChange={(e) => updateContact('address', e.target.value)}
            placeholder="Entrez votre adresse"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">VILLE</Label>
            <Input
              value={cvData.contact.city}
              onChange={(e) => updateContact('city', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">CODE POSTAL</Label>
            <Input
              value={cvData.contact.postalCode}
              onChange={(e) => updateContact('postalCode', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Label className="text-xs uppercase text-gray-500">PAYS</Label>
            <Input
              value={cvData.contact.country || ''}
              onChange={(e) => updateContact('country', e.target.value)}
              className="mt-1"
            />
            <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Revenir en arrière
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          Suivant à télécharger
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
