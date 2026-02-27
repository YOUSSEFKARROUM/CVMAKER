import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { commonSchools } from '../utils/aiSuggestions';
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

export function EducationForm({
  educations,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onNext,
  onBack,
  onSkip,
}: EducationFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education | null>(null);

  // Options de diplômes traduites
  const diplomaOptions = [
    { value: '', label: t('education.selectDiploma') },
    { value: 'Bac', label: t('education.diplomas.bac') },
    { value: 'Bac+2', label: t('education.diplomas.bac2') },
    { value: 'Licence', label: t('education.diplomas.licence') },
    { value: 'Master', label: t('education.diplomas.master') },
    { value: 'Doctorat', label: t('education.diplomas.doctorat') },
    { value: 'Certification', label: t('education.diplomas.certification') },
    { value: 'Autre', label: t('education.diplomas.other') },
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
    if (educations.length === 0) {
      onSkip();
    } else {
      onNext();
    }
  };

  const renderEducationForm = (edu: Education, isNew: boolean) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm">
            {edu.school || `(${t('common.notSpecified')})`}, {edu.diploma || t('common.unknown')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isNew ? handleCancel() : onDelete(edu.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${expandedId === edu.id ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {expandedId === edu.id && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('education.school')}</Label>
              <AutocompleteInput
                value={edu.school}
                onChange={(value) => isNew 
                  ? setNewEducation({ ...edu, school: value })
                  : onUpdate(edu.id, { school: value })
                }
                suggestions={commonSchools}
                placeholder={t('education.schoolPlaceholder') || 'Université Hassan II'}
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('education.diploma')}</Label>
              <select
                value={edu.diploma}
                onChange={(e) => isNew
                  ? setNewEducation({ ...edu, diploma: e.target.value })
                  : onUpdate(edu.id, { diploma: e.target.value })
                }
                className="w-full mt-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              >
                {diplomaOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('education.graduationDate')}</Label>
              <Input
                type="month"
                value={edu.graduationDate}
                onChange={(e) => isNew
                  ? setNewEducation({ ...edu, graduationDate: e.target.value })
                  : onUpdate(edu.id, { graduationDate: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('education.city')}</Label>
              <Input
                value={edu.city}
                onChange={(e) => isNew
                  ? setNewEducation({ ...edu, city: e.target.value })
                  : onUpdate(edu.id, { city: e.target.value })
                }
                placeholder={t('education.cityPlaceholder') || 'Casablanca'}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">{t('education.description')}</Label>
            <div className="border border-gray-200 rounded-lg mt-1">
              <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                <button className="p-1 hover:bg-gray-100 rounded"><Bold className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><Italic className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><Underline className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><Strikethrough className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><List className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><ListOrdered className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><Link className="w-4 h-4" /></button>
              </div>
              <textarea
                value={edu.description}
                onChange={(e) => isNew
                  ? setNewEducation({ ...edu, description: e.target.value })
                  : onUpdate(edu.id, { description: e.target.value })
                }
                placeholder={t('education.descriptionPlaceholder') || 'Décrivez vos études et réalisations...'}
                className="w-full p-3 min-h-[100px] resize-none outline-none"
              />
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
        <span className="text-[#2196F3]">{t('education.titleHighlight')}</span> {t('education.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('education.subtitle')}
      </p>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-[#2196F3] font-medium mb-4 hover:underline"
      >
        <Plus className="w-5 h-5" />
        {t('education.add')}
      </button>

      {newEducation && renderEducationForm(newEducation, true)}

      {educations.length > 0 && (
        <SortableList
          items={educations}
          onReorder={onReorder}
          renderItem={(edu) => renderEducationForm(edu, false)}
        />
      )}

      <p className="text-gray-500 text-sm mb-8">
        {t('education.helpText')}
      </p>

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
          onClick={handleNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {t('education.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
