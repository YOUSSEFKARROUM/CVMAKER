import { forwardRef } from 'react';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, Flag, Car } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, getSkillLevelWidth, formatDate } from './utils';

export const StanfordTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects } = cvData;

    // Helper function to get language level text
    const getLanguageLevelText = (level: string) => {
      switch (level) {
        case 'native': return 'Langue maternelle';
        case 'fluent': return 'Courant';
        case 'advanced': return 'Avancé';
        case 'intermediate': return 'Intermédiaire';
        case 'beginner': return 'Débutant';
        default: return level;
      }
    };

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Left Sidebar - Dark Charcoal */}
          <div 
            className="w-[32%] p-6 text-white min-h-[297mm]"
            style={{ backgroundColor: '#4A4A4A' }}
          >
            {/* Photo - Large Circular */}
            {contact.photo ? (
              <div className="w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden border-4 border-white/30">
                <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto mb-5 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}

            {/* Name in Sidebar */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold leading-tight">{contact.firstName}</h1>
              <h1 className="text-2xl font-bold leading-tight">{contact.lastName}</h1>
            </div>

            {/* Contact Section - Personelles */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                Personnelles
              </h3>
              <div className="space-y-2 text-xs">
                {contact.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{contact.email}</span>
                  </div>
                )}
                {(contact.city || contact.country) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex items-start gap-2">
                    <Linkedin className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{contact.linkedin}</span>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{contact.website}</span>
                  </div>
                )}
                {contact.github && (
                  <div className="flex items-start gap-2">
                    <Github className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{contact.github}</span>
                  </div>
                )}
                {contact.nationality && (
                  <div className="flex items-start gap-2">
                    <Flag className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span>{contact.nationality}</span>
                  </div>
                )}
                {contact.drivingLicense && (
                  <div className="flex items-start gap-2">
                    <Car className="w-3 h-3 opacity-70 mt-0.5 flex-shrink-0" />
                    <span>Permis {contact.drivingLicense}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interests - Intérêts */}
            {interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                  Intérêts
                </h3>
                <div className="text-xs space-y-1">
                  {interests.map((interest, idx) => (
                    <div key={idx}>• {interest}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages - Langues with text levels */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                  Langues
                </h3>
                <div className="space-y-2 text-xs">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-gray-400 block">{getLanguageLevelText(lang.level)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills - Compétences with horizontal bars */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                  Compétences
                </h3>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-xs mb-1.5">{skill.name}</p>
                      {!settings.showSkillsAsTags && settings.showSkillLevels && (
                        <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full"
                            style={{ width: getSkillLevelWidth(skill.level) }}
                          />
                        </div>
                      )}
                      {settings.showSkillsAsTags && (
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 bg-white/20 rounded text-[10px]">{skill.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - White */}
          <div className="w-[68%] p-8">
            {/* Profile */}
            {profile && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{profile}</p>
              </div>
            )}

            {/* Education - Enseignement */}
            {educations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Enseignement
                </h3>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{edu.diploma}</h4>
                        <span className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</span>
                      </div>
                      <p className="text-xs text-gray-600">{edu.school}{edu.city && `, ${edu.city}`}</p>
                      {edu.description && (
                        <p className="text-xs text-gray-700 mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience - Expérience professionnelle */}
            {experiences.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Expérience professionnelle
                </h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{exp.jobTitle}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      {exp.description && (
                        <p className="text-xs text-gray-700 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills repeated in main content with bar charts */}
            {skills.length > 0 && !settings.showSkillsAsTags && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Compétences
                </h3>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={`main-${skill.id}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-700">{skill.name}</span>
                      </div>
                      {settings.showSkillLevels && (
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: getSkillLevelWidth(skill.level),
                              backgroundColor: '#4A4A4A'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Certificats
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                        <p className="text-xs text-gray-600">{cert.organization}</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(cert.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References - Références */}
            {contact.references && contact.references.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Références
                </h3>
                <div className="space-y-3">
                  {contact.references.map((ref, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-medium text-gray-900">{ref.name}</p>
                      <p className="text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
                      {ref.phone && <p className="text-gray-500">{ref.phone}</p>}
                      {ref.email && <p className="text-gray-500">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StanfordTemplate.displayName = 'StanfordTemplate';
