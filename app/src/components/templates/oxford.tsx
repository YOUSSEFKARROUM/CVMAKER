import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import type { TemplateProps } from './types';
import { formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

export const OxfordTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainSectionIds: LayoutSectionId[] = ['education', 'experience', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) =>
      mainSectionIds.includes(id) && isSectionVisible(id, settings)
    );

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

            {/* Personal Data */}
            <div className="mb-6">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                {t('template.personalInfo')}
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
          {isSectionVisible('profile', settings) && profile && (
            <div className="mb-6">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                {t('template.profile')}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{profile}</p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="flex gap-8">
            {/* Left Column - Timeline */}
            <div className="flex-1">
              {orderedSections.map((sectionId) => {
                if (sectionId === 'education' && educations.length > 0) {
                  return (
                    <div className="mb-6" key="education">
                      <h2
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.education')}
                      </h2>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                        <div className="space-y-4">
                          {educations.map((edu) => (
                            <div key={edu.id} className="relative pl-6">
                              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-600 -translate-x-1/2" style={{ backgroundColor: settings.primaryColor }}></div>
                              <div className="flex gap-4">
                                <div className="w-20 flex-shrink-0">
                                  <span className="text-xs text-gray-600 font-medium">
                                    {formatDate(edu.graduationDate)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.diploma}</h4>
                                  <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}</p>
                                  {edu.description && (
                                    <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (sectionId === 'experience' && experiences.length > 0) {
                  return (
                    <div className="mb-6" key="experience">
                      <h2
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.experience')}
                      </h2>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                        <div className="space-y-5">
                          {experiences.map((exp) => (
                            <div key={exp.id} className="relative pl-6">
                              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: settings.primaryColor }}></div>
                              <div className="flex gap-4">
                                <div className="w-20 flex-shrink-0">
                                  <span className="text-xs text-gray-600 font-medium">
                                    {formatDate(exp.startDate)} – {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.jobTitle}</h4>
                                  <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                                  {exp.description && (
                                    <div className="text-xs text-gray-700 mt-1 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (sectionId === 'certifications' && certifications.length > 0) {
                  return (
                    <div className="mb-6" key="certifications">
                      <h2
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.certifications')}
                      </h2>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                        <div className="space-y-3">
                          {certifications.map((cert) => (
                            <div key={cert.id} className="relative pl-6">
                              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: settings.primaryColor }}></div>
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
                  );
                }

                if (sectionId === 'projects' && projects.length > 0) {
                  return (
                    <div className="mb-6" key="projects">
                      <h2
                        className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                        style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                      >
                        {t('template.projects')}
                      </h2>
                      <div className="space-y-3">
                        {projects.map((proj) => (
                          <div key={proj.id} className="min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 break-words">{proj.name}</h4>
                            <div className="text-xs text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                            {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {proj.technologies.slice(0, 12).map((tech, idx) => (
                                  <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{String(tech)}</span>
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
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.internships')}
                  </h2>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400"></div>
                    <div className="space-y-5">
                      {internships.map((intern) => (
                        <div key={intern.id} className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: settings.primaryColor }}></div>
                          <div className="flex gap-4">
                            <div className="w-20 flex-shrink-0">
                              <span className="text-xs text-gray-600 font-medium">
                                {formatDate(intern.startDate)} – {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.jobTitle}</h4>
                              <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                              {intern.description && (
                                <div className="text-xs text-gray-700 mt-1 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Publications */}
              {isSectionVisible('publications', settings) && publications.length > 0 && (
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.publications')}
                  </h2>
                  <div className="space-y-1">
                    {publications.map((pub, i) => (
                      <p key={i} className="text-sm text-gray-700">• {pub}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracurricular */}
              {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.extracurricular')}
                  </h2>
                  <div className="space-y-1">
                    {extracurricular.map((act, i) => (
                      <p key={i} className="text-sm text-gray-700">• {act}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-[32%]">
              {/* Contact Summary */}
              <div className="mb-6">
                <h2
                  className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
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
              {isSectionVisible('skills', settings) && skills.length > 0 && (
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.skills')}
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
              {isSectionVisible('languages', settings) && languages.length > 0 && (
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.languages')}
                  </h2>
                  <div className="space-y-1 text-xs">
                    {languages.map((lang) => (
                      <div key={lang.id} className="text-gray-700">
                        {lang.name}
                        {lang.level && (
                          <span className="text-gray-500 ml-1">
                            – {t(`template.languageLevels.${lang.level}`, lang.level)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {isSectionVisible('interests', settings) && interests.length > 0 && (
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.interests')}
                  </h2>
                  <p className="text-xs text-gray-700">{interests.join(', ')}</p>
                </div>
              )}

              {/* References */}
              {isSectionVisible('references', settings) && references.length > 0 && (
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    {t('template.references')}
                  </h2>
                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div key={ref.id} className="text-xs">
                        <p className="font-medium text-gray-900">{ref.name}</p>
                        <p className="text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
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

OxfordTemplate.displayName = 'OxfordTemplate';
