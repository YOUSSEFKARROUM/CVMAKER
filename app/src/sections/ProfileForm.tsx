import { useState } from 'react';
import { ArrowRight, ArrowLeft, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AISuggestionButton } from '../components/AISuggestionButton';
import { generateProfileSuggestion } from '../utils/aiSuggestions';

interface ProfileFormProps {
  profile: string;
  onUpdate: (profile: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function ProfileForm({
  profile,
  onUpdate,
  onNext,
  onBack,
  onSkip,
}: ProfileFormProps) {
  const [charCount, setCharCount] = useState(profile.length);

  const handleChange = (value: string) => {
    onUpdate(value);
    setCharCount(value.length);
  };

  const getAISuggestions = async (): Promise<string[]> => {
    // In a real app, this would call an AI API
    return [
      generateProfileSuggestion('Développeur Web', 3, ['React', 'TypeScript', 'Node.js']),
      generateProfileSuggestion('Chef de Projet', 5, ['Agile', 'Scrum', 'Gestion d\'équipe']),
      'Professionnel passionné avec une solide expérience dans mon domaine. Je combine expertise technique et soft skills pour mener à bien les projets qui me sont confiés.',
    ];
  };

  const applySuggestion = (suggestion: string) => {
    handleChange(suggestion);
  };

  const handleNext = () => {
    if (!profile.trim()) {
      onSkip();
    } else {
      onNext();
    }
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('profile-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = profile.substring(start, end);
    
    let formattedText = '';
    switch (tag) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'list':
        formattedText = `\n• ${selectedText}`;
        break;
      case 'ordered-list':
        formattedText = `\n1. ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newText = profile.substring(0, start) + formattedText + profile.substring(end);
    handleChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        <span className="text-[#2196F3]">Rédigez</span> votre profil professionnel
      </h2>
      <p className="text-gray-500 mb-8">
        Écrivez 2-4 courtes lignes sur votre travail, vos réussites et vos compétences.
      </p>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs uppercase text-gray-500">À PROPOS DE MOI</Label>
          <span className={`text-xs ${charCount > 500 ? 'text-orange-500' : 'text-gray-400'}`}>
            {charCount} caractères
          </span>
        </div>
        <div className="border border-gray-200 rounded-lg mt-1">
          <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
            <button 
              onClick={() => insertFormatting('bold')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Gras"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('italic')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Italique"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('underline')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Souligné"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('strikethrough')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Barré"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button 
              onClick={() => insertFormatting('list')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Liste à puces"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('ordered-list')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Liste numérotée"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('link')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Lien"
            >
              <Link className="w-4 h-4" />
            </button>
          </div>
          <textarea
            id="profile-textarea"
            value={profile}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Je suis un chef de projet expérimenté et je cherche à réussir dans un nouveau poste."
            className="w-full p-3 min-h-[150px] resize-none outline-none"
            maxLength={1000}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <AISuggestionButton
            onSuggest={getAISuggestions}
            onApply={applySuggestion}
            buttonText="Générer avec l'IA"
            dialogTitle="Suggestions de profil"
          />
          <span className="text-xs text-gray-400">
            Maximum 1000 caractères
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-8">
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
          Aller à Terminez-le
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
