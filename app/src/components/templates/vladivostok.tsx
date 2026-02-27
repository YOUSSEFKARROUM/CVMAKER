import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, Award, Folder, Flag, Car } from 'lucide-react';
import type { TemplateProps } from './types';
import { getSkillLevelWidth, formatDate, getInitials } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const VladivostokTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects, interests } = cvData;

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

            {profile && (
              <div className="mb-8">
                <SectionTitle titleKey="profile.title" variant="underline" color={settings.primaryColor} />
                <p className="text-gray-700 leading-relaxed">{profile}</p>
              </div>
            )}

            {experiences.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="experience.title" variant="underline" color={settings.primaryColor} />
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: settings.primaryColor }}>
                      <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-gray-600">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {educations.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="education.title" variant="underline" color={settings.primaryColor} />
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: settings.primaryColor }}>
                      <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="mb-8">
                <SectionTitle titleKey="certifications.title" variant="underline" color={settings.primaryColor} />
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
            )}

            {projects.length > 0 && (
              <div>
                <SectionTitle titleKey="projects.title" variant="underline" color={settings.primaryColor} />
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <Folder className="w-4 h-4" style={{ color: settings.primaryColor }} />
                        <h4 className="font-semibold text-gray-900">{proj.name}</h4>
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

          {/* Right Sidebar - 30% */}
          <div 
            className="w-[30%] p-6 text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {/* Photo or Initials */}
            {contact.photo ? (
              <div className="w-full aspect-square mb-6 overflow-hidden">
                <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-square mb-6 overflow-hidden bg-white/20 flex items-center justify-center text-6xl font-bold">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-6">
              <SectionTitle titleKey="contact.title" variant="sidebar" />
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

            {skills.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="skills.title" variant="sidebar" />
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

            {languages.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="languages.title" variant="sidebar" />
                <div className="space-y-2 text-sm">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center gap-2">
                      <Flag className="w-4 h-4 opacity-70" />
                      <span>{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="interests.title" variant="sidebar" />
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
