import { forwardRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TemplateProps } from './types';
import { getInitials, getSkillLevelWidth, formatDate, getOrderedSections, isSectionVisible, isLightColor, type LayoutSectionId } from './utils';
import { SectionTitle } from './components/SectionTitle';
import { ContactItem } from './components/ContactItem';
import { sanitizeHtml } from '../../utils/sanitize';

export const BudapestTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const { primaryColor, titleFont, bodyFont, showSkillLevels, showSkillsAsTags } = settings;

    const textOnPrimary = isLightColor(primaryColor) ? '#1a1a1a' : '#ffffff';
    const textOnPrimaryMuted = isLightColor(primaryColor) ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';
    const textOnPrimarySubtle = isLightColor(primaryColor) ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.18)';
    const borderOnPrimary = isLightColor(primaryColor) ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.28)';
    const pillBg = isLightColor(primaryColor) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';

    const mainIds: LayoutSectionId[] = ['profile', 'experience', 'education', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter(
      (id) => mainIds.includes(id) && isSectionVisible(id, settings)
    );

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] shadow-xl ${className}`}
        style={{ fontFamily: bodyFont }}
      >
        <div className="flex min-h-[297mm]">
          {/* Left Sidebar */}
          <div
            className="w-[33%] shrink-0 self-stretch"
            style={{ backgroundColor: primaryColor, padding: '32px 22px' }}
          >
            {/* Photo / Initials */}
            {contact.photo ? (
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-lg"
                style={{ border: `3px solid ${borderOnPrimary}` }}
              >
                <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner"
                style={{
                  backgroundColor: textOnPrimarySubtle,
                  color: textOnPrimary,
                  border: `2px solid ${borderOnPrimary}`,
                }}
              >
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-7">
              <h3
                className="text-[10px] uppercase tracking-widest font-semibold mb-3 pb-1.5"
                style={{ color: textOnPrimary, borderBottom: `1px solid ${borderOnPrimary}` }}
              >
                {t('template.contact')}
              </h3>
              <div className="space-y-2.5">
                <ContactItem icon="phone" value={contact.phone} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem icon="email" value={contact.email} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem
                  icon="location"
                  value={[contact.city, contact.country].filter(Boolean).join(', ')}
                  variant="sidebar"
                  textColor={textOnPrimary}
                />
                <ContactItem icon="linkedin" value={contact.linkedin} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem icon="github" value={contact.github} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem icon="portfolio" value={contact.portfolio} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem icon="nationality" value={contact.nationality} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem icon="birthdate" value={contact.birthDate} variant="sidebar" textColor={textOnPrimary} />
                <ContactItem icon="driving" value={contact.drivingLicense} variant="sidebar" textColor={textOnPrimary} />
              </div>
            </div>

            {/* Skills */}
            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div className="mb-7">
                <h3
                  className="text-[10px] uppercase tracking-widest font-semibold mb-3 pb-1.5"
                  style={{ color: textOnPrimary, borderBottom: `1px solid ${borderOnPrimary}` }}
                >
                  {t('template.skills')}
                </h3>
                {showSkillsAsTags ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: pillBg, color: textOnPrimary }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {skills.map((skill) => (
                      <div key={skill.id}>
                        <span className="text-[11px] font-medium" style={{ color: textOnPrimary }}>
                          {skill.name}
                        </span>
                        {showSkillLevels && (
                          <div
                            className="w-full h-1.5 rounded-full mt-1"
                            style={{ backgroundColor: textOnPrimarySubtle }}
                          >
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: getSkillLevelWidth(skill.level), backgroundColor: textOnPrimary }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Languages */}
            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div className="mb-7">
                <h3
                  className="text-[10px] uppercase tracking-widest font-semibold mb-3 pb-1.5"
                  style={{ color: textOnPrimary, borderBottom: `1px solid ${borderOnPrimary}` }}
                >
                  {t('template.languages')}
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <span className="text-[11px] font-medium" style={{ color: textOnPrimary }}>
                        {lang.name}
                      </span>
                      <span className="text-[10px] italic" style={{ color: textOnPrimaryMuted }}>
                        {t(`template.languageLevels.${lang.level}`, lang.level)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div className="mb-7">
                <h3
                  className="text-[10px] uppercase tracking-widest font-semibold mb-3 pb-1.5"
                  style={{ color: textOnPrimary, borderBottom: `1px solid ${borderOnPrimary}` }}
                >
                  {t('template.interests')}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: pillBg, color: textOnPrimary }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1" style={{ padding: '35px 35px 35px 30px' }}>
            {/* Name + Job Title */}
            <div className="mb-6">
              <h1
                className="text-4xl font-bold leading-tight tracking-tight"
                style={{ fontFamily: titleFont, color: '#1a1a1a' }}
              >
                {contact.firstName?.toUpperCase()} {contact.lastName?.toUpperCase()}
              </h1>
              {contact.jobTitle && (
                <p className="text-base mt-1.5 font-medium" style={{ color: primaryColor }}>
                  {contact.jobTitle}
                </p>
              )}
            </div>

            {orderedSections.map((section) => {
              if (section === 'profile' && profile) {
                return (
                  <div className="mb-6" key="profile">
                    <SectionTitle titleKey="template.profile" variant="underline" color={primaryColor} />
                    <p className="text-[11px] text-gray-700 leading-relaxed">{profile}</p>
                  </div>
                );
              }
              if (section === 'experience' && experiences.length > 0) {
                return (
                  <div className="mb-6" key="experience">
                    <SectionTitle titleKey="template.experience" variant="underline" color={primaryColor} />
                    <div className="space-y-4 min-w-0">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="min-w-0" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                          <div className="flex justify-between items-start gap-2 min-w-0">
                            <h4 className="text-[12px] font-bold text-gray-900 break-words min-w-0">{exp.jobTitle}</h4>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">
                              {formatDate(exp.startDate)} – {exp.currentlyWorking ? t('common.present') : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 break-words" style={{ overflowWrap: 'anywhere' }}>
                            {exp.employer}{exp.city ? `, ${exp.city}` : ''}
                          </p>
                          {exp.description && (
                            <div
                              className="text-[10.5px] text-gray-700 mt-1.5 break-words leading-relaxed cv-rich-text"
                              style={{ overflowWrap: 'anywhere' }}
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'education' && educations.length > 0) {
                return (
                  <div className="mb-6" key="education">
                    <SectionTitle titleKey="template.education" variant="underline" color={primaryColor} />
                    <div className="space-y-3 min-w-0">
                      {educations.map((edu) => (
                        <div key={edu.id} className="min-w-0" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                          <div className="flex justify-between items-start gap-2 min-w-0">
                            <h4 className="text-[12px] font-bold text-gray-900 break-words min-w-0">{edu.diploma}</h4>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">{formatDate(edu.graduationDate)}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 break-words" style={{ overflowWrap: 'anywhere' }}>
                            {edu.school}{edu.city ? `, ${edu.city}` : ''}
                          </p>
                          {edu.description && (
                            <div
                              className="text-[10.5px] text-gray-700 mt-1 break-words leading-relaxed cv-rich-text"
                              style={{ overflowWrap: 'anywhere' }}
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(edu.description) }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'certifications' && certifications.length > 0) {
                return (
                  <div className="mb-6" key="certifications">
                    <SectionTitle titleKey="template.certifications" variant="underline" color={primaryColor} />
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-[12px] font-bold text-gray-900">{cert.name}</h4>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">{formatDate(cert.date)}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{cert.organization}</p>
                          {cert.credentialId && (
                            <p className="text-[10px] text-gray-400 mt-0.5">ID: {cert.credentialId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section === 'projects' && projects.length > 0) {
                return (
                  <div className="mb-6" key="projects">
                    <SectionTitle titleKey="template.projects" variant="underline" color={primaryColor} />
                    <div className="space-y-3 min-w-0">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="text-[12px] font-bold text-gray-900 truncate">{proj.name}</h4>
                            {proj.link && <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-400" />}
                          </div>
                          {proj.description && (
                            <div
                              className="text-[10.5px] text-gray-600 mt-0.5 leading-relaxed cv-rich-text break-words"
                              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description) }}
                            />
                          )}
                          {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {proj.technologies.slice(0, 15).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                                >
                                  {String(tech)}
                                </span>
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

            {/* Internships */}
            {isSectionVisible('internships', settings) && internships.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.internships" variant="underline" color={primaryColor} />
                <div className="space-y-4 min-w-0">
                  {internships.map((intern) => (
                    <div key={intern.id} className="min-w-0">
                      <div className="flex justify-between items-start gap-2 min-w-0">
                        <h4 className="text-[12px] font-bold text-gray-900 break-words min-w-0">{intern.jobTitle}</h4>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">
                          {formatDate(intern.startDate)} – {intern.currentlyWorking ? t('common.present') : formatDate(intern.endDate)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 break-words" style={{ overflowWrap: 'anywhere' }}>
                        {intern.employer}{intern.city ? `, ${intern.city}` : ''}
                      </p>
                      {intern.description && (
                        <div
                          className="text-[10.5px] text-gray-700 mt-1.5 break-words leading-relaxed cv-rich-text"
                          style={{ overflowWrap: 'anywhere' }}
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(intern.description) }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.publications" variant="underline" color={primaryColor} />
                <div className="space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-[10.5px] text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Extracurricular */}
            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.extracurricular" variant="underline" color={primaryColor} />
                <div className="space-y-1">
                  {extracurricular.map((act, i) => (
                    <p key={i} className="text-[10.5px] text-gray-700">• {act}</p>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {isSectionVisible('references', settings) && references.length > 0 && (
              <div className="mb-6">
                <SectionTitle titleKey="template.references" variant="underline" color={primaryColor} />
                <div className="grid grid-cols-2 gap-4">
                  {references.map((ref) => (
                    <div key={ref.id}>
                      <p className="text-[12px] font-bold text-gray-900">{ref.name}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{ref.position}{ref.company ? `, ${ref.company}` : ''}</p>
                      {ref.email && <p className="text-[10px] text-gray-400 mt-0.5">{ref.email}</p>}
                      {ref.phone && <p className="text-[10px] text-gray-400">{ref.phone}</p>}
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
