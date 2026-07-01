import { useState } from 'react';
import { AlertTriangle, Check, Loader2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/useAI';
import type { CVData, CVSettings } from '@/types/cv';

export interface ATSOptimizationResult {
  matchScore?: number;
  missingKeywords?: string[];
  suggestedChanges?: Array<{
    section: 'profile' | 'experience' | string;
    index?: number;
    field?: string;
    suggested?: string;
  }>;
  newSkills?: string[];
  tips?: string[];
}

interface ATSOptimizerProps {
  cvData: CVData;
  settings: CVSettings;
  onApplyChanges: (changes: ATSOptimizationResult) => void;
}

function isATSResult(value: unknown): value is ATSOptimizationResult {
  return Boolean(value && typeof value === 'object');
}

export default function ATSOptimizer({ cvData, settings, onApplyChanges }: ATSOptimizerProps) {
  const { generate, loading, error } = useAI();
  const [jobOffer, setJobOffer] = useState('');
  const [result, setResult] = useState<ATSOptimizationResult | null>(null);

  async function handleOptimize() {
    if (!jobOffer.trim()) return;

    const response = await generate('optimize-ats', {
      jobOffer,
      jobTitle: cvData.contact.jobTitle,
      profile: cvData.profile,
      experiences: cvData.experiences,
      skills: cvData.skills,
      language: settings.language,
    });

    if (isATSResult(response)) {
      setResult(response);
    }
  }

  const score = result?.matchScore ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">
          Collez l'offre d'emploi visee
        </label>
        <textarea
          value={jobOffer}
          onChange={e => setJobOffer(e.target.value)}
          placeholder="Collez ici le texte de l'offre d'emploi..."
          className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-background text-sm resize-y"
        />
      </div>

      <Button
        variant="blue"
        onClick={handleOptimize}
        disabled={loading || !jobOffer.trim()}
        className="w-full gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
        Analyser la compatibilite ATS
      </Button>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className={`text-4xl font-bold ${
              score >= 70 ? 'text-green-600' :
              score >= 40 ? 'text-amber-600' : 'text-red-600'
            }`}
            >
              {score}%
            </div>
            <p className="text-sm text-muted-foreground">Compatibilite ATS</p>
          </div>

          {Boolean(result.missingKeywords?.length) && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Mots-cles manquants
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords?.map((keyword) => (
                  <span key={keyword} className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Boolean(result.newSkills?.length) && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Competences a ajouter</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.newSkills?.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Boolean(result.tips?.length) && (
            <div className="space-y-1.5">
              {result.tips?.map((tip) => (
                <p key={tip} className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  {tip}
                </p>
              ))}
            </div>
          )}

          <Button variant="blue" className="w-full gap-2" onClick={() => onApplyChanges(result)}>
            <Check className="w-4 h-4" />
            Appliquer les suggestions
          </Button>
        </div>
      )}
    </div>
  );
}
