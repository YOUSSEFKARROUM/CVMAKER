import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Layout, Palette, Type, Layers, Check, User, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { PhotoUpload } from '../components/PhotoUpload';
import { CVPreview } from '../components/CVPreview';
import { CVThumbnail } from '../components/CVThumbnail';
import { ExportModal } from '../components/ExportModal';
import type { CVData, CVSettings, ContactInfo } from '../types/cv';
import { SortableList } from '../components/SortableList';
import { DEFAULT_SECTION_ORDER, type LayoutSectionId } from '../components/templates/utils';
import { THEME_COLORS, TITLE_FONTS, BODY_FONTS, LABEL_CLASS } from '../styles/design-system';
import { TEMPLATES } from '../data/templates';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { cn } from '@/lib/utils';

interface FinishFormProps {
  cvData: CVData;
  settings: CVSettings;
  setSettings: (settings: CVSettings) => void;
  updateContact: (field: keyof ContactInfo, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onExport: () => void;
}

const cvLanguages = [
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

type FinishTab = 'template' | 'colors' | 'fonts' | 'sections' | 'data';

const TABS: { id: FinishTab; label: string; icon: React.ElementType }[] = [
  { id: 'template', label: 'Template',  icon: Layout  },
  { id: 'colors',   label: 'Couleurs',  icon: Palette },
  { id: 'fonts',    label: 'Polices',   icon: Type    },
  { id: 'sections', label: 'Sections',  icon: Layers  },
  { id: 'data',     label: 'Données',   icon: User    },
];

export function FinishForm({
  cvData, settings, setSettings, updateContact, onBack,
}: FinishFormProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FinishTab>('template');
  const [previewScale, setPreviewScale] = useState(0.65);
  const [manualScale, setManualScale] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const getFilename = () =>
    `CV-${cvData.contact.firstName || 'CV'}-${cvData.contact.lastName || ''}`.replace(/\s+/g, '-');

  const updateSettings = (patch: Partial<CVSettings>) =>
    setSettings({ ...settings, ...patch });

  // Auto-scale preview to fit container
  useEffect(() => {
    if (!previewContainerRef.current || manualScale !== null) return;
    const ro = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width - 48;
      const maxWidth = Math.min(containerWidth, 680);
      setPreviewScale(maxWidth / 794);
    });
    ro.observe(previewContainerRef.current);
    return () => ro.disconnect();
  }, [manualScale]);

  const effectiveScale = manualScale ?? previewScale;

  const handleZoomIn = () => {
    const next = Math.min((manualScale ?? previewScale) + 0.1, 1.2);
    setManualScale(parseFloat(next.toFixed(2)));
  };
  const handleZoomOut = () => {
    const next = Math.max((manualScale ?? previewScale) - 0.1, 0.2);
    setManualScale(parseFloat(next.toFixed(2)));
  };

  // Section order
  type SectionItem = { id: LayoutSectionId; label: string };
  const sectionItems: SectionItem[] = useMemo(() => {
    const labels: Record<LayoutSectionId, string> = {
      profile: 'Profil', experience: 'Expérience professionnelle',
      education: 'Formation', projects: 'Projets',
      certifications: 'Certifications', languages: 'Langues',
    };
    const rawOrder = settings.sectionOrder?.length ? settings.sectionOrder : DEFAULT_SECTION_ORDER;
    const validOrder = rawOrder.filter((id): id is LayoutSectionId =>
      (DEFAULT_SECTION_ORDER as string[]).includes(id));
    return validOrder.map(id => ({ id, label: labels[id] }));
  }, [settings.sectionOrder]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-background" aria-hidden />

      <div className="relative z-10 flex flex-col h-full">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3
                           border-b border-border bg-background/95 backdrop-blur-sm
                           sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground
                         hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <div className="h-5 w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-foreground">Finaliser votre CV</h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                Ajustez le template, les couleurs et les polices
              </p>
            </div>
          </div>

          <Button variant="blue" onClick={() => setShowExportModal(true)} className="gap-1.5">
            <Download className="w-4 h-4" />
            {t('finishForm.nextStep')}
          </Button>
        </header>

        {/* ── Tabs bar ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1 px-4 border-b border-border bg-background flex-shrink-0">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
                  'border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'border-blue-500 text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <aside className="w-72 lg:w-80 border-r border-border bg-card overflow-y-auto flex-shrink-0">
            <div className="p-4">

              {/* ── Template tab ─────────────────────────────────── */}
              {activeTab === 'template' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Choisir un template</h3>
                  <div className="space-y-2">
                    {TEMPLATES.map(template => {
                      const isSelected = settings.template === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => updateSettings({ template: template.id })}
                          className={cn(
                            'w-full rounded-xl overflow-hidden border-2 transition-all duration-200 text-left',
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500/20'
                              : 'border-border hover:border-blue-500/40'
                          )}
                        >
                          {/* Miniature */}
                          <div className="relative">
                            <CVThumbnail
                              cvData={cvData}
                              settings={{ ...settings, template: template.id }}
                            />
                            {isSelected && (
                              <div className="absolute bottom-2 left-2">
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full
                                                bg-blue-500 text-white text-[10px] font-medium">
                                  <Check className="w-3 h-3" />
                                  Sélectionné
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Infos */}
                          <div className="px-3 py-2 bg-card">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-foreground">{template.name}</span>
                              <div className="flex gap-1 flex-shrink-0">
                                {template.isRecommended && (
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full
                                                   bg-green-500/10 text-green-500">
                                    Recommandé
                                  </span>
                                )}
                                {template.isNew && (
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full
                                                   bg-blue-500/10 text-blue-500">
                                    Nouveau
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Colors tab ───────────────────────────────────── */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Couleur principale</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {THEME_COLORS.map(c => (
                        <button
                          key={c.value}
                          onClick={() => updateSettings({ primaryColor: c.value })}
                          title={c.name}
                          className={cn(
                            'aspect-square rounded-xl transition-all duration-150',
                            'hover:scale-105 hover:shadow-md',
                            settings.primaryColor === c.value
                              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background scale-105'
                              : 'ring-1 ring-border'
                          )}
                          style={{ backgroundColor: c.value }}
                        >
                          {settings.primaryColor === c.value && (
                            <Check className="w-4 h-4 text-white mx-auto" strokeWidth={3} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Couleur personnalisée</h3>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={e => updateSettings({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={e => updateSettings({ primaryColor: e.target.value })}
                        className="font-mono text-sm w-28"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Conseil : </span>
                      Choisissez une couleur adaptée à votre secteur. Le bleu convient aux domaines techniques.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Fonts tab ────────────────────────────────────── */}
              {activeTab === 'fonts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Police des titres</h3>
                    <div className="space-y-1.5">
                      {TITLE_FONTS.map(f => (
                        <button
                          key={f.value}
                          onClick={() => updateSettings({ titleFont: f.value })}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors',
                            settings.titleFont === f.value
                              ? 'border-blue-500 bg-blue-500/8 text-blue-500'
                              : 'border-border hover:border-border/60 hover:bg-accent/50 text-foreground'
                          )}
                        >
                          <span style={{ fontFamily: f.value, fontSize: '1.05rem' }}>{f.name}</span>
                          <span className="text-xs text-muted-foreground">Aa</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Police du texte</h3>
                    <div className="space-y-1.5">
                      {BODY_FONTS.map(f => (
                        <button
                          key={f.value}
                          onClick={() => updateSettings({ bodyFont: f.value })}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors',
                            settings.bodyFont === f.value
                              ? 'border-blue-500 bg-blue-500/8 text-blue-500'
                              : 'border-border hover:border-border/60 hover:bg-accent/50 text-foreground'
                          )}
                        >
                          <span style={{ fontFamily: f.value }} className="text-sm">{f.name}</span>
                          <span className="text-xs text-muted-foreground">Aa</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Sections tab ─────────────────────────────────── */}
              {activeTab === 'sections' && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Ordre des sections</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Glissez-déposez les éléments pour modifier l&apos;ordre d&apos;affichage.
                    </p>
                  </div>
                  <SortableList
                    items={sectionItems}
                    onReorder={items => updateSettings({ sectionOrder: items.map(i => i.id) })}
                    renderItem={item => (
                      <Card className="px-3 py-2 text-sm text-foreground">
                        {item.label}
                      </Card>
                    )}
                  />
                </div>
              )}

              {/* ── Data tab ─────────────────────────────────────── */}
              {activeTab === 'data' && (
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-foreground">Données personnelles</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label={t('finishForm.jobTitle')}>
                      <Input
                        value={cvData.contact.jobTitle || ''}
                        onChange={e => updateContact('jobTitle', e.target.value)}
                        placeholder={t('finishForm.jobTitlePlaceholder')}
                      />
                    </FormField>
                    <div className="flex items-end justify-center pb-1">
                      <PhotoUpload
                        photo={cvData.contact.photo}
                        onPhotoChange={photo => updateContact('photo', photo || '')}
                        firstName={cvData.contact.firstName}
                        lastName={cvData.contact.lastName}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(['firstName', 'lastName'] as const).map(field => (
                      <div key={field}>
                        <p className={LABEL_CLASS}>{t(`finishForm.${field}`)}</p>
                        <Input
                          value={cvData.contact[field]}
                          onChange={e => updateContact(field, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(['email', 'phone'] as const).map(field => (
                      <div key={field}>
                        <p className={LABEL_CLASS}>{t(`finishForm.${field}`)}</p>
                        <Input
                          value={cvData.contact[field]}
                          onChange={e => updateContact(field, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>

                  <FormField label={t('finishForm.address')}>
                    <Input
                      value={cvData.contact.address || ''}
                      onChange={e => updateContact('address', e.target.value)}
                      placeholder={t('finishForm.addressPlaceholder')}
                    />
                  </FormField>

                  <div>
                    <p className={LABEL_CLASS}>{t('finishForm.cvLanguage')}</p>
                    <SelectDropdown
                      value={settings.language}
                      options={cvLanguages.map(l => ({ value: l.code, name: l.name }))}
                      onChange={code => updateSettings({ language: code })}
                    />
                  </div>
                </div>
              )}

            </div>
          </aside>

          {/* ── Right panel — Preview ───────────────────────────── */}
          <main
            ref={previewContainerRef}
            className="flex-1 bg-muted/20 overflow-y-auto p-6 flex flex-col items-center"
          >
            {/* Preview meta */}
            <div className="flex items-center justify-between w-full max-w-[680px] mb-3">
              <span className="text-xs text-muted-foreground">Aperçu en temps réel</span>
              <span className="text-xs text-muted-foreground capitalize">{settings.template}</span>
            </div>

            {/* CV sheet */}
            <div
              className="relative bg-white shadow-2xl overflow-hidden flex-shrink-0"
              style={{
                width: `${794 * effectiveScale}px`,
                height: `${1123 * effectiveScale}px`,
              }}
            >
              <div
                ref={previewRef}
                className="absolute top-0 left-0 origin-top-left"
                style={{ width: '794px', transform: `scale(${effectiveScale})` }}
              >
                <CVPreview ref={cvPreviewRef} cvData={cvData} settings={settings} />
              </div>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground min-w-[44px] text-center">
                {Math.round(effectiveScale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Modale d'export PDF */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        previewElement={cvPreviewRef.current}
        filename={getFilename()}
        cvTemplate={settings.template}
      />
    </div>
  );
}
