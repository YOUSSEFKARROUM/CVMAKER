import { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SortableList } from '../components/SortableList';
import { AISuggestionButton } from '../components/AISuggestionButton';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { generateExperienceSuggestions, commonJobTitles } from '../utils/aiSuggestions';
import type { Experience } from '../types/cv';

interface ExperienceFormProps {
  experiences: Experience[];
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

export function ExperienceForm({
  experiences,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onNext,
  onBack,
  onSkip,
}: ExperienceFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Experience | null>(null);

  const handleAdd = () => {
    const id = Date.now().toString();
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
    if (experiences.length === 0) {
      onSkip();
    } else {
      onNext();
    }
  };

  const getAISuggestions = async (): Promise<string[]> => {
    const exp = newExperience || experiences[experiences.length - 1];
    if (!exp) return [];
    return generateExperienceSuggestions(exp.jobTitle, 5, '500K€');
  };

  const applySuggestion = (suggestion: string) => {
    const exp = newExperience || experiences[experiences.length - 1];
    if (exp) {
      const currentDesc = exp.description;
      const newDesc = currentDesc ? `${currentDesc}\n• ${suggestion}` : `• ${suggestion}`;
      if (newExperience) {
        setNewExperience({ ...newExperience, description: newDesc });
      } else {
        onUpdate(exp.id, { description: newDesc });
      }
    }
  };

  const renderExperienceForm = (exp: Experience, isNew: boolean) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm">
            {exp.jobTitle || '(Non spécifié)'}, {exp.employer || 'Inconnu'} - {exp.city || 'Inconnu'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isNew ? handleCancel() : onDelete(exp.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${expandedId === exp.id ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {expandedId === exp.id && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-gray-500">INTITULÉ DU POSTE</Label>
              <AutocompleteInput
                value={exp.jobTitle}
                onChange={(value) => isNew 
                  ? setNewExperience({ ...exp, jobTitle: value })
                  : onUpdate(exp.id, { jobTitle: value })
                }
                suggestions={commonJobTitles}
                placeholder="Chef de projet"
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-gray-500">EMPLOYEUR</Label>
              <Input
                value={exp.employer}
                onChange={(e) => isNew
                  ? setNewExperience({ ...exp, employer: e.target.value })
                  : onUpdate(exp.id, { employer: e.target.value })
                }
                placeholder="Maroc Telecom"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-gray-500">DATE DE DÉBUT</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => isNew
                  ? setNewExperience({ ...exp, startDate: e.target.value })
                  : onUpdate(exp.id, { startDate: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-gray-500">DATE DE FIN</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => isNew
                  ? setNewExperience({ ...exp, endDate: e.target.value })
                  : onUpdate(exp.id, { endDate: e.target.value })
                }
                className="mt-1"
                disabled={exp.currentlyWorking}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={exp.currentlyWorking}
                onCheckedChange={(checked) => isNew
                  ? setNewExperience({ ...exp, currentlyWorking: checked as boolean })
                  : onUpdate(exp.id, { currentlyWorking: checked as boolean })
                }
              />
              <Label className="text-sm text-gray-500">J'occupe ce poste actuellement</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={exp.hideMonths}
                onCheckedChange={(checked) => isNew
                  ? setNewExperience({ ...exp, hideMonths: checked as boolean })
                  : onUpdate(exp.id, { hideMonths: checked as boolean })
                }
              />
              <Label className="text-sm text-gray-500">Masquer les mois</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={exp.showDuration}
                onCheckedChange={(checked) => isNew
                  ? setNewExperience({ ...exp, showDuration: checked as boolean })
                  : onUpdate(exp.id, { showDuration: checked as boolean })
                }
              />
              <Label className="text-sm text-gray-500">Afficher la durée</Label>
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">VILLE</Label>
            <Input
              value={exp.city}
              onChange={(e) => isNew
                ? setNewExperience({ ...exp, city: e.target.value })
                : onUpdate(exp.id, { city: e.target.value })
              }
              placeholder="Casablanca"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">DESCRIPTION</Label>
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
                value={exp.description}
                onChange={(e) => isNew
                  ? setNewExperience({ ...exp, description: e.target.value })
                  : onUpdate(exp.id, { description: e.target.value })
                }
                placeholder="J'ai travaillé comme chef de projet chez Maroc Telecom pendant cinq ans."
                className="w-full p-3 min-h-[100px] resize-none outline-none"
              />
            </div>
            <AISuggestionButton
              onSuggest={getAISuggestions}
              onApply={applySuggestion}
              buttonText="Suggestions IA pour la description"
            />
          </div>

          {isNew && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleSave} className="bg-[#2196F3] hover:bg-[#1976D2]">
                Enregistrer
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
        <span className="text-[#2196F3]">Parlez-nous</span> de votre expérience
      </h2>
      <p className="text-gray-500 mb-8">
        Écrivez vos emplois (les plus récents) avec de courts points de ce que vous avez fait.
      </p>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-[#2196F3] font-medium mb-4 hover:underline"
      >
        <Plus className="w-5 h-5" />
        Ajouter une expérience
      </button>

      {newExperience && renderExperienceForm(newExperience, true)}

      {experiences.length > 0 && (
        <SortableList
          items={experiences}
          onReorder={onReorder}
          renderItem={(exp) => renderExperienceForm(exp, false)}
        />
      )}

      <p className="text-gray-500 text-sm mb-8">
        Dans cette section, listez des expériences professionnelles connexes acquises au cours des 10 dernières années ainsi que les dates. Mentionnez d'abord l'emploi le plus récent.
      </p>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Revenir en arrière
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          Aller à Formation
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
