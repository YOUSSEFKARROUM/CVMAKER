import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { commonSkills } from '../utils/aiSuggestions';
import type { Skill, CVSettings } from '../types/cv';

interface SkillsFormProps {
  skills: Skill[];
  settings: CVSettings;
  setSettings: (settings: CVSettings) => void;
  onAdd: (skill: Skill) => void;
  onUpdate: (id: string, skill: Partial<Skill>) => void;
  onDelete: (id: string) => void;
  onReorder: (skills: Skill[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SkillsForm({
  skills,
  settings,
  setSettings,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onNext,
  onBack,
}: SkillsFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<Skill | null>(null);

  // Niveaux traduits dynamiquement
  const getSkillLevels = () => [
    { value: 'beginner', label: t('skills.levels.beginner'), color: 'bg-red-500' },
    { value: 'intermediate', label: t('skills.levels.intermediate'), color: 'bg-yellow-500' },
    { value: 'advanced', label: t('skills.levels.advanced'), color: 'bg-blue-500' },
    { value: 'expert', label: t('skills.levels.expert'), color: 'bg-green-500' },
  ];

  const handleAdd = () => {
    const id = crypto.randomUUID();
    setNewSkill({ id, name: '', level: 'expert' });
    setExpandedId(id);
  };

  const handleSave = () => {
    if (newSkill && newSkill.name.trim()) {
      onAdd(newSkill);
      setNewSkill(null);
      setExpandedId(null);
    }
  };

  const handleCancel = () => {
    setNewSkill(null);
    setExpandedId(null);
  };

  const getLevelLabel = (level: string) => {
    return getSkillLevels().find(l => l.value === level)?.label || level;
  };

  const getLevelColor = (level: string) => {
    return getSkillLevels().find(l => l.value === level)?.color || 'bg-gray-500';
  };

  const renderSkillForm = (skill: Skill, isNew: boolean) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{skill.name || t('skills.newSkill')}</span>
          {skill.name && (
            <span className={`text-xs px-2 py-1 rounded text-white ${getLevelColor(skill.level)}`}>
              {getLevelLabel(skill.level)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isNew ? handleCancel() : onDelete(skill.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpandedId(expandedId === skill.id ? null : skill.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${expandedId === skill.id ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {expandedId === skill.id && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase text-gray-500">{t('skills.name')}</Label>
            <AutocompleteInput
              value={skill.name}
              onChange={(value) => isNew 
                ? setNewSkill({ ...skill, name: value })
                : onUpdate(skill.id, { name: value })
              }
              suggestions={commonSkills}
              placeholder={t('skills.placeholder')}
            />
          </div>

          {!settings.showSkillsAsTags && (
            <div>
              <Label className="text-xs uppercase text-gray-500 mb-2 block">
                {t('skills.level')} - {getLevelLabel(skill.level)}
              </Label>
              <div className="flex gap-2">
                {getSkillLevels().map((level) => (
                  <button
                    key={level.value}
                    onClick={() => isNew
                      ? setNewSkill({ ...skill, level: level.value as Skill['level'] })
                      : onUpdate(skill.id, { level: level.value as Skill['level'] })
                    }
                    className={`flex-1 h-8 rounded transition-colors ${
                      skill.level === level.value ? level.color : 'bg-gray-200'
                    }`}
                    title={level.label}
                  />
                ))}
              </div>
            </div>
          )}

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
        <span className="text-[#2196F3]">{t('skills.titleHighlight')}</span> {t('skills.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('skills.subtitle')}
      </p>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-[#2196F3] font-medium mb-4 hover:underline"
      >
        <Plus className="w-5 h-5" />
        {t('skills.add')}
      </button>

      {newSkill && renderSkillForm(newSkill, true)}

      {skills.length > 0 && (
        <SortableList
          items={skills}
          onReorder={onReorder}
          renderItem={(skill) => renderSkillForm(skill, false)}
        />
      )}

      <div className="flex items-center gap-8 mt-6 mb-8">
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.showSkillsAsTags}
            onCheckedChange={(checked) => setSettings({ ...settings, showSkillsAsTags: checked })}
          />
          <Label className="text-sm text-gray-500">{t('skills.showAsTags')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={!settings.showSkillLevels}
            onCheckedChange={(checked) => setSettings({ ...settings, showSkillLevels: !checked })}
          />
          <Label className="text-sm text-gray-500">{t('skills.hideLevels')}</Label>
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
          {t('skills.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
