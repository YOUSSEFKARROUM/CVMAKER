import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Folder,
  Linkedin,
  Globe,
  Github,
  Flag,
  Car,
  Calendar
} from 'lucide-react';
import type { TemplateProps } from './types';
import { getSkillLevelWidth, formatDate } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const ModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects } = cvData;

    // Get initials for fallback avatar
    const getInitials = (firstName: string, lastName: string) => {
      const first = firstName?.charAt(0) || '';
      const last = lastName?.charAt(0) || '';
      return (first + last).toUpperCase();
    };

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
            {/* Skills */}
            {skills.length > 0 && (
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

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.languages" 
                  color={settings.primaryColor}
                  variant="default"
                  className="text-sm uppercase tracking-wider"
                />
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <p key={lang.id} className="text-sm">{lang.name}</p>
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
          </div>

          {/* Right Column */}
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
                <p className="text-gray-700 leading-relaxed">{profile}</p>
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
                      <p className="text-sm text-gray-600">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700">{exp.description}</p>
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

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.certifications" 
                  color={settings.primaryColor}
                  variant="underline"
                  className="text-sm uppercase tracking-wider"
                />
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
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <Folder className="w-4 h-4" style={{ color: settings.primaryColor }} />
                        <h4 className="font-semibold text-gray-900 text-sm">{proj.name}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{proj.description}</p>
                      {proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                              {tech}
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

ModernTemplate.displayName = 'ModernTemplate';
