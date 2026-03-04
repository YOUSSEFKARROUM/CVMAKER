import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Download, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVPreview } from '../components/CVPreview';
import { ExportModal } from '../components/ExportModal';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { useToast } from '../hooks/useToast';
import type { CVData, CVSettings } from '../types/cv';
import { SortableList } from '../components/SortableList';
import { DEFAULT_SECTION_ORDER, type LayoutSectionId } from '../components/templates/utils';

type DownloadTab = 'template' | 'colors' | 'fonts' | 'sections';

interface DownloadPageProps {
  cvData: CVData;
  settings: CVSettings;
  setSettings: (settings: CVSettings) => void;
  onHomeClick?: () => void;
  onBack?: () => void;
}

interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  badge?: string;
  isRecommended?: boolean;
  isNew?: boolean;
}

const TEMPLATES: TemplateMeta[] = [
  { id: 'budapest', name: 'Budapest', description: 'Sidebar colorée à gauche', badge: 'Recommandé', isRecommended: true },
  { id: 'chicago', name: 'Chicago', description: 'Header centré classique', badge: 'Recommandé', isRecommended: true },
  { id: 'brunei', name: 'Brunei', description: 'Minimaliste élégant' },
  { id: 'vladivostok', name: 'Vladivostok', description: 'Moderne sidebar droite' },
  { id: 'sydney', name: 'Sydney', description: 'Épuré avec timeline', badge: 'Nouveau', isNew: true },
  { id: 'shanghai', name: 'Shanghai', description: 'Professionnel corporate' },
  { id: 'kiev', name: 'Kiev', description: 'Créatif avec grande photo' },
  { id: 'rotterdam', name: 'Rotterdam', description: 'Technique compétences visibles' },
  { id: 'tokyo', name: 'Tokyo', description: 'Compact 2 colonnes' },
  { id: 'stanford', name: 'Stanford', description: 'Sidebar foncée élégante', badge: 'Nouveau', isNew: true },
  { id: 'cambridge', name: 'Cambridge', description: 'Header bleu classique', badge: 'Nouveau', isNew: true },
  { id: 'oxford', name: 'Oxford', description: 'Sidebar droite structurée', badge: 'Nouveau', isNew: true },
  { id: 'otago', name: 'Otago', description: 'Minimaliste professionnel', badge: 'Nouveau', isNew: true },
  { id: 'berkeley', name: 'Berkeley', description: 'Design avec icônes', badge: 'Nouveau', isNew: true },
  { id: 'harvard', name: 'Harvard', description: 'Sidebar bleue avec timeline', badge: 'Nouveau', isNew: true },
  { id: 'auckland', name: 'Auckland', description: '2 colonnes équilibrées', badge: 'Nouveau', isNew: true },
  { id: 'edinburgh', name: 'Edinburgh', description: 'Header violet moderne', badge: 'Nouveau', isNew: true },
  { id: 'princeton', name: 'Princeton', description: 'Classique centré', badge: 'Nouveau', isNew: true },
];

const COLOR_OPTIONS = [
  '#1a1a1a', '#2c3e50', '#1e3a8a', '#6b2c91',
  '#c62828', '#d84315', '#f57c00', '#f9a825',
  '#4CAF50', '#00897b', '#00acc1', '#0288d1',
];

const TITLE_FONTS = [
  'Bebas Neue', 'Roboto', 'Arial', 'Roboto Mono', 'Bebas Kai',
  'Source Sans Pro', 'Ubuntu', 'Open Sans', 'Cabin',
];

const BODY_FONTS = [
  'Lato', 'Open Sans', 'Playfair Display', 'Arial', 'Roboto',
  'Roboto Mono', 'Source Sans Pro', 'Butler',
];

interface SidebarTabsProps {
  activeTab: DownloadTab;
  onChange: (tab: DownloadTab) => void;
}

function SidebarTabs({ activeTab, onChange }: SidebarTabsProps) {
  const activeClass = 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400';
  const inactiveClass = 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800';
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onChange('template')}
        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'template' ? activeClass : inactiveClass}`}
      >
        Template
      </button>
      <button
        onClick={() => onChange('colors')}
        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'colors' ? activeClass : inactiveClass}`}
      >
        Couleurs
      </button>
      <button
        onClick={() => onChange('fonts')}
        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'fonts' ? activeClass : inactiveClass}`}
      >
        Polices
      </button>
      <button
        onClick={() => onChange('sections')}
        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'sections' ? activeClass : inactiveClass}`}
      >
        Sections
      </button>
    </div>
  );
}

interface TemplateTabProps {
  selectedTemplate: string;
  onChangeTemplate: (id: string) => void;
}

function TemplateTab({ selectedTemplate, onChangeTemplate }: TemplateTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Choisir un template</h3>
      <div className="space-y-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onChangeTemplate(template.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === template.id
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-500'
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-medium">{template.name}</span>
              <div className="flex gap-1">
                {template.isRecommended && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                    Recommandé
                  </span>
                )}
                {template.isNew && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    Nouveau
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">{template.description}</p>
            {selectedTemplate === template.id && (
              <div className="mt-2 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm">
                <Check className="w-4 h-4" />
                <span>Sélectionné</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface SectionsTabProps {
  sectionOrder: string[] | undefined;
  onChangeOrder: (order: LayoutSectionId[]) => void;
}

function SectionsTab({ sectionOrder, onChangeOrder }: SectionsTabProps) {
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
      sectionOrder && sectionOrder.length > 0
        ? sectionOrder
        : DEFAULT_SECTION_ORDER;

    const validOrder = rawOrder.filter(
      (id): id is LayoutSectionId =>
        (DEFAULT_SECTION_ORDER as string[]).includes(id)
    );

    return validOrder.map((id) => ({
      id,
      label: labels[id],
    }));
  }, [sectionOrder]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-gray-900">Ordre des sections du CV</h3>
        <p className="text-xs text-gray-500 mt-1">
          Glissez-déposez les éléments pour modifier l&apos;ordre d&apos;affichage (Profil, Expérience, Formation, etc.).
        </p>
      </div>
      <SortableList
        items={sectionItems}
        onReorder={(items) => onChangeOrder(items.map((item) => item.id))}
        renderItem={(item) => (
          <div className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm">
            {item.label}
          </div>
        )}
      />
    </div>
  );
}

interface ColorsTabProps {
  selectedColor: string;
  onChangeColor: (color: string) => void;
}

function ColorsTab({ selectedColor, onChangeColor }: ColorsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Couleur principale</h3>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              onClick={() => onChangeColor(color)}
              className={`w-12 h-12 rounded-lg transition-all ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-indigo-600 dark:ring-indigo-500 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <Check className="w-5 h-5 text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
        <p className="text-sm text-indigo-800 dark:text-indigo-200">
          <strong>Conseil :</strong> Choisissez une couleur qui correspond à votre secteur d'activité.
          Le bleu convient bien aux domaines techniques, le vert à l'environnement, etc.
        </p>
      </div>
    </div>
  );
}

interface FontsTabProps {
  titleFont: string;
  bodyFont: string;
  onChangeTitleFont: (font: string) => void;
  onChangeBodyFont: (font: string) => void;
}

function FontsTab({ titleFont, bodyFont, onChangeTitleFont, onChangeBodyFont }: FontsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Police des titres</h3>
        <div className="space-y-2">
          {TITLE_FONTS.map((font) => (
            <button
              key={font}
              onClick={() => onChangeTitleFont(font)}
              className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                titleFont === font
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <span style={{ fontFamily: font, fontSize: '1.25rem' }}>
                {font}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Police du texte</h3>
        <div className="space-y-2">
          {BODY_FONTS.map((font) => (
            <button
              key={font}
              onClick={() => onChangeBodyFont(font)}
              className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                bodyFont === font
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <span style={{ fontFamily: font }}>
                {font} - Texte exemple pour voir le rendu
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DownloadPage({
  cvData,
  settings,
  setSettings,
  onHomeClick,
  onBack,
}: DownloadPageProps) {
  const [activeTab, setActiveTab] = useState<DownloadTab>('template');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getFilename = () =>
    `CV-${cvData.contact.firstName}-${cvData.contact.lastName}`;

  const handleTemplateChange = (templateId: string) => {
    setSettings({ ...settings, template: templateId });
    success('Template appliqué');
  };

  const handleColorChange = (color: string) => {
    setSettings({ ...settings, primaryColor: color });
  };

  const handleTitleFontChange = (font: string) => {
    setSettings({ ...settings, titleFont: font });
  };

  const handleBodyFontChange = (font: string) => {
    setSettings({ ...settings, bodyFont: font });
  };

  const handleSectionOrderChange = (order: LayoutSectionId[]) => {
    setSettings({ ...settings, sectionOrder: order });
  };

  const resolvedPreviewElement =
    previewRef.current ?? (document.getElementById('cv-preview') as HTMLElement | null);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 text-white px-6 py-4 flex items-center justify-between shadow-lg border-b border-white/5">
        <div className="flex items-center gap-4">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="p-2 hover:bg-red-500/90 rounded-lg transition-colors bg-red-500/20 border border-red-400/40"
              title="Retour à l'accueil"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Finaliser votre CV</span>
              <span className="text-xs text-slate-300">
                Ajustez le template, les couleurs, les polices et l&apos;ordre des sections avant de télécharger.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="border-indigo-500/60 text-indigo-100 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Revenir en arrière
          </Button>

          <Button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-900/40"
            disabled={!resolvedPreviewElement}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white overflow-y-auto border-r">
          <SidebarTabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="p-6">
            {activeTab === 'template' && (
              <TemplateTab
                selectedTemplate={settings.template}
                onChangeTemplate={handleTemplateChange}
              />
            )}

            {activeTab === 'colors' && (
              <ColorsTab
                selectedColor={settings.primaryColor}
                onChangeColor={handleColorChange}
              />
            )}

            {activeTab === 'fonts' && (
              <FontsTab
                titleFont={settings.titleFont}
                bodyFont={settings.bodyFont}
                onChangeTitleFont={handleTitleFontChange}
                onChangeBodyFont={handleBodyFontChange}
              />
            )}

            {activeTab === 'sections' && (
              <SectionsTab
                sectionOrder={settings.sectionOrder}
                onChangeOrder={handleSectionOrderChange}
              />
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-gray-200 overflow-auto p-8">
          <div className="flex justify-center">
            <CVPreview
              ref={previewRef}
              cvData={cvData}
              settings={settings}
              className="transform origin-top scale-90"
            />
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        previewElement={resolvedPreviewElement}
        filename={getFilename()}
      />
    </div>
  );
}
