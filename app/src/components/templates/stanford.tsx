import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, Flag, Car } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, getSkillLevelWidth, formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

export const StanfordTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainIds: LayoutSectionId[] = ['profile', 'experience', 'education', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter(
      (id) => mainIds.includes(id) && isSectionVisible(id, settings)
    );

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Left Sidebar - Dark Charcoal (design intent: fixed dark) */}
          <div
            className="w-[32%] p-6 text-white self-stretch"
            style={{ backgroundColor: '#4A4A4A' }}
          >
            {/* Photo */}
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

            {/* Contact Section */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                {t('template.personalInfo')}
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

            {/* Interests */}
            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                  {t('template.interests')}
                </h3>
                <div className="text-xs space-y-1">
                  {interests.map((interest, idx) => (
                    <div key={idx}>• {interest}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                  {t('template.languages')}
                </h3>
                <div className="space-y-2 text-xs">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-gray-400 block">
                        {t(`template.languageLevels.${lang.level}`, lang.level)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300 border-b border-gray-500 pb-1">
                  {t('template.skills')}
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

          {/* Main Content */}
          <div className="w-[68%] p-8">
            {orderedSections.map((section) => {
              if (section === 'profile' && profile) {
                return (
                  <div className="mb-6" key="profile">
                    <p className="text-sm text-gray-700 leading-relaxed">{profile}</p>
                  </div>
                );
              }
              if (section === 'education' && educations.length > 0) {
                return (
                  <div className="mb-6" key="education">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                      {t('template.education')}
                    </h3>
                    <div className="space-y-3">
                      {educations.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm text-gray-900">{edu.diploma}</h4>
                            <span className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</span>
                          </div>
                          <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                          {edu.description && (
                            <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'experience' && experiences.length > 0) {
                return (
                  <div className="mb-6" key="experience">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                      {t('template.experience')}
                    </h3>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm text-gray-900">{exp.jobTitle}</h4>
                            <span className="text-xs text-gray-500">
                              {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                          {exp.description && (
                            <div className="text-xs text-gray-700 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'certifications' && certifications.length > 0) {
                return (
                  <div className="mb-6" key="certifications">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                      {t('template.certifications')}
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
                );
              }
              if (section === 'projects' && projects.length > 0) {
                return (
                  <div className="mb-6" key="projects">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                      {t('template.projects')}
                    </h3>
                    <div className="space-y-3 min-w-0">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 break-words">{proj.name}</h4>
                          <div className="text-xs text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                          {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {proj.technologies.slice(0, 12).map((tech, idx) => (
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
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  {t('template.internships')}
                </h3>
                <div className="space-y-4">
                  {internships.map((intern) => (
                    <div key={intern.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{intern.jobTitle}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                      {intern.description && (
                        <div className="text-xs text-gray-700 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  {t('template.publications')}
                </h3>
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-xs text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Extracurricular */}
            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
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
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  {t('template.references')}
                </h3>
                <div className="space-y-3">
                  {references.map((ref) => (
                    <div key={ref.id} className="text-xs">
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
