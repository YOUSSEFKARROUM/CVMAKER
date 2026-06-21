import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { RichTextArea } from '../components/RichTextArea';
import { commonSchools } from '../utils/aiSuggestions';
import { fadeInUp, staggerContainer } from '../styles/design-system';
import type { Education } from '../types/cv';

interface EducationFormProps {
  educations: Education[];
  onAdd: (education: Education) => void;
  onUpdate: (id: string, education: Partial<Education>) => void;
  onDelete: (id: string) => void;
  onReorder: (educations: Education[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const emptyEducation: Education = {
  id: '',
  school: '',
  diploma: '',
  city: '',
  graduationDate: '',
  description: '',
};

const labelCls = 'block text-xs font-medium uppercase tracking-wider text-muted-foreground';

export function EducationForm({
  educations, onAdd, onUpdate, onDelete, onReorder, onNext, onBack, onSkip,
}: EducationFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education | null>(null);

  const diplomaOptions = [
    { value: '',              label: t('education.selectDiploma') },
    { value: 'Bac',          label: t('education.diplomas.bac') },
    { value: 'Bac+2',        label: t('education.diplomas.bac2') },
    { value: 'Licence',      label: t('education.diplomas.licence') },
    { value: 'Master',       label: t('education.diplomas.master') },
    { value: 'Doctorat',     label: t('education.diplomas.doctorat') },
    { value: 'Certification',label: t('education.diplomas.certification') },
    { value: 'Autre',        label: t('education.diplomas.other') },
  ];

  const handleAdd = () => {
    const id = crypto.randomUUID();
    setNewEducation({ ...emptyEducation, id });
    setExpandedId(id);
  };

  const handleSave = () => {
    if (newEducation && newEducation.school.trim()) {
      onAdd(newEducation);
      setNewEducation(null);
      setExpandedId(null);
    }
  };

  const handleCancel = () => {
    setNewEducation(null);
    setExpandedId(null);
  };

  const handleNext = () => {
    if (educations.length === 0) { onSkip(); } else { onNext(); }
  };

  const renderEducationForm = (edu: Education, isNew: boolean) => (
    <Card variant="compact" hover className="mb-3 cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm text-muted-foreground">
          {edu.school || `(${t('common.notSpecified')})`}, {edu.diploma || t('common.unknown')}
        </p>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => isNew ? handleCancel() : onDelete(edu.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expandedId === edu.id ? '' : 'rotate-180'}`} />
          </Button>
        </div>
      </div>

      {expandedId === edu.id && (
        <div className="space-y-4 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelCls}>{t('education.school')}</p>
              <AutocompleteInput
                value={edu.school}
                onChange={value => isNew
                  ? setNewEducation({ ...edu, school: value })
                  : onUpdate(edu.id, { school: value })}
                suggestions={commonSchools}
                placeholder={t('education.schoolPlaceholder') || 'Université Hassan II'}
              />
            </div>
            <div>
              <p className={labelCls}>{t('education.diploma')}</p>
              <select
                value={edu.diploma}
                onChange={e => isNew
                  ? setNewEducation({ ...edu, diploma: e.target.value })
                  : onUpdate(edu.id, { diploma: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 text-foreground"
              >
                {diplomaOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('education.graduationDate')}>
              <Input
                type="month"
                value={edu.graduationDate}
                onChange={e => isNew
                  ? setNewEducation({ ...edu, graduationDate: e.target.value })
                  : onUpdate(edu.id, { graduationDate: e.target.value })}
              />
            </FormField>
            <FormField label={t('education.city')}>
              <Input
                value={edu.city}
                onChange={e => isNew
                  ? setNewEducation({ ...edu, city: e.target.value })
                  : onUpdate(edu.id, { city: e.target.value })}
                placeholder={t('education.cityPlaceholder') || 'Casablanca'}
              />
            </FormField>
          </div>

          <div>
            <p className={labelCls}>{t('education.description')}</p>
            <RichTextArea
              value={edu.description}
              onChange={html => isNew
                ? setNewEducation(prev => prev ? { ...prev, description: html } : prev)
                : onUpdate(edu.id, { description: html })}
              placeholder={t('education.descriptionPlaceholder') || 'Décrivez vos études et réalisations...'}
              id={`education-description-${edu.id || 'new'}`}
            />
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
        <span className="text-blue">{t('education.titleHighlight')}</span>{' '}
        {t('education.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('education.subtitle')}</p>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Button variant="outline" size="sm" onClick={handleAdd} className="mb-4">
          <Plus className="w-4 h-4" />
          {t('education.add')}
        </Button>

        <AnimatePresence mode="wait">
          {newEducation && (
            <motion.div key="new" variants={fadeInUp}>
              {renderEducationForm(newEducation, true)}
            </motion.div>
          )}
        </AnimatePresence>

        {educations.length === 0 && !newEducation && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border mb-6"
          >
            <GraduationCap className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{t('education.emptyState')}</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> {t('education.add')}
            </Button>
          </motion.div>
        )}

        {educations.length > 0 && (
          <SortableList items={educations} onReorder={onReorder}
            renderItem={edu => renderEducationForm(edu, false)} />
        )}
      </motion.div>

      <p className="text-xs text-muted-foreground mb-8">{t('education.helpText')}</p>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={handleNext}>
          {t('education.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
