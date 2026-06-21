import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { commonSkills } from '../utils/aiSuggestions';
import { fadeInUp, staggerContainer } from '../styles/design-system';
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

const labelCls = 'block text-sm font-medium text-foreground mb-1';

const levelColors: Record<string, string> = {
  beginner:     'bg-muted-foreground/40',
  intermediate: 'bg-info',
  advanced:     'bg-blue',
  expert:       'bg-success',
};

export function SkillsForm({
  skills, settings, setSettings, onAdd, onUpdate, onDelete, onReorder, onNext, onBack,
}: SkillsFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<Skill | null>(null);

  const getSkillLevels = () => [
    { value: 'beginner',     label: t('skills.levels.beginner'),     color: levelColors.beginner },
    { value: 'intermediate', label: t('skills.levels.intermediate'), color: levelColors.intermediate },
    { value: 'advanced',     label: t('skills.levels.advanced'),     color: levelColors.advanced },
    { value: 'expert',       label: t('skills.levels.expert'),       color: levelColors.expert },
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

  const getLevelLabel = (level: string) =>
    getSkillLevels().find(l => l.value === level)?.label || level;
  const getLevelColor = (level: string) =>
    levelColors[level] || 'bg-muted-foreground';

  const renderSkillForm = (skill: Skill, isNew: boolean) => (
    <Card variant="compact" hover className="mb-3 cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {skill.name || t('skills.newSkill')}
          </span>
          {skill.name && (
            <span className={`text-xs px-2 py-0.5 rounded text-foreground ${getLevelColor(skill.level)}`}>
              {getLevelLabel(skill.level)}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => isNew ? handleCancel() : onDelete(skill.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpandedId(expandedId === skill.id ? null : skill.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expandedId === skill.id ? '' : 'rotate-180'}`} />
          </Button>
        </div>
      </div>

      {expandedId === skill.id && (
        <div className="space-y-4 pt-3 border-t border-border">
          <div>
            <p className={labelCls}>{t('skills.name')}</p>
            <AutocompleteInput
              value={skill.name}
              onChange={value => isNew
                ? setNewSkill({ ...skill, name: value })
                : onUpdate(skill.id, { name: value })}
              suggestions={commonSkills}
              placeholder={t('skills.placeholder')}
            />
          </div>

          {!settings.showSkillsAsTags && (
            <div>
              <p className={`${labelCls} mb-2`}>
                {t('skills.level')} — {getLevelLabel(skill.level)}
              </p>
              <div className="flex gap-2">
                {getSkillLevels().map(level => (
                  <button
                    key={level.value}
                    onClick={() => isNew
                      ? setNewSkill({ ...skill, level: level.value as Skill['level'] })
                      : onUpdate(skill.id, { level: level.value as Skill['level'] })}
                    title={level.label}
                    className={`flex-1 h-7 rounded-md transition-colors duration-150 ${
                      skill.level === level.value ? level.color : 'bg-muted hover:bg-muted/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

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
        <span className="text-blue">{t('skills.titleHighlight')}</span>{' '}
        {t('skills.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('skills.subtitle')}</p>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Button variant="outline" size="sm" onClick={handleAdd} className="mb-4">
          <Plus className="w-4 h-4" />
          {t('skills.add')}
        </Button>

        <AnimatePresence mode="wait">
          {newSkill && (
            <motion.div key="new" variants={fadeInUp}>
              {renderSkillForm(newSkill, true)}
            </motion.div>
          )}
        </AnimatePresence>

        {skills.length === 0 && !newSkill && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border mb-6"
          >
            <Wrench className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{t('skills.emptyState')}</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> {t('skills.add')}
            </Button>
          </motion.div>
        )}

        {skills.length > 0 && (
          <SortableList items={skills} onReorder={onReorder}
            renderItem={skill => renderSkillForm(skill, false)} />
        )}
      </motion.div>

      <div className="flex items-center gap-8 mt-6 mb-8">
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.showSkillsAsTags}
            onCheckedChange={checked => setSettings({ ...settings, showSkillsAsTags: checked })}
          />
          <Label className="text-sm text-muted-foreground">{t('skills.showAsTags')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={!settings.showSkillLevels}
            onCheckedChange={checked => setSettings({ ...settings, showSkillLevels: !checked })}
          />
          <Label className="text-sm text-muted-foreground">{t('skills.hideLevels')}</Label>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={onNext}>
          {t('skills.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
