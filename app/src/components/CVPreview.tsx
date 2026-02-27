import { forwardRef, memo } from 'react';
import type { CVData, CVSettings } from '../types/cv';
import {
  BudapestTemplate,
  BruneiTemplate,
  VladivostokTemplate,
  SydneyTemplate,
  ShanghaiTemplate,
  KievTemplate,
  RotterdamTemplate,
  TokyoTemplate,
  ChicagoTemplate,
  ModernTemplate,
  StanfordTemplate,
  CambridgeTemplate,
  OxfordTemplate,
  OtagoTemplate,
  BerkeleyTemplate,
  HarvardTemplate,
  AucklandTemplate,
  EdinburghTemplate,
  PrincetonTemplate,
} from './templates';

interface CVPreviewProps {
  cvData: CVData;
  settings: CVSettings;
  className?: string;
}

// Composant mémorisé pour éviter les re-rendus inutiles
const CVPreviewComponent = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ cvData, settings, className = '' }, ref) => {
    // Ne pas rendre si pas de données minimales
    if (!cvData || !settings) {
      return null;
    }

    switch (settings.template) {
      case 'budapest':
        return <BudapestTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'brunei':
        return <BruneiTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'vladivostok':
        return <VladivostokTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'sydney':
        return <SydneyTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'shanghai':
        return <ShanghaiTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'kiev':
        return <KievTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'rotterdam':
        return <RotterdamTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'tokyo':
        return <TokyoTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'chicago':
        return <ChicagoTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'stanford':
        return <StanfordTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'cambridge':
        return <CambridgeTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'oxford':
        return <OxfordTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'otago':
        return <OtagoTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'berkeley':
        return <BerkeleyTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'harvard':
        return <HarvardTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'auckland':
        return <AucklandTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'edinburgh':
        return <EdinburghTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      case 'princeton':
        return <PrincetonTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
      default:
        return <ModernTemplate ref={ref} cvData={cvData} settings={settings} className={className} />;
    }
  }
);

CVPreviewComponent.displayName = 'CVPreviewComponent';

// Fonction de comparaison personnalisée pour memo
const areEqual = (prevProps: CVPreviewProps, nextProps: CVPreviewProps) => {
  // Comparer settings par valeur
  const settingsEqual = 
    prevProps.settings.template === nextProps.settings.template &&
    prevProps.settings.primaryColor === nextProps.settings.primaryColor &&
    prevProps.settings.titleFont === nextProps.settings.titleFont &&
    prevProps.settings.bodyFont === nextProps.settings.bodyFont &&
    prevProps.settings.showSkillLevels === nextProps.settings.showSkillLevels &&
    prevProps.settings.showSkillsAsTags === nextProps.settings.showSkillsAsTags;

  if (!settingsEqual) return false;

  // Comparer cvData de manière superficielle pour les tableaux principaux
  const cvDataEqual = 
    prevProps.cvData.contact.firstName === nextProps.cvData.contact.firstName &&
    prevProps.cvData.contact.lastName === nextProps.cvData.contact.lastName &&
    prevProps.cvData.contact.email === nextProps.cvData.contact.email &&
    prevProps.cvData.contact.phone === nextProps.cvData.contact.phone &&
    prevProps.cvData.contact.photo === nextProps.cvData.contact.photo &&
    prevProps.cvData.contact.jobTitle === nextProps.cvData.contact.jobTitle &&
    prevProps.cvData.profile === nextProps.cvData.profile &&
    prevProps.cvData.experiences.length === nextProps.cvData.experiences.length &&
    prevProps.cvData.educations.length === nextProps.cvData.educations.length &&
    prevProps.cvData.skills.length === nextProps.cvData.skills.length &&
    prevProps.cvData.languages.length === nextProps.cvData.languages.length &&
    prevProps.cvData.certifications.length === nextProps.cvData.certifications.length &&
    prevProps.cvData.projects.length === nextProps.cvData.projects.length &&
    prevProps.cvData.interests.length === nextProps.cvData.interests.length;

  return cvDataEqual;
};

// Exporter le composant mémorisé
export const CVPreview = memo(CVPreviewComponent, areEqual);
CVPreview.displayName = 'CVPreview';
