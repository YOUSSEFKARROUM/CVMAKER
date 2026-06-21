import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate, getInitials, getOrderedSections, isSectionVisible } from './utils';
import { SectionTitle, ContactItem } from './components';

export const ChicagoTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects, interests, references, internships, publications, extracurricular } = cvData;
    const orderedSections = getOrderedSections(settings).filter(id => isSectionVisible(id, settings));

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
        <div className="text-center mb-9 pb-6 border-b-2" style={{ borderColor: settings.primaryColor }}>
          {/* Photo or Initials */}
          {contact.photo ? (
            <img
              src={contact.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 shadow-sm"
              style={{ borderColor: settings.primaryColor }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-4 shadow-sm"
              style={{ backgroundColor: settings.primaryColor, borderColor: settings.primaryColor }}
            >
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          )}
          <h1
            className="text-3xl font-bold mb-1.5 tracking-tight"
            style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
          >
            {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
          </h1>
          {contact.jobTitle && (
            <p className="text-lg text-gray-600 mb-4 font-medium">{contact.jobTitle}</p>
          )}

          {/* Contact Info */}
          <div className="flex justify-center gap-x-4 gap-y-1 text-sm text-gray-600 flex-wrap">
            <ContactItem icon="phone" value={contact.phone} variant="inline" accentColor={settings.primaryColor} />
            <ContactItem icon="email" value={contact.email} variant="inline" accentColor={settings.primaryColor} />
            {(contact.city || contact.country) && (
              <ContactItem
                icon="location"
                value={[contact.city, contact.country].filter(Boolean).join(', ')}
                variant="inline"
                accentColor={settings.primaryColor}
              />
            )}
            <ContactItem icon="github" value={contact.github} variant="inline" accentColor={settings.primaryColor} />
            <ContactItem icon="linkedin" value={contact.linkedin} variant="inline" accentColor={settings.primaryColor} />
            <ContactItem icon="portfolio" value={contact.portfolio} variant="inline" accentColor={settings.primaryColor} />
            <ContactItem icon="nationality" value={contact.nationality} variant="inline" accentColor={settings.primaryColor} />
            <ContactItem icon="birthdate" value={contact.birthDate} variant="inline" accentColor={settings.primaryColor} />
            <ContactItem icon="driving" value={contact.drivingLicense} variant="inline" accentColor={settings.primaryColor} />
          </div>
        </div>

        {orderedSections.map((section) => {
          if (section === 'profile' && profile) {
            return (
              <div className="mb-7" key="profile">
                <SectionTitle titleKey="template.profile" color={settings.primaryColor} variant="bordered" />
                <p className="text-gray-700 leading-relaxed text-sm break-words">{profile}</p>
              </div>
            );
          }
          if (section === 'experience' && experiences.length > 0) {
            return (
              <div className="mb-7" key="experience">
                <SectionTitle titleKey="template.experience" color={settings.primaryColor} variant="bordered" />
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="min-w-0">
                      <div className="flex justify-between items-start gap-2 min-w-0">
                        <h4 className="font-semibold text-gray-900 break-words min-w-0">{exp.jobTitle}</h4>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
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
                <SectionTitle titleKey="template.education" color={settings.primaryColor} variant="bordered" />
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="min-w-0">
                      <div className="flex justify-between items-start gap-2 min-w-0">
                        <h4 className="font-semibold text-gray-900 break-words min-w-0">{edu.diploma}</h4>
                        <span className="text-sm text-gray-500 flex-shrink-0">{formatDate(edu.graduationDate)}</span>
                      </div>
                      <p className="text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
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
                <SectionTitle titleKey="template.certifications" color={settings.primaryColor} variant="bordered" />
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start gap-2">
                      <Award className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: settings.primaryColor }} />
                      <div>
                        <p className="font-medium text-gray-900">{cert.name}</p>
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
              <div className="mb-8" key="projects">
                <SectionTitle titleKey="template.projects" color={settings.primaryColor} variant="bordered" />
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
          if (section === 'languages' && languages.length > 0) {
            return (
              <div className="mb-8" key="languages">
                <SectionTitle titleKey="template.languages" color={settings.primaryColor} variant="bordered" />
                <div className="flex flex-wrap gap-4">
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-gray-700">
                      {lang.name}
                      {' — '}
                      <span className="text-gray-500 text-sm">{t(`template.languageLevels.${lang.level}`, lang.level)}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Skills - fixed at end */}
        {isSectionVisible('skills', settings) && skills.length > 0 && (
          <div className="mt-8">
            <SectionTitle titleKey="template.skills" color={settings.primaryColor} variant="bordered" />
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {isSectionVisible('interests', settings) && interests.length > 0 && (
          <div className="mt-8">
            <SectionTitle titleKey="template.interests" color={settings.primaryColor} variant="bordered" />
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Internships */}
        {isSectionVisible('internships', settings) && internships.length > 0 && (
          <div className="mt-8">
            <SectionTitle titleKey="template.internships" color={settings.primaryColor} variant="bordered" />
            <div className="space-y-5">
              {internships.map((intern) => (
                <div key={intern.id} className="min-w-0">
                  <div className="flex justify-between items-start gap-2 min-w-0">
                    <h4 className="font-semibold text-gray-900 break-words min-w-0">{intern.jobTitle}</h4>
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                  {intern.description && (
                    <div className="text-sm text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {isSectionVisible('publications', settings) && publications.length > 0 && (
          <div className="mt-8">
            <SectionTitle titleKey="template.publications" color={settings.primaryColor} variant="bordered" />
            <div className="space-y-1">
              {publications.map((pub, i) => (
                <p key={i} className="text-sm text-gray-700">• {pub}</p>
              ))}
            </div>
          </div>
        )}

        {/* Extracurricular */}
        {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
          <div className="mt-8">
            <SectionTitle titleKey="template.extracurricular" color={settings.primaryColor} variant="bordered" />
            <div className="space-y-1">
              {extracurricular.map((act, i) => (
                <p key={i} className="text-sm text-gray-700">• {act}</p>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {isSectionVisible('references', settings) && references.length > 0 && (
          <div className="mt-8">
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
    );
  }
);

ChicagoTemplate.displayName = 'ChicagoTemplate';
