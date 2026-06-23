import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { Globe, Award, Folder, Flag } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate, getOrderedSections, isSectionVisible } from './utils';
import { SectionTitle, ContactItem } from './components';

export const KievTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const {
      contact,
      experiences,
      educations,
      skills,
      profile,
      languages,
      certifications,
      projects,
      interests,
      references,
      internships,
      publications,
      extracurricular,
    } = cvData;

    const orderedSections = getOrderedSections(settings).filter((id) => isSectionVisible(id, settings));

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Left Side with Photo */}
          <div
            className="w-2/5 relative"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <div className="p-8 text-white self-stretch">
              {contact.photo ? (
                <div className="w-full aspect-[3/4] mb-6 overflow-hidden">
                  <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className="w-full aspect-[3/4] mb-6 flex items-center justify-center text-8xl font-bold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  {getInitials(contact.firstName, contact.lastName)}
                </div>
              )}

              <h1
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: settings.titleFont }}
              >
                {contact.firstName}
              </h1>
              <h1
                className="text-3xl font-bold mb-4"
                style={{ fontFamily: settings.titleFont }}
              >
                {contact.lastName}
              </h1>

              {contact.jobTitle && (
                <p className="text-white/80 mb-6">{contact.jobTitle}</p>
              )}

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <ContactItem icon="email" value={contact.email} variant="sidebar" />
                <ContactItem icon="phone" value={contact.phone} variant="sidebar" />
                <ContactItem
                  icon="location"
                  value={[contact.city, contact.country].filter(Boolean).join(', ')}
                  variant="sidebar"
                />
                <ContactItem icon="linkedin" value={contact.linkedin} variant="sidebar" />
                <ContactItem icon="github" value={contact.github} variant="sidebar" />
                <ContactItem icon="portfolio" value={contact.portfolio} variant="sidebar" />
                <ContactItem icon="nationality" value={contact.nationality} variant="sidebar" />
                <ContactItem icon="birthdate" value={contact.birthDate} variant="sidebar" />
                {contact.drivingLicense && (
                  <ContactItem icon="driving" value={contact.drivingLicense} variant="sidebar" />
                )}
              </div>

              {/* Skills */}
              {isSectionVisible('skills', settings) && skills.length > 0 && (
                <div className="mt-8">
                  <SectionTitle
                    titleKey="template.skills"
                    variant="sidebar"
                  />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill.id} className="text-xs px-2 py-1 bg-white/20 rounded">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {isSectionVisible('languages', settings) && languages.length > 0 && (
                <div className="mt-8">
                  <SectionTitle
                    titleKey="template.languages"
                    variant="sidebar"
                  />
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex items-center gap-2">
                        <Flag className="w-4 h-4 opacity-70" />
                        <span className="text-sm">{lang.name}</span>
                        {lang.level && <span className="text-xs opacity-70">({t(`template.languageLevels.${lang.level}`, lang.level)})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {isSectionVisible('certifications', settings) && certifications.length > 0 && (
                <div className="mt-8">
                  <SectionTitle
                    titleKey="template.certifications"
                    variant="sidebar"
                  />
                  <div className="space-y-3">
                    {certifications.map((cert) => (
                      <div key={cert.id}>
                        <div className="flex items-start gap-2">
                          <Award className="w-4 h-4 opacity-70 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{cert.name}</p>
                            <p className="text-xs opacity-80">{cert.organization}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {isSectionVisible('projects', settings) && projects.length > 0 && (
                <div className="mt-8">
                  <SectionTitle
                    titleKey="template.projects"
                    variant="sidebar"
                  />
                  <div className="space-y-3">
                    {projects.slice(0, 3).map((proj) => (
                      <div key={proj.id}>
                        <div className="flex items-start gap-2">
                          <Folder className="w-4 h-4 opacity-70 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{proj.name}</p>
                            <p className="text-xs opacity-80">
                              {proj.technologies.slice(0, 3).join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {isSectionVisible('interests', settings) && interests.length > 0 && (
                <div className="mt-8">
                  <SectionTitle
                    titleKey="template.interests"
                    variant="sidebar"
                  />
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-white/20 rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-3/5 p-8">
            {orderedSections.map((section) => {
              if (section === 'profile') {
                if (!profile) return null;
                return (
                  <div className="mb-8" key="profile">
                    <SectionTitle
                      titleKey="template.profile"
                      color={settings.primaryColor}
                      variant="bordered"
                    />
                    <p className="text-gray-700 leading-relaxed">{profile}</p>
                  </div>
                );
              }

              if (section === 'experience') {
                if (!experiences.length) return null;
                return (
                  <div className="mb-8" key="experience">
                    <SectionTitle
                      titleKey="template.experience"
                      color={settings.primaryColor}
                      variant="bordered"
                    />
                    <div className="space-y-5">
                      {experiences.map((exp) => (
                        <div key={exp.id}>
                          <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                          <p className="text-gray-600 text-sm">{exp.employer}</p>
                          <p className="text-xs text-gray-500 mb-1">
                            {formatDate(exp.startDate)} -{' '}
                            {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                          </p>
                          {exp.description && (
                            <div className="text-sm text-gray-700 break-words leading-relaxed cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section === 'education') {
                if (!educations.length) return null;
                return (
                  <div className="mb-8" key="education">
                    <SectionTitle
                      titleKey="template.education"
                      color={settings.primaryColor}
                      variant="bordered"
                    />
                    <div className="space-y-3">
                      {educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                          <p className="text-gray-600 text-sm">{edu.school}</p>
                          <p className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section === 'certifications') {
                if (!certifications.length) return null;
                return (
                  <div className="mb-8" key="certifications">
                    <SectionTitle
                      titleKey="template.certifications"
                      color={settings.primaryColor}
                      variant="bordered"
                    />
                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div key={cert.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <span className="text-sm text-gray-500">{formatDate(cert.date)}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{cert.organization}</p>
                          {cert.credentialId && (
                            <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section === 'projects') {
                if (!projects.length) return null;
                return (
                  <div className="mb-8" key="projects">
                    <SectionTitle
                      titleKey="template.projects"
                      color={settings.primaryColor}
                      variant="bordered"
                    />
                    <div className="space-y-4 min-w-0">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {proj.name}
                            </h4>
                            {proj.link && (
                              <Globe className="w-3 h-3 flex-shrink-0 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-700 mb-1 break-words cv-rich-text" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                          {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {proj.technologies.slice(0, 15).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600"
                                >
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

              if (section === 'languages') {
                if (!languages.length) return null;
                return (
                  <div key="languages" className="mb-8">
                    <SectionTitle
                      titleKey="template.languages"
                      color={settings.primaryColor}
                      variant="bordered"
                    />
                    <div className="space-y-1">
                      {languages.map((lang) => (
                        <p key={lang.id} className="text-sm text-gray-700">
                          {lang.name}{lang.level ? ` — ${t(`template.languageLevels.${lang.level}`, lang.level)}` : ''}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {isSectionVisible('internships', settings) && internships.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.internships" color={settings.primaryColor} variant="bordered" />
                <div className="space-y-5">
                  {internships.map((intern) => (
                    <div key={intern.id}>
                      <h4 className="font-semibold text-gray-900">{intern.jobTitle}</h4>
                      <p className="text-gray-600 text-sm">{intern.employer}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDate(intern.startDate)} -{' '}
                        {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                      </p>
                      {intern.description && (
                        <div className="text-sm text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.publications" color={settings.primaryColor} variant="bordered" />
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-sm text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.extracurricular" color={settings.primaryColor} variant="bordered" />
                <div className="space-y-1">
                  {extracurricular.map((act, i) => (
                    <p key={i} className="text-sm text-gray-700">• {act}</p>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('references', settings) && references.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.references" color={settings.primaryColor} variant="bordered" />
                <div className="grid grid-cols-2 gap-4">
                  {references.map((ref) => (
                    <div key={ref.id} className="text-sm">
                      <p className="font-semibold text-gray-900">{ref.name}</p>
                      <p className="text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
                      {ref.email && <p className="text-gray-500 text-xs">{ref.email}</p>}
                      {ref.phone && <p className="text-gray-500 text-xs">{ref.phone}</p>}
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

KievTemplate.displayName = 'KievTemplate';
