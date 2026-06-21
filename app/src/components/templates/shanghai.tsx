import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate, getInitials, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';
import { SectionTitle, ContactItem } from './components';

export const ShanghaiTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects, interests, references, internships, publications, extracurricular } = cvData;
    const rightColumnIds: LayoutSectionId[] = ['experience', 'education', 'projects'];
    const orderedRight = getOrderedSections(settings).filter((id) => rightColumnIds.includes(id) && isSectionVisible(id, settings));

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header Band */}
        <div
          className="p-8 text-white"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="flex items-center gap-6">
            {contact.photo ? (
              <img
                src={contact.photo}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}
            <div>
              <h1
                className="text-4xl font-bold mb-1"
                style={{ fontFamily: settings.titleFont }}
              >
                {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
              </h1>
              {contact.jobTitle && (
                <p className="text-xl text-white/90">{contact.jobTitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Contact Bar */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b">
            {contact.email && (
              <ContactItem icon="email" value={contact.email} variant="inline" />
            )}
            {contact.phone && (
              <ContactItem icon="phone" value={contact.phone} variant="inline" />
            )}
            {(contact.city || contact.country) && (
              <ContactItem
                icon="location"
                value={[contact.city, contact.country].filter(Boolean).join(', ')}
                variant="inline"
              />
            )}
            {contact.linkedin && (
              <ContactItem icon="linkedin" value={contact.linkedin} variant="inline" />
            )}
            {contact.portfolio && (
              <ContactItem icon="portfolio" value={contact.portfolio} variant="inline" />
            )}
            {contact.github && (
              <ContactItem icon="github" value={contact.github} variant="inline" />
            )}
            {contact.nationality && (
              <ContactItem icon="nationality" value={contact.nationality} variant="inline" />
            )}
            {contact.birthDate && (
              <ContactItem icon="birthdate" value={formatDate(contact.birthDate)} variant="inline" />
            )}
            {contact.drivingLicense && (
              <ContactItem icon="driving" value={contact.drivingLicense} variant="inline" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="col-span-1 space-y-6">
              {isSectionVisible('profile', settings) && profile && (
                <div>
                  <SectionTitle
                    titleKey="template.profile"
                    variant="underline"
                    color={settings.primaryColor}
                    className="text-sm uppercase"
                  />
                  <p className="text-sm text-gray-700">{profile}</p>
                </div>
              )}

              {isSectionVisible('skills', settings) && skills.length > 0 && (
                <div>
                  <SectionTitle
                    titleKey="template.skills"
                    variant="underline"
                    color={settings.primaryColor}
                    className="text-sm uppercase"
                  />
                  <div className="space-y-1">
                    {skills.map((skill) => (
                      <p key={skill.id} className="text-sm text-gray-700">• {skill.name}</p>
                    ))}
                  </div>
                </div>
              )}

              {isSectionVisible('languages', settings) && languages.length > 0 && (
                <div>
                  <SectionTitle
                    titleKey="template.languages"
                    variant="underline"
                    color={settings.primaryColor}
                    className="text-sm uppercase"
                  />
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <div key={lang.id}>
                        <p className="text-sm text-gray-700">• {lang.name}</p>
                        {lang.level && <p className="text-xs text-gray-500 pl-3">{t(`template.languageLevels.${lang.level}`, lang.level)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSectionVisible('certifications', settings) && certifications.length > 0 && (
                <div>
                  <SectionTitle
                    titleKey="template.certifications"
                    variant="underline"
                    color={settings.primaryColor}
                    className="text-sm uppercase"
                  />
                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-2">
                        <Award className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                          <p className="text-xs text-gray-600">{cert.organization}</p>
                          {cert.date && (
                            <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSectionVisible('interests', settings) && interests.length > 0 && (
                <div>
                  <SectionTitle
                    titleKey="template.interests"
                    variant="underline"
                    color={settings.primaryColor}
                    className="text-sm uppercase"
                  />
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isSectionVisible('references', settings) && references.length > 0 && (
                <div>
                  <SectionTitle
                    titleKey="template.references"
                    variant="underline"
                    color={settings.primaryColor}
                    className="text-sm uppercase"
                  />
                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div key={ref.id}>
                        <p className="text-sm font-medium text-gray-900">{ref.name}</p>
                        <p className="text-xs text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
                        {ref.email && <p className="text-xs text-gray-500">{ref.email}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - ordered */}
            <div className="col-span-2 space-y-6">
              {orderedRight.map((section) => {
                if (section === 'experience' && experiences.length > 0) {
                  return (
                    <div key="experience">
                      <SectionTitle titleKey="template.experience" variant="underline" color={settings.primaryColor} className="text-sm uppercase" />
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                              <span className="text-sm text-gray-500">
                                {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                            {exp.description && (
                              <div className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (section === 'education' && educations.length > 0) {
                  return (
                    <div key="education">
                      <SectionTitle titleKey="template.education" variant="underline" color={settings.primaryColor} className="text-sm uppercase" />
                      <div className="space-y-3">
                        {educations.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                              <span className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</span>
                            </div>
                            <p className="text-gray-600 text-sm break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                            {edu.description && (
                              <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (section === 'projects' && projects.length > 0) {
                  return (
                    <div key="projects">
                      <SectionTitle titleKey="template.projects" variant="underline" color={settings.primaryColor} className="text-sm uppercase" />
                      <div className="space-y-4">
                        {projects.map((proj) => (
                          <div key={proj.id} className="min-w-0 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1 min-w-0">
                              <Folder className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                              <h4 className="font-semibold text-gray-900 truncate">{proj.name}</h4>
                            </div>
                            <div className="text-sm text-gray-700 mb-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                            {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {proj.technologies.slice(0, 15).map((tech, idx) => (
                                  <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
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

              {isSectionVisible('internships', settings) && internships.length > 0 && (
                <div>
                  <SectionTitle titleKey="template.internships" variant="underline" color={settings.primaryColor} className="text-sm uppercase" />
                  <div className="space-y-4">
                    {internships.map((intern) => (
                      <div key={intern.id}>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900">{intern.jobTitle}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                        {intern.description && (
                          <div className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSectionVisible('publications', settings) && publications.length > 0 && (
                <div>
                  <SectionTitle titleKey="template.publications" variant="underline" color={settings.primaryColor} className="text-sm uppercase" />
                  <div className="space-y-1">
                    {publications.map((pub, i) => (
                      <p key={i} className="text-sm text-gray-700">• {pub}</p>
                    ))}
                  </div>
                </div>
              )}

              {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
                <div>
                  <SectionTitle titleKey="template.extracurricular" variant="underline" color={settings.primaryColor} className="text-sm uppercase" />
                  <div className="space-y-1">
                    {extracurricular.map((act, i) => (
                      <p key={i} className="text-sm text-gray-700">• {act}</p>
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

ShanghaiTemplate.displayName = 'ShanghaiTemplate';
