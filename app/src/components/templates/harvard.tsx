import { forwardRef } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, Award, Star, Square, GraduationCap, Briefcase, CheckCircle, User, MessageSquare, BookOpen, Users } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate, getOrderedSections, isSectionVisible, type LayoutSectionId } from './utils';

// Star rating component for sidebar
const StarRating = ({ level, color = 'white' }: { level: string; color?: string }) => {
  const filledStars = level === 'beginner' ? 1 : level === 'intermediate' ? 3 : level === 'advanced' ? 4 : 5;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3`}
          style={{
            fill: star <= filledStars ? color : 'transparent',
            color: star <= filledStars ? color : `${color}4D`,
          }}
        />
      ))}
    </div>
  );
};

// Section header with icon in circle
const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-800" />
    </div>
    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
      {title}
    </h3>
  </div>
);

// Timeline item with i18n for "present"
const TimelineItemHarvard = ({
  startDate,
  endDate,
  currentlyWorking,
  title,
  subtitle,
  description,
  primaryColor,
}: {
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  title: string;
  subtitle: string;
  description?: string;
  primaryColor: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      <div
        className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute left-[5px] top-4 bottom-0 w-0.5"
        style={{ backgroundColor: primaryColor }}
      />
      <div className="min-w-0">
        {(startDate || endDate) && (
          <p className="text-xs text-gray-500 mb-1">
            {startDate && formatDate(startDate)} - {currentlyWorking ? t('common.present') : endDate ? formatDate(endDate) : ''}
          </p>
        )}
        <h4 className="font-bold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{title}</h4>
        <p className="text-xs text-gray-600 mb-1 break-words" style={{ overflowWrap: 'anywhere' }}>{subtitle}</p>
        {description && (
          <div className="text-xs text-gray-700 leading-relaxed break-words cv-rich-text" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
        )}
      </div>
    </div>
  );
};

export const HarvardTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { t } = useTranslation();
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, projects, references, internships, publications, extracurricular } = cvData;
    const mainSectionIds: LayoutSectionId[] = ['profile', 'education', 'experience', 'certifications', 'projects'];
    const orderedSections = getOrderedSections(settings).filter((id) =>
      mainSectionIds.includes(id) && isSectionVisible(id, settings)
    );

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Left Sidebar */}
          <div
            className="w-[35%] p-6 text-white self-stretch"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {/* Photo */}
            {contact.photo ? (
              <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white">
                <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}

            {/* Name */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold mb-1" style={{ fontFamily: settings.titleFont }}>{contact.firstName}</h1>
              <h1 className="text-xl font-bold" style={{ fontFamily: settings.titleFont }}>{contact.lastName}</h1>
              {contact.jobTitle && <p className="text-xs mt-2 opacity-80">{contact.jobTitle}</p>}
            </div>

            {/* Personal Info */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                {t('template.personalInfo')}
              </h3>
              <div className="space-y-3 text-xs">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3 h-3" />
                    </div>
                    <span className="break-all">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {(contact.city || contact.country) && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3 h-3" />
                    </div>
                    <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-3 h-3" />
                    </div>
                    <span className="break-all">{contact.linkedin}</span>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-3 h-3" />
                    </div>
                    <span className="break-all">{contact.website}</span>
                  </div>
                )}
                {contact.github && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Github className="w-3 h-3" />
                    </div>
                    <span className="break-all">{contact.github}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            {isSectionVisible('interests', settings) && interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  {t('template.interests')}
                </h3>
                <div className="text-xs space-y-2">
                  {interests.map((interest, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Square className="w-2.5 h-2.5 fill-white" />
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {isSectionVisible('languages', settings) && languages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  {t('template.languages')}
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between text-xs">
                      <span>{lang.name}</span>
                      <StarRating level={lang.level} color="white" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills — sidebar only */}
            {isSectionVisible('skills', settings) && skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  {t('template.skills')}
                </h3>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between text-xs">
                      <span>{skill.name}</span>
                      <StarRating level={skill.level} color="white" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References — shown only when data exists */}
            {isSectionVisible('references', settings) && references.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  {t('template.references')}
                </h3>
                <div className="space-y-3 text-xs">
                  {references.map((ref) => (
                    <div key={ref.id}>
                      <p className="font-semibold">{ref.name}</p>
                      <p className="opacity-80">{ref.position}{ref.company && `, ${ref.company}`}</p>
                      {ref.email && <p className="opacity-70 break-all">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-[65%] p-8">
            {orderedSections.map((sectionId) => {
              if (sectionId === 'profile' && profile) {
                return (
                  <div className="mb-8" key="profile">
                    <SectionHeader icon={User} title={t('template.profile')} />
                    <p className="text-sm text-gray-700 leading-relaxed pl-10">{profile}</p>
                  </div>
                );
              }

              if (sectionId === 'education' && educations.length > 0) {
                return (
                  <div className="mb-8" key="education">
                    <SectionHeader icon={GraduationCap} title={t('template.education')} />
                    <div className="pl-10">
                      {educations.map((edu) => (
                        <TimelineItemHarvard
                          key={edu.id}
                          startDate={edu.graduationDate}
                          title={edu.diploma}
                          subtitle={`${edu.school}${edu.city ? `, ${edu.city}` : ''}`}
                          description={edu.description}
                          primaryColor={settings.primaryColor}
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'experience' && experiences.length > 0) {
                return (
                  <div className="mb-8" key="experience">
                    <SectionHeader icon={Briefcase} title={t('template.experience')} />
                    <div className="pl-10">
                      {experiences.map((exp) => (
                        <TimelineItemHarvard
                          key={exp.id}
                          startDate={exp.startDate}
                          endDate={exp.endDate}
                          currentlyWorking={exp.currentlyWorking}
                          title={exp.jobTitle}
                          subtitle={`${exp.employer}${exp.city ? `, ${exp.city}` : ''}`}
                          description={exp.description}
                          primaryColor={settings.primaryColor}
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'certifications' && certifications.length > 0) {
                return (
                  <div className="mb-8" key="certifications">
                    <SectionHeader icon={Award} title={t('template.certifications')} />
                    <div className="pl-10 space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900">{cert.name}</h4>
                            <p className="text-xs text-gray-600">{cert.organization}</p>
                            {cert.date && (
                              <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'projects' && projects.length > 0) {
                return (
                  <div className="mb-8" key="projects">
                    <SectionHeader icon={MessageSquare} title={t('template.projects')} />
                    <div className="pl-10 space-y-4 min-w-0">
                      {projects.map((proj) => (
                        <div key={proj.id} className="min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 break-words">{proj.name}</h4>
                          <div className="text-xs text-gray-700 leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(proj.description || '') }} />
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

            {/* Internships */}
            {isSectionVisible('internships', settings) && internships.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={Briefcase} title={t('template.internships')} />
                <div className="pl-10">
                  {internships.map((intern) => (
                    <TimelineItemHarvard
                      key={intern.id}
                      startDate={intern.startDate}
                      endDate={intern.endDate}
                      currentlyWorking={intern.currentlyWorking}
                      title={intern.jobTitle}
                      subtitle={`${intern.employer}${intern.city ? `, ${intern.city}` : ''}`}
                      description={intern.description}
                      primaryColor={settings.primaryColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {isSectionVisible('publications', settings) && publications.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={BookOpen} title={t('template.publications')} />
                <div className="pl-10 space-y-1">
                  {publications.map((pub, i) => (
                    <p key={i} className="text-sm text-gray-700">• {pub}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Extracurricular */}
            {isSectionVisible('extracurricular', settings) && extracurricular.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={BookOpen} title={t('template.extracurricular')} />
                <div className="pl-10 space-y-1">
                  {extracurricular.map((act, i) => (
                    <p key={i} className="text-sm text-gray-700">• {act}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Default references note when no data */}
            {(!isSectionVisible('references', settings) || references.length === 0) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <SectionHeader icon={Users} title={t('template.references')} />
                <p className="text-sm text-gray-600 pl-10">{t('template.onRequest')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

HarvardTemplate.displayName = 'HarvardTemplate';
