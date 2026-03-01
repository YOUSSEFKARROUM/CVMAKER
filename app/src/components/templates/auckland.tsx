import { forwardRef } from 'react';
import type { TemplateProps } from './types';
import { formatDate } from './utils';

export const AucklandTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, certifications } = cvData;

    // Helper function to get dot rating (1-5) based on level
    const getDotRating = (level: string) => {
      switch (level) {
        case 'beginner': return 1;
        case 'intermediate': return 3;
        case 'advanced': return 4;
        case 'expert':
        case 'native':
        case 'fluent':
          return 5;
        default: return 3;
      }
    };

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Name Box - Centered with accent border */}
        <div 
          className="mx-10 mt-10 border-2 px-8 py-5 text-center"
          style={{ borderColor: settings.primaryColor }}
        >
          <h1 
            className="text-3xl font-bold tracking-wide"
            style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
          >
            {contact.firstName} {contact.lastName}
          </h1>
        </div>

        {/* Two Column Layout - 35% / 65% split */}
        <div className="flex px-10 pb-10 pt-8">
          {/* Left Column - 35% */}
          <div className="w-[35%] pr-6">
            {/* Personal Info */}
            <div className="mb-6">
              <h3 
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                Personnelles
              </h3>
              <div className="space-y-1.5 text-[10px] text-gray-800 leading-relaxed">
                {contact.birthDate && (
                  <div>{formatDate(contact.birthDate)}</div>
                )}
                {contact.nationality && (
                  <div>{contact.nationality}</div>
                )}
                {contact.phone && (
                  <div>{contact.phone}</div>
                )}
                {contact.email && (
                  <div className="break-all">{contact.email}</div>
                )}
                {(contact.address || contact.city || contact.country) && (
                  <div>
                    {[contact.address, contact.city, contact.country].filter(Boolean).join(', ')}
                  </div>
                )}
                {contact.linkedin && (
                  <div className="break-all">{contact.linkedin}</div>
                )}
              </div>
            </div>

            {/* Interests */}
            {interests.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  Intérêts
                </h3>
                <div className="space-y-1">
                  {interests.map((interest, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[10px] text-gray-800">
                      <span 
                        className="inline-block w-1.5 h-1.5 mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: settings.primaryColor }}
                      ></span>
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages with 5-dot rating */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  Langues
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <div className="text-[10px] text-gray-800 mb-1">{lang.name}</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div 
                            key={dot} 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: dot <= getDotRating(lang.level) ? settings.primaryColor : '#D1D5DB' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  Certificats
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-[10px] text-gray-800">
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-gray-600">{cert.organization}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 65% */}
          <div className="w-[65%] min-w-0 pl-6 border-l border-gray-200">
            {/* Profile at top */}
            {profile && (
              <div className="mb-6">
                <p className="text-[10.5px] text-gray-800 leading-relaxed text-justify">{profile}</p>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  Enseignement
                </h3>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <h4 className="font-semibold text-[10.5px] text-gray-900 break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{edu.diploma}</h4>
                        <span className="text-[9px] text-gray-600 flex-shrink-0">{formatDate(edu.graduationDate)}</span>
                      </div>
                      <p className="text-[10px] text-gray-700 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                      {edu.description && (
                        <p className="text-[10px] text-gray-600 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience with bullet points */}
            {experiences.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  Expérience Professionnelle
                </h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <h4 className="font-semibold text-[10.5px] text-gray-900 break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{exp.jobTitle}</h4>
                        <span className="text-[9px] text-gray-600 flex-shrink-0">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-700 mb-1.5 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      {exp.description && (
                        <ul className="text-[10px] text-gray-700 leading-relaxed list-disc list-inside space-y-0.5 break-words" style={{ overflowWrap: 'anywhere' }}>
                          {exp.description.split('\n').map((line, idx) => (
                            line.trim() && <li key={idx}>{line.trim().replace(/^[-•]\s*/, '')}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills with 5-dot rating */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                  style={{ fontFamily: settings.titleFont }}
                >
                  Compétences
                </h3>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-800">{skill.name}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div 
                            key={dot} 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: dot <= getDotRating(skill.level) ? settings.primaryColor : '#D1D5DB' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References at bottom */}
            <div>
              <h3 
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                Références
              </h3>
              <p className="text-[10px] text-gray-600">Sur demande</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AucklandTemplate.displayName = 'AucklandTemplate';
