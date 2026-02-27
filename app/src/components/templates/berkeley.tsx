import { forwardRef } from 'react';
import { User, Briefcase, GraduationCap } from 'lucide-react';
import type { TemplateProps } from './types';
import { getInitials, formatDate } from './utils';

export const BerkeleyTemplate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ cvData, settings, className = '' }, ref) => {
    const { contact, experiences, educations, profile } = cvData;

    return (
      <div 
        ref={ref}
        id="cv-preview"
        data-cv-preview
        className={`bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 ${className}`}
        style={{ fontFamily: settings.bodyFont }}
      >
        {/* Header with Circular Photo */}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {contact.firstName} {contact.lastName}
            </h1>
            {profile && (
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{profile}</p>
            )}
          </div>
        </div>

        {/* Personal Data Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded mb-3"
            style={{ backgroundColor: '#e5e7eb' }}
          >
            <User className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">Données personnelles</span>
          </div>
          <div className="pl-3 space-y-1 text-sm">
            {contact.email && (
              <div className="flex">
                <span className="text-gray-600 w-16 flex-shrink-0">E-mail</span>
                <span className="text-gray-800">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex">
                <span className="text-gray-600 w-16 flex-shrink-0">Téléphone</span>
                <span className="text-gray-800">{contact.phone}</span>
              </div>
            )}
            {(contact.city || contact.country) && (
              <div className="flex">
                <span className="text-gray-600 w-16 flex-shrink-0">Adresse</span>
                <span className="text-gray-800">{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education Section */}
        {educations.length > 0 && (
          <div className="mb-6">
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded mb-3"
              style={{ backgroundColor: '#e5e7eb' }}
            >
              <GraduationCap className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-semibold text-gray-800">Enseignement</span>
            </div>
            <div className="pl-3 space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900">{edu.diploma}</h4>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(edu.graduationDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded mb-3"
              style={{ backgroundColor: '#e5e7eb' }}
            >
              <Briefcase className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-semibold text-gray-800">Expérience professionnelle</span>
            </div>
            <div className="pl-3 space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900">{exp.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{exp.employer}</p>
                    {exp.description && (
                      <ul className="mt-2 space-y-1">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-1.5">•</span>
                            <span>{line.trim().replace(/^[•\-\*]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'aujourd\'hui' : formatDate(exp.endDate)}
                  </span>
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
