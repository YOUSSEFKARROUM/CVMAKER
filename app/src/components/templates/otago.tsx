import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { TemplateProps } from './types';
import { formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

export const OtagoTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainIds: LayoutSectionId[] = ['profile', 'experience', 'education', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) =>
      mainIds.includes(id) && isSectionVisible(id, settings)
    );

    const getContactField = (field: string): string | undefined => {
      return (contact as unknown as Record<string, unknown>)[field] as string | undefined;
    };

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-4xl font-bold uppercase tracking-wide text-gray-900"
            style={{ fontFamily: settings.titleFont }}
          >
            {contact.firstName} {contact.lastName}
          </h1>
          <div
            className="px-4 py-2 text-white text-xl font-bold"
            style={{ backgroundColor: settings.primaryColor }}
          >
            CV
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-700 mb-6 border-b pb-4" style={{ borderColor: settings.primaryColor }}>
          {(contact.address || contact.city) && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" style={{ color: settings.primaryColor }} />
              <span>{[contact.address, contact.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" style={{ color: settings.primaryColor }} />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-1 min-w-0">
              <Mail className="w-3 h-3 flex-shrink-0" style={{ color: settings.primaryColor }} />
              <span className="break-words" style={{ overflowWrap: 'anywhere' }}>{contact.email}</span>
            </div>
          )}
        </div>

        {/* Personal Details Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-y-3 text-xs">
            {contact.birthDate && (
              <div>
                <span className="text-gray-500 block">Date de naissance</span>
                <span className="font-medium text-gray-800">{formatDate(contact.birthDate)}</span>
              </div>
            )}
            {contact.nationality && (
              <div>
                <span className="text-gray-500 block">Nationalité</span>
                <span className="font-medium text-gray-800">{contact.nationality}</span>
              </div>
            )}
            {getContactField('gender') && (
              <div>
                <span className="text-gray-500 block">{t('template.gender')}</span>
                <span className="font-medium text-gray-800">{getContactField('gender')}</span>
              </div>
            )}
            {(contact.portfolio || contact.github) && (
              <div>
                <span className="text-gray-500 block">Site internet</span>
                <span className="font-medium text-gray-800">{contact.portfolio || contact.github}</span>
              </div>
            )}
            {getContactField('birthPlace') && (
              <div>
                <span className="text-gray-500 block">{t('template.birthPlace')}</span>
                <span className="font-medium text-gray-800">{getContactField('birthPlace')}</span>
              </div>
            )}
            {contact.maritalStatus && (
              <div>
                <span className="text-gray-500 block">{t('template.maritalStatus')}</span>
                <span className="font-medium text-gray-800">{contact.maritalStatus}</span>
              </div>
            )}
            {contact.drivingLicense && (
              <div>
                <span className="text-gray-500 block">Permis</span>
                <span className="font-medium text-gray-800">{contact.drivingLicense}</span>
              </div>
            )}
            {contact.linkedin && (
              <div>
                <span className="text-gray-500 block">LinkedIn</span>
                <span className="font-medium text-gray-800">{contact.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {orderedSections.map((section) => {
          if (section === 'profile' && profile) {
            return (
              <div className="mb-8" key="profile">
                <p className="text-sm text-gray-700 leading-relaxed italic">{profile}</p>
              </div>
            );
          }
          if (section === 'education' && educations.length > 0) {
            return (
              <div className="mb-8" key="education">
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
                  {t('template.education')}
                </h3>
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start gap-2 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 break-words">{edu.diploma}</h4>
                        <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                        {edu.description && (
                          <div className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{formatDate(edu.graduationDate)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section === 'experience' && experiences.length > 0) {
            return (
              <div className="mb-8" key="experience">
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
                  {t('template.experience')}
                </h3>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-start gap-2 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 break-words">{exp.jobTitle}</h4>
                        <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                        {exp.description && (
                          <div className="text-xs text-gray-700 leading-relaxed mt-1 break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section === 'certifications' && certifications.length > 0) {
            return (
              <div className="mb-8" key="certifications">
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
                  {t('template.certifications')}
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-start gap-2 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.organization}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{formatDate(cert.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section === 'projects' && projects.length > 0) {
            return (
              <div className="mb-8" key="projects">
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
                  style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                >
                  {t('template.projects')}
                </h3>
                <div className="space-y-3 min-w-0">
                  {projects.map((proj) => (
                    <div key={proj.id} className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 break-words">{proj.name}</h4>
                      <div className="text-xs text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                      {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proj.technologies.slice(0, 12).map((tech, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{String(tech)}</span>
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

        {/* Skills */}
        {isSectionVisible('skills', settings) && skills.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.skills')}
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700 w-40">{skill.name}</span>
                  <span className="text-gray-500 text-xs">
                    {t(`template.languageLevels.${skill.level}`, skill.level)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {isSectionVisible('languages', settings) && languages.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.languages')}
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700 w-40">{lang.name}</span>
                  <span className="text-gray-500 text-xs">
                    {t(`template.languageLevels.${lang.level}`, lang.level)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {isSectionVisible('interests', settings) && interests.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.interests')}
            </h3>
            <p className="text-sm text-gray-700">{interests.join(', ')}</p>
          </div>
        )}

        {/* Internships */}
        {isSectionVisible('internships', settings) && internships.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.internships')}
            </h3>
            <div className="space-y-5">
              {internships.map((intern) => (
                <div key={intern.id} className="flex justify-between items-start gap-2 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 break-words">{intern.jobTitle}</h4>
                    <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                    {intern.description && (
                      <div className="text-xs text-gray-700 leading-relaxed mt-1 break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {isSectionVisible('publications', settings) && publications.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.publications')}
            </h3>
            <div className="space-y-1">
              {publications.map((pub, i) => (
                <p key={i} className="text-sm text-gray-700">• {pub}</p>
              ))}
            </div>
          </div>
        )}

        {/* Extracurricular */}
        {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.extracurricular')}
            </h3>
            <div className="space-y-1">
              {extracurricular.map((act, i) => (
                <p key={i} className="text-sm text-gray-700">• {act}</p>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {isSectionVisible('references', settings) && references.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {t('template.references')}
            </h3>
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

OtagoTemplate.displayName = 'OtagoTemplate';
