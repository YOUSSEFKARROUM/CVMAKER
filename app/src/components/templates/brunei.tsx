import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
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
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header Minimalist */}
        <div className="pb-6 mb-8 border-b" style={{ borderColor: `${settings.primaryColor}30` }}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 
                className="text-4xl font-light mb-1.5 tracking-tight"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {contact.firstName.toUpperCase()} <span className="font-semibold">{contact.lastName.toUpperCase()}</span>
              </h1>
              {contact.jobTitle && (
                <p className="text-base text-gray-500 tracking-widest uppercase font-medium">{contact.jobTitle}</p>
              )}
            </div>
            {contact.photo && (
              <img 
                src={contact.photo} 
                alt="Profile" 
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                style={{ border: `2px solid ${settings.primaryColor}` }}
              />
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-10">
          {/* Left Column - Contact & Skills */}
          <div className="col-span-1 space-y-6">
            {/* Contact */}
            <div>
              <SectionTitle 
                titleKey="template.contact" 
                color={settings.primaryColor}
                variant="underline"
                className="text-sm uppercase tracking-wider"
              />
              <div className="space-y-2.5">
                {contact.email && (
                  <ContactItem icon="email" value={contact.email} accentColor={settings.primaryColor} />
                )}
                {contact.phone && (
                  <ContactItem icon="phone" value={contact.phone} accentColor={settings.primaryColor} />
                )}
                {(contact.city || contact.country) && (
                  <ContactItem 
                    icon="location" 
                    value={[contact.city, contact.country].filter(Boolean).join(', ')} 
                    accentColor={settings.primaryColor}
                  />
                )}
                {contact.linkedin && (
                  <ContactItem icon="linkedin" value={contact.linkedin} accentColor={settings.primaryColor} />
                )}
                {contact.github && (
                  <ContactItem icon="github" value={contact.github} accentColor={settings.primaryColor} />
                )}
                {contact.portfolio && (
                  <ContactItem icon="portfolio" value={contact.portfolio} accentColor={settings.primaryColor} />
                )}
                {contact.nationality && (
                  <ContactItem icon="nationality" value={contact.nationality} accentColor={settings.primaryColor} />
                )}
                {contact.drivingLicense && (
                  <ContactItem icon="driving" value={contact.drivingLicense} accentColor={settings.primaryColor} />
                )}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.skills" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-1.5">
                  {skills.map((skill) => (
                    <p key={skill.id} className="text-sm text-gray-700 leading-snug">{skill.name}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
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
              <div>
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
              <div>
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
          <div className="col-span-2 space-y-7">
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
                <div className="space-y-5 min-w-0">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 pl-4 py-0.5 min-w-0" style={{ borderColor: `${settings.primaryColor}40` }}>
                      <h4 className="font-semibold text-gray-900 text-[15px] break-words">{exp.jobTitle}</h4>
                      <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                      <p className="text-xs text-gray-500 mb-1.5">
                        {formatDate(exp.startDate)} – {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }}>{exp.description}</p>
                      )}
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
                <div className="space-y-4 min-w-0">
                  {educations.map((edu) => (
                    <div key={edu.id} className="py-0.5 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-[15px] break-words">{edu.diploma}</h4>
                      <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                      <p className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</p>
                      {edu.description && (
                        <p className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{edu.description}</p>
                      )}
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
                <div className="space-y-3 min-w-0">
                  {projects.map((proj) => (
                    <div key={proj.id} className="min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1 min-w-0">
                        <Folder className="w-3 h-3 flex-shrink-0" style={{ color: settings.primaryColor }} />
                        <h4 className="font-semibold text-gray-900 truncate">{proj.name}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{proj.description}</p>
                      {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.slice(0, 15).map((tech, idx) => (
                            <span key={idx} className="text-xs text-gray-500 break-all">
                              {String(tech)}{idx < Math.min(proj.technologies.length, 15) - 1 ? ', ' : ''}
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
