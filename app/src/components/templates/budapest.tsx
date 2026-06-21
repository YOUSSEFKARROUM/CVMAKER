import { forwardRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TemplateProps } from './types';
import { getInitials, getSkillLevelWidth, formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';
import { sanitizeHtml } from '../../utils/sanitize';

export const BudapestTemplate = forwardRef<HTMLDivElement, TemplateProps>(
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
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Left Sidebar */}
          <div
            className="w-[35%] px-7 py-8 text-white min-h-[297mm]"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {/* Photo */}
            {contact.photo ? (
              <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/25 flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-7">
              <SectionTitle titleKey="template.contact" variant="sidebar" className="text-white" />
              <div className="space-y-2.5">
                <ContactItem icon="phone" value={contact.phone} variant="sidebar" />
                <ContactItem icon="email" value={contact.email} variant="sidebar" />
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
                <ContactItem icon="driving" value={contact.drivingLicense} variant="sidebar" />
              </div>
            </div>

            {/* Skills — sidebar only, NOT in main content */}
            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div className="mb-7">
                <SectionTitle titleKey="template.skills" variant="sidebar" className="text-white" />
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-sm mb-1.5 text-white/95">{skill.name}</p>
                      {!settings.showSkillsAsTags && settings.showSkillLevels && (
                        <div className="w-full h-2 bg-white/25 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{ width: getSkillLevelWidth(skill.level) }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div className="mb-7">
                <SectionTitle titleKey="template.languages" variant="sidebar" className="text-white" />
                <div className="space-y-2 text-sm">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <span className="text-white/95">{lang.name}</span>
                      <span className="text-white/70 text-xs">{t(`template.languageLevels.${lang.level}`, lang.level)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.interests" variant="sidebar" className="text-white" />
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

          {/* Main Content */}
          <div className="w-[65%] p-8">
            {/* Name */}
            <div className="mb-6">
              <h1
                className="text-5xl font-bold mb-2"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {contact.firstName.toUpperCase()}
              </h1>
              <h1
                className="text-5xl font-bold mb-4"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {contact.lastName.toUpperCase()}
              </h1>
              {contact.jobTitle && (
                <p className="text-xl text-gray-600">{contact.jobTitle}</p>
              )}
            </div>

            {orderedSections.map((section) => {
              if (section === 'profile' && profile) {
                return (
                  <div className="mb-8" key="profile">
                    <SectionTitle titleKey="template.profile" variant="underline" color={settings.primaryColor} />
                    <p className="text-gray-700 leading-relaxed">{profile}</p>
                  </div>
                );
              }
              if (section === 'experience' && experiences.length > 0) {
                return (
                  <div className="mb-8" key="experience">
                    <SectionTitle titleKey="template.experience" variant="underline" color={settings.primaryColor} />
                    <div className="space-y-5 min-w-0">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 break-words min-w-0">{exp.jobTitle}</h4>
                            <span className="text-sm text-gray-500 flex-shrink-0">
                              {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                          {exp.description && (
                            <div className="text-sm text-gray-700 break-words leading-relaxed cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'education' && educations.length > 0) {
                return (
                  <div className="mb-8" key="education">
                    <SectionTitle titleKey="template.education" variant="underline" color={settings.primaryColor} />
                    <div className="space-y-4 min-w-0">
                      {educations.map((edu) => (
                        <div key={edu.id} className="min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 break-words min-w-0">{edu.diploma}</h4>
                            <span className="text-sm text-gray-500 flex-shrink-0">{formatDate(edu.graduationDate)}</span>
                          </div>
                          <p className="text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                          {edu.description && (
                            <div className="text-sm text-gray-700 mt-1 break-words leading-relaxed cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'certifications' && certifications.length > 0) {
                return (
                  <div className="mb-8" key="certifications">
                    <SectionTitle titleKey="template.certifications" variant="underline" color={settings.primaryColor} />
                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div key={cert.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <span className="text-sm text-gray-500">{formatDate(cert.date)}</span>
                          </div>
                          <p className="text-gray-600">{cert.organization}</p>
                          {cert.credentialId && (
                            <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'projects' && projects.length > 0) {
                return (
                  <div className="mb-8" key="projects">
                    <SectionTitle titleKey="template.projects" variant="underline" color={settings.primaryColor} />
                    <div className="space-y-4 min-w-0">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{proj.name}</h4>
                            {proj.link && (
                              <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-700 mb-1 break-words cv-rich-text" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                          {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {proj.technologies.slice(0, 15).map((tech, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
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
              <div className="mb-8">
                <SectionTitle titleKey="template.internships" variant="underline" color={settings.primaryColor} />
                <div className="space-y-5 min-w-0">
                  {internships.map((intern) => (
                    <div key={intern.id} className="min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 break-words min-w-0">{intern.jobTitle}</h4>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                      {intern.description && (
                        <div className="text-sm text-gray-700 break-words leading-relaxed cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.publications" variant="underline" color={settings.primaryColor} />
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-sm text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Extracurricular */}
            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.extracurricular" variant="underline" color={settings.primaryColor} />
                <div className="space-y-1">
                  {extracurricular.map((act, i) => (
                    <p key={i} className="text-sm text-gray-700">• {act}</p>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {isSectionVisible('references', settings) && references.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.references" variant="underline" color={settings.primaryColor} />
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

BudapestTemplate.displayName = 'BudapestTemplate';
