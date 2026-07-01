import { useState } from 'react';
import { Check, Copy, FileText, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/useAI';
import type { CVData, CVSettings } from '@/types/cv';

interface CoverLetterModalProps {
  open: boolean;
  onClose: () => void;
  cvData: CVData;
  settings: CVSettings;
}

type CoverLetterTone = 'professional' | 'dynamic' | 'creative';

export default function CoverLetterModal({ open, onClose, cvData, settings }: CoverLetterModalProps) {
  const { generate, loading, error } = useAI();
  const [jobOffer, setJobOffer] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState<CoverLetterTone>('professional');
  const [letter, setLetter] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    const result = await generate('generate-cover-letter', {
      firstName: cvData.contact.firstName,
      lastName: cvData.contact.lastName,
      jobTitle: cvData.contact.jobTitle,
      profile: cvData.profile,
      experiences: cvData.experiences,
      skills: cvData.skills,
      jobOffer,
      companyName,
      tone,
      language: settings.language,
    });

    if (typeof result === 'string') {
      setLetter(result);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={isOpen => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generer une lettre de motivation
          </DialogTitle>
        </DialogHeader>

        {!letter ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Offre d'emploi
              </label>
              <textarea
                value={jobOffer}
                onChange={e => setJobOffer(e.target.value)}
                placeholder="Collez le texte de l'offre d'emploi..."
                className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-background text-sm resize-y"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Nom de l'entreprise
              </label>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Ex: Google, BEYONDCOM..."
                className="w-full p-3 rounded-lg border border-border bg-background text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Ton</label>
              <div className="flex gap-2">
                {[
                  { value: 'professional', label: 'Professionnel' },
                  { value: 'dynamic', label: 'Dynamique' },
                  { value: 'creative', label: 'Creatif' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setTone(option.value as CoverLetterTone)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      tone === option.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                        : 'border-border text-muted-foreground hover:border-blue-500/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              variant="blue"
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={loading || !jobOffer.trim()}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generer la lettre
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border text-sm leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {letter}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-1.5" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copie !' : 'Copier'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setLetter('')}>
                Regenerer
              </Button>
              <Button variant="blue" className="flex-1" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
