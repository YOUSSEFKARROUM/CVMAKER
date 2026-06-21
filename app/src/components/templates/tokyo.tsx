import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { MapPin, Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate, getInitials, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const TokyoTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const leftIds: LayoutSectionId[] = ['profile', 'experience', 'certifications'];
    const rightIds: LayoutSectionId[] = ['education', 'projects'];
    const orderedLeft = getOrderedSections(settings).filter((id) => leftIds.includes(id) && isSectionVisible(id, settings));
    const orderedRight = getOrderedSections(settings).filter((id) => rightIds.includes(id) && isSectionVisible(id, settings));

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-6 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Compact Header */}
        <div className="flex items-center gap-4 mb-6 border-b pb-4" style={{ borderColor: settings.primaryColor }}>
          {contact.photo ? (
            <img
              src={contact.photo}
              alt="Profile"
              className="w-20 h-20 rounded object-cover"
            />
          ) : (
            <div
              className="w-20 h-20 rounded flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          )}
          <div className="flex-1">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
            >
              {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
            </h1>
            {contact.jobTitle && (
              <p className="text-gray-600">{contact.jobTitle}</p>
            )}
          </div>
          <div className="text-right text-sm text-gray-600 space-y-1">
            <ContactItem icon="email" value={contact.email} variant="inline" />
            <ContactItem icon="phone" value={contact.phone} variant="inline" />
            {(contact.city || contact.country) && (
              <div className="flex items-center gap-1 justify-end">
                <MapPin className="w-3 h-3" />
                <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            <ContactItem icon="linkedin" value={contact.linkedin} variant="inline" className="break-all" />
            <ContactItem icon="github" value={contact.github} variant="inline" className="break-all" />
            <ContactItem icon="portfolio" value={contact.portfolio} variant="inline" className="break-all" />
            <ContactItem icon="nationality" value={contact.nationality} variant="inline" />
            <ContactItem icon="birthdate" value={contact.birthDate} variant="inline" />
            <ContactItem icon="driving" value={contact.drivingLicense} variant="inline" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - ordered */}
          <div className="space-y-5">
            {orderedLeft.map((section) => {
              if (section === 'profile' && profile) {
                return (
                  <div key="profile">
                    <SectionTitle titleKey="template.profile" color={settings.primaryColor} className="text-sm uppercase" />
                    <p className="text-sm text-gray-700">{profile}</p>
                  </div>
                );
              }
              if (section === 'experience' && experiences.length > 0) {
                return (
                  <div key="experience">
                    <SectionTitle titleKey="template.experience" color={settings.primaryColor} className="text-sm uppercase" />
                    <div className="space-y-3">
                      {experiences.map((exp) => (
                        <div key={exp.id}>
                          <h4 className="font-semibold text-sm text-gray-900">{exp.jobTitle}</h4>
                          <p className="text-xs text-gray-600">{exp.employer}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                          </p>
                          {exp.description && (
                            <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'certifications' && certifications.length > 0) {
                return (
                  <div key="certifications">
                    <SectionTitle titleKey="template.certifications" color={settings.primaryColor} className="text-sm uppercase" />
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-start gap-2">
                          <Award className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: settings.primaryColor }} />
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
              return null;
            })}

            {isSectionVisible('internships', settings) && internships.length > 0 && (
              <div>
                <SectionTitle titleKey="template.internships" color={settings.primaryColor} className="text-sm uppercase" />
                <div className="space-y-3">
                  {internships.map((intern) => (
                    <div key={intern.id}>
                      <h4 className="font-semibold text-sm text-gray-900">{intern.jobTitle}</h4>
                      <p className="text-xs text-gray-600">{intern.employer}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                      </p>
                      {intern.description && (
                        <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div>
                <SectionTitle titleKey="template.publications" color={settings.primaryColor} className="text-sm uppercase" />
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-xs text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - ordered then skills, languages, interests, extracurricular, references */}
          <div className="space-y-5">
            {orderedRight.map((section) => {
              if (section === 'education' && educations.length > 0) {
                return (
                  <div key="education">
                    <SectionTitle titleKey="template.education" color={settings.primaryColor} className="text-sm uppercase" />
                    <div className="space-y-2">
                      {educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-semibold text-sm text-gray-900">{edu.diploma}</h4>
                          <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                          <p className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</p>
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
                    <SectionTitle titleKey="template.projects" color={settings.primaryColor} className="text-sm uppercase" />
                    <div className="space-y-3 min-w-0">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0 overflow-hidden">
                          <div className="flex items-center gap-1 mb-1 min-w-0">
                            <Folder className="w-3 h-3 flex-shrink-0" style={{ color: settings.primaryColor }} />
                            <h4 className="font-semibold text-sm text-gray-900 truncate">{proj.name}</h4>
                          </div>
                          <div className="text-xs text-gray-700 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                          {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {proj.technologies.slice(0, 15).map((tech, idx) => (
                                <span key={idx} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
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

            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div>
                <SectionTitle titleKey="template.skills" color={settings.primaryColor} className="text-sm uppercase" />
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill) => (
                    <span key={skill.id} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div>
                <SectionTitle titleKey="template.languages" color={settings.primaryColor} className="text-sm uppercase" />
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <p key={lang.id} className="text-sm text-gray-700">
                      {lang.name}{lang.level ? ` (${t(`template.languageLevels.${lang.level}`, lang.level)})` : ''}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div>
                <SectionTitle titleKey="template.interests" color={settings.primaryColor} className="text-sm uppercase" />
                <p className="text-sm text-gray-700">{interests.join(', ')}</p>
              </div>
            )}

            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div>
                <SectionTitle titleKey="template.extracurricular" color={settings.primaryColor} className="text-sm uppercase" />
                <div className="space-y-1">
                  {extracurricular.map((act, i) => (
                    <p key={i} className="text-xs text-gray-700">• {act}</p>
                  ))}
                </div>
              </div>
            )}

            {isSectionVisible('references', settings) && references.length > 0 && (
              <div>
                <SectionTitle titleKey="template.references" color={settings.primaryColor} className="text-sm uppercase" />
                <div className="space-y-2">
                  {references.map((ref) => (
                    <div key={ref.id}>
                      <p className="text-sm font-semibold text-gray-900">{ref.name}</p>
                      <p className="text-xs text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
                      {ref.email && <p className="text-xs text-gray-500">{ref.email}</p>}
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

TokyoTemplate.displayName = 'TokyoTemplate';
