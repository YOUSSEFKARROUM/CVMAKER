import { forwardRef } from 'react';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, User, Calendar, Flag, Heart, Car } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate } from './utils';

const getLevelDots = (level: string) => {
  const levelMap: Record<string, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4,
    'native': 5
  };
  return levelMap[level] || 3;
};

export const CambridgeTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, references } = cvData;

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header - Blue Bar with "Curriculum Vitae" centered */}
        <div 
          className="py-4 text-center"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <h1 className="text-xl font-semibold tracking-wide text-white">Curriculum Vitae</h1>
        </div>

        <div className="p-8 min-w-0">
          {/* Name and Contact Info - 2 columns */}
          <div className="grid grid-cols-2 gap-8 mb-6 min-w-0">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-1 break-words">
                {contact.firstName} {contact.lastName}
              </h2>
              {contact.jobTitle && (
                <p className="text-sm text-gray-600 break-words">{contact.jobTitle}</p>
              )}
            </div>
            <div className="text-sm text-gray-700 space-y-1 min-w-0">
              {contact.address && (
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.address}{contact.city ? `, ${contact.city}` : ''}{contact.postalCode ? ` ${contact.postalCode}` : ''}{contact.country ? `, ${contact.country}` : ''}</span>
                </div>
              )}
              {!contact.address && (contact.city || contact.country) && (
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.email}</span>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center gap-2 min-w-0">
                  <Linkedin className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.linkedin}</span>
                </div>
              )}
              {contact.portfolio && (
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.portfolio}</span>
                </div>
              )}
              {contact.github && (
                <div className="flex items-center gap-2 min-w-0">
                  <Github className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                  <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile paragraph */}
          {profile && (
            <div className="mb-6">
              <p className="text-sm text-gray-700 leading-relaxed text-justify">{profile}</p>
            </div>
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-8 min-w-0">
            {/* Left Column: ENSEIGNEMENT, EXPÉRIENCE PROFESSIONNELLE */}
            <div className="space-y-6 min-w-0">
              {/* Education - ENSEIGNEMENT */}
              {educations.length > 0 && (
                <div className="min-w-0">
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    Enseignement
                  </h3>
                  <div className="space-y-4">
                    {educations.map((edu) => (
                      <div key={edu.id} className="min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          {formatDate(edu.graduationDate)}
                        </p>
                        <h4 className="font-semibold text-sm text-gray-900 break-words">{edu.diploma}</h4>
                        <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                        {edu.description && (
                          <p className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience - EXPÉRIENCE PROFESSIONNELLE */}
              {experiences.length > 0 && (
                <div className="min-w-0">
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    Expérience Professionnelle
                  </h3>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                        </p>
                        <h4 className="font-semibold text-sm text-gray-900 break-words">{exp.jobTitle}</h4>
                        <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                        {exp.description && (
                          <p className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: PERSONNELLES, INTÉRÊTS, LANGUES, COMPÉTENCES, RÉFÉRENCES */}
            <div className="space-y-5">
              {/* Personal Info - PERSONNELLES with icons */}
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
                  Personnelles
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  {contact.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" style={{ color: settings.primaryColor }} />
                      <span>{contact.birthDate}</span>
                    </div>
                  )}
                  {contact.nationality && (
                    <div className="flex items-center gap-2">
                      <Flag className="w-3.5 h-3.5" style={{ color: settings.primaryColor }} />
                      <span>{contact.nationality}</span>
                    </div>
                  )}
                  {contact.maritalStatus && (
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5" style={{ color: settings.primaryColor }} />
                      <span>{contact.maritalStatus}</span>
                    </div>
                  )}
                  {contact.drivingLicense && (
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5" style={{ color: settings.primaryColor }} />
                      <span>Permis: {contact.drivingLicense}</span>
                    </div>
                  )}
                  {contact.visaStatus && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" style={{ color: settings.primaryColor }} />
                      <span>{contact.visaStatus}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interests - INTÉRÊTS */}
              {interests.length > 0 && (
                <div>
                  <h3 
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    Intérêts
                  </h3>
                  <p className="text-xs text-gray-700">{interests.join(', ')}</p>
                </div>
              )}

              {/* Languages - LANGUES with 5 dots */}
              {languages.length > 0 && (
                <div>
                  <h3 
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    Langues
                  </h3>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{lang.name}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div 
                              key={dot}
                              className={`w-2 h-2 rounded-full ${
                                dot <= getLevelDots(lang.level) 
                                  ? '' 
                                  : 'bg-gray-200'
                              }`}
                              style={{ 
                                backgroundColor: dot <= getLevelDots(lang.level) ? settings.primaryColor : undefined 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills - COMPÉTENCES with 5 dots */}
              {skills.length > 0 && (
                <div>
                  <h3 
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    Compétences
                  </h3>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{skill.name}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div 
                              key={dot}
                              className={`w-2 h-2 rounded-full ${
                                dot <= getLevelDots(skill.level) 
                                  ? '' 
                                  : 'bg-gray-200'
                              }`}
                              style={{ 
                                backgroundColor: dot <= getLevelDots(skill.level) ? settings.primaryColor : undefined 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References - RÉFÉRENCES */}
              {references.length > 0 && (
                <div>
                  <h3 
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    Références
                  </h3>
                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div key={ref.id} className="text-xs">
                        <p className="font-semibold text-gray-900">{ref.name}</p>
                        <p className="text-gray-600">{ref.position}{ref.company ? `, ${ref.company}` : ''}</p>
                        {ref.email && <p className="text-gray-500">{ref.email}</p>}
                        {ref.phone && <p className="text-gray-500">{ref.phone}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CambridgeTemplate.displayName = 'CambridgeTemplate';
