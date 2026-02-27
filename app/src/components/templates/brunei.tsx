import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Globe, 
  Github, 
  Award, 
  Folder, 
  Flag, 
  Car 
} from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate } from './utils';
import { SectionTitle, ContactItem } from './components';

export const BruneiTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects, interests } = cvData;

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-12 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header Minimalist */}
        <div className="border-b-2 pb-6 mb-8" style={{ borderColor: settings.primaryColor }}>
          <div className="flex items-end justify-between">
            <div>
              <h1 
                className="text-4xl font-light mb-2 tracking-wide"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {contact.firstName.toUpperCase()} <span className="font-bold">{contact.lastName.toUpperCase()}</span>
              </h1>
              {contact.jobTitle && (
                <p className="text-lg text-gray-500 tracking-widest uppercase">{contact.jobTitle}</p>
              )}
            </div>
            {contact.photo && (
              <img 
                src={contact.photo} 
                alt="Profile" 
                className="w-24 h-24 object-cover"
                style={{ border: `2px solid ${settings.primaryColor}` }}
              />
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Contact & Skills */}
          <div className="col-span-1">
            {/* Contact */}
            <div className="mb-6">
              <SectionTitle 
                titleKey="template.contact" 
                color={settings.primaryColor}
                variant="underline"
                className="text-sm uppercase tracking-wider"
              />
              <div className="space-y-2">
                {contact.email && (
                  <ContactItem icon="email" value={contact.email} />
                )}
                {contact.phone && (
                  <ContactItem icon="phone" value={contact.phone} />
                )}
                {(contact.city || contact.country) && (
                  <ContactItem 
                    icon="location" 
                    value={[contact.city, contact.country].filter(Boolean).join(', ')} 
                  />
                )}
                {contact.linkedin && (
                  <ContactItem icon="linkedin" value={contact.linkedin} />
                )}
                {contact.github && (
                  <ContactItem icon="github" value={contact.github} />
                )}
                {contact.portfolio && (
                  <ContactItem icon="portfolio" value={contact.portfolio} />
                )}
                {contact.nationality && (
                  <ContactItem icon="nationality" value={contact.nationality} />
                )}
                {contact.drivingLicense && (
                  <ContactItem icon="driving" value={contact.drivingLicense} />
                )}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <SectionTitle 
                  titleKey="template.skills" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-1">
                  {skills.map((skill) => (
                    <p key={skill.id} className="text-sm text-gray-700">{skill.name}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mb-6">
                <SectionTitle 
                  titleKey="template.languages" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <p key={lang.id} className="text-sm text-gray-700">{lang.name}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <SectionTitle 
                  titleKey="template.certifications" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <p className="text-sm font-medium text-gray-700">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div className="mb-6">
                <SectionTitle 
                  titleKey="template.interests" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="flex flex-wrap gap-1">
                  {interests.map((interest, idx) => (
                    <span key={idx} className="text-xs text-gray-600">
                      {interest}{idx < interests.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="col-span-2 space-y-6">
            {/* Profile */}
            {profile && (
              <div>
                <SectionTitle 
                  titleKey="template.profile" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <p className="text-gray-700 leading-relaxed text-sm">{profile}</p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.experience" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{exp.employer}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.education" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
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
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.projects" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <Folder className="w-3 h-3" style={{ color: settings.primaryColor }} />
                        <h4 className="font-semibold text-gray-900">{proj.name}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{proj.description}</p>
                      {proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs text-gray-500">
                              {tech}{idx < proj.technologies.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      )}
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

BruneiTemplate.displayName = 'BruneiTemplate';
