import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import type { TemplateProps } from './types';
import { getInitials, formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

export const PrincetonTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainIds: LayoutSectionId[] = ['profile', 'experience', 'education', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) =>
      mainIds.includes(id) && isSectionVisible(id, settings)
    );

    const formatDateRange = (startDate: string, endDate: string | null, currentlyWorking: boolean) => {
      const start = formatDate(startDate);
      const end = currentlyWorking ? t('common.present') : (endDate ? formatDate(endDate) : '');
      return `${start} - ${end}`;
    };

    const getBirthPlace = () => {
      const parts = [];
      if (contact.city) parts.push(contact.city);
      if (contact.country && contact.country !== contact.city) parts.push(contact.country);
      return parts.join(', ');
    };

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont || 'Georgia, serif' }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {contact.photo ? (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          )}
          <div>
            <h1
              className="text-lg font-bold uppercase tracking-wide"
              style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
            >
              {contact.firstName} {contact.lastName}
            </h1>
            {contact.jobTitle && <p className="text-sm text-gray-600 mt-0.5">{contact.jobTitle}</p>}
          </div>
        </div>

        <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />

        {/* Personal Data */}
        <div className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: settings.primaryColor }}
          >
            {t('template.personalInfo')}
          </h2>
          <div className="grid grid-cols-[1fr_2fr] gap-y-2 text-sm">
            <div className="text-gray-600 font-normal">Nom</div>
            <div className="text-gray-800">{contact.firstName} {contact.lastName}</div>

            <div className="text-gray-600 font-normal">Adresse</div>
            <div className="text-gray-800">
              {[contact.address, contact.postalCode, contact.city].filter(Boolean).join(', ') ||
               [contact.city, contact.country].filter(Boolean).join(', ') || '-'}
            </div>

            <div className="text-gray-600 font-normal">Téléphone</div>
            <div className="text-gray-800">{contact.phone || '-'}</div>

            <div className="text-gray-600 font-normal">E-mail</div>
            <div className="text-gray-800 break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{contact.email || '-'}</div>

            <div className="text-gray-600 font-normal">Date de naissance</div>
            <div className="text-gray-800">{contact.birthDate ? formatDate(contact.birthDate) : '-'}</div>

            <div className="text-gray-600 font-normal">{t('template.birthPlace')}</div>
            <div className="text-gray-800">{getBirthPlace() || '-'}</div>

            <div className="text-gray-600 font-normal">{t('template.gender')}</div>
            <div className="text-gray-800">{contact.gender || '-'}</div>

            <div className="text-gray-600 font-normal">Permis de conduire</div>
            <div className="text-gray-800">{contact.drivingLicense || '-'}</div>
          </div>
        </div>

        <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />

        {orderedSections.map((section) => {
          if (section === 'profile' && profile) {
            return (
              <div key="profile" className="mb-6">
                <p className="text-sm text-gray-800 leading-relaxed text-justify">{profile}</p>
              </div>
            );
          }
          if (section === 'education' && educations.length > 0) {
            return (
              <div key="education" className="mb-6">
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.primaryColor }}
                >
                  {t('template.education')}
                </h2>
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4">
                      <div className="text-sm text-gray-800 flex-shrink-0">
                        {edu.graduationDate ? formatDate(edu.graduationDate) : '-'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.diploma}{edu.school ? `, ${edu.school}` : ''}{edu.city ? `, ${edu.city}` : ''}</p>
                        {edu.description && (
                          <div className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section === 'experience' && experiences.length > 0) {
            return (
              <div key="experience" className="mb-6">
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.primaryColor }}
                >
                  {t('template.experience')}
                </h2>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4">
                      <div className="text-sm text-gray-800 flex-shrink-0">
                        {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.jobTitle}</p>
                        <p className="text-sm text-gray-700 italic mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                        {exp.description && (
                          <div className="text-sm text-gray-800 break-words cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section === 'certifications' && certifications.length > 0) {
            return (
              <div key="certifications" className="mb-6">
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.primaryColor }}
                >
                  {t('template.certifications')}
                </h2>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-sm text-gray-800">
                      {cert.name}{cert.organization ? ` - ${cert.organization}` : ''}{cert.date ? ` (${formatDate(cert.date)})` : ''}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section === 'projects' && projects.length > 0) {
            return (
              <div key="projects" className="mb-6">
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.primaryColor }}
                >
                  {t('template.projects')}
                </h2>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="grid grid-cols-[120px_1fr] gap-4">
                      <div className="text-sm text-gray-600 flex-shrink-0">{proj.name}</div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-800 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                        {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">{proj.technologies.slice(0, 10).map(String).join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}

        <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />

        {/* Skills */}
        {isSectionVisible('skills', settings) && skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: settings.primaryColor }}
            >
              {t('template.skills')}
            </h2>
            <div className="text-sm text-gray-800">
              {skills.map((skill) => skill.name).join(', ')}
            </div>
          </div>
        )}

        {isSectionVisible('skills', settings) && skills.length > 0 && <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />}

        {/* Languages */}
        {isSectionVisible('languages', settings) && languages.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: settings.primaryColor }}
            >
              {t('template.languages')}
            </h2>
            <div className="text-sm text-gray-800">
              {languages.map((lang, idx) => (
                <span key={lang.id}>
                  {lang.name}{lang.level ? ` (${t(`template.languageLevels.${lang.level}`, lang.level)})` : ''}
                  {idx < languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {isSectionVisible('languages', settings) && languages.length > 0 && <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />}

        {/* Interests */}
        {isSectionVisible('interests', settings) && interests.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: settings.primaryColor }}
            >
              {t('template.interests')}
            </h2>
            <p className="text-sm text-gray-800">{interests.join(', ')}</p>
          </div>
        )}

        {/* Internships */}
        {isSectionVisible('internships', settings) && internships.length > 0 && (
          <>
            <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: settings.primaryColor }}>
                {t('template.internships')}
              </h2>
              <div className="space-y-5">
                {internships.map((intern) => (
                  <div key={intern.id} className="grid grid-cols-[120px_1fr] gap-4">
                    <div className="text-sm text-gray-800 flex-shrink-0">
                      {formatDateRange(intern.startDate, intern.endDate, intern.currentlyWorking)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.jobTitle}</p>
                      <p className="text-sm text-gray-700 italic break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city ? `, ${intern.city}` : ''}</p>
                      {intern.description && (
                        <div className="text-sm text-gray-800 break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Publications */}
        {isSectionVisible('publications', settings) && publications.length > 0 && (
          <>
            <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: settings.primaryColor }}>
                {t('template.publications')}
              </h2>
              <div className="space-y-1">
                {publications.map((pub, i) => (
                  <p key={i} className="text-sm text-gray-800">• {pub}</p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Extracurricular */}
        {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
          <>
            <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: settings.primaryColor }}>
                {t('template.extracurricular')}
              </h2>
              <div className="space-y-1">
                {extracurricular.map((act, i) => (
                  <p key={i} className="text-sm text-gray-800">• {act}</p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* References */}
        {isSectionVisible('references', settings) && references.length > 0 && (
          <>
            <hr className="mb-6" style={{ borderColor: settings.primaryColor }} />
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: settings.primaryColor }}>
                {t('template.references')}
              </h2>
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
          </>
        )}
      </div>
    );
  }
);

PrincetonTemplate.displayName = 'PrincetonTemplate';
