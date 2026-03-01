import { forwardRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate } from './utils';

// Helper to convert skill level to French text
const getSkillLevelText = (level: string): string => {
  switch (level) {
    case 'expert': return 'Très bon';
    case 'advanced': return 'Bon';
    case 'intermediate': return 'Moyen';
    case 'beginner': return 'Débutant';
    default: return '';
  }
};

export const OtagoTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests } = cvData;

    // Helper to safely access optional contact fields
    const getContactField = (field: string): string | undefined => {
      return (contact as any)[field];
    };

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header - Name on left, CV badge on right */}
        <div className="flex items-center justify-between mb-4">
          <h1 
            className="text-4xl font-bold uppercase tracking-wide text-gray-900"
            style={{ fontFamily: settings.titleFont }}
          >
            {contact.firstName} {contact.lastName}
          </h1>
          <div className="px-4 py-2 bg-gray-400 text-white text-xl font-bold">
            CV
          </div>
        </div>

        {/* Contact Info - One line with icons */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-700 mb-6 border-b border-gray-200 pb-4">
          {(contact.address || contact.city) && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{[contact.address, contact.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-1 min-w-0">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.email}</span>
            </div>
          )}
        </div>

        {/* Personal Details - Four Column Grid (2 rows) */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-y-3 text-xs">
            {/* Row 1 */}
            {contact.birthDate && (
              <div>
                <span className="text-gray-500 block">Date de naissance</span>
                <span className="font-medium text-gray-800">{formatDate(contact.birthDate)}</span>
              </div>
            )}
            {contact.nationality && (
              <div>
                <span className="text-gray-500 block">Nationalité</span>
                <span className="font-medium text-gray-800">{contact.nationality}</span>
              </div>
            )}
            {getContactField('gender') && (
              <div>
                <span className="text-gray-500 block">Sexe</span>
                <span className="font-medium text-gray-800">{getContactField('gender')}</span>
              </div>
            )}
            {(contact.portfolio || contact.github) && (
              <div>
                <span className="text-gray-500 block">Site internet</span>
                <span className="font-medium text-gray-800">{contact.portfolio || contact.github}</span>
              </div>
            )}
            {/* Row 2 */}
            {getContactField('birthPlace') && (
              <div>
                <span className="text-gray-500 block">Lieu de naissance</span>
                <span className="font-medium text-gray-800">{getContactField('birthPlace')}</span>
              </div>
            )}
            {contact.maritalStatus && (
              <div>
                <span className="text-gray-500 block">État civil</span>
                <span className="font-medium text-gray-800">{contact.maritalStatus}</span>
              </div>
            )}
            {contact.drivingLicense && (
              <div>
                <span className="text-gray-500 block">Rijbewijs</span>
                <span className="font-medium text-gray-800">{contact.drivingLicense}</span>
              </div>
            )}
            {contact.linkedin && (
              <div>
                <span className="text-gray-500 block">LinkedIn</span>
                <span className="font-medium text-gray-800">{contact.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile - Italic style */}
        {profile && (
          <div className="mb-8">
            <p className="text-sm text-gray-700 leading-relaxed italic">{profile}</p>
          </div>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
              Enseignement
            </h3>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start gap-2 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 break-words">{edu.diploma}</h4>
                    <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                    {edu.description && (
                      <p className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{edu.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{formatDate(edu.graduationDate)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
              Expérience professionnelle
            </h3>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex justify-between items-start gap-2 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 break-words">{exp.jobTitle}</h4>
                    <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                    {exp.description && (
                      <p className="text-xs text-gray-700 leading-relaxed mt-1 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section - with text level indicators */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
              Compétences
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700 w-40">{skill.name}</span>
                  <span className="text-gray-500 text-xs">{getSkillLevelText(skill.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
              Langues
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700 w-40">{lang.name}</span>
                  <span className="text-gray-500 text-xs">{getSkillLevelText(lang.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests Section */}
        {interests.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
              Intérêts
            </h3>
            <p className="text-sm text-gray-700">{interests.join(', ')}</p>
          </div>
        )}
      </div>
    );
  }
);

OtagoTemplate.displayName = 'OtagoTemplate';
