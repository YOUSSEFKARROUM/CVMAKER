import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Download, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CVPreview } from '../components/CVPreview';
import { ExportModal } from '../components/ExportModal';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { useToast } from '../hooks/useToast';
import type { CVData, CVSettings } from '../types/cv';
import { SortableList } from '../components/SortableList';
import { DEFAULT_SECTION_ORDER, type LayoutSectionId } from '../components/templates/utils';
import { TEMPLATES } from '../data/templates';
import { THEME_COLORS, TITLE_FONTS, BODY_FONTS } from '../styles/design-system';

type DownloadTab = 'template' | 'colors' | 'fonts' | 'sections';

interface DownloadPageProps {
  cvData: CVData;
  settings: CVSettings;
  setSettings: (settings: CVSettings) => void;
  onHomeClick?: () => void;
  onBack?: () => void;
}

/* ── Sub-components ──────────────────────────────────────────────── */

function SidebarTabs({ activeTab, onChange }: { activeTab: DownloadTab; onChange: (t: DownloadTab) => void }) {
  const tabs: { id: DownloadTab; label: string }[] = [
    { id: 'template', label: 'Template' },
    { id: 'colors',   label: 'Couleurs' },
    { id: 'fonts',    label: 'Polices' },
    { id: 'sections', label: 'Sections' },
  ];
  return (
    <div className="flex border-b border-border">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-2.5 px-2 text-xs font-medium transition-colors duration-150 ${
            activeTab === tab.id
              ? 'border-b-2 border-blue text-blue'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function TemplateTab({ selectedTemplate, onChangeTemplate }: { selectedTemplate: string; onChangeTemplate: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Choisir un template</h3>
      <div className="space-y-2">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onChangeTemplate(template.id)}
            className={`w-full px-3 py-3 rounded-lg border text-left transition-colors duration-150 ${
              selectedTemplate === template.id
                ? 'border-blue bg-blue/8'
                : 'border-border hover:border-border/60 hover:bg-accent/50'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{template.name}</span>
              <div className="flex gap-1">
                {template.isRecommended && (
                  <span className="text-xs px-1.5 py-0.5 bg-success/10 text-success rounded font-medium">
                    Recommandé
                  </span>
                )}
                {template.isNew && (
                  <span className="text-xs px-1.5 py-0.5 bg-blue/10 text-blue rounded font-medium">
                    Nouveau
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{template.description}</p>
            {selectedTemplate === template.id && (
              <div className="mt-2 flex items-center gap-1 text-blue text-xs font-medium">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Sélectionné</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionsTab({ sectionOrder, onChangeOrder }: { sectionOrder: string[] | undefined; onChangeOrder: (order: LayoutSectionId[]) => void }) {
  type SectionItem = { id: LayoutSectionId; label: string };
  const sectionItems: SectionItem[] = useMemo(() => {
    const labels: Record<LayoutSectionId, string> = {
      profile: 'Profil', experience: 'Expérience professionnelle',
      education: 'Formation', projects: 'Projets',
      certifications: 'Certifications', languages: 'Langues',
    };
    const rawOrder = sectionOrder?.length ? sectionOrder : DEFAULT_SECTION_ORDER;
    const validOrder = rawOrder.filter((id): id is LayoutSectionId =>
      (DEFAULT_SECTION_ORDER as string[]).includes(id));
    return validOrder.map(id => ({ id, label: labels[id] }));
  }, [sectionOrder]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Ordre des sections du CV</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Glissez-déposez les éléments pour modifier l&apos;ordre d&apos;affichage.
        </p>
      </div>
      <SortableList
        items={sectionItems}
        onReorder={items => onChangeOrder(items.map(item => item.id))}
        renderItem={item => (
          <Card className="px-3 py-2 text-sm text-foreground">
            {item.label}
          </Card>
        )}
      />
    </div>
  );
}

function ColorsTab({ selectedColor, onChangeColor }: { selectedColor: string; onChangeColor: (c: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Couleur principale</h3>
        <div className="grid grid-cols-4 gap-2">
          {THEME_COLORS.map(c => c.value).map(color => (
            <button
              key={color}
              onClick={() => onChangeColor(color)}
              className={`w-11 h-11 rounded-lg transition-all duration-150 ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-blue scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <Check className="w-4 h-4 text-white mx-auto" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Conseil : </span>
          Choisissez une couleur adaptée à votre secteur. Le bleu convient aux domaines techniques, le vert à l'environnement.
        </p>
      </div>
    </div>
  );
}

function FontsTab({ titleFont, bodyFont, onChangeTitleFont, onChangeBodyFont }: {
  titleFont: string; bodyFont: string;
  onChangeTitleFont: (f: string) => void; onChangeBodyFont: (f: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Police des titres</h3>
        <div className="space-y-1.5">
          {TITLE_FONTS.map(f => (
            <button
              key={f.value}
              onClick={() => onChangeTitleFont(f.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-left transition-colors duration-150 ${
                titleFont === f.value
                  ? 'border-blue bg-blue/8 text-blue'
                  : 'border-border hover:border-border/60 hover:bg-accent/50 text-foreground'
              }`}
            >
              <span style={{ fontFamily: f.value, fontSize: '1.1rem' }}>{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Police du texte</h3>
        <div className="space-y-1.5">
          {BODY_FONTS.map(f => (
            <button
              key={f.value}
              onClick={() => onChangeBodyFont(f.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-left transition-colors duration-150 ${
                bodyFont === f.value
                  ? 'border-blue bg-blue/8 text-blue'
                  : 'border-border hover:border-border/60 hover:bg-accent/50 text-foreground'
              }`}
            >
              <span style={{ fontFamily: f.value }} className="text-sm">
                {f.name} — Texte exemple pour voir le rendu
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export function DownloadPage({ cvData, settings, setSettings, onHomeClick, onBack }: DownloadPageProps) {
  const [activeTab, setActiveTab] = useState<DownloadTab>('template');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  const handleDownloadSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getFilename = () => `CV-${cvData.contact.firstName}-${cvData.contact.lastName}`;

  const handleTemplateChange = (templateId: string) => {
    setSettings({ ...settings, template: templateId });
    success('Template appliqué');
  };

  const resolvedPreviewElement =
    previewRef.current ?? (document.getElementById('cv-preview') as HTMLElement | null);

  const handleBackClick = () => {
    if (onBack) { onBack(); }
    else if (onHomeClick) { onHomeClick(); }
  };

  return (
    // Force dark: download page is intentionally always dark (print preview context)
    <div className="dark fixed inset-0 z-50 flex flex-col">
      <div className="fixed inset-0 bg-background" aria-hidden />
      <div className="relative z-10 flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="bg-background border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Retour à l'accueil"
            >
              <Home className="size-[18px]" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue" />
            <div>
              <span className="text-sm font-semibold text-foreground">Finaliser votre CV</span>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                Ajustez le template, les couleurs, les polices et les sections
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="border-border text-muted-foreground bg-surface-2/50 hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Revenir en arrière
          </Button>
          <Button
            size="sm"
            variant="blue"
            onClick={() => setIsExportModalOpen(true)}
            disabled={!resolvedPreviewElement}
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger
          </Button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto flex-shrink-0">
          <SidebarTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="p-5">
            {activeTab === 'template' && (
              <TemplateTab selectedTemplate={settings.template} onChangeTemplate={handleTemplateChange} />
            )}
            {activeTab === 'colors' && (
              <ColorsTab selectedColor={settings.primaryColor}
                onChangeColor={color => setSettings({ ...settings, primaryColor: color })} />
            )}
            {activeTab === 'fonts' && (
              <FontsTab
                titleFont={settings.titleFont}
                bodyFont={settings.bodyFont}
                onChangeTitleFont={font => setSettings({ ...settings, titleFont: font })}
                onChangeBodyFont={font => setSettings({ ...settings, bodyFont: font })}
              />
            )}
            {activeTab === 'sections' && (
              <SectionsTab
                sectionOrder={settings.sectionOrder}
                onChangeOrder={order => setSettings({ ...settings, sectionOrder: order })}
              />
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-surface-3 overflow-auto p-8">
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

      <ConfettiEffect trigger={showConfetti} />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        previewElement={resolvedPreviewElement}
        filename={getFilename()}
        cvTemplate={settings.template}
        onSuccess={handleDownloadSuccess}
      />
      </div>
    </div>
  );
}
