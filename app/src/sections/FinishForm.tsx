import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, LayoutGrid, User, Check, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { PhotoUpload } from '../components/PhotoUpload';
import type { CVData, CVSettings, ContactInfo } from '../types/cv';
import { SortableList } from '../components/SortableList';
import { DEFAULT_SECTION_ORDER, type LayoutSectionId } from '../components/templates/utils';
import { THEME_COLORS, TITLE_FONTS, BODY_FONTS, LABEL_CLASS } from '../styles/design-system';
import { SelectDropdown } from '@/components/ui/select-dropdown';

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

const labelCls = LABEL_CLASS;


export function FinishForm({
  cvData, settings, setSettings, updateContact, onNext, onBack, onExport,
}: FinishFormProps) {
  const { t } = useTranslation();

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

  // 30px = label height (16px) + label margin (4px) + input padding-top (10px)
  const CHECK_INDICATOR_TOP = 30;
  const CheckIndicator = ({ show }: { show: boolean }) => show ? (
    <div style={{ top: CHECK_INDICATOR_TOP }} className="absolute right-3 w-4 h-4 bg-success rounded-md flex items-center justify-center">
      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
    </div>
  ) : null;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">{t('finishForm.title')}</h2>
        <Button variant="outline" size="sm" onClick={onExport}>
          <FileJson className="w-3.5 h-3.5" /> {t('finishForm.export')}
        </Button>
      </div>

      {/* Optimize tip */}
      <div className="px-4 py-3 bg-muted/50 border border-border rounded-lg mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t('finishForm.optimizeText')}</p>
        <Button variant="outline" size="sm">{t('finishForm.optimize')}</Button>
      </div>

      {/* Layout section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <LayoutGrid className="w-4 h-4 text-blue" />
          <h3 className="text-sm font-semibold text-foreground">{t('finishForm.layoutTitle')}</h3>
        </div>

        {/* Primary color */}
        <div className="mb-6">
          <p className={`${labelCls} mb-3`}>{t('finishForm.primaryColor')}</p>
          <div className="flex flex-wrap gap-2.5">
            {THEME_COLORS.map(c => (
              <button
                key={c.value}
                title={c.name}
                onClick={() => setSettings({ ...settings, primaryColor: c.value })}
                className={`w-9 h-9 rounded-lg transition-all duration-150 ${
                  settings.primaryColor === c.value
                    ? 'ring-2 ring-offset-2 ring-blue scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              >
                {settings.primaryColor === c.value && (
                  <Check className="w-4 h-4 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className={labelCls}>{t('finishForm.titleFont')}</p>
            <SelectDropdown
              value={settings.titleFont}
              options={TITLE_FONTS.map(f => ({ value: f.value, name: f.name }))}
              onChange={font => setSettings({ ...settings, titleFont: font })}
            />
          </div>
          <div>
            <p className={labelCls}>{t('finishForm.bodyFont')}</p>
            <SelectDropdown
              value={settings.bodyFont}
              options={BODY_FONTS.map(f => ({ value: f.value, name: f.name }))}
              onChange={font => setSettings({ ...settings, bodyFont: font })}
            />
          </div>
        </div>

        {/* CV Language */}
        <div>
          <p className={labelCls}>{t('finishForm.cvLanguage')}</p>
          <SelectDropdown
            value={settings.language}
            options={cvLanguages.map(l => ({ value: l.code, name: l.name }))}
            onChange={code => setSettings({ ...settings, language: code })}
          />
        </div>

        {/* Section order */}
        <div className="mt-6">
          <p className={`${labelCls} mb-1`}>Ordre des sections du CV</p>
          <p className="text-xs text-muted-foreground mb-3">
            Glissez-déposez l&apos;icône à gauche pour changer l&apos;ordre des blocs.
          </p>
          <SortableList
            items={sectionItems}
            onReorder={items => setSettings({ ...settings, sectionOrder: items.map(i => i.id) })}
            renderItem={item => (
              <Card className="px-3 py-2 text-sm text-foreground">
                {item.label}
              </Card>
            )}
          />
        </div>
      </div>

      {/* Personal data section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-blue" />
          <h3 className="text-sm font-semibold text-foreground">{t('finishForm.personalData')}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField label={t('finishForm.jobTitle')}>
            <Input
              value={cvData.contact.jobTitle || ''}
              onChange={e => updateContact('jobTitle', e.target.value)}
              placeholder={t('finishForm.jobTitlePlaceholder')}
            />
          </FormField>
          <div className="flex items-center justify-center">
            <PhotoUpload
              photo={cvData.contact.photo}
              onPhotoChange={photo => updateContact('photo', photo || '')}
              firstName={cvData.contact.firstName}
              lastName={cvData.contact.lastName}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {(['firstName', 'lastName'] as const).map(field => (
            <div key={field} className="relative">
              <p className={labelCls}>{t(`finishForm.${field}`)}</p>
              <Input
                value={cvData.contact[field]}
                onChange={e => updateContact(field, e.target.value)}
                className="mt-1"
              />
              <CheckIndicator show={Boolean(cvData.contact[field])} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {(['email', 'phone'] as const).map(field => (
            <div key={field} className="relative">
              <p className={labelCls}>{t(`finishForm.${field}`)}</p>
              <Input
                value={cvData.contact[field]}
                onChange={e => updateContact(field, e.target.value)}
                className="mt-1"
              />
              <CheckIndicator show={Boolean(cvData.contact[field])} />
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
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={onNext}>
          {t('finishForm.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
