import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface InterestsFormProps {
  interests: string[];
  onUpdate: (interests: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const suggestedInterests = [
  'Lecture', 'Voyages', 'Photographie', 'Musique', 'Sport', 'Cinéma', 'Cuisine',
  'Jardinage', 'Technologie', 'Jeux vidéo', 'Randonnée', 'Natation', 'Course à pied',
  'Yoga', 'Méditation', 'Peinture', 'Dessin', 'Écriture', 'Bénévolat', 'Associations',
  'Échecs', 'Bridge', 'Danse', 'Théâtre', 'Développement personnel', 'Finance',
  'Investissement', 'Crypto-monnaies', 'Blockchain', 'Intelligence artificielle',
];

const labelCls = 'block text-sm font-medium text-foreground mb-1';

export function InterestsForm({ interests, onUpdate, onNext, onBack, onSkip }: InterestsFormProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (!trimmed || interests.includes(trimmed)) return;
    onUpdate([...interests, trimmed]);
    setInputValue('');
  };

  const removeInterest = (interestToRemove: string) =>
    onUpdate(interests.filter(i => i !== interestToRemove));

  const handleNext = () => {
    if (interests.length === 0) { onSkip(); } else { onNext(); }
  };

  const filteredSuggestions = suggestedInterests
    .filter(i => i.toLowerCase().includes(inputValue.toLowerCase()) && !interests.includes(i))
    .slice(0, 10);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
        <span className="text-blue">{t('interests.titleHighlight')}</span>{' '}
        {t('interests.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('interests.subtitle')}</p>

      {/* Input card */}
      <Card variant="compact" className="mb-6">
        <p className={`${labelCls} mb-3`}>{t('interests.addLabel')}</p>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest(inputValue);
              }
            }}
            placeholder={t('interests.placeholder')}
            className="flex-1"
          />
          <Button variant="blue" onClick={() => addInterest(inputValue)} disabled={!inputValue.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {inputValue && filteredSuggestions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">{t('interests.suggestions')}</p>
            <div className="flex flex-wrap gap-1.5">
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => addInterest(suggestion)}
                  className="text-xs px-2.5 py-1.5 bg-blue/8 text-blue rounded-md hover:bg-blue/15 transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Current interests */}
      {interests.length > 0 && (
        <div className="mb-6">
          <p className={`${labelCls} mb-3`}>
            {t('interests.myInterests')} ({interests.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-md text-sm text-foreground font-medium"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card variant="compact">
          <h4 className="text-sm font-medium text-foreground mb-1">💡 {t('interests.tipProTitle')}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{t('interests.tipProText')}</p>
        </Card>
        <Card variant="compact">
          <h4 className="text-sm font-medium text-foreground mb-1">⚠️ {t('interests.avoidTitle')}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{t('interests.avoidText')}</p>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={handleNext}>
          {t('interests.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
