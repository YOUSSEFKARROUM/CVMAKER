import { forwardRef } from 'react';
import type { TemplateProps } from './types';
import { formatDate } from './utils';

export const OxfordTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, certifications } = cvData;

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-normal text-gray-800 mb-6">Curriculum vitae</h1>
            
            {/* Personal Data - 2 column layout */}
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 pb-1 border-b border-gray-300">
                Données personnelles
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <div className="flex">
                  <span className="w-24 text-gray-600">Nom</span>
                  <span className="text-gray-800">{contact.firstName} {contact.lastName}</span>
                </div>
                {contact.email && (
                  <div className="flex">
                    <span className="w-24 text-gray-600">E-mail</span>
                    <span className="text-gray-800 break-all">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex">
                    <span className="w-24 text-gray-600">Téléphone</span>
                    <span className="text-gray-800">{contact.phone}</span>
                  </div>
                )}
                {(contact.city || contact.country) && (
                  <div className="flex">
                    <span className="w-24 text-gray-600">Résidence</span>
                    <span className="text-gray-800">{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {contact.birthDate && (
                  <div className="flex">
                    <span className="w-24 text-gray-600">Né(e) le</span>
                    <span className="text-gray-800">{formatDate(contact.birthDate)}</span>
                  </div>
                )}
                {contact.drivingLicense && (
                  <div className="flex">
                    <span className="w-24 text-gray-600">Permis</span>
                    <span className="text-gray-800">{contact.drivingLicense}</span>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex">
                    <span className="w-24 text-gray-600">LinkedIn</span>
                    <span className="text-gray-800 break-all">{contact.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Section */}
          {profile && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800 pb-1 border-b border-gray-300">
                Profil
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{profile}</p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="flex gap-8">
            {/* Left Column - Timeline */}
            <div className="flex-1">
              {/* Education Section */}
              {educations.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 pb-1 border-b border-gray-300">
                    Enseignement
                  </h2>
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                    <div className="space-y-4">
                      {educations.map((edu) => (
                        <div key={edu.id} className="relative pl-6">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-600 -translate-x-1/2"></div>
                          <div className="flex gap-4">
                            {/* Date on the left */}
                            <div className="w-20 flex-shrink-0">
                              <span className="text-xs text-gray-600 font-medium">
                                {formatDate(edu.graduationDate)}
                              </span>
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-gray-900">{edu.diploma}</h4>
                              <p className="text-sm text-gray-600">{edu.school}</p>
                              {edu.description && (
                                <p className="text-xs text-gray-700 mt-1">{edu.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {experiences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 pb-1 border-b border-gray-300">
                    Expérience
                  </h2>
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                    <div className="space-y-5">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="relative pl-6">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-600 -translate-x-1/2"></div>
                          <div className="flex gap-4">
                            {/* Date on the left */}
                            <div className="w-20 flex-shrink-0">
                              <span className="text-xs text-gray-600 font-medium">
                                {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                              </span>
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-gray-900">{exp.jobTitle}</h4>
                              <p className="text-sm text-gray-600">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                              {exp.description && (
                                <p className="text-xs text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 pb-1 border-b border-gray-300">
                    Certificats
                  </h2>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-600 -translate-x-1/2"></div>
                          <div className="flex gap-4">
                            <div className="w-20 flex-shrink-0">
                              <span className="text-xs text-gray-600 font-medium">
                                {cert.date && formatDate(cert.date)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-gray-900">{cert.name}</h4>
                              <p className="text-sm text-gray-600">{cert.organization}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Personal Info */}
            <div className="w-[32%]">
              {/* Personal Info Summary */}
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800 pb-1 border-b border-gray-300">
                  {contact.firstName} {contact.lastName}
                </h2>
                <div className="space-y-1 text-xs text-gray-700">
                  {contact.email && <div>{contact.email}</div>}
                  {contact.phone && <div>{contact.phone}</div>}
                  {(contact.city || contact.country) && (
                    <div>{[contact.city, contact.country].filter(Boolean).join(', ')}</div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800 pb-1 border-b border-gray-300">
                    Compétences
                  </h2>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="text-xs">
                        <div className="text-gray-800">{skill.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800 pb-1 border-b border-gray-300">
                    Langues
                  </h2>
                  <div className="space-y-1 text-xs">
                    {languages.map((lang) => (
                      <div key={lang.id} className="text-gray-700">
                        {lang.name}
                        {lang.level && (
                          <span className="text-gray-500 ml-1">
                            – {lang.level === 'native' ? 'Langue maternelle' : 
                                lang.level === 'advanced' ? 'Courant' :
                                lang.level === 'intermediate' ? 'Intermédiaire' : 'Débutant'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {interests.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800 pb-1 border-b border-gray-300">
                    Intérêts
                  </h2>
                  <p className="text-xs text-gray-700">{interests.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OxfordTemplate.displayName = 'OxfordTemplate';
