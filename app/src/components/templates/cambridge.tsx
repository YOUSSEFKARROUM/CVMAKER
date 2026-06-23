import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, User, Calendar, Flag, Heart, Car, Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

const getLevelDots = (level: string) => {
  const levelMap: Record<string, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4,
    'native': 5,
  };
  return levelMap[level] || 3;
};

export const CambridgeTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, references, certifications, projects, internships, publications, extracurricular } = cvData;
    const mainSectionIds: LayoutSectionId[] = ['education', 'experience', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) =>
      mainSectionIds.includes(id) && isSectionVisible(id, settings)
    );

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
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
          {isSectionVisible('profile', settings) && profile && (
            <div className="mb-6">
              <p className="text-sm text-gray-700 leading-relaxed text-justify">{profile}</p>
            </div>
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-8 min-w-0">
            {/* Left Column: orderedSections */}
            <div className="space-y-6 min-w-0">
              {orderedSections.map((sectionId) => {
                if (sectionId === 'education' && educations.length > 0) {
                  return (
                    <div className="min-w-0" key="education">
                      <h3
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.education')}
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
                              <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sectionId === 'experience' && experiences.length > 0) {
                  return (
                    <div className="min-w-0" key="experience">
                      <h3
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.experience')}
                      </h3>
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <div key={exp.id} className="min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">
                              {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                            </p>
                            <h4 className="font-semibold text-sm text-gray-900 break-words">{exp.jobTitle}</h4>
                            <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                            {exp.description && (
                              <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sectionId === 'certifications' && certifications.length > 0) {
                  return (
                    <div className="min-w-0" key="certifications">
                      <h3
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.certifications')}
                      </h3>
                      <div className="space-y-3">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="flex items-start gap-2">
                            <Award className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                              <p className="text-xs text-gray-600">{cert.organization}</p>
                              <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sectionId === 'projects' && projects.length > 0) {
                  return (
                    <div className="min-w-0" key="projects">
                      <h3
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.projects')}
                      </h3>
                      <div className="space-y-3">
                        {projects.map((proj) => (
                          <div key={proj.id} className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 min-w-0">
                              <Folder className="w-3.5 h-3.5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                              <h4 className="font-semibold text-sm text-gray-900 truncate">{proj.name}</h4>
                            </div>
                            <div className="text-xs text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                            {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {proj.technologies.slice(0, 10).map((tech, idx) => (
                                  <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                                    {String(tech)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {/* Internships */}
              {isSectionVisible('internships', settings) && internships.length > 0 && (
                <div className="min-w-0">
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.internships')}
                  </h3>
                  <div className="space-y-4">
                    {internships.map((intern) => (
                      <div key={intern.id} className="min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                        </p>
                        <h4 className="font-semibold text-sm text-gray-900 break-words">{intern.jobTitle}</h4>
                        <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city ? `, ${intern.city}` : ''}</p>
                        {intern.description && (
                          <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications */}
              {isSectionVisible('publications', settings) && publications.length > 0 && (
                <div className="min-w-0">
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.publications')}
                  </h3>
                  <div className="space-y-1">
                    {publications.map((pub, i) => (
                      <p key={i} className="text-xs text-gray-700">• {pub}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Personal Info */}
              <div>
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
                  {t('template.personalInfo')}
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

              {/* Interests */}
              {isSectionVisible('interests', settings) && interests.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.interests')}
                  </h3>
                  <p className="text-xs text-gray-700">{interests.join(', ')}</p>
                </div>
              )}

              {/* Languages */}
              {isSectionVisible('languages', settings) && languages.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.languages')}
                  </h3>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{lang.name}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div
                              key={dot}
                              className={`w-2 h-2 rounded-full ${dot <= getLevelDots(lang.level) ? '' : 'bg-gray-200'}`}
                              style={{ backgroundColor: dot <= getLevelDots(lang.level) ? settings.primaryColor : undefined }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {isSectionVisible('skills', settings) && skills.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.skills')}
                  </h3>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{skill.name}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div
                              key={dot}
                              className={`w-2 h-2 rounded-full ${dot <= getLevelDots(skill.level) ? '' : 'bg-gray-200'}`}
                              style={{ backgroundColor: dot <= getLevelDots(skill.level) ? settings.primaryColor : undefined }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracurricular */}
              {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.extracurricular')}
                  </h3>
                  <div className="space-y-1">
                    {extracurricular.map((act, i) => (
                      <p key={i} className="text-xs text-gray-700">• {act}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {isSectionVisible('references', settings) && references.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.references')}
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
