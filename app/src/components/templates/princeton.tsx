import { forwardRef } from 'react';
import type { TemplateProps } from './types';
import { getInitials, formatDate } from './utils';

export const PrincetonTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, skills, profile, languages, interests, certifications } = cvData;

    // Helper to format date range for experience
    const formatDateRange = (startDate: string, endDate: string | null, currentlyWorking: boolean) => {
      const start = formatDate(startDate);
      const end = currentlyWorking ? 'présent' : (endDate ? formatDate(endDate) : '');
      return `${start} - ${end}`;
    };

    // Helper to get birth place from contact
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
        {/* Header: Small circular photo on left, "Curriculum vitae" title next to it */}
        <div className="flex items-center gap-4 mb-6">
          {contact.photo ? (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 flex-shrink-0">
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          )}
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Curriculum vitae</h1>
        </div>

        {/* Profile paragraph below the header */}
        {profile && (
          <div className="mb-6">
            <p className="text-sm text-gray-800 leading-relaxed text-justify">{profile}</p>
          </div>
        )}

        <hr className="border-gray-400 mb-6" />

        {/* DONNÉES PERSONNELLES - 2-column grid with labels on left, values on right */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Données personnelles</h2>
          <div className="grid grid-cols-[1fr_2fr] gap-y-2 text-sm">
            {/* Nom */}
            <div className="text-gray-800 font-normal">Nom</div>
            <div className="text-gray-800">{contact.firstName} {contact.lastName}</div>
            
            {/* Adresse */}
            <div className="text-gray-800 font-normal">Adresse</div>
            <div className="text-gray-800">
              {[contact.address, contact.postalCode, contact.city].filter(Boolean).join(', ') || 
               [contact.city, contact.country].filter(Boolean).join(', ') || '-'}
            </div>
            
            {/* Numéro de téléphone */}
            <div className="text-gray-800 font-normal">Numéro de téléphone</div>
            <div className="text-gray-800">{contact.phone || '-'}</div>
            
            {/* E-Adresse e-mail */}
            <div className="text-gray-800 font-normal">E-Adresse e-mail</div>
            <div className="text-gray-800">{contact.email || '-'}</div>
            
            {/* Date de naissance */}
            <div className="text-gray-800 font-normal">Date de naissance</div>
            <div className="text-gray-800">{contact.birthDate ? formatDate(contact.birthDate) : '-'}</div>
            
            {/* Lieu de naissance */}
            <div className="text-gray-800 font-normal">Lieu de naissance</div>
            <div className="text-gray-800">{getBirthPlace() || '-'}</div>
            
            {/* Sexe */}
            <div className="text-gray-800 font-normal">Sexe</div>
            <div className="text-gray-800">{contact.gender || '-'}</div>
            
            {/* Permis de conduire */}
            <div className="text-gray-800 font-normal">Permis de conduire</div>
            <div className="text-gray-800">{contact.drivingLicense || '-'}</div>
          </div>
        </div>

        <hr className="border-gray-400 mb-6" />

        {/* ENSEIGNEMENT - dates left, content right */}
        {educations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Enseignement</h2>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="text-sm text-gray-800">
                    {edu.graduationDate ? formatDate(edu.graduationDate) : '-'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{edu.diploma}{edu.school ? `, ${edu.school}` : ''}{edu.city ? `, ${edu.city}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {educations.length > 0 && <hr className="border-gray-400 mb-6" />}

        {/* EXPÉRIENCE PROFESSIONNELLE - Date range left, job title/company/bullets right */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Expérience professionnelle</h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="text-sm text-gray-800">
                    {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{exp.jobTitle}</p>
                    <p className="text-sm text-gray-700 italic mb-1">{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                    {exp.description && (
                      <ul className="text-sm text-gray-800 list-disc list-inside space-y-0.5">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                          <li key={idx}>{line.trim().replace(/^[-•]\s*/, '')}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experiences.length > 0 && <hr className="border-gray-400 mb-6" />}

        {/* COMPÉTENCES */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Compétences</h2>
            <div className="text-sm text-gray-800">
              {skills.map((skill) => skill.name).join(', ')}
            </div>
          </div>
        )}

        {skills.length > 0 && <hr className="border-gray-400 mb-6" />}

        {/* LANGUES */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Langues</h2>
            <div className="text-sm text-gray-800">
              {languages.map((lang) => (
                <span key={lang.id}>
                  {lang.name}{lang.level ? ` (${lang.level})` : ''}
                  {languages.indexOf(lang) < languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && <hr className="border-gray-400 mb-6" />}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-sm text-gray-800">
                  {cert.name}{cert.organization ? ` - ${cert.organization}` : ''}{cert.date ? ` (${formatDate(cert.date)})` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && <hr className="border-gray-400 mb-6" />}

        {/* INTÉRÊTS */}
        {interests.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-900">Intérêts</h2>
            <p className="text-sm text-gray-800">{interests.join(', ')}</p>
          </div>
        )}
      </div>
    );
  }
);

PrincetonTemplate.displayName = 'PrincetonTemplate';
