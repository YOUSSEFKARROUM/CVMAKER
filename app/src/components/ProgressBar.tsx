import type { Step } from '../types/cv';

interface ProgressBarProps {
  steps: Exclude<Step, 'landing' | 'download'>[];
  currentStep: Exclude<Step, 'landing' | 'download'>;
}

const stepLabels: Record<Exclude<Step, 'landing' | 'download'>, string> = {
  contact: 'CONTACT',
  experience: 'EXPÉRIENCE',
  education: 'FORMATION',
  skills: 'COMPÉTENCES',
  languages: 'LANGUES',
  certifications: 'CERTIFICATIONS',
  profile: 'PROFIL',
  finish: 'TERMINEZ-LE',
};

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="bg-white border-b border-gray-200 py-4 px-8">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full mb-1 transition-colors ${
                    isActive ? 'bg-[#2196F3]' : 'bg-gray-300'
                  }`}
                />
                <span
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isCurrent
                      ? 'text-[#2196F3]'
                      : isActive
                      ? 'text-[#2196F3]'
                      : 'text-gray-400'
                  }`}
                >
                  {stepLabels[step]}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors ${
                    index < currentIndex ? 'bg-[#2196F3]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
        <div className="flex items-center ml-4">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            TÉLÉCHARGER
          </span>
        </div>
      </div>
    </div>
  );
}
