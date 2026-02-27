import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export function InterestsForm({
  interests,
  onUpdate,
  onNext,
  onBack,
  onSkip,
}: InterestsFormProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (!trimmed) return;
    if (!interests.includes(trimmed)) {
      onUpdate([...interests, trimmed]);
    }
    setInputValue('');
  };

  const removeInterest = (interestToRemove: string) => {
    onUpdate(interests.filter(i => i !== interestToRemove));
  };

  const handleNext = () => {
    if (interests.length === 0) {
      onSkip();
    } else {
      onNext();
    }
  };

  const filteredSuggestions = suggestedInterests.filter(
    interest => 
      interest.toLowerCase().includes(inputValue.toLowerCase()) && 
      !interests.includes(interest)
  ).slice(0, 10);

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        <span className="text-[#2196F3]">{t('interests.titleHighlight')}</span> {t('interests.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('interests.subtitle')}
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <Label className="text-xs uppercase text-gray-500 mb-3 block">
          {t('interests.addLabel')}
        </Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest(inputValue);
              }
            }}
            placeholder={t('interests.placeholder')}
            className="flex-1"
          />
          <Button
            onClick={() => addInterest(inputValue)}
            disabled={!inputValue.trim()}
            className="bg-[#2196F3] hover:bg-[#1976D2]"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {inputValue && filteredSuggestions.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-2">{t('interests.suggestions')} :</p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addInterest(suggestion)}
                  className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {interests.length > 0 && (
        <div className="mb-6">
          <Label className="text-xs uppercase text-gray-500 mb-3 block">
            {t('interests.myInterests')} ({interests.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium"
              >
                <Heart className="w-3 h-3" />
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">💡 {t('interests.tipProTitle')}</h4>
          <p className="text-sm text-gray-600">
            {t('interests.tipProText')}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">⚠️ {t('interests.avoidTitle')}</h4>
          <p className="text-sm text-gray-600">
            {t('interests.avoidText')}
          </p>
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
          onClick={handleNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {t('interests.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
