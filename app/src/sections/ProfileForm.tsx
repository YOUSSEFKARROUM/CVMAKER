import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [charCount, setCharCount] = useState(profile.length);

  const handleChange = (value: string) => {
    onUpdate(value);
    setCharCount(value.length);
  };

  const getAISuggestions = async (): Promise<string[]> => {
    return [
      generateProfileSuggestion('Développeur Web', 3, ['React', 'TypeScript', 'Node.js']),
      generateProfileSuggestion('Chef de Projet', 5, ['Agile', 'Scrum', 'Gestion d\'équipe']),
      t('profile.sampleText'),
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

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        <span className="text-[#2196F3]">{t('profile.titleHighlight')}</span> {t('profile.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('profile.subtitle')}
      </p>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs uppercase text-gray-500">{t('profile.aboutMe')}</Label>
          <span className={`text-xs ${charCount > 500 ? 'text-orange-500' : 'text-gray-400'}`}>
            {charCount} {t('profile.characters')}
          </span>
        </div>
        <div className="border border-gray-200 rounded-lg mt-1">
          <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
            <button 
              onClick={() => insertFormatting('bold')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.bold')}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('italic')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.italic')}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('underline')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.underline')}
            >
              <Underline className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('strikethrough')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.strikethrough')}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button 
              onClick={() => insertFormatting('list')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.list')}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('ordered-list')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.orderedList')}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button 
              onClick={() => insertFormatting('link')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t('profile.formatting.link')}
            >
              <Link className="w-4 h-4" />
            </button>
          </div>
          <textarea
            id="profile-textarea"
            value={profile}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t('profile.placeholder')}
            className="w-full p-3 min-h-[150px] resize-none outline-none"
            maxLength={1000}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <AISuggestionButton
            onSuggest={getAISuggestions}
            onApply={applySuggestion}
            buttonText={t('profile.aiButton')}
            dialogTitle={t('profile.aiTitle')}
          />
          <span className="text-xs text-gray-400">
            {t('profile.maxCharacters')}
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
          {t('nav.back')}
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {t('profile.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
