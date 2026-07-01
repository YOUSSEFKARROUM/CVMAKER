import { useState } from 'react';
import { ArrowRight, Check, Loader2, Sparkles, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAI } from '@/hooks/useAI';
import type { CVData, CVSettings } from '@/types/cv';

interface PolishResult {
  profile?: string;
  experiences?: Array<{ id: string; jobTitle?: string; description?: string }>;
  educations?: Array<{ id: string; diploma?: string }>;
  skills?: Array<{ id: string; name?: string }>;
  projects?: Array<{ id: string; name?: string; description?: string }>;
  interests?: string[];
  changes?: string[];
}

interface PolishAllButtonProps {
  cvData: CVData;
  settings: CVSettings;
  onApply: (newData: Partial<CVData>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

function isPolishResult(value: unknown): value is PolishResult {
  return Boolean(value && typeof value === 'object');
}

export default function PolishAllButton({ cvData, settings, onApply, onNotify }: PolishAllButtonProps) {
  const { generate, error } = useAI();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PolishResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [backup, setBackup] = useState<CVData | null>(null);

  async function handlePolish() {
    setLoading(true);
    try {
      const response = await generate('polish-all', {
        profile: cvData.profile,
        experiences: cvData.experiences,
        educations: cvData.educations,
        skills: cvData.skills,
        projects: cvData.projects,
        interests: cvData.interests,
        languages: cvData.languages,
        language: settings.language,
      });

      if (isPolishResult(response)) {
        setResult(response);
        setShowPreview(true);
      }
    } catch {
      onNotify?.('Erreur lors de la reecriture IA', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!result) return;
    setBackup({
      ...cvData,
      experiences: [...cvData.experiences],
      educations: [...cvData.educations],
      skills: [...cvData.skills],
      projects: [...cvData.projects],
      interests: [...cvData.interests],
    });

    const updates: Partial<CVData> = {};

    if (result.profile) {
      updates.profile = result.profile;
    }

    if (result.experiences?.length) {
      updates.experiences = cvData.experiences.map(exp => {
        const improved = result.experiences?.find(item => item.id === exp.id);
        return improved
          ? {
              ...exp,
              jobTitle: improved.jobTitle || exp.jobTitle,
              description: improved.description || exp.description,
            }
          : exp;
      });
    }

    if (result.educations?.length) {
      updates.educations = cvData.educations.map(edu => {
        const improved = result.educations?.find(item => item.id === edu.id);
        return improved
          ? { ...edu, diploma: improved.diploma || edu.diploma }
          : edu;
      });
    }

    if (result.skills?.length) {
      updates.skills = cvData.skills.map(skill => {
        const improved = result.skills?.find(item => item.id === skill.id);
        return improved ? { ...skill, name: improved.name || skill.name } : skill;
      });
    }

    if (result.projects?.length) {
      updates.projects = cvData.projects.map(project => {
        const improved = result.projects?.find(item => item.id === project.id);
        return improved
          ? {
              ...project,
              name: improved.name || project.name,
              description: improved.description || project.description,
            }
          : project;
      });
    }

    if (result.interests?.length) {
      updates.interests = result.interests;
    }

    onApply(updates);
    setShowPreview(false);
    onNotify?.('CV poli avec succes. Vous pouvez annuler le polissage.', 'success');
  }

  function handleUndo() {
    if (!backup) return;
    onApply(backup);
    setBackup(null);
    onNotify?.('Modifications IA annulees', 'info');
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handlePolish}
          disabled={loading}
          className="gap-1.5 text-blue-600 border-blue-500/30 hover:bg-blue-500/10"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? 'Analyse...' : 'Polir tout le CV'}
        </Button>

        {backup && (
          <Button variant="ghost" size="sm" onClick={handleUndo} className="gap-1 text-amber-600">
            <Undo2 className="w-3.5 h-3.5" />
            Annuler
          </Button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Dialog open={showPreview} onOpenChange={isOpen => { if (!isOpen) setShowPreview(false); }}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Changements proposes par l'IA
            </DialogTitle>
          </DialogHeader>

          {Boolean(result?.changes?.length) && (
            <div className="space-y-2">
              {result?.changes?.map((change) => (
                <div key={change} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-foreground">{change}</span>
                </div>
              ))}
            </div>
          )}

          {result?.profile && (
            <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">PROFIL AMELIORE</h4>
              <p className="text-sm text-foreground">{result.profile}</p>
            </div>
          )}

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Annuler
            </Button>
            <Button variant="blue" onClick={handleApply} className="gap-1.5">
              Appliquer
              <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
