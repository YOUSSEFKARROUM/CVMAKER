import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Mail, Globe, Linkedin, Github, Calendar, Flag, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
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
  contact, updateContact, errors, showDetails, setShowDetails, onNext, onPhotoChange,
}: ContactFormProps) {
  const { t } = useTranslation();
  const [touched, setTouched]           = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors]   = useState<Record<string, string>>({});

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const validateFieldValue = useCallback((field: keyof ContactInfo, value: string) => {
    const rule = validationRules[field as keyof typeof validationRules];
    if (rule) {
      const err = validateField(value, rule, field);
      setLocalErrors(prev => ({ ...prev, [field]: err || '' }));
    }
  }, []);

  const debouncedValidate = useCallback(
    debounce((field: keyof ContactInfo, value: string) => validateFieldValue(field, value), 300),
    [validateFieldValue]
  );

  const handleChange = (field: keyof ContactInfo, value: string) => {
    updateContact(field, value);
    debouncedValidate(field, value);
  };

  const isFieldValid = (field: keyof ContactInfo) => {
    const v = contact[field];
    return (typeof v === 'string' ? v.trim() !== '' : Boolean(v)) && !localErrors[field];
  };

  const getFieldError  = (f: string) => errors[f] || localErrors[f];
  const isFieldTouched = (f: string) => touched[f] || errors[f];

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
        {t('contact.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('contact.subtitle')}</p>

      {/* Photo */}
      <div className="mb-8 flex justify-center">
        <PhotoUpload photo={contact.photo} onPhotoChange={onPhotoChange}
          firstName={contact.firstName} lastName={contact.lastName} />
      </div>

      <div className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={t('contact.firstName')}
            error={isFieldTouched('firstName') ? getFieldError('firstName') || undefined : undefined}
            isValid={isFieldValid('firstName')}
            required
          >
            <Input
              id="firstName"
              value={contact.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder={t('contact.placeholders.firstName')}
            />
          </FormField>
          <FormField
            label={t('contact.lastName')}
            error={isFieldTouched('lastName') ? getFieldError('lastName') || undefined : undefined}
            isValid={isFieldValid('lastName')}
            required
          >
            <Input
              id="lastName"
              value={contact.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder={t('contact.placeholders.lastName')}
            />
          </FormField>
        </div>

        {/* Job title */}
        <div>
          <AutocompleteInput
            value={contact.jobTitle || ''}
            onChange={v => handleChange('jobTitle', v)}
            suggestions={commonJobTitles}
            label={t('contact.jobTitle')}
            placeholder={t('contact.placeholders.jobTitle')}
            className="relative"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('contact.city')}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="city"
                value={contact.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder={t('contact.placeholders.city')}
                className="pl-9"
              />
            </div>
          </FormField>
          <FormField label={t('contact.postalCode')}>
            <Input
              id="postalCode"
              value={contact.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              placeholder={t('contact.placeholders.postalCode')}
            />
          </FormField>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('contact.phone')}>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                value={contact.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder={t('contact.placeholders.phone')}
                className="pl-9"
              />
            </div>
          </FormField>
          <FormField
            label={t('contact.email')}
            error={isFieldTouched('email') ? getFieldError('email') || undefined : undefined}
            isValid={isFieldValid('email')}
            required
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={contact.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder={t('contact.placeholders.email')}
                className="pl-9"
              />
            </div>
          </FormField>
        </div>

        {/* Toggle details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue font-medium hover:underline underline-offset-2 focus-visible:outline-none"
        >
          {showDetails ? t('contact.hideDetails') : t('contact.addDetails')}
        </button>

        {/* Additional details */}
        <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-5 pt-4 border-t border-border"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('contact.linkedin')}>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="linkedin"
                    value={contact.linkedin || ''}
                    onChange={e => handleChange('linkedin', e.target.value)}
                    placeholder={t('contact.placeholders.linkedin')}
                    className="pl-9"
                  />
                </div>
              </FormField>
              <FormField label={t('contact.portfolio')}>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="portfolio"
                    value={contact.portfolio || ''}
                    onChange={e => handleChange('portfolio', e.target.value)}
                    placeholder={t('contact.placeholders.portfolio')}
                    className="pl-9"
                  />
                </div>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('contact.github')}>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="github"
                    value={contact.github || ''}
                    onChange={e => handleChange('github', e.target.value)}
                    placeholder={t('contact.placeholders.github')}
                    className="pl-9"
                  />
                </div>
              </FormField>
              <FormField label={t('contact.nationality')}>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="nationality"
                    value={contact.nationality || ''}
                    onChange={e => handleChange('nationality', e.target.value)}
                    placeholder={t('contact.placeholders.nationality')}
                    className="pl-9"
                  />
                </div>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('contact.birthDate')}>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={contact.birthDate || ''}
                    onChange={e => handleChange('birthDate', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </FormField>
              <FormField label={t('contact.drivingLicense')}>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="drivingLicense"
                    value={contact.drivingLicense || ''}
                    onChange={e => handleChange('drivingLicense', e.target.value)}
                    placeholder={t('contact.placeholders.drivingLicense')}
                    className="pl-9"
                  />
                </div>
              </FormField>
            </div>
            <FormField label={t('contact.country')}>
              <Input
                id="country"
                value={contact.country || ''}
                onChange={e => handleChange('country', e.target.value)}
                placeholder={t('contact.placeholders.country')}
              />
            </FormField>
          </motion.div>
        )}
        </AnimatePresence>

        <div className="flex justify-end pt-4">
          <Button variant="blue" onClick={onNext}>
            {t('nav.next')} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
