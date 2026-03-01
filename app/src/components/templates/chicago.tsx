import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Folder } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate, getInitials } from './utils';
import { SectionTitle, ContactItem } from './components';

export const ChicagoTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, certifications, projects } = cvData;

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

        {/* Profile */}
        {profile && (
          <div className="mb-7">
            <SectionTitle 
              titleKey="template.profile" 
              color={settings.primaryColor}
              variant="bordered"
            />
            <p className="text-gray-700 leading-relaxed text-sm break-words">{profile}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-7">
            <SectionTitle 
              titleKey="template.experience" 
              color={settings.primaryColor}
              variant="bordered"
            />
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 break-all">{exp.description}</p>
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
              color={settings.primaryColor}
              variant="bordered"
            />
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                    <span className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</span>
                  </div>
                  <p className="text-gray-600">{edu.school}{edu.city && `, ${edu.city}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.skills" 
              color={settings.primaryColor}
              variant="bordered"
            />
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.certifications" 
              color={settings.primaryColor}
              variant="bordered"
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

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <SectionTitle 
              titleKey="template.projects" 
              color={settings.primaryColor}
              variant="bordered"
            />
            <div className="space-y-4 min-w-0">
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

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <SectionTitle 
              titleKey="template.languages" 
              color={settings.primaryColor}
              variant="bordered"
            />
            <div className="flex flex-wrap gap-4">
              {languages.map((lang) => (
                <span key={lang.id} className="text-gray-700">{lang.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChicagoTemplate.displayName = 'ChicagoTemplate';
