import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Folder, Flag } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';

export const SydneyTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { 
      contact, 
      experiences, 
      educations, 
      skills, 
      profile, 
      languages, 
      certifications, 
      projects, 
      interests 
    } = cvData;

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          {contact.photo ? (
            <img 
              src={contact.photo} 
              alt="Profile" 
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 border-4 border-gray-100">
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          )}
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: settings.titleFont }}
          >
            {contact.firstName} {contact.lastName}
          </h1>
          {contact.jobTitle && (
            <p className="text-lg text-gray-500">{contact.jobTitle}</p>
          )}
          
          {/* Contact Info */}
          <div className="flex justify-center gap-4 text-sm text-gray-500 mt-3 flex-wrap">
            {contact.email && (
              <ContactItem icon="email" value={contact.email} variant="inline" />
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
          </div>
          
          {/* Additional Contact Info */}
          <div className="flex justify-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
            {contact.linkedin && (
              <ContactItem icon="linkedin" value={contact.linkedin} variant="inline" className="break-all" />
            )}
            {contact.portfolio && (
              <ContactItem icon="portfolio" value={contact.portfolio} variant="inline" className="break-all" />
            )}
            {contact.github && (
              <ContactItem icon="github" value={contact.github} variant="inline" className="break-all" />
            )}
            {contact.nationality && (
              <ContactItem icon="nationality" value={contact.nationality} variant="inline" />
            )}
            {contact.birthDate && (
              <ContactItem icon="birthdate" value={formatDate(contact.birthDate)} variant="inline" />
            )}
            {contact.drivingLicense && (
              <ContactItem icon="driving" value={contact.drivingLicense} variant="inline" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-8">
          {profile && (
            <div className="text-center">
              <p className="text-gray-700 italic">{profile}</p>
            </div>
          )}

          {experiences.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.experience" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 text-right">
                      <p className="text-sm text-gray-500">
                        {formatDate(exp.startDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                          {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </p>
                    </div>
                    <div className="flex-1 pb-6 border-l-2 pl-4" style={{ borderColor: settings.primaryColor }}>
                      <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-gray-600">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {educations.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.education" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 text-right">
                      <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                    </div>
                    <div className="flex-1 border-l-2 pl-4" style={{ borderColor: settings.primaryColor }}>
                      <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.certifications" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 text-right">
                      <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
                    </div>
                    <div className="flex-1 border-l-2 pl-4" style={{ borderColor: settings.primaryColor }}>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" style={{ color: settings.primaryColor }} />
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      </div>
                      <p className="text-gray-600">{cert.organization}</p>
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.projects" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 text-right">
                      <Folder className="w-5 h-5 ml-auto" style={{ color: settings.primaryColor }} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden border-l-2 pl-4" style={{ borderColor: settings.primaryColor }}>
                      <h4 className="font-semibold text-gray-900 truncate">
                        {proj.name}
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs ml-2 break-all"
                            style={{ color: settings.primaryColor }}
                          >
                            {proj.link}
                          </a>
                        )}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{proj.description}</p>
                      {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.slice(0, 15).map((tech, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                              {String(tech)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.skills" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="flex flex-wrap justify-center gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1 border rounded-full text-sm"
                    style={{ borderColor: settings.primaryColor }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.languages" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="flex flex-wrap justify-center gap-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-2">
                    <Flag className="w-4 h-4" style={{ color: settings.primaryColor }} />
                    <span className="text-sm text-gray-700">{lang.name}</span>
                    <span className="text-xs text-gray-500">({t(`languages.levels.${lang.level}`)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div>
              <SectionTitle 
                titleKey="template.interests" 
                color={settings.primaryColor}
                variant="bordered"
                className="text-center"
              />
              <div className="flex flex-wrap justify-center gap-2">
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
      </div>
    );
  }
);

SydneyTemplate.displayName = 'SydneyTemplate';
