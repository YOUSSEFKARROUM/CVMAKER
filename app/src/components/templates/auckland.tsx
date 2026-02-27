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
        {/* Name Box - Centered with black border */}
        <div className="mx-10 mt-10 border-2 border-black px-8 py-5 text-center">
          <h1 
            className="text-3xl font-bold tracking-wide"
            style={{ fontFamily: settings.titleFont }}
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
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                style={{ fontFamily: settings.titleFont }}
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
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                  style={{ fontFamily: settings.titleFont }}
                >
                  Intérêts
                </h3>
                <div className="space-y-1">
                  {interests.map((interest, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[10px] text-gray-800">
                      <span className="inline-block w-1.5 h-1.5 bg-black mt-1.5 flex-shrink-0"></span>
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
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                  style={{ fontFamily: settings.titleFont }}
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
                            className={`w-2 h-2 rounded-full ${
                              dot <= getDotRating(lang.level) ? 'bg-black' : 'bg-gray-300'
                            }`}
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
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                  style={{ fontFamily: settings.titleFont }}
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
          <div className="w-[65%] pl-6 border-l border-gray-200">
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
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                  style={{ fontFamily: settings.titleFont }}
                >
                  Enseignement
                </h3>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-semibold text-[10.5px] text-gray-900">{edu.diploma}</h4>
                        <span className="text-[9px] text-gray-600">{formatDate(edu.graduationDate)}</span>
                      </div>
                      <p className="text-[10px] text-gray-700">{edu.school}{edu.city && `, ${edu.city}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience with bullet points */}
            {experiences.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 text-black"
                  style={{ fontFamily: settings.titleFont }}
                >
                  Expérience Professionnelle
                </h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-semibold text-[10.5px] text-gray-900">{exp.jobTitle}</h4>
                        <span className="text-[9px] text-gray-600">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-700 mb-1.5">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      {exp.description && (
                        <ul className="text-[10px] text-gray-700 leading-relaxed list-disc list-inside space-y-0.5">
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
                            className={`w-2 h-2 rounded-full ${
                              dot <= getDotRating(skill.level) ? 'bg-black' : 'bg-gray-300'
                            }`}
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
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2 text-black"
                style={{ fontFamily: settings.titleFont }}
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
