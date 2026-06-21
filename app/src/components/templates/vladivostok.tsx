import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { Award, Folder, Flag } from 'lucide-react';
import type { TemplateProps } from './types';
import { getSkillLevelWidth, formatDate, getInitials, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const VladivostokTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects, interests, references, internships, publications, extracurricular } = cvData;
    const mainIds: LayoutSectionId[] = ['profile', 'experience', 'education', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) => mainIds.includes(id) && isSectionVisible(id, settings));

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Main Content - 70% */}
          <div className="w-[70%] p-8">
            {/* Header */}
            <div className="mb-8">
              <h1
                className="text-5xl font-bold mb-2"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {contact.firstName} {contact.lastName}
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
                        <div key={exp.id} className="border-l-2 pl-4 min-w-0" style={{ borderColor: settings.primaryColor }}>
                          <h4 className="font-semibold text-gray-900 break-words">{exp.jobTitle}</h4>
                          <p className="text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                          <p className="text-sm text-gray-500 mb-1">
                            {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                          </p>
                          {exp.description && (
                            <div className="text-sm text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
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
                        <div key={edu.id} className="border-l-2 pl-4 min-w-0" style={{ borderColor: settings.primaryColor }}>
                          <h4 className="font-semibold text-gray-900 break-words">{edu.diploma}</h4>
                          <p className="text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                          <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                          {edu.description && (
                            <div className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
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
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-start gap-2">
                          <Award className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: settings.primaryColor }} />
                          <div>
                            <p className="font-medium text-gray-900">{cert.name}</p>
                            <p className="text-sm text-gray-600">{cert.organization}</p>
                            {cert.date && (
                              <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                            )}
                          </div>
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
                            <Folder className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                            <h4 className="font-semibold text-gray-900 truncate">{proj.name}</h4>
                          </div>
                          <div className="text-sm text-gray-700 mb-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
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

            {isSectionVisible('internships', settings) && internships.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.internships" variant="underline" color={settings.primaryColor} />
                <div className="space-y-5 min-w-0">
                  {internships.map((intern) => (
                    <div key={intern.id} className="border-l-2 pl-4 min-w-0" style={{ borderColor: settings.primaryColor }}>
                      <h4 className="font-semibold text-gray-900 break-words">{intern.jobTitle}</h4>
                      <p className="text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
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
                <SectionTitle titleKey="template.publications" variant="underline" color={settings.primaryColor} />
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-sm text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

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

            {isSectionVisible('references', settings) && references.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="template.references" variant="underline" color={settings.primaryColor} />
                <div className="space-y-3">
                  {references.map((ref) => (
                    <div key={ref.id}>
                      <p className="font-medium text-gray-900">{ref.name}</p>
                      <p className="text-sm text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
                      {ref.email && <p className="text-xs text-gray-500">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - 30% */}
          <div
            className="w-[30%] p-6 text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {contact.photo ? (
              <div className="w-full aspect-square mb-6 overflow-hidden">
                <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-square mb-6 overflow-hidden bg-white/20 flex items-center justify-center text-6xl font-bold">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}

            <div className="mb-6">
              <SectionTitle titleKey="template.contact" variant="sidebar" />
              <div className="space-y-2">
                {contact.email && (
                  <ContactItem icon="email" value={contact.email} variant="sidebar" />
                )}
                {contact.phone && (
                  <ContactItem icon="phone" value={contact.phone} variant="sidebar" />
                )}
                {(contact.city || contact.country) && (
                  <ContactItem
                    icon="location"
                    value={[contact.city, contact.country].filter(Boolean).join(', ')}
                    variant="sidebar"
                  />
                )}
                {contact.linkedin && (
                  <ContactItem icon="linkedin" value={contact.linkedin} variant="sidebar" />
                )}
                {contact.github && (
                  <ContactItem icon="github" value={contact.github} variant="sidebar" />
                )}
                {contact.portfolio && (
                  <ContactItem icon="portfolio" value={contact.portfolio} variant="sidebar" />
                )}
                {contact.nationality && (
                  <ContactItem icon="nationality" value={contact.nationality} variant="sidebar" />
                )}
                {contact.birthDate && (
                  <ContactItem icon="birthdate" value={contact.birthDate} variant="sidebar" />
                )}
                {contact.drivingLicense && (
                  <ContactItem icon="driving" value={contact.drivingLicense} variant="sidebar" />
                )}
              </div>
            </div>

            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.skills" variant="sidebar" />
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-sm">{skill.name}</p>
                      {!settings.showSkillsAsTags && settings.showSkillLevels && (
                        <div className="w-full h-1 bg-white/30 rounded mt-1">
                          <div
                            className="h-full bg-white rounded"
                            style={{ width: getSkillLevelWidth(skill.level) }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.languages" variant="sidebar" />
                <div className="space-y-2 text-sm">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center gap-2">
                      <Flag className="w-4 h-4 opacity-70" />
                      <span>{lang.name}</span>
                      {lang.level && <span className="opacity-70 text-xs">({t(`template.languageLevels.${lang.level}`, lang.level)})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.interests" variant="sidebar" />
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
      </div>
    );
  }
);

VladivostokTemplate.displayName = 'VladivostokTemplate';
