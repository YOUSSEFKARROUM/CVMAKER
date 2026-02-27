import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
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
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Arabe',
  'Chinois',
  'Japonais',
  'Russe',
  'Néerlandais',
  'Polonais',
  'Turc',
  'Hindi',
  'Coréen',
];

const emptyLanguage: Language = {
  id: '',
  name: '',
  level: 'intermediate',
};

export function LanguagesForm({
  languages,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onNext,
  onBack,
}: LanguagesFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language | null>(null);

  // Niveaux traduits dynamiquement
  const getProficiencyLevels = () => [
    { value: 'beginner', label: t('languages.levels.beginner'), description: t('languages.descriptions.beginner') },
    { value: 'intermediate', label: t('languages.levels.intermediate'), description: t('languages.descriptions.intermediate') },
    { value: 'advanced', label: t('languages.levels.advanced'), description: t('languages.descriptions.advanced') },
    { value: 'expert', label: t('languages.levels.fluent'), description: t('languages.descriptions.fluent') },
    { value: 'native', label: t('languages.levels.native'), description: t('languages.descriptions.native') },
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

  const getLevelLabel = (level: string) => {
    return getProficiencyLevels().find(l => l.value === level)?.label || level;
  };

  const getLevelDescription = (level: string) => {
    return getProficiencyLevels().find(l => l.value === level)?.description || '';
  };

  const renderLanguageForm = (lang: Language, isNew: boolean) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#2196F3]" />
          <div>
            <p className="font-medium">{lang.name || t('languages.newLanguage')}</p>
            {lang.name && (
              <p className="text-sm text-gray-500">
                {getLevelLabel(lang.level)} - {getLevelDescription(lang.level)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isNew ? handleCancel() : onDelete(lang.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpandedId(expandedId === lang.id ? null : lang.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${expandedId === lang.id ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {expandedId === lang.id && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase text-gray-500">{t('languages.name')}</Label>
            <AutocompleteInput
              value={lang.name}
              onChange={(value) => isNew 
                ? setNewLanguage({ ...lang, name: value })
                : onUpdate(lang.id, { name: value })
              }
              suggestions={commonLanguages}
              placeholder={t('languages.placeholder')}
            />
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500 mb-3 block">
              {t('languages.proficiency')}
            </Label>
            <div className="space-y-2">
              {getProficiencyLevels().map((level) => (
                <button
                  key={level.value}
                  onClick={() => isNew
                    ? setNewLanguage({ ...lang, level: level.value as Language['level'] })
                    : onUpdate(lang.id, { level: level.value as Language['level'] })
                  }
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    lang.level === level.value
                      ? 'border-[#2196F3] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{level.label}</span>
                    {lang.level === level.value && (
                      <div className="w-5 h-5 bg-[#2196F3] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {isNew && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t('nav.cancel')}
              </Button>
              <Button onClick={handleSave} className="bg-[#2196F3] hover:bg-[#1976D2]">
                {t('nav.save')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        <span className="text-[#2196F3]">{t('languages.titleHighlight')}</span> {t('languages.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('languages.subtitle')}
      </p>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-[#2196F3] font-medium mb-4 hover:underline"
      >
        <Plus className="w-5 h-5" />
        {t('languages.add')}
      </button>

      {newLanguage && renderLanguageForm(newLanguage, true)}

      {languages.length > 0 && (
        <SortableList
          items={languages}
          onReorder={onReorder}
          renderItem={(lang) => renderLanguageForm(lang, false)}
        />
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{t('languages.tipTitle')}</strong> {t('languages.tipText')}
        </p>
      </div>

      <div className="flex justify-between mt-8">
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
          {t('languages.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
