import { useState, useCallback, useRef } from 'react';
import { LandingPage } from './sections/LandingPage';
import { ContactForm } from './sections/ContactForm';
import { ExperienceForm } from './sections/ExperienceForm';
import { EducationForm } from './sections/EducationForm';
import { SkillsForm } from './sections/SkillsForm';
import { ProfileForm } from './sections/ProfileForm';
import { FinishForm } from './sections/FinishForm';
import { DownloadPage } from './sections/DownloadPage';
import { CVPreview } from './components/CVPreview';
import { ProgressBar } from './components/ProgressBar';
import { ConfirmationModal } from './components/ConfirmationModal';
import { WarningModal } from './components/WarningModal';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useCVStorage } from './hooks/useCVStorage';
import { useHistory } from './hooks/useHistory';
import { useToast } from './hooks/useToast';
import { useGlobalShortcuts } from './hooks/useKeyboardShortcuts';
import type { CVData, CVSettings, Step, Experience, Education, Skill } from './types/cv';
import './App.css';

const initialCVData: CVData = {
  contact: {
    firstName: '',
    lastName: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    nationality: '',
    birthDate: '',
    country: '',
    address: '',
    jobTitle: '',
    visaStatus: '',
    maritalStatus: '',
    drivingLicense: '',
    linkedin: '',
    portfolio: '',
    github: '',
  },
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  profile: '',
  socialLinks: [],
  interests: [],
  references: [],
  internships: [],
  publications: [],
  extracurricular: [],
};

const initialSettings: CVSettings = {
  template: 'budapest',
  primaryColor: '#1a1a1a',
  titleFont: 'Bebas Neue',
  bodyFont: 'Lato',
  language: 'fr',
  showSkillLevels: true,
  showSkillsAsTags: false,
};

const steps: Exclude<Step, 'landing' | 'download'>[] = ['contact', 'experience', 'education', 'skills', 'profile', 'finish'];

function App() {
  const {
    cvData,
    setCVData,
    settings,
    setSettings,
    currentStep,
    setCurrentStep,
    exportData,
    importData,
    resetData,
  } = useCVStorage(initialCVData, initialSettings, 'landing');

  const { setState: setHistoryState, undo, redo, canUndo, canRedo } = useHistory(cvData);
  const { toasts, removeToast, success, error, info } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalState, setModalState] = useState<{
    type: 'delete' | 'warning' | 'reset' | null;
    data?: any;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ type: null });
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcuts
  useGlobalShortcuts(undo, redo, canUndo, canRedo);

  const updateCVData = useCallback((updater: (prev: CVData) => CVData) => {
    setCVData(updater);
    setHistoryState(updater);
  }, [setCVData, setHistoryState]);

  const updateContact = useCallback((field: keyof typeof cvData.contact, value: string) => {
    updateCVData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [updateCVData, errors]);

  const addExperience = useCallback((experience: Experience) => {
    updateCVData(prev => ({
      ...prev,
      experiences: [...prev.experiences, experience]
    }));
    success('Expérience ajoutée avec succès');
  }, [updateCVData, success]);

  const updateExperience = useCallback((id: string, experience: Partial<Experience>) => {
    updateCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }));
  }, [updateCVData]);

  const deleteExperience = useCallback((id: string) => {
    setModalState({
      type: 'delete',
      message: 'Êtes-vous sûr de vouloir supprimer cette expérience ?',
      onConfirm: () => {
        updateCVData(prev => ({
          ...prev,
          experiences: prev.experiences.filter(exp => exp.id !== id)
        }));
        setModalState({ type: null });
        info('Expérience supprimée');
      },
      onCancel: () => setModalState({ type: null })
    });
  }, [updateCVData, info]);

  const reorderExperiences = useCallback((experiences: Experience[]) => {
    updateCVData(prev => ({ ...prev, experiences }));
  }, [updateCVData]);

  const addEducation = useCallback((education: Education) => {
    updateCVData(prev => ({
      ...prev,
      educations: [...prev.educations, education]
    }));
    success('Formation ajoutée avec succès');
  }, [updateCVData, success]);

  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    updateCVData(prev => ({
      ...prev,
      educations: prev.educations.map(edu => 
        edu.id === id ? { ...edu, ...education } : edu
      )
    }));
  }, [updateCVData]);

  const deleteEducation = useCallback((id: string) => {
    setModalState({
      type: 'delete',
      message: 'Êtes-vous sûr de vouloir supprimer cette formation ?',
      onConfirm: () => {
        updateCVData(prev => ({
          ...prev,
          educations: prev.educations.filter(edu => edu.id !== id)
        }));
        setModalState({ type: null });
        info('Formation supprimée');
      },
      onCancel: () => setModalState({ type: null })
    });
  }, [updateCVData, info]);

  const reorderEducations = useCallback((educations: Education[]) => {
    updateCVData(prev => ({ ...prev, educations }));
  }, [updateCVData]);

  const addSkill = useCallback((skill: Skill) => {
    updateCVData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    success('Compétence ajoutée avec succès');
  }, [updateCVData, success]);

  const updateSkill = useCallback((id: string, skill: Partial<Skill>) => {
    updateCVData(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.id === id ? { ...s, ...skill } : s
      )
    }));
  }, [updateCVData]);

  const deleteSkill = useCallback((id: string) => {
    updateCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
    info('Compétence supprimée');
  }, [updateCVData, info]);

  const reorderSkills = useCallback((skills: Skill[]) => {
    updateCVData(prev => ({ ...prev, skills }));
  }, [updateCVData]);

  const updateProfile = useCallback((profile: string) => {
    updateCVData(prev => ({ ...prev, profile }));
  }, [updateCVData]);

  const updatePhoto = useCallback((photo: string | undefined) => {
    updateCVData(prev => ({
      ...prev,
      contact: { ...prev.contact, photo }
    }));
  }, [updateCVData]);

  const validateContact = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!cvData.contact.firstName.trim()) {
      newErrors.firstName = 'Ce champ est requis';
    }
    if (!cvData.contact.lastName.trim()) {
      newErrors.lastName = 'Ce champ est requis';
    }
    if (!cvData.contact.email.trim()) {
      newErrors.email = 'Veuillez saisir votre adresse e-mail';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.contact.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 'contact') {
      if (!validateContact()) {
        error('Veuillez corriger les erreurs avant de continuer');
        return;
      }
    }
    
    const currentIndex = steps.indexOf(currentStep as Exclude<Step, 'landing' | 'download'>);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      success(`Étape ${steps[currentIndex + 1]} atteinte`);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep as Exclude<Step, 'landing' | 'download'>);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSkipExperience = () => {
    setModalState({
      type: 'warning',
      message: 'Il semblerait que vous n\'avez pas indiqué une précédente expérience de travail. Nous vous recommandons de mentionner au moins votre dernier emploi et l\'entreprise.',
      onConfirm: () => {
        setModalState({ type: null });
        handleNext();
      },
      onCancel: () => setModalState({ type: null })
    });
  };

  const handleSkipEducation = () => {
    setModalState({
      type: 'warning',
      message: 'Il semblerait que vous n\'avez pas indiqué de renseignements concernant vos études. Nous vous recommandons d\'indiquer au moins le dernier diplôme et le niveau auquel vous avez été formé.',
      onConfirm: () => {
        setModalState({ type: null });
        handleNext();
      },
      onCancel: () => setModalState({ type: null })
    });
  };

  const handleSkipProfile = () => {
    setModalState({
      type: 'warning',
      message: 'Il semblerait que vous n\'avez pas rempli la partie Profil professionnel.',
      onConfirm: () => {
        setModalState({ type: null });
        handleNext();
      },
      onCancel: () => setModalState({ type: null })
    });
  };

  const handleReset = () => {
    setModalState({
      type: 'reset',
      message: 'Êtes-vous sûr de vouloir réinitialiser votre CV ? Toutes vos données seront perdues.',
      onConfirm: () => {
        resetData();
        setModalState({ type: null });
        success('CV réinitialisé avec succès');
      },
      onCancel: () => setModalState({ type: null })
    });
  };

  const handleExport = () => {
    exportData();
    success('Données exportées avec succès');
  };

  const handleImport = async (file: File) => {
    try {
      await importData(file);
      success('Données importées avec succès');
    } catch (err) {
      error('Erreur lors de l\'importation des données');
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage 
            onCreateNew={() => setCurrentStep('contact')} 
            onExistingCV={() => setCurrentStep('contact')}
            onImport={handleImport}
          />
        );
      case 'contact':
        return (
          <ContactForm
            contact={cvData.contact}
            updateContact={updateContact}
            errors={errors}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            onNext={handleNext}
            onPhotoChange={updatePhoto}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            experiences={cvData.experiences}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onDelete={deleteExperience}
            onReorder={reorderExperiences}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkipExperience}
          />
        );
      case 'education':
        return (
          <EducationForm
            educations={cvData.educations}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onDelete={deleteEducation}
            onReorder={reorderEducations}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkipEducation}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            skills={cvData.skills}
            settings={settings}
            setSettings={setSettings}
            onAdd={addSkill}
            onUpdate={updateSkill}
            onDelete={deleteSkill}
            onReorder={reorderSkills}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'profile':
        return (
          <ProfileForm
            profile={cvData.profile}
            onUpdate={updateProfile}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkipProfile}
          />
        );
      case 'finish':
        return (
          <FinishForm
            cvData={cvData}
            settings={settings}
            setSettings={setSettings}
            updateContact={updateContact}
            onNext={() => setCurrentStep('download')}
            onBack={handleBack}
            onReset={handleReset}
            onExport={handleExport}
          />
        );
      case 'download':
        return (
          <DownloadPage
            cvData={cvData}
            settings={settings}
            setSettings={setSettings}
          />
        );
      default:
        return null;
    }
  };

  const showPreview = currentStep !== 'landing' && currentStep !== 'download';
  const showProgress = currentStep !== 'landing' && currentStep !== 'download';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f5f5f7]">
        {showProgress && (
          <ProgressBar 
            steps={steps} 
            currentStep={currentStep as Exclude<Step, 'landing' | 'download'>} 
          />
        )}
        
        <div className={`${showPreview ? 'flex flex-col lg:flex-row' : ''} min-h-screen`}>
          <div className={`${showPreview ? 'w-full lg:w-1/2' : 'w-full'} p-4 lg:p-8 overflow-y-auto`}>
            {renderContent()}
          </div>
          
          {showPreview && (
            <div className="hidden lg:flex w-1/2 bg-gray-200 p-8 items-center justify-center sticky top-0 h-screen">
              <div ref={previewRef}>
                <CVPreview cvData={cvData} settings={settings} />
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {modalState.type === 'delete' && (
          <ConfirmationModal
            message={modalState.message || ''}
            onConfirm={modalState.onConfirm || (() => {})}
            onCancel={modalState.onCancel || (() => {})}
          />
        )}

        {modalState.type === 'warning' && (
          <WarningModal
            message={modalState.message || ''}
            onConfirm={modalState.onConfirm || (() => {})}
            onCancel={modalState.onCancel || (() => {})}
            confirmText="Je n'ai pas d'expérience professionnelle"
            cancelText="Ok"
          />
        )}

        {modalState.type === 'reset' && (
          <ConfirmationModal
            message={modalState.message || ''}
            onConfirm={modalState.onConfirm || (() => {})}
            onCancel={modalState.onCancel || (() => {})}
          />
        )}

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
