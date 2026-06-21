import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import type { TemplateProps } from './types';
import { formatDate, isSectionVisible } from './utils';

export const AucklandTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;

    const getDotRating = (level: string) => {
      switch (level) {
        case 'beginner': return 1;
        case 'intermediate': return 3;
        case 'advanced': return 4;
        case 'expert':
        case 'native':
        case 'fluent':
          return 5;
        default: return 3;
      }
    };

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Name Box */}
        <div
          className="mx-10 mt-10 border-2 px-8 py-5 text-center"
          style={{ borderColor: settings.primaryColor }}
        >
          <h1
            className="text-3xl font-bold tracking-wide"
            style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
          >
            {contact.firstName} {contact.lastName}
          </h1>
          {contact.jobTitle && (
            <p className="text-sm text-gray-600 mt-1">{contact.jobTitle}</p>
          )}
        </div>

        <div className="flex px-10 pb-10 pt-8">
          {/* Left Column - 35% */}
          <div className="w-[35%] pr-6">
            {/* Personal Info */}
            <div className="mb-6">
              <h3
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {t('template.personalInfo')}
              </h3>
              <div className="space-y-1.5 text-[11px] text-gray-800 leading-relaxed">
                {contact.birthDate && <div>{formatDate(contact.birthDate)}</div>}
                {contact.nationality && <div>{contact.nationality}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.email && <div className="break-all">{contact.email}</div>}
                {(contact.address || contact.city || contact.country) && (
                  <div>{[contact.address, contact.city, contact.country].filter(Boolean).join(', ')}</div>
                )}
                {contact.linkedin && <div className="break-all">{contact.linkedin}</div>}
              </div>
            </div>

            {/* Interests */}
            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.interests')}
                </h3>
                <div className="space-y-1">
                  {interests.map((interest, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-gray-800">
                      <span className="inline-block w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ backgroundColor: settings.primaryColor }}></span>
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.languages')}
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <div className="text-[11px] text-gray-800 mb-1">{lang.name}</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: dot <= getDotRating(lang.level) ? settings.primaryColor : '#D1D5DB' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {isSectionVisible('certifications', settings) && certifications.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.certifications')}
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-[11px] text-gray-800">
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-gray-600">{cert.organization}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 65% */}
          <div className="w-[65%] min-w-0 pl-6 border-l border-gray-200">
            {/* Profile */}
            {isSectionVisible('profile', settings) && profile && (
              <div className="mb-6">
                <p className="text-[11px] text-gray-800 leading-relaxed text-justify">{profile}</p>
              </div>
            )}

            {/* Education */}
            {isSectionVisible('education', settings) && educations.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.education')}
                </h3>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <h4 className="font-semibold text-[11px] text-gray-900 break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{edu.diploma}</h4>
                        <span className="text-[10px] text-gray-600 flex-shrink-0">{formatDate(edu.graduationDate)}</span>
                      </div>
                      <p className="text-[11px] text-gray-700 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                      {edu.description && (
                        <div className="text-[11px] text-gray-600 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {isSectionVisible('experience', settings) && experiences.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.experience')}
                </h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <h4 className="font-semibold text-[11px] text-gray-900 break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{exp.jobTitle}</h4>
                        <span className="text-[10px] text-gray-600 flex-shrink-0">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 mb-1.5 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      {exp.description && (
                        <div className="text-[11px] text-gray-700 leading-relaxed break-words cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {isSectionVisible('projects', settings) && projects.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.projects')}
                </h3>
                <div className="space-y-3 min-w-0">
                  {projects.map((proj) => (
                    <div key={proj.id} className="min-w-0">
                      <h4 className="font-semibold text-[11px] text-gray-900 break-words">{proj.name}</h4>
                      <div className="text-[11px] text-gray-700 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                      {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {proj.technologies.slice(0, 10).map((tech, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{String(tech)}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.skills')}
                </h3>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-800">{skill.name}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: dot <= getDotRating(skill.level) ? settings.primaryColor : '#D1D5DB' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internships */}
            {isSectionVisible('internships', settings) && internships.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.internships')}
                </h3>
                <div className="space-y-4">
                  {internships.map((intern) => (
                    <div key={intern.id} className="min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <h4 className="font-semibold text-[11px] text-gray-900 break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{intern.jobTitle}</h4>
                        <span className="text-[10px] text-gray-600 flex-shrink-0">
                          {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 mb-1.5 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                      {intern.description && (
                        <div className="text-[11px] text-gray-700 leading-relaxed break-words cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.publications')}
                </h3>
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-[11px] text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Extracurricular */}
            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {t('template.extracurricular')}
                </h3>
                <div className="space-y-1">
                  {extracurricular.map((act, i) => (
                    <p key={i} className="text-[11px] text-gray-700">• {act}</p>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            <div>
              <h3
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2"
                style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
              >
                {t('template.references')}
              </h3>
              {isSectionVisible('references', settings) && references.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {references.map((ref) => (
                    <div key={ref.id} className="text-[11px]">
                      <p className="font-semibold text-gray-900">{ref.name}</p>
                      <p className="text-gray-600">{ref.position}{ref.company && `, ${ref.company}`}</p>
                      {ref.email && <p className="text-gray-500">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-600">{t('template.onRequest')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AucklandTemplate.displayName = 'AucklandTemplate';
