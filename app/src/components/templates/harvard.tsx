import { forwardRef } from 'react';
import { MapPin, Phone, Mail, Linkedin, Globe, Github, Award, Star, Square, GraduationCap, Briefcase, CheckCircle, User, Lightbulb, MessageSquare } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate } from './utils';

// Star rating component
const StarRating = ({ level, color = 'white' }: { level: string; color?: string }) => {
  const filledStars = level === 'beginner' ? 1 : level === 'intermediate' ? 3 : level === 'advanced' ? 4 : 5;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= filledStars ? `fill-${color} text-${color}` : `text-${color}/30`}`}
          style={{ 
            fill: star <= filledStars ? color : 'transparent',
            color: star <= filledStars ? color : `${color}4D`
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

// Timeline item component
const TimelineItem = ({ 
  startDate, 
  endDate, 
  currentlyWorking,
  title, 
  subtitle, 
  description,
  primaryColor 
}: { 
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  title: string;
  subtitle: string;
  description?: string;
  primaryColor: string;
}) => (
  <div className="relative pl-6 pb-6 last:pb-0">
    {/* Timeline dot */}
    <div 
      className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
      style={{ backgroundColor: primaryColor }}
    />
    {/* Timeline line */}
    <div 
      className="absolute left-[5px] top-4 bottom-0 w-0.5"
      style={{ backgroundColor: primaryColor }}
    />
    {/* Content */}
    <div>
      {(startDate || endDate) && (
        <p className="text-xs text-gray-500 mb-1">
          {startDate && formatDate(startDate)} - {currentlyWorking ? 'Présent' : endDate ? formatDate(endDate) : ''}
        </p>
      )}
      <h4 className="font-bold text-sm text-gray-900">{title}</h4>
      <p className="text-xs text-gray-600 mb-1">{subtitle}</p>
      {description && (
        <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
      )}
    </div>
  </div>
);

export const HarvardTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, certifications } = cvData;

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        <div className="flex">
          {/* Left Sidebar - Blue */}
          <div 
            className="w-[35%] p-6 text-white min-h-[297mm]"
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
              <h1 className="text-xl font-bold mb-1">{contact.firstName}</h1>
              <h1 className="text-xl font-bold">{contact.lastName}</h1>
            </div>

            {/* Personelles Section */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                Personnelles
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

            {/* Intérêts */}
            {interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  Intérêts
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

            {/* Langues */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  Langues
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

            {/* Compétences - Sidebar */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                  Compétences
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

            {/* Références */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b-2 border-white/50 pb-2">
                Références
              </h3>
              <p className="text-xs opacity-90">Sur demande</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-[65%] p-8">
            {/* Profile */}
            {profile && (
              <div className="mb-8">
                <SectionHeader icon={User} title="Profil" />
                <p className="text-sm text-gray-700 leading-relaxed pl-10">{profile}</p>
              </div>
            )}

            {/* Enseignement (Education) */}
            {educations.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={GraduationCap} title="Enseignement" />
                <div className="pl-10">
                  {educations.map((edu) => (
                    <TimelineItem
                      key={edu.id}
                      startDate={edu.graduationDate}
                      title={edu.diploma}
                      subtitle={`${edu.school}${edu.city ? `, ${edu.city}` : ''}`}
                      primaryColor={settings.primaryColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Expérience Professionnelle */}
            {experiences.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={Briefcase} title="Expérience Professionnelle" />
                <div className="pl-10">
                  {experiences.map((exp) => (
                    <TimelineItem
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
            )}

            {/* Compétences - Main content */}
            {skills.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={Lightbulb} title="Compétences" />
                <div className="pl-10 space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{skill.name}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4"
                            style={{
                              fill: star <= (skill.level === 'beginner' ? 1 : skill.level === 'intermediate' ? 3 : skill.level === 'advanced' ? 4 : 5)
                                ? settings.primaryColor : 'transparent',
                              color: star <= (skill.level === 'beginner' ? 1 : skill.level === 'intermediate' ? 3 : skill.level === 'advanced' ? 4 : 5)
                                ? settings.primaryColor : '#D1D5DB'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-8">
                <SectionHeader icon={Award} title="Certifications" />
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
            )}

            {/* Références at bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <SectionHeader icon={MessageSquare} title="Références" />
              <p className="text-sm text-gray-600 pl-10">Références disponibles sur demande</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HarvardTemplate.displayName = 'HarvardTemplate';
