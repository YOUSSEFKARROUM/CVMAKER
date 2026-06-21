import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { fadeInUp, staggerContainer } from '../styles/design-system';
import type { Certification } from '../types/cv';

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: (certification: Certification) => void;
  onUpdate: (id: string, certification: Partial<Certification>) => void;
  onDelete: (id: string) => void;
  onReorder: (certifications: Certification[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const commonCertifications = [
  'AWS Certified Solutions Architect', 'AWS Certified Developer',
  'Microsoft Azure Fundamentals', 'Google Cloud Professional',
  'Scrum Master', 'PMP (Project Management Professional)', 'ITIL Foundation',
  'Cisco CCNA', 'CompTIA A+', 'CompTIA Network+', 'CompTIA Security+',
  'TOEFL', 'IELTS', 'DELF', 'Cambridge English',
];

const commonOrganizations = [
  'Amazon Web Services', 'Microsoft', 'Google', 'Scrum.org', 'PMI',
  'Cisco', 'CompTIA', 'AXELOS', 'Oracle', 'Adobe', 'Salesforce',
  'HubSpot', 'Google Analytics', 'Meta', 'IBM',
];

const emptyCertification: Certification = {
  id: '', name: '', organization: '', date: '', expiryDate: '', credentialId: '',
};

const labelCls = 'block text-xs font-medium uppercase tracking-wider text-muted-foreground';

export function CertificationsForm({
  certifications, onAdd, onUpdate, onDelete, onReorder, onNext, onBack, onSkip,
}: CertificationsFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newCertification, setNewCertification] = useState<Certification | null>(null);
  const [hasExpiry, setHasExpiry] = useState(false);

  const handleAdd = () => {
    const id = crypto.randomUUID();
    setNewCertification({ ...emptyCertification, id });
    setHasExpiry(false);
    setExpandedId(id);
  };

  const handleSave = () => {
    if (newCertification && newCertification.name.trim() && newCertification.organization.trim()) {
      if (!hasExpiry) {
        const { expiryDate, ...certWithoutExpiry } = newCertification;
        onAdd(certWithoutExpiry);
      } else {
        onAdd(newCertification);
      }
      setNewCertification(null);
      setExpandedId(null);
    }
  };

  const handleCancel = () => {
    setNewCertification(null);
    setExpandedId(null);
  };

  const handleNext = () => {
    if (certifications.length === 0) { onSkip(); } else { onNext(); }
  };

  const renderCertificationForm = (cert: Certification, isNew: boolean) => (
    <Card variant="compact" hover className="mb-3 cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Award className="w-4 h-4 text-blue" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {cert.name || t('certifications.newCertification')}
            </p>
            {cert.name && (
              <p className="text-xs text-muted-foreground">
                {cert.organization}
                {cert.date && ` · ${new Date(cert.date).getFullYear()}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => isNew ? handleCancel() : onDelete(cert.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expandedId === cert.id ? '' : 'rotate-180'}`} />
          </Button>
        </div>
      </div>

      {expandedId === cert.id && (
        <div className="space-y-4 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelCls}>{t('certifications.name')}</p>
              <AutocompleteInput
                value={cert.name}
                onChange={value => isNew
                  ? setNewCertification({ ...cert, name: value })
                  : onUpdate(cert.id, { name: value })}
                suggestions={commonCertifications}
                placeholder={t('certifications.namePlaceholder')}
              />
            </div>
            <div>
              <p className={labelCls}>{t('certifications.organization')}</p>
              <AutocompleteInput
                value={cert.organization}
                onChange={value => isNew
                  ? setNewCertification({ ...cert, organization: value })
                  : onUpdate(cert.id, { organization: value })}
                suggestions={commonOrganizations}
                placeholder={t('certifications.organizationPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('certifications.date')}>
              <Input
                type="month"
                value={cert.date}
                onChange={e => isNew
                  ? setNewCertification({ ...cert, date: e.target.value })
                  : onUpdate(cert.id, { date: e.target.value })}
              />
            </FormField>
            <FormField label={t('certifications.credentialId')}>
              <Input
                value={cert.credentialId || ''}
                onChange={e => isNew
                  ? setNewCertification({ ...cert, credentialId: e.target.value })
                  : onUpdate(cert.id, { credentialId: e.target.value })}
                placeholder={t('certifications.credentialIdPlaceholder')}
              />
            </FormField>
          </div>

          {isNew && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>{t('nav.cancel')}</Button>
              <Button variant="blue" onClick={handleSave}>{t('nav.save')}</Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
        <span className="text-blue">{t('certifications.titleHighlight')}</span>{' '}
        {t('certifications.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('certifications.subtitle')}</p>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Button variant="outline" size="sm" onClick={handleAdd} className="mb-4">
          <Plus className="w-4 h-4" />
          {t('certifications.add')}
        </Button>

        <AnimatePresence mode="wait">
          {newCertification && (
            <motion.div key="new" variants={fadeInUp}>
              {renderCertificationForm(newCertification, true)}
            </motion.div>
          )}
        </AnimatePresence>

        {certifications.length === 0 && !newCertification && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border mb-6"
          >
            <Award className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{t('certifications.emptyState')}</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> {t('certifications.add')}
            </Button>
          </motion.div>
        )}

        {certifications.length > 0 && (
          <SortableList items={certifications} onReorder={onReorder}
            renderItem={cert => renderCertificationForm(cert, false)} />
        )}
      </motion.div>

      <p className="text-xs text-muted-foreground mb-8">{t('certifications.helpText')}</p>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={handleNext}>
          {t('certifications.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
