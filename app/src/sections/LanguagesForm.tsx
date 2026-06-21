import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { fadeInUp, staggerContainer } from '../styles/design-system';
import type { Language } from '../types/cv';

interface LanguagesFormProps {
  languages: Language[];
  onAdd: (language: Language) => void;
  onUpdate: (id: string, language: Partial<Language>) => void;
  onDelete: (id: string) => void;
  onReorder: (languages: Language[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const commonLanguages = [
  'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais',
  'Arabe', 'Chinois', 'Japonais', 'Russe', 'Néerlandais', 'Polonais',
  'Turc', 'Hindi', 'Coréen',
];

const emptyLanguage: Language = { id: '', name: '', level: 'intermediate' };

const labelCls = 'block text-sm font-medium text-foreground mb-1';

export function LanguagesForm({
  languages, onAdd, onUpdate, onDelete, onReorder, onNext, onBack,
}: LanguagesFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language | null>(null);

  const getProficiencyLevels = () => [
    { value: 'beginner',     label: t('languages.levels.beginner'),     description: t('languages.descriptions.beginner') },
    { value: 'intermediate', label: t('languages.levels.intermediate'), description: t('languages.descriptions.intermediate') },
    { value: 'advanced',     label: t('languages.levels.advanced'),     description: t('languages.descriptions.advanced') },
    { value: 'expert',       label: t('languages.levels.fluent'),       description: t('languages.descriptions.fluent') },
    { value: 'native',       label: t('languages.levels.native'),       description: t('languages.descriptions.native') },
  ];

  const handleAdd = () => {
    const id = crypto.randomUUID();
    setNewLanguage({ ...emptyLanguage, id });
    setExpandedId(id);
  };

  const handleSave = () => {
    if (newLanguage && newLanguage.name.trim()) {
      onAdd(newLanguage);
      setNewLanguage(null);
      setExpandedId(null);
    }
  };

  const handleCancel = () => {
    setNewLanguage(null);
    setExpandedId(null);
  };

  const getLevelLabel       = (level: string) => getProficiencyLevels().find(l => l.value === level)?.label || level;
  const getLevelDescription = (level: string) => getProficiencyLevels().find(l => l.value === level)?.description || '';

  const renderLanguageForm = (lang: Language, isNew: boolean) => (
    <Card variant="compact" hover className="mb-3 cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-blue" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {lang.name || t('languages.newLanguage')}
            </p>
            {lang.name && (
              <p className="text-xs text-muted-foreground">
                {getLevelLabel(lang.level)} — {getLevelDescription(lang.level)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => isNew ? handleCancel() : onDelete(lang.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpandedId(expandedId === lang.id ? null : lang.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expandedId === lang.id ? '' : 'rotate-180'}`} />
          </Button>
        </div>
      </div>

      {expandedId === lang.id && (
        <div className="space-y-4 pt-3 border-t border-border">
          <div>
            <p className={labelCls}>{t('languages.name')}</p>
            <AutocompleteInput
              value={lang.name}
              onChange={value => isNew
                ? setNewLanguage({ ...lang, name: value })
                : onUpdate(lang.id, { name: value })}
              suggestions={commonLanguages}
              placeholder={t('languages.placeholder')}
            />
          </div>

          <div>
            <p className={`${labelCls} mb-3`}>{t('languages.proficiency')}</p>
            <div className="space-y-2">
              {getProficiencyLevels().map(level => (
                <button
                  key={level.value}
                  onClick={() => isNew
                    ? setNewLanguage({ ...lang, level: level.value as Language['level'] })
                    : onUpdate(lang.id, { level: level.value as Language['level'] })}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors duration-150 ${
                    lang.level === level.value
                      ? 'border-blue bg-blue/8'
                      : 'border-border hover:border-border/80 hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{level.label}</span>
                    {lang.level === level.value && (
                      <div className="w-4 h-4 bg-blue rounded-md flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {isNew && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>{t('nav.cancel')}</Button>
              <Button variant="blue" onClick={handleSave}>{t('nav.save')}</Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
        <span className="text-blue">{t('languages.titleHighlight')}</span>{' '}
        {t('languages.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('languages.subtitle')}</p>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Button variant="outline" size="sm" onClick={handleAdd} className="mb-4">
          <Plus className="w-4 h-4" />
          {t('languages.add')}
        </Button>

        <AnimatePresence mode="wait">
          {newLanguage && (
            <motion.div key="new" variants={fadeInUp}>
              {renderLanguageForm(newLanguage, true)}
            </motion.div>
          )}
        </AnimatePresence>

        {languages.length === 0 && !newLanguage && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border mb-6"
          >
            <Globe className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{t('languages.emptyState')}</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> {t('languages.add')}
            </Button>
          </motion.div>
        )}

        {languages.length > 0 && (
          <SortableList items={languages} onReorder={onReorder}
            renderItem={lang => renderLanguageForm(lang, false)} />
        )}
      </motion.div>

      <div className="mt-6 mb-8 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{t('languages.tipTitle')}</span>{' '}
          {t('languages.tipText')}
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={onNext}>
          {t('languages.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
