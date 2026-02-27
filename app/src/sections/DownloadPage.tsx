import { useState, useRef, useEffect } from 'react';
import { Check, FileText, Home, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVPreview } from '../components/CVPreview';
import { ExportModal } from '../components/ExportModal';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { useToast } from '../hooks/useToast';
import type { CVData, CVSettings } from '../types/cv';

interface DownloadPageProps {
  cvData: CVData;
  settings: CVSettings;
  setSettings: (settings: CVSettings) => void;
  onHomeClick?: () => void;
}

interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  badge?: string;
  isRecommended?: boolean;
  isNew?: boolean;
}

const templates: TemplateMeta[] = [
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


const colors = [
  '#1a1a1a', '#2c3e50', '#1e3a8a', '#6b2c91', 
  '#c62828', '#d84315', '#f57c00', '#f9a825',
  '#4CAF50', '#00897b', '#00acc1', '#0288d1'
];

const titleFonts = [
  'Bebas Neue', 'Roboto', 'Arial', 'Roboto Mono', 'Bebas Kai',
  'Source Sans Pro', 'Ubuntu', 'Open Sans', 'Cabin',
];

const bodyFonts = [
  'Lato', 'Open Sans', 'Playfair Display', 'Arial', 'Roboto',
  'Roboto Mono', 'Source Sans Pro', 'Butler',
];

export function DownloadPage({
  cvData,
  settings,
  setSettings,
  onHomeClick,
}: DownloadPageProps) {
  const [activeTab, setActiveTab] = useState<'template' | 'colors' | 'fonts'>('template');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getFilename = () => {
    return `CV-${cvData.contact.firstName}-${cvData.contact.lastName}`;
  };

  const handleTemplateChange = (templateId: string) => {
    setSettings({ ...settings, template: templateId });
    success('Template appliqué');
  };

  const handleColorChange = (color: string) => {
    setSettings({ ...settings, primaryColor: color });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onHomeClick}
            className="p-2 hover:bg-red-500 rounded-lg transition-colors"
            title="Retour à l'accueil"
          >
            <Home className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#2196F3]" />
            <span className="text-xl font-semibold">Finaliser votre CV</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-[#2196F3] hover:bg-[#1976D2]"
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
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('template')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'template'
                  ? 'border-b-2 border-[#2196F3] text-[#2196F3]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Template
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'colors'
                  ? 'border-b-2 border-[#2196F3] text-[#2196F3]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Couleurs
            </button>
            <button
              onClick={() => setActiveTab('fonts')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'fonts'
                  ? 'border-b-2 border-[#2196F3] text-[#2196F3]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Polices
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'template' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Choisir un template</h3>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        settings.template === template.id
                          ? 'border-[#2196F3] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                      {settings.template === template.id && (
                        <div className="mt-2 flex items-center gap-1 text-[#2196F3] text-sm">
                          <Check className="w-4 h-4" />
                          <span>Sélectionné</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Couleur principale</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-12 h-12 rounded-lg transition-all ${
                          settings.primaryColor === color
                            ? 'ring-2 ring-offset-2 ring-[#2196F3] scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {settings.primaryColor === color && (
                          <Check className="w-5 h-5 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Conseil:</strong> Choisissez une couleur qui correspond à votre secteur d'activité. 
                    Le bleu convient bien aux domaines techniques, le vert à l'environnement, etc.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'fonts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Police des titres</h3>
                  <div className="space-y-2">
                    {titleFonts.map((font) => (
                      <button
                        key={font}
                        onClick={() => setSettings({ ...settings, titleFont: font })}
                        className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                          settings.titleFont === font
                            ? 'border-[#2196F3] bg-blue-50 text-[#2196F3]'
                            : 'border-gray-200 hover:border-gray-300'
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
                    {bodyFonts.map((font) => (
                      <button
                        key={font}
                        onClick={() => setSettings({ ...settings, bodyFont: font })}
                        className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                          settings.bodyFont === font
                            ? 'border-[#2196F3] bg-blue-50 text-[#2196F3]'
                            : 'border-gray-200 hover:border-gray-300'
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
        previewElement={previewRef.current}
        filename={getFilename()}
      />
    </div>
  );
}
