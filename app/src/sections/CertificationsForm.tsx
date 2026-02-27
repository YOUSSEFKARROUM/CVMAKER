import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SortableList } from '../components/SortableList';
import { AutocompleteInput } from '../components/AutocompleteInput';
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
  'AWS Certified Solutions Architect',
  'AWS Certified Developer',
  'Microsoft Azure Fundamentals',
  'Google Cloud Professional',
  'Scrum Master',
  'PMP (Project Management Professional)',
  'ITIL Foundation',
  'Cisco CCNA',
  'CompTIA A+',
  'CompTIA Network+',
  'CompTIA Security+',
  'TOEFL',
  'IELTS',
  'DELF',
  'Cambridge English',
];

const commonOrganizations = [
  'Amazon Web Services',
  'Microsoft',
  'Google',
  'Scrum.org',
  'PMI',
  'Cisco',
  'CompTIA',
  'AXELOS',
  'Oracle',
  'Adobe',
  'Salesforce',
  'HubSpot',
  'Google Analytics',
  'Meta',
  'IBM',
];

const emptyCertification: Certification = {
  id: '',
  name: '',
  organization: '',
  date: '',
  expiryDate: '',
  credentialId: '',
};

export function CertificationsForm({
  certifications,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onNext,
  onBack,
  onSkip,
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
    if (certifications.length === 0) {
      onSkip();
    } else {
      onNext();
    }
  };

  const renderCertificationForm = (cert: Certification, isNew: boolean) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-[#2196F3]" />
          <div>
            <p className="font-medium">{cert.name || t('certifications.newCertification')}</p>
            {cert.name && (
              <p className="text-sm text-gray-500">
                {cert.organization}
                {cert.date && ` • ${new Date(cert.date).getFullYear()}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isNew ? handleCancel() : onDelete(cert.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${expandedId === cert.id ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {expandedId === cert.id && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('certifications.name')}</Label>
              <AutocompleteInput
                value={cert.name}
                onChange={(value) => isNew 
                  ? setNewCertification({ ...cert, name: value })
                  : onUpdate(cert.id, { name: value })
                }
                suggestions={commonCertifications}
                placeholder={t('certifications.namePlaceholder')}
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('certifications.organization')}</Label>
              <AutocompleteInput
                value={cert.organization}
                onChange={(value) => isNew 
                  ? setNewCertification({ ...cert, organization: value })
                  : onUpdate(cert.id, { organization: value })
                }
                suggestions={commonOrganizations}
                placeholder={t('certifications.organizationPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('certifications.date')}</Label>
              <Input
                type="month"
                value={cert.date}
                onChange={(e) => isNew
                  ? setNewCertification({ ...cert, date: e.target.value })
                  : onUpdate(cert.id, { date: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-gray-500">{t('certifications.credentialId')}</Label>
              <Input
                value={cert.credentialId || ''}
                onChange={(e) => isNew
                  ? setNewCertification({ ...cert, credentialId: e.target.value })
                  : onUpdate(cert.id, { credentialId: e.target.value })
                }
                placeholder={t('certifications.credentialIdPlaceholder')}
                className="mt-1"
              />
            </div>
          </div>

          {isNew && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t('nav.cancel')}
              </Button>
              <Button onClick={handleSave} className="bg-[#2196F3] hover:bg-[#1976D2]">
                {t('nav.save')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        <span className="text-[#2196F3]">{t('certifications.titleHighlight')}</span> {t('certifications.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('certifications.subtitle')}
      </p>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-[#2196F3] font-medium mb-4 hover:underline"
      >
        <Plus className="w-5 h-5" />
        {t('certifications.add')}
      </button>

      {newCertification && renderCertificationForm(newCertification, true)}

      {certifications.length > 0 && (
        <SortableList
          items={certifications}
          onReorder={onReorder}
          renderItem={(cert) => renderCertificationForm(cert, false)}
        />
      )}

      <p className="text-gray-500 text-sm mb-8">
        {t('certifications.helpText')}
      </p>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('nav.back')}
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {t('certifications.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
