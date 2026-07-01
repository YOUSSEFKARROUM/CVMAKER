import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AISuggestionButton } from '../components/AISuggestionButton';
import AIButton from '@/components/AIButton';
import { useAI } from '@/hooks/useAI';
import { generateProfileSuggestion } from '../utils/aiSuggestions';
import type { CVData, CVSettings } from '../types/cv';

interface ProfileFormProps {
  profile: string;
  cvData: CVData;
  settings: CVSettings;
  onUpdate: (profile: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const labelCls = 'block text-sm font-medium text-foreground mb-1';

export function ProfileForm({ profile, cvData, settings, onUpdate, onNext, onBack, onSkip }: ProfileFormProps) {
  const { t } = useTranslation();
  const { generate, error: aiError } = useAI();
  const [charCount, setCharCount] = useState(profile.length);

  const handleChange = (value: string) => {
    onUpdate(value);
    setCharCount(value.length);
  };

  const getAISuggestions = async (): Promise<string[]> => [
    generateProfileSuggestion('Développeur Web', 3, ['React', 'TypeScript', 'Node.js']),
    generateProfileSuggestion('Chef de Projet', 5, ['Agile', 'Scrum', 'Gestion d\'équipe']),
    t('profile.sampleText'),
  ];

  const applySuggestion = (suggestion: string) => handleChange(suggestion);

  const handleGenerateProfile = async () => {
    const result = await generate('generate-profile', {
      firstName: cvData.contact.firstName,
      lastName: cvData.contact.lastName,
      jobTitle: cvData.contact.jobTitle,
      experiences: cvData.experiences,
      skills: cvData.skills,
      educations: cvData.educations,
      language: settings.language,
    });

    if (typeof result === 'string') {
      handleChange(result);
    }
  };

  const handleNext = () => {
    if (!profile.trim()) { onSkip(); } else { onNext(); }
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('profile-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start         = textarea.selectionStart;
    const end           = textarea.selectionEnd;
    const selectedText  = profile.substring(start, end);

    let formattedText = '';
    switch (tag) {
      case 'bold':          formattedText = `**${selectedText}**`; break;
      case 'italic':        formattedText = `*${selectedText}*`;   break;
      case 'underline':     formattedText = `<u>${selectedText}</u>`; break;
      case 'strikethrough': formattedText = `~~${selectedText}~~`; break;
      case 'list':          formattedText = `\n• ${selectedText}`; break;
      case 'ordered-list':  formattedText = `\n1. ${selectedText}`; break;
      default:              formattedText = selectedText;
    }

    const newText = profile.substring(0, start) + formattedText + profile.substring(end);
    handleChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const toolbarBtns = [
    { tag: 'bold',          Icon: Bold,          title: t('profile.formatting.bold') },
    { tag: 'italic',        Icon: Italic,        title: t('profile.formatting.italic') },
    { tag: 'underline',     Icon: Underline,     title: t('profile.formatting.underline') },
    { tag: 'strikethrough', Icon: Strikethrough, title: t('profile.formatting.strikethrough') },
  ];
  const listBtns = [
    { tag: 'list',          Icon: List,          title: t('profile.formatting.list') },
    { tag: 'ordered-list',  Icon: ListOrdered,   title: t('profile.formatting.orderedList') },
    { tag: 'link',          Icon: Link,          title: t('profile.formatting.link') },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
        <span className="text-blue">{t('profile.titleHighlight')}</span>{' '}
        {t('profile.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('profile.subtitle')}</p>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className={labelCls}>{t('profile.aboutMe')}</p>
          <span className={`text-xs tabular-nums ${charCount > 500 ? 'text-orange-500' : 'text-muted-foreground'}`}>
            {charCount} {t('profile.characters')}
          </span>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
            {toolbarBtns.map(({ tag, Icon, title }) => (
              <button
                key={tag}
                onClick={() => insertFormatting(tag)}
                title={title}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            {listBtns.map(({ tag, Icon, title }) => (
              <button
                key={tag}
                onClick={() => insertFormatting(tag)}
                title={title}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <textarea
            id="profile-textarea"
            value={profile}
            onChange={e => handleChange(e.target.value)}
            placeholder={t('profile.placeholder')}
            className="w-full px-3 py-2.5 min-h-[120px] resize-y text-sm bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            maxLength={1000}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <AIButton onClick={handleGenerateProfile} label={t('ai.generateProfile')} />
            <AISuggestionButton
              onSuggest={getAISuggestions}
              onApply={applySuggestion}
              buttonText={t('profile.aiButton')}
              dialogTitle={t('profile.aiTitle')}
            />
          </div>
          <span className="text-xs text-muted-foreground">{t('profile.maxCharacters')}</span>
        </div>
        {aiError && (
          <p className="mt-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {aiError}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={handleNext}>
          {t('profile.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
