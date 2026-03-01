import { forwardRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TemplateProps } from './types';
import { getInitials, getSkillLevelWidth, formatDate } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const BudapestTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects } = cvData;

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
              <SectionTitle 
                titleKey="template.contact" 
                variant="sidebar" 
                className="text-white"
              />
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

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-7">
                <SectionTitle 
                  titleKey="template.skills" 
                  variant="sidebar" 
                  className="text-white"
                />
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
            {languages.length > 0 && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.languages" 
                  variant="sidebar" 
                  className="text-white"
                />
                <div className="space-y-2 text-sm">
                  {languages.map((lang) => (
                    <ContactItem 
                      key={lang.id} 
                      icon="nationality" 
                      value={lang.name} 
                      variant="sidebar" 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Certifications - Sidebar */}
            {certifications.length > 0 && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.certifications" 
                  variant="sidebar" 
                  className="text-white"
                />
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <p className="text-sm font-medium">{cert.name}</p>
                      <p className="text-xs opacity-80">{cert.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects - Sidebar */}
            {projects.length > 0 && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.projects" 
                  variant="sidebar" 
                  className="text-white"
                />
                <div className="space-y-2">
                  {projects.slice(0, 3).map((proj) => (
                    <div key={proj.id}>
                      <p className="text-sm font-medium">{proj.name}</p>
                      {proj.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-xs opacity-80 mr-1">{tech}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.interests" 
                  variant="sidebar" 
                  className="text-white"
                />
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

            {/* Profile */}
            {profile && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.profile" 
                  variant="underline" 
                  color={settings.primaryColor}
                />
                <p className="text-gray-700 leading-relaxed">{profile}</p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.experience" 
                  variant="underline" 
                  color={settings.primaryColor}
                />
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{exp.employer}{exp.city && `, ${exp.city}`}</p>
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
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.education" 
                  variant="underline" 
                  color={settings.primaryColor}
                />
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                        <span className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</span>
                      </div>
                      <p className="text-gray-600">{edu.school}{edu.city && `, ${edu.city}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-8">
                <SectionTitle 
                  titleKey="template.certifications" 
                  variant="underline" 
                  color={settings.primaryColor}
                />
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
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <SectionTitle 
                  titleKey="template.projects" 
                  variant="underline" 
                  color={settings.primaryColor}
                />
                <div className="space-y-4 min-w-0">
                  {projects.map((proj) => (
                    <div key={proj.id} className="min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{proj.name}</h4>
                        {proj.link && (
                          <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{proj.description}</p>
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
            )}
          </div>
        </div>
      </div>
    );
  }
);

BudapestTemplate.displayName = 'BudapestTemplate';
