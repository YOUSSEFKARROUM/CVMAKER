import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { getSkillLevelWidth, formatDate, getInitials, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const ModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainIds: LayoutSectionId[] = ['profile', 'experience', 'education', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) => mainIds.includes(id) && isSectionVisible(id, settings));

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
          className="p-8 text-white"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="flex items-start gap-6">
            {contact.photo ? (
              <img
                src={contact.photo}
                alt="Profile"
                className="w-24 h-24 rounded-lg object-cover border-2 border-white/30"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-lg border-2 border-white/30 flex items-center justify-center text-3xl font-bold bg-white/20"
              >
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}
            <div className="flex-1">
              <h1
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: settings.titleFont }}
              >
                {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
              </h1>
              {contact.jobTitle && (
                <p className="text-xl text-white/90 mb-3">{contact.jobTitle}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80">
                {contact.phone && (
                  <ContactItem icon="phone" value={contact.phone} variant="sidebar" />
                )}
                {contact.email && (
                  <ContactItem icon="email" value={contact.email} variant="sidebar" />
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
                {contact.portfolio && (
                  <ContactItem icon="portfolio" value={contact.portfolio} variant="sidebar" />
                )}
                {contact.github && (
                  <ContactItem icon="github" value={contact.github} variant="sidebar" />
                )}
                {contact.nationality && (
                  <ContactItem icon="nationality" value={contact.nationality} variant="sidebar" />
                )}
                {contact.birthDate && (
                  <ContactItem icon="birthdate" value={formatDate(contact.birthDate)} variant="sidebar" />
                )}
                {contact.drivingLicense && (
                  <ContactItem icon="driving" value={contact.drivingLicense} variant="sidebar" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div>
                <SectionTitle
                  titleKey="template.skills"
                  color={settings.primaryColor}
                  variant="default"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-sm font-medium">{skill.name}</p>
                      {!settings.showSkillsAsTags && settings.showSkillLevels && (
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: getSkillLevelWidth(skill.level),
                              backgroundColor: settings.primaryColor
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div>
                <SectionTitle
                  titleKey="template.languages"
                  color={settings.primaryColor}
                  variant="default"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <p className="text-sm">{lang.name}</p>
                      {lang.level && <p className="text-xs text-gray-500">{t(`template.languageLevels.${lang.level}`, lang.level)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div>
                <SectionTitle
                  titleKey="template.interests"
                  color={settings.primaryColor}
                  variant="default"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="flex flex-wrap gap-1">
                  {interests.map((interest, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
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
                  color={settings.primaryColor}
                  variant="default"
                  className="text-sm uppercase tracking-wider"
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

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            {orderedSections.map((section) => {
              if (section === 'profile' && profile) {
                return (
                  <div key="profile">
                    <SectionTitle titleKey="template.profile" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                    <p className="text-gray-700 leading-relaxed">{profile}</p>
                  </div>
                );
              }
              if (section === 'experience' && experiences.length > 0) {
                return (
                  <div key="experience">
                    <SectionTitle titleKey="template.experience" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id}>
                          <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                          <p className="text-sm text-gray-600">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                          <p className="text-xs text-gray-500 mb-1">
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
                  <div key="education">
                    <SectionTitle titleKey="template.education" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                    <div className="space-y-3">
                      {educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                          <p className="text-sm text-gray-600">{edu.school}</p>
                          <p className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'certifications' && certifications.length > 0) {
                return (
                  <div key="certifications">
                    <SectionTitle titleKey="template.certifications" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-start gap-2">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.organization}</p>
                            <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'projects' && projects.length > 0) {
                return (
                  <div key="projects">
                    <SectionTitle titleKey="template.projects" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                    <div className="space-y-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <Folder className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{proj.name}</h4>
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
              <div>
                <SectionTitle titleKey="template.internships" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                <div className="space-y-4">
                  {internships.map((intern) => (
                    <div key={intern.id}>
                      <h4 className="font-semibold text-gray-900">{intern.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{intern.employer}{intern.city && `, ${intern.city}`}</p>
                      <p className="text-xs text-gray-500 mb-1">
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
              <div>
                <SectionTitle titleKey="template.publications" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-sm text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div>
                <SectionTitle titleKey="template.extracurricular" color={settings.primaryColor} variant="underline" className="text-sm uppercase tracking-wider" />
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
    );
  }
);

ModernTemplate.displayName = 'ModernTemplate';
