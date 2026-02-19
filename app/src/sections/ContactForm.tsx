import { useState, useCallback } from 'react';
import { ArrowRight, Check, MapPin, Phone, Mail, Globe, Linkedin, Github, Calendar, Flag, Car, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhotoUpload } from '../components/PhotoUpload';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { validationRules, validateField, debounce } from '../utils/validation';
import { commonJobTitles } from '../utils/aiSuggestions';
import type { ContactInfo } from '../types/cv';

interface ContactFormProps {
  contact: ContactInfo;
  updateContact: (field: keyof ContactInfo, value: string) => void;
  errors: Record<string, string>;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  onNext: () => void;
  onPhotoChange: (photo: string | undefined) => void;
}

export function ContactForm({
  contact,
  updateContact,
  errors,
  showDetails,
  setShowDetails,
  onNext,
  onPhotoChange,
}: ContactFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateFieldValue = useCallback((field: keyof ContactInfo, value: string) => {
    const rule = validationRules[field as keyof typeof validationRules];
    if (rule) {
      const error = validateField(value, rule, field);
      setLocalErrors(prev => ({ ...prev, [field]: error || '' }));
    }
  }, []);

  const debouncedValidate = useCallback(
    debounce((field: keyof ContactInfo, value: string) => {
      validateFieldValue(field, value);
    }, 300),
    [validateFieldValue]
  );

  const handleChange = (field: keyof ContactInfo, value: string) => {
    updateContact(field, value);
    debouncedValidate(field, value);
  };

  const isFieldValid = (field: keyof ContactInfo) => {
    const value = contact[field];
    return value && value?.trim() !== '' && !localErrors[field];
  };

  const getFieldError = (field: string) => {
    return errors[field] || localErrors[field];
  };

  const isFieldTouched = (field: string) => {
    return touched[field] || errors[field];
  };

  const requiredFields = ['firstName', 'lastName', 'email'];
  const completedRequiredFields = requiredFields.filter(field => 
    contact[field as keyof ContactInfo]?.trim()
  ).length;
  const progress = Math.round((completedRequiredFields / requiredFields.length) * 100);

  return (
    <div className="max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progression</span>
          <span className="text-sm font-medium text-[#2196F3]">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#2196F3] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Vos informations de <span className="text-[#2196F3]">contact</span>
      </h2>
      <p className="text-gray-500 mb-8">
        Ces informations permettront aux recruteurs de vous contacter facilement.
      </p>

      {/* Photo Upload */}
      <div className="mb-8 flex justify-center">
        <PhotoUpload
          photo={contact.photo}
          onPhotoChange={onPhotoChange}
          firstName={contact.firstName}
          lastName={contact.lastName}
        />
      </div>

      <div className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="firstName" className="text-xs uppercase text-gray-500 flex items-center gap-1">
              <User className="w-3 h-3" />
              PRÉNOM <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={contact.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Jean"
              className={`mt-1 ${
                getFieldError('firstName') && isFieldTouched('firstName')
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : isFieldValid('firstName')
                  ? 'border-green-500'
                  : ''
              }`}
            />
            {isFieldValid('firstName') && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            {getFieldError('firstName') && isFieldTouched('firstName') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('firstName')}</p>
            )}
          </div>

          <div className="relative">
            <Label htmlFor="lastName" className="text-xs uppercase text-gray-500 flex items-center gap-1">
              <User className="w-3 h-3" />
              NOM <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={contact.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Dupont"
              className={`mt-1 ${
                getFieldError('lastName') && isFieldTouched('lastName')
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : isFieldValid('lastName')
                  ? 'border-green-500'
                  : ''
              }`}
            />
            {isFieldValid('lastName') && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            {getFieldError('lastName') && isFieldTouched('lastName') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('lastName')}</p>
            )}
          </div>
        </div>

        {/* Job Title */}
        <AutocompleteInput
          value={contact.jobTitle || ''}
          onChange={(value) => handleChange('jobTitle', value)}
          suggestions={commonJobTitles}
          label="INTITULÉ DU POSTE"
          placeholder="Développeur Web Full Stack"
          className="relative"
        />

        {/* Location Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="city" className="text-xs uppercase text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              VILLE
            </Label>
            <Input
              id="city"
              value={contact.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Paris"
              className={`mt-1 ${isFieldValid('city') ? 'border-green-500' : ''}`}
            />
          </div>

          <div className="relative">
            <Label htmlFor="postalCode" className="text-xs uppercase text-gray-500">
              CODE POSTAL
            </Label>
            <Input
              id="postalCode"
              value={contact.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="75001"
              className={`mt-1 ${isFieldValid('postalCode') ? 'border-green-500' : ''}`}
            />
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="phone" className="text-xs uppercase text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              TÉLÉPHONE
            </Label>
            <Input
              id="phone"
              value={contact.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className={`mt-1 ${isFieldValid('phone') ? 'border-green-500' : ''}`}
            />
          </div>

          <div className="relative">
            <Label htmlFor="email" className="text-xs uppercase text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              EMAIL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="jean.dupont@email.com"
              className={`mt-1 ${
                getFieldError('email') && isFieldTouched('email')
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : isFieldValid('email')
                  ? 'border-green-500'
                  : ''
              }`}
            />
            {isFieldValid('email') && (
              <div className="absolute right-3 top-8 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            {getFieldError('email') && isFieldTouched('email') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
            )}
          </div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[#2196F3] font-medium hover:underline flex items-center gap-1"
        >
          {showDetails ? '− Masquer' : '+ Ajouter'} plus de détails
        </button>

        {/* Additional Details */}
        {showDetails && (
          <div className="space-y-6 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin" className="text-xs uppercase text-gray-500 flex items-center gap-1">
                  <Linkedin className="w-3 h-3" />
                  LINKEDIN
                </Label>
                <Input
                  id="linkedin"
                  value={contact.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/jeandupont"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="portfolio" className="text-xs uppercase text-gray-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  PORTFOLIO / SITE
                </Label>
                <Input
                  id="portfolio"
                  value={contact.portfolio || ''}
                  onChange={(e) => handleChange('portfolio', e.target.value)}
                  placeholder="www.jeandupont.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github" className="text-xs uppercase text-gray-500 flex items-center gap-1">
                  <Github className="w-3 h-3" />
                  GITHUB
                </Label>
                <Input
                  id="github"
                  value={contact.github || ''}
                  onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="github.com/jeandupont"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="nationality" className="text-xs uppercase text-gray-500 flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  NATIONALITÉ
                </Label>
                <Input
                  id="nationality"
                  value={contact.nationality || ''}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  placeholder="Française"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthDate" className="text-xs uppercase text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  DATE DE NAISSANCE
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={contact.birthDate || ''}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="drivingLicense" className="text-xs uppercase text-gray-500 flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  PERMIS DE CONDUIRE
                </Label>
                <Input
                  id="drivingLicense"
                  value={contact.drivingLicense || ''}
                  onChange={(e) => handleChange('drivingLicense', e.target.value)}
                  placeholder="B, A2"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="text-xs uppercase text-gray-500">
                PAYS
              </Label>
              <Input
                id="country"
                value={contact.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="France"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={onNext}
            className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
          >
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
