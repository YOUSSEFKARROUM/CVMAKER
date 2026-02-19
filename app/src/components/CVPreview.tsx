import { forwardRef } from 'react';
import { MapPin, Phone, Mail, Globe, Linkedin, Flag, Car } from 'lucide-react';
import type { CVData, CVSettings } from '../types/cv';

interface CVPreviewProps {
  cvData: CVData;
  settings: CVSettings;
  className?: string;
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests } = cvData;

    const getInitials = (firstName: string, lastName: string) => {
      if (!firstName || !lastName) return 'CV';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getSkillLevelWidth = (level: string) => {
      switch (level) {
        case 'expert': return '100%';
        case 'advanced': return '75%';
        case 'intermediate': return '50%';
        case 'beginner': return '25%';
        default: return '100%';
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    };

    // Template: Budapest (Sidebar left)
    if (settings.template === 'budapest') {
      return (
        <div 
          ref={ref}
          id="cv-preview"
          data-cv-preview
          className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
          style={{ fontFamily: settings.bodyFont }}
        >
          <div className="flex">
            {/* Left Sidebar */}
            <div 
              className="w-[35%] p-8 text-white min-h-[297mm]"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {/* Photo */}
              {contact.photo ? (
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/30">
                  <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                  {getInitials(contact.firstName, contact.lastName)}
                </div>
              )}

              {/* Contact Info */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider mb-4 opacity-80 border-b border-white/30 pb-2">
                  Contact
                </h3>
                <div className="space-y-2 text-sm">
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 opacity-70" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 opacity-70" />
                      <span className="break-all">{contact.email}</span>
                    </div>
                  )}
                  {(contact.city || contact.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 opacity-70" />
                      <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {contact.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 opacity-70" />
                      <span className="break-all">{contact.linkedin}</span>
                    </div>
                  )}
                  {contact.portfolio && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 opacity-70" />
                      <span className="break-all">{contact.portfolio}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider mb-4 opacity-80 border-b border-white/30 pb-2">
                    Compétences
                  </h3>
                  <div className="space-y-3">
                    {skills.map((skill) => (
                      <div key={skill.id}>
                        <p className="text-sm mb-1">{skill.name}</p>
                        {!settings.showSkillsAsTags && settings.showSkillLevels && (
                          <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white rounded-full"
                              style={{ width: getSkillLevelWidth(skill.level) }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider mb-4 opacity-80 border-b border-white/30 pb-2">
                    Langues
                  </h3>
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

              {/* Interests */}
              {interests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider mb-4 opacity-80 border-b border-white/30 pb-2">
                    Centres d'intérêt
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-white/20 rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Driving License */}
              {contact.drivingLicense && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider mb-4 opacity-80 border-b border-white/30 pb-2">
                    Permis
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 opacity-70" />
                    <span>{contact.drivingLicense}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="w-[65%] p-8">
              {/* Name */}
              <div className="mb-6">
                <h1 
                  className="text-5xl font-bold mb-2"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {contact.firstName.toUpperCase()}
                </h1>
                <h1 
                  className="text-5xl font-bold mb-4"
                  style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
                >
                  {contact.lastName.toUpperCase()}
                </h1>
                {contact.jobTitle && (
                  <p className="text-xl text-gray-600">{contact.jobTitle}</p>
                )}
              </div>

              {/* Profile */}
              {profile && (
                <div className="mb-8">
                  <h3 
                    className="text-lg font-semibold mb-3 pb-2 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    PROFIL
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{profile}</p>
                </div>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <div className="mb-8">
                  <h3 
                    className="text-lg font-semibold mb-4 pb-2 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    EXPÉRIENCE PROFESSIONNELLE
                  </h3>
                  <div className="space-y-5">
                    {experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                        {exp.description && (
                          <p className="text-sm text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {educations.length > 0 && (
                <div>
                  <h3 
                    className="text-lg font-semibold mb-4 pb-2 border-b-2"
                    style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                  >
                    FORMATION
                  </h3>
                  <div className="space-y-4">
                    {educations.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                          <span className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</span>
                        </div>
                        <p className="text-gray-600">{edu.school}{edu.city && `, ${edu.city}`}</p>
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

    // Template: Chicago (Centered header)
    if (settings.template === 'chicago') {
      return (
        <div 
          ref={ref}
          id="cv-preview"
          data-cv-preview
          className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-12 ${className}`}
          style={{ fontFamily: settings.bodyFont }}
        >
          {/* Header */}
          <div className="text-center mb-10 border-b-2 pb-6" style={{ borderColor: settings.primaryColor }}>
            {contact.photo && (
              <img 
                src={contact.photo} 
                alt="Profile" 
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4"
                style={{ borderColor: settings.primaryColor }}
              />
            )}
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: settings.titleFont, color: settings.primaryColor }}
            >
              {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
            </h1>
            {contact.jobTitle && (
              <p className="text-xl text-gray-600 mb-4">{contact.jobTitle}</p>
            )}
            <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
              {contact.phone && <span>{contact.phone}</span>}
              {contact.email && <span>•</span>}
              {contact.email && <span>{contact.email}</span>}
              {(contact.city || contact.country) && <span>•</span>}
              {(contact.city || contact.country) && (
                <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
              )}
            </div>
          </div>

          {/* Profile */}
          {profile && (
            <div className="mb-8">
              <h3 
                className="text-lg font-semibold mb-3 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                PROFIL
              </h3>
              <p className="text-gray-700 leading-relaxed">{profile}</p>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div className="mb-8">
              <h3 
                className="text-lg font-semibold mb-4 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                EXPÉRIENCE PROFESSIONNELLE
              </h3>
              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div className="mb-8">
              <h3 
                className="text-lg font-semibold mb-4 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                FORMATION
              </h3>
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
              <h3 
                className="text-lg font-semibold mb-4 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                COMPÉTENCES
              </h3>
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

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h3 
                className="text-lg font-semibold mb-4 pb-1 border-b"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                LANGUES
              </h3>
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

    // Default/Modern Template
    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header */}
        <div 
          className="p-8 text-white"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="flex items-start gap-6">
            {contact.photo && (
              <img 
                src={contact.photo} 
                alt="Profile" 
                className="w-24 h-24 rounded-lg object-cover border-2 border-white/30"
              />
            )}
            <div className="flex-1">
              <h1 
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: settings.titleFont }}
              >
                {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
              </h1>
              {contact.jobTitle && (
                <p className="text-xl text-white/90 mb-3">{contact.jobTitle}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                {contact.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                )}
                {(contact.city || contact.country) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: settings.primaryColor }}
                >
                  Compétences
                </h3>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-sm font-medium">{skill.name}</p>
                      {!settings.showSkillsAsTags && settings.showSkillLevels && (
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: getSkillLevelWidth(skill.level),
                              backgroundColor: settings.primaryColor 
                            }}
                          />
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
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: settings.primaryColor }}
                >
                  Langues
                </h3>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <p key={lang.id} className="text-sm">{lang.name}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: settings.primaryColor }}
                >
                  Intérêts
                </h3>
                <div className="flex flex-wrap gap-1">
                  {interests.map((interest, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            {/* Profile */}
            {profile && (
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: settings.primaryColor }}
                >
                  Profil
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile}</p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: settings.primaryColor }}
                >
                  Expérience
                </h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{exp.employer}{exp.city && `, ${exp.city}`}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: settings.primaryColor }}
                >
                  Formation
                </h3>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id}>
                      <h4 className="font-semibold text-gray-900">{edu.diploma}</h4>
                      <p className="text-sm text-gray-600">{edu.school}</p>
                      <p className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</p>
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

CVPreview.displayName = 'CVPreview';
