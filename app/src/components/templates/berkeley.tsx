import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { User, Briefcase, GraduationCap, Award, Folder, Lightbulb, Globe, Heart, BookOpen, Users, Star } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

const BannerHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded mb-3 bg-gray-200">
    <Icon className="w-4 h-4 text-gray-700" />
    <span className="text-sm font-semibold text-gray-800">{title}</span>
  </div>
);

export const BerkeleyTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainSectionIds: LayoutSectionId[] = ['education', 'experience', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) =>
      mainSectionIds.includes(id) && isSectionVisible(id, settings)
    );

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full flex-shrink-0 overflow-hidden bg-gray-200">
            {contact.photo ? (
              <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: settings.primaryColor }}
              >
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: settings.titleFont }}>
              {contact.firstName} {contact.lastName}
            </h1>
            {contact.jobTitle && (
              <p className="text-base text-gray-600 mb-1">{contact.jobTitle}</p>
            )}
            {profile && (
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{profile}</p>
            )}
          </div>
        </div>

        {/* Personal Data Section */}
        <div className="mb-6">
          <BannerHeader icon={User} title={t('template.personalInfo')} />
          <div className="pl-3 space-y-1 text-sm">
            {contact.email && (
              <div className="flex min-w-0">
                <span className="text-gray-600 w-20 flex-shrink-0">E-mail</span>
                <span className="text-gray-800 break-words" style={{ overflowWrap: 'anywhere' }}>{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex">
                <span className="text-gray-600 w-20 flex-shrink-0">Téléphone</span>
                <span className="text-gray-800">{contact.phone}</span>
              </div>
            )}
            {(contact.city || contact.country) && (
              <div className="flex">
                <span className="text-gray-600 w-20 flex-shrink-0">Adresse</span>
                <span className="text-gray-800">{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {contact.linkedin && (
              <div className="flex min-w-0">
                <span className="text-gray-600 w-20 flex-shrink-0">LinkedIn</span>
                <span className="text-gray-800 break-all">{contact.linkedin}</span>
              </div>
            )}
            {contact.github && (
              <div className="flex min-w-0">
                <span className="text-gray-600 w-20 flex-shrink-0">GitHub</span>
                <span className="text-gray-800 break-all">{contact.github}</span>
              </div>
            )}
            {contact.nationality && (
              <div className="flex">
                <span className="text-gray-600 w-20 flex-shrink-0">Nationalité</span>
                <span className="text-gray-800">{contact.nationality}</span>
              </div>
            )}
            {contact.birthDate && (
              <div className="flex">
                <span className="text-gray-600 w-20 flex-shrink-0">Naissance</span>
                <span className="text-gray-800">{formatDate(contact.birthDate)}</span>
              </div>
            )}
            {contact.drivingLicense && (
              <div className="flex">
                <span className="text-gray-600 w-20 flex-shrink-0">Permis</span>
                <span className="text-gray-800">{contact.drivingLicense}</span>
              </div>
            )}
          </div>
        </div>

        {orderedSections.map((sectionId) => {
          if (sectionId === 'education' && educations.length > 0) {
            return (
              <div className="mb-6" key="education">
                <BannerHeader icon={GraduationCap} title={t('template.education')} />
                <div className="pl-3 space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.diploma}</h4>
                        <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}{edu.city && `, ${edu.city}`}</p>
                        {edu.description && (
                          <div className="text-sm text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }} />
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                        {formatDate(edu.graduationDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionId === 'experience' && experiences.length > 0) {
            return (
              <div className="mb-6" key="experience">
                <BannerHeader icon={Briefcase} title={t('template.experience')} />
                <div className="pl-3 space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.jobTitle}</h4>
                        <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city && `, ${exp.city}`}</p>
                        {exp.description && (
                          <div className="mt-2 text-sm text-gray-700 break-words cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionId === 'certifications' && certifications.length > 0) {
            return (
              <div className="mb-6" key="certifications">
                <BannerHeader icon={Award} title={t('template.certifications')} />
                <div className="pl-3 space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.organization}</p>
                        {cert.credentialId && <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">{formatDate(cert.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionId === 'projects' && projects.length > 0) {
            return (
              <div className="mb-6" key="projects">
                <BannerHeader icon={Folder} title={t('template.projects')} />
                <div className="pl-3 space-y-4 min-w-0">
                  {projects.map((proj) => (
                    <div key={proj.id} className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 break-words">{proj.name}</h4>
                      <div className="text-sm text-gray-700 break-words leading-relaxed mt-1" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
                      {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proj.technologies.slice(0, 12).map((tech, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">{String(tech)}</span>
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
          <div className="mb-6">
            <BannerHeader icon={Lightbulb} title={t('template.skills')} />
            <div className="pl-3">
              {settings.showSkillsAsTags ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{skill.name}</span>
                      {settings.showSkillLevels && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const filled = skill.level === 'beginner' ? 1 : skill.level === 'intermediate' ? 3 : skill.level === 'advanced' ? 4 : 5;
                            return (
                              <Star
                                key={star}
                                className="w-3.5 h-3.5"
                                style={{ fill: star <= filled ? settings.primaryColor : 'transparent', color: star <= filled ? settings.primaryColor : '#D1D5DB' }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {isSectionVisible('languages', settings) && languages.length > 0 && (
          <div className="mb-6">
            <BannerHeader icon={Globe} title={t('template.languages')} />
            <div className="pl-3 space-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{lang.name}</span>
                  <span className="text-gray-500 text-xs">{t(`template.languageLevels.${lang.level}`, lang.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {isSectionVisible('interests', settings) && interests.length > 0 && (
          <div className="mb-6">
            <BannerHeader icon={Heart} title={t('template.interests')} />
            <div className="pl-3 flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Internships */}
        {isSectionVisible('internships', settings) && internships.length > 0 && (
          <div className="mb-6">
            <BannerHeader icon={Briefcase} title={t('template.internships')} />
            <div className="pl-3 space-y-5">
              {internships.map((intern) => (
                <div key={intern.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.jobTitle}</h4>
                    <p className="text-sm text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{intern.employer}{intern.city && `, ${intern.city}`}</p>
                    {intern.description && (
                      <div className="mt-2 text-sm text-gray-700 break-words cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }} />
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                    {formatDate(intern.startDate)} - {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {isSectionVisible('publications', settings) && publications.length > 0 && (
          <div className="mb-6">
            <BannerHeader icon={BookOpen} title={t('template.publications')} />
            <div className="pl-3 space-y-1">
              {publications.map((pub, i) => (
                <p key={i} className="text-sm text-gray-700">• {pub}</p>
              ))}
            </div>
          </div>
        )}

        {/* Extracurricular */}
        {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
          <div className="mb-6">
            <BannerHeader icon={BookOpen} title={t('template.extracurricular')} />
            <div className="pl-3 space-y-1">
              {extracurricular.map((act, i) => (
                <p key={i} className="text-sm text-gray-700">• {act}</p>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {isSectionVisible('references', settings) && references.length > 0 && (
          <div className="mb-6">
            <BannerHeader icon={Users} title={t('template.references')} />
            <div className="pl-3 grid grid-cols-2 gap-4">
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

BerkeleyTemplate.displayName = 'BerkeleyTemplate';
