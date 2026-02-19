import { AlertCircle, Lightbulb, TrendingUp, Award } from 'lucide-react';
import type { CVData, CVStats } from '../types/cv';

interface CVStatsProps {
  cvData: CVData;
}

export function CVStatsPanel({ cvData }: CVStatsProps) {
  const calculateStats = (): CVStats => {
    const sections = [
      { name: 'contact', check: () => cvData.contact.firstName && cvData.contact.lastName && cvData.contact.email },
      { name: 'profile', check: () => cvData.profile && cvData.profile.length > 50 },
      { name: 'experience', check: () => cvData.experiences.length > 0 },
      { name: 'education', check: () => cvData.educations.length > 0 },
      { name: 'skills', check: () => cvData.skills.length >= 3 },
      { name: 'languages', check: () => cvData.languages.length > 0 },
    ];

    const completedSections = sections.filter(s => s.check()).length;
    const completeness = Math.round((completedSections / sections.length) * 100);

    const suggestions: string[] = [];
    
    if (!cvData.profile || cvData.profile.length < 100) {
      suggestions.push('Ajoutez un profil professionnel détaillé (minimum 100 caractères)');
    }
    if (cvData.experiences.length === 0) {
      suggestions.push('Ajoutez au moins une expérience professionnelle');
    }
    if (cvData.skills.length < 5) {
      suggestions.push('Ajoutez au moins 5 compétences pertinentes');
    }
    if (cvData.languages.length === 0) {
      suggestions.push('Indiquez les langues que vous maîtrisez');
    }
    if (!cvData.contact.photo) {
      suggestions.push('Ajoutez une photo professionnelle pour plus d\'impact');
    }

    return {
      completeness,
      sectionsCompleted: completedSections,
      totalSections: sections.length,
      suggestions,
    };
  };

  const stats = calculateStats();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-full ${getScoreBg(stats.completeness)}`}>
          <TrendingUp className={`w-6 h-6 ${getScoreColor(stats.completeness)}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Score de votre CV</h3>
          <p className="text-sm text-gray-500">
            {stats.sectionsCompleted}/{stats.totalSections} sections complétées
          </p>
        </div>
        <div className="ml-auto">
          <span className={`text-3xl font-bold ${getScoreColor(stats.completeness)}`}>
            {stats.completeness}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-500 ${
            stats.completeness >= 80 ? 'bg-green-500' :
            stats.completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${stats.completeness}%` }}
        />
      </div>

      {/* Suggestions */}
      {stats.suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            Conseils d'amélioration
          </h4>
          <ul className="space-y-2">
            {stats.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.completeness >= 80 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800">
            Excellent ! Votre CV est prêt à être envoyé.
          </span>
        </div>
      )}
    </div>
  );
}
