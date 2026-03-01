import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate } from './utils';
import { SectionTitle, ContactItem } from './components';

export const RotterdamTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects, interests } = cvData;

    // Generate fallback initials when no photo is provided
    const initials = contact.firstName && contact.lastName 
      ? `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()
      : contact.firstName 
        ? contact.firstName.charAt(0).toUpperCase()
        : contact.lastName 
          ? contact.lastName.charAt(0).toUpperCase()
          : '';

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-8 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 border-b-2 pb-6" style={{ borderColor: settings.primaryColor }}>
          <div>
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
          {contact.photo ? (
            <img 
              src={contact.photo} 
              alt="Profile" 
              className="w-28 h-28 object-cover"
              style={{ border: `3px solid ${settings.primaryColor}` }}
            />
          ) : initials ? (
            <div 
              className="w-28 h-28 flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {initials}
            </div>
          ) : null}
        </div>

        {/* Contact Info Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
          {contact.email && (
            <ContactItem icon="email" value={contact.email} variant="inline" className="break-all" />
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
            <ContactItem icon="linkedin" value={contact.linkedin} variant="inline" className="break-all" />
          )}
          {contact.github && (
            <ContactItem icon="github" value={contact.github} variant="inline" className="break-all" />
          )}
          {contact.portfolio && (
            <ContactItem icon="portfolio" value={contact.portfolio} variant="inline" className="break-all" />
          )}
          {contact.nationality && (
            <ContactItem icon="nationality" value={contact.nationality} variant="inline" />
          )}
          {contact.birthDate && (
            <ContactItem icon="birthdate" value={contact.birthDate} variant="inline" />
          )}
          {contact.drivingLicense && (
            <ContactItem icon="driving" value={contact.drivingLicense} variant="inline" />
          )}
        </div>

        {profile && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.profile" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <p className="text-gray-700">{profile}</p>
          </div>
        )}

        {/* Skills Section - Prominent */}
        {skills.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.technicalSkills" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <div className="grid grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <span className="text-gray-700">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.experience" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h4 className="font-semibold text-gray-900 break-words">{exp.jobTitle}</h4>
                    <p className="text-gray-600 text-sm break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {educations.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.education" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                  </div>
                  <div className="col-span-3 min-w-0">
                    <h4 className="font-semibold text-gray-900 break-words">{edu.diploma}</h4>
                    <p className="text-gray-600 text-sm break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                    {edu.description && (
                      <p className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.languages" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <div className="grid grid-cols-3 gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <span className="text-gray-700">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.certifications" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
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
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.projects" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <Folder className="w-4 h-4 flex-shrink-0" style={{ color: settings.primaryColor }} />
                    <h4 className="font-semibold text-gray-900 truncate">{proj.name}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{proj.description}</p>
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
        )}

        {/* Interests Section */}
        {interests.length > 0 && (
          <div>
            <SectionTitle 
              titleKey="template.interests" 
              color={settings.primaryColor}
              variant="underline"
              className="uppercase"
            />
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

RotterdamTemplate.displayName = 'RotterdamTemplate';
