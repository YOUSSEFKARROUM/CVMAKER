import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AIButton from '@/components/AIButton';
import { useAI } from '@/hooks/useAI';
import { SortableList } from '../components/SortableList';
import { AISuggestionButton } from '../components/AISuggestionButton';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { RichTextArea } from '../components/RichTextArea';
import { generateExperienceSuggestions, commonJobTitles } from '../utils/aiSuggestions';
import { fadeInUp, staggerContainer } from '../styles/design-system';
import type { CVSettings, Experience } from '../types/cv';

interface ExperienceFormProps {
  experiences: Experience[];
  settings: CVSettings;
  onAdd: (experience: Experience) => void;
  onUpdate: (id: string, experience: Partial<Experience>) => void;
  onDelete: (id: string) => void;
  onReorder: (experiences: Experience[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const emptyExperience: Experience = {
  id: '',
  jobTitle: '',
  employer: '',
  city: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: '',
  hideMonths: false,
  showDuration: false,
};

const labelCls = 'block text-sm font-medium text-foreground mb-1';

export function ExperienceForm({
  experiences, settings, onAdd, onUpdate, onDelete, onReorder, onNext, onBack, onSkip,
}: ExperienceFormProps) {
  const { t } = useTranslation();
  const { generate, error: aiError } = useAI();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Experience | null>(null);

  const handleAdd = () => {
    const id = crypto.randomUUID();
    setNewExperience({ ...emptyExperience, id });
    setExpandedId(id);
  };

  const handleSave = () => {
    if (newExperience && newExperience.jobTitle.trim()) {
      onAdd(newExperience);
      setNewExperience(null);
      setExpandedId(null);
    }
  };

  const handleCancel = () => {
    setNewExperience(null);
    setExpandedId(null);
  };

  const handleNext = () => {
    if (experiences.length === 0) { onSkip(); } else { onNext(); }
  };

  const handleImproveExperience = async (exp: Experience, isNew: boolean) => {
    const result = await generate('improve-experience', {
      jobTitle: exp.jobTitle,
      employer: exp.employer,
      description: exp.description,
      language: settings.language,
    });

    if (typeof result !== 'string') return;
    if (isNew) {
      setNewExperience(prev => prev ? { ...prev, description: result } : prev);
    } else {
      onUpdate(exp.id, { description: result });
    }
  };

  const renderExperienceForm = (exp: Experience, isNew: boolean) => {
    const getAISuggestions = async (): Promise<string[]> =>
      generateExperienceSuggestions(exp.jobTitle, 5, '500K€');

    const applySuggestion = (suggestion: string) => {
      const currentDesc = exp.description;
      const newDesc = currentDesc ? `${currentDesc}\n• ${suggestion}` : `• ${suggestion}`;
      if (isNew) {
        setNewExperience(prev => prev ? { ...prev, description: newDesc } : prev);
      } else {
        onUpdate(exp.id, { description: newDesc });
      }
    };

    return (
      <Card variant="compact" hover className="mb-3 cursor-grab active:cursor-grabbing">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm text-muted-foreground">
            {exp.jobTitle || `(${t('common.notSpecified')})`}, {exp.employer || t('common.unknown')} — {exp.city || t('common.unknown')}
          </p>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => isNew ? handleCancel() : onDelete(exp.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expandedId === exp.id ? '' : 'rotate-180'}`} />
            </Button>
          </div>
        </div>

        {expandedId === exp.id && (
          <div className="space-y-4 pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={labelCls}>{t('experience.jobTitle')}</p>
                <AutocompleteInput
                  value={exp.jobTitle}
                  onChange={value => isNew
                    ? setNewExperience({ ...exp, jobTitle: value })
                    : onUpdate(exp.id, { jobTitle: value })}
                  suggestions={commonJobTitles}
                  placeholder={t('experience.jobTitlePlaceholder') || 'Chef de projet'}
                />
              </div>
              <FormField label={t('experience.employer')}>
                <Input
                  value={exp.employer}
                  onChange={e => isNew
                    ? setNewExperience({ ...exp, employer: e.target.value })
                    : onUpdate(exp.id, { employer: e.target.value })}
                  placeholder={t('experience.employerPlaceholder') || 'Maroc Telecom'}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('experience.startDate')}>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={e => isNew
                    ? setNewExperience({ ...exp, startDate: e.target.value })
                    : onUpdate(exp.id, { startDate: e.target.value })}
                />
              </FormField>
              <FormField label={t('experience.endDate')}>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={e => isNew
                    ? setNewExperience({ ...exp, endDate: e.target.value })
                    : onUpdate(exp.id, { endDate: e.target.value })}
                  disabled={exp.currentlyWorking}
                />
              </FormField>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              {([
                ['currentlyWorking', 'experience.currentlyWorking'],
                ['hideMonths',       'experience.hideMonths'],
                ['showDuration',     'experience.showDuration'],
              ] as const).map(([field, key]) => (
                <div key={field} className="flex items-center gap-2">
                  <Checkbox
                    checked={exp[field] as boolean}
                    onCheckedChange={checked => isNew
                      ? setNewExperience({ ...exp, [field]: checked as boolean })
                      : onUpdate(exp.id, { [field]: checked as boolean })}
                  />
                  <Label className="text-sm text-muted-foreground cursor-pointer">{t(key)}</Label>
                </div>
              ))}
            </div>

            <FormField label={t('experience.city')}>
              <Input
                value={exp.city}
                onChange={e => isNew
                  ? setNewExperience({ ...exp, city: e.target.value })
                  : onUpdate(exp.id, { city: e.target.value })}
                placeholder={t('experience.cityPlaceholder') || 'Casablanca'}
              />
            </FormField>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{t('experience.description')}</p>
                <AIButton
                  onClick={() => handleImproveExperience(exp, isNew)}
                  label={t('ai.improveExperience')}
                  disabled={!exp.jobTitle.trim() && !exp.description.trim()}
                />
              </div>
              <RichTextArea
                value={exp.description}
                onChange={html => isNew
                  ? setNewExperience(prev => prev ? { ...prev, description: html } : prev)
                  : onUpdate(exp.id, { description: html })}
                placeholder={t('experience.descriptionPlaceholder')}
                id={`experience-description-${exp.id || 'new'}`}
              />
              <AISuggestionButton
                onSuggest={getAISuggestions}
                onApply={applySuggestion}
                buttonText={t('experience.aiSuggestions')}
              />
              {aiError && (
                <p className="mt-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {aiError}
                </p>
              )}
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
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
        <span className="text-blue">{t('experience.titleHighlight')}</span>{' '}
        {t('experience.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('experience.subtitle')}</p>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Button variant="outline" size="sm" onClick={handleAdd} className="mb-4">
          <Plus className="w-4 h-4" />
          {t('experience.add')}
        </Button>

        <AnimatePresence mode="wait">
          {newExperience && (
            <motion.div key="new" variants={fadeInUp}>
              {renderExperienceForm(newExperience, true)}
            </motion.div>
          )}
        </AnimatePresence>

        {experiences.length === 0 && !newExperience && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border mb-6"
          >
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{t('experience.emptyState')}</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> {t('experience.add')}
            </Button>
          </motion.div>
        )}

        {experiences.length > 0 && (
          <SortableList items={experiences} onReorder={onReorder}
            renderItem={exp => renderExperienceForm(exp, false)} />
        )}
      </motion.div>

      <p className="text-xs text-muted-foreground mb-8">{t('experience.helpText')}</p>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={handleNext}>
          {t('experience.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
