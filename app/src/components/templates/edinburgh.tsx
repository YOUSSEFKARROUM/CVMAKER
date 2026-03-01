import { forwardRef } from 'react';
import { MapPin, Phone, Mail, Linkedin, Circle, Calendar, Flag, Car, HeartHandshake } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate } from './utils';

// 5-dot rating component for skills and languages
const DotRating = ({ level }: { level: string }) => {
  // Convert level to number of filled dots (1-5)
  const getLevelValue = (lvl: string): number => {
    switch (lvl) {
      case 'beginner': return 1;
      case 'intermediate': return 3;
      case 'advanced': return 4;
      case 'expert':
      case 'native': return 5;
      default: return 3;
    }
  };

  const filledDots = getLevelValue(level);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot <= filledDots ? 'bg-gray-700' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Helper to get appropriate icon for contact info
const getContactIcon = (type: string) => {
  const iconClass = "w-4 h-4 text-gray-600 flex-shrink-0";
  switch (type) {
    case 'email':
      return <Mail className={iconClass} />;
    case 'phone':
      return <Phone className={iconClass} />;
    case 'location':
      return <MapPin className={iconClass} />;
    case 'linkedin':
      return <Linkedin className={iconClass} />;
    case 'birthDate':
      return <Calendar className={iconClass} />;
    case 'nationality':
      return <Flag className={iconClass} />;
    case 'drivingLicense':
      return <Car className={iconClass} />;
    case 'maritalStatus':
      return <HeartHandshake className={iconClass} />;
    default:
      return <Circle className={iconClass} />;
  }
};

export const EdinburghTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, certifications, references } = cvData;

    return (
      <div
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl overflow-hidden ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header with Purple/Indigo Background */}
        <div
          className="p-8 text-white flex items-center gap-6"
          style={{ backgroundColor: '#4c5582' }}
        >
          {contact.photo ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0">
              <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              {contact.firstName.toUpperCase()} {contact.lastName.toUpperCase()}
            </h1>
            {contact.jobTitle && (
              <p className="text-white/90 text-lg mt-1">{contact.jobTitle}</p>
            )}
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar - Light Gray Background ~30% */}
          <div className="w-[30%] p-6 bg-gray-100">
            {/* Personnelles */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
                Personnelles
              </h3>
              <div className="space-y-3 text-xs">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('email')}
                    <span className="break-all text-gray-700">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('phone')}
                    <span className="text-gray-700">{contact.phone}</span>
                  </div>
                )}
                {(contact.city || contact.country || contact.address) && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('location')}
                    <span className="text-gray-700">
                      {[contact.address, contact.city, contact.postalCode, contact.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('linkedin')}
                    <span className="break-all text-gray-700">{contact.linkedin}</span>
                  </div>
                )}
                {contact.birthDate && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('birthDate')}
                    <span className="text-gray-700">{contact.birthDate}</span>
                  </div>
                )}
                {contact.nationality && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('nationality')}
                    <span className="text-gray-700">{contact.nationality}</span>
                  </div>
                )}
                {contact.maritalStatus && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('maritalStatus')}
                    <span className="text-gray-700">{contact.maritalStatus}</span>
                  </div>
                )}
                {contact.drivingLicense && (
                  <div className="flex items-center gap-3">
                    {getContactIcon('drivingLicense')}
                    <span className="text-gray-700">{contact.drivingLicense}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Intérêts - Filled square bullets */}
            {interests && interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
                  Intérêts
                </h3>
                <div className="text-xs space-y-2">
                  {interests.map((interest, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm">■</span>
                      <span className="text-gray-700">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues - 5-dot rating */}
            {languages && languages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
                  Langues
                </h3>
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">{lang.name}</span>
                      <DotRating level={lang.level} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compétences - 5-dot rating */}
            {skills && skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
                  Compétences
                </h3>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">{skill.name}</span>
                      <DotRating level={skill.level} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificats */}
            {certifications && certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-800 border-b border-gray-300 pb-1">
                  Certificats
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <p className="text-xs font-medium text-gray-800">{cert.name}</p>
                      <p className="text-xs text-gray-600">{cert.organization}</p>
                      {cert.date && (
                        <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content ~70% */}
          <div className="w-[70%] min-w-0 p-6">
            {/* Profile */}
            {profile && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{profile}</p>
              </div>
            )}

            {/* Enseignement */}
            {educations && educations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Enseignement
                </h3>
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.diploma}</h4>
                      <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.school}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{edu.fieldOfStudy}</p>
                      )}
                      {edu.graduationDate && (
                        <p className="text-xs text-gray-500 mt-1">{formatDate(edu.graduationDate)}</p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-gray-700 mt-1 break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expérience professionnelle */}
            {experiences && experiences.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                  Expérience professionnelle
                </h3>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.jobTitle}</h4>
                      <p className="text-xs text-gray-600 break-words" style={{ overflowWrap: 'anywhere' }}>{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Présent' : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <div 
                          className="text-xs text-gray-700 mt-2 leading-relaxed break-words"
                          style={{ overflowWrap: 'anywhere' }}
                          dangerouslySetInnerHTML={{ 
                            __html: exp.description.replace(/\n/g, '<br/>').replace(/• /g, '&bull; ') 
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Références */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-800 pb-1">
                Références
              </h3>
              {references && references.length > 0 ? (
                <div className="space-y-3">
                  {references.map((ref) => (
                    <div key={ref.id}>
                      <p className="text-xs font-medium text-gray-800">{ref.name}</p>
                      <p className="text-xs text-gray-600">{ref.position}, {ref.company}</p>
                      {ref.email && <p className="text-xs text-gray-500">{ref.email}</p>}
                      {ref.phone && <p className="text-xs text-gray-500">{ref.phone}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">Sur demande</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EdinburghTemplate.displayName = 'EdinburghTemplate';
