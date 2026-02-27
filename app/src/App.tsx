import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingPage } from './sections/LandingPage';
import { ContactForm } from './sections/ContactForm';
import { ExperienceForm } from './sections/ExperienceForm';
import { EducationForm } from './sections/EducationForm';
import { SkillsForm } from './sections/SkillsForm';
import { LanguagesForm } from './sections/LanguagesForm';
import { CertificationsForm } from './sections/CertificationsForm';
import { ProjectsForm } from './sections/ProjectsForm';
import { InterestsForm } from './sections/InterestsForm';
import { ProfileForm } from './sections/ProfileForm';
import { FinishForm } from './sections/FinishForm';
import { DownloadPage } from './sections/DownloadPage';
import { CVPreview } from './components/CVPreview';
import { ProgressBar } from './components/ProgressBar';
import { ConfirmationModal } from './components/ConfirmationModal';
import { WarningModal } from './components/WarningModal';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthModal } from './components/AuthModal';
import { ZenMode } from './components/ZenMode';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { VerticalStepper } from './components/VerticalStepper';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';
import { PageTransition, StaggerContainer, StaggerItem } from './components/PageTransition';
import { MobilePreviewToggle, DesktopPreviewToggle } from './components/MobilePreviewToggle';
import { FloatingActions, CompactActions } from './components/FloatingActions';
import { useAuth } from './hooks/useAuth';
import { useCVStorage } from './hooks/useCVStorage';
import { useHistory } from './hooks/useHistory';
import { useToast } from './hooks/useToast';
import { useAutoSave } from './hooks/useAutoSave';
import { useGlobalShortcuts } from './hooks/useKeyboardShortcuts';
import type { CVData, CVSettings, Step, Experience, Education, Skill, Language, Certification, Project } from './types/cv';
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

const steps: Exclude<Step, 'landing' | 'download'>[] = ['contact', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects', 'interests', 'profile', 'finish'];

function App() {
  // IMPORTANT: useAuth doit être appelé avant useCVStorage car il fournit user
  const { isAuthenticated, user } = useAuth();
  
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
  } = useCVStorage(initialCVData, initialSettings, 'landing', user?.uid);

  const { setState: setHistoryState, undo, redo, canUndo, canRedo } = useHistory(cvData);
  const { toasts, removeToast, success, error, info } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalState, setModalState] = useState<{
    type: 'delete' | 'warning' | 'reset' | null;
    data?: any;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ type: null });
  const [isZenMode, setIsZenMode] = useState(false);
  const [showPreviewDesktop, setShowPreviewDesktop] = useState(true);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Rediriger vers le formulaire CV après authentification
  useEffect(() => {
    if (isAuthenticated && currentStep === 'landing') {
      setCurrentStep('contact');
    }
  }, [isAuthenticated, currentStep]);

  // Auto-save
  const { isSaving, lastSaved, versions } = useAutoSave(cvData, {
    key: 'cv-maker-autosave',
    interval: 5000,
    onSave: () => {
      // Silencieux
    },
  });

  // Keyboard shortcuts
  useGlobalShortcuts(undo, redo, canUndo, canRedo);

  // Gestion de la langue
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const currentI18nLang = i18n.language;
    const settingsLang = settings.language;
    
    if (settingsLang && settingsLang !== currentI18nLang) {
      i18n.changeLanguage(settingsLang);
    } else if (!settingsLang && currentI18nLang) {
      setSettings({ ...settings, language: currentI18nLang });
    }
  }, []);
  
  useEffect(() => {
    if (i18n.language !== settings.language) {
      setSettings({ ...settings, language: i18n.language });
    }
  }, [i18n.language]);

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

  // Languages
  const addLanguage = useCallback((language: Language) => {
    updateCVData(prev => ({
      ...prev,
      languages: [...prev.languages, language]
    }));
    success('Langue ajoutée avec succès');
  }, [updateCVData, success]);

  const updateLanguage = useCallback((id: string, language: Partial<Language>) => {
    updateCVData(prev => ({
      ...prev,
      languages: prev.languages.map(l => 
        l.id === id ? { ...l, ...language } : l
      )
    }));
  }, [updateCVData]);

  const deleteLanguage = useCallback((id: string) => {
    setModalState({
      type: 'delete',
      message: 'Êtes-vous sûr de vouloir supprimer cette langue ?',
      onConfirm: () => {
        updateCVData(prev => ({
          ...prev,
          languages: prev.languages.filter(l => l.id !== id)
        }));
        setModalState({ type: null });
        info('Langue supprimée');
      },
      onCancel: () => setModalState({ type: null })
    });
  }, [updateCVData, info]);

  const reorderLanguages = useCallback((languages: Language[]) => {
    updateCVData(prev => ({ ...prev, languages }));
  }, [updateCVData]);

  // Certifications
  const addCertification = useCallback((certification: Certification) => {
    updateCVData(prev => ({
      ...prev,
      certifications: [...prev.certifications, certification]
    }));
    success('Certification ajoutée avec succès');
  }, [updateCVData, success]);

  const updateCertification = useCallback((id: string, certification: Partial<Certification>) => {
    updateCVData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => 
        c.id === id ? { ...c, ...certification } : c
      )
    }));
  }, [updateCVData]);

  const deleteCertification = useCallback((id: string) => {
    setModalState({
      type: 'delete',
      message: 'Êtes-vous sûr de vouloir supprimer cette certification ?',
      onConfirm: () => {
        updateCVData(prev => ({
          ...prev,
          certifications: prev.certifications.filter(c => c.id !== id)
        }));
        setModalState({ type: null });
        info('Certification supprimée');
      },
      onCancel: () => setModalState({ type: null })
    });
  }, [updateCVData, info]);

  const reorderCertifications = useCallback((certifications: Certification[]) => {
    updateCVData(prev => ({ ...prev, certifications }));
  }, [updateCVData]);

  // Projects
  const addProject = useCallback((project: Project) => {
    updateCVData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
    success('Projet ajouté avec succès');
  }, [updateCVData, success]);

  const updateProject = useCallback((id: string, project: Partial<Project>) => {
    updateCVData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === id ? { ...p, ...project } : p
      )
    }));
  }, [updateCVData]);

  const deleteProject = useCallback((id: string) => {
    setModalState({
      type: 'delete',
      message: 'Êtes-vous sûr de vouloir supprimer ce projet ?',
      onConfirm: () => {
        updateCVData(prev => ({
          ...prev,
          projects: prev.projects.filter(p => p.id !== id)
        }));
        setModalState({ type: null });
        info('Projet supprimé');
      },
      onCancel: () => setModalState({ type: null })
    });
  }, [updateCVData, info]);

  const reorderProjects = useCallback((projects: Project[]) => {
    updateCVData(prev => ({ ...prev, projects }));
  }, [updateCVData]);

  const updateInterests = useCallback((interests: string[]) => {
    updateCVData(prev => ({ ...prev, interests }));
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

  // Calculer les étapes complétées
  const completedSteps = useMemo(() => {
    const completed = new Set<string>();
    if (cvData.contact.firstName && cvData.contact.lastName) completed.add('contact');
    if (cvData.experiences.length > 0) completed.add('experience');
    if (cvData.educations.length > 0) completed.add('education');
    if (cvData.skills.length > 0) completed.add('skills');
    if (cvData.languages.length > 0) completed.add('languages');
    if (cvData.certifications.length > 0) completed.add('certifications');
    if (cvData.projects.length > 0) completed.add('projects');
    if (cvData.interests.length > 0) completed.add('interests');
    if (cvData.profile && cvData.profile.length > 50) completed.add('profile');
    return completed;
  }, [cvData]);

  // Données pour le stepper
  const stepData = useMemo(() => {
    const data: Record<string, { isFilled: boolean; summary?: string }> = {};
    
    data.contact = {
      isFilled: !!(cvData.contact.firstName || cvData.contact.lastName),
      summary: cvData.contact.firstName 
        ? `${cvData.contact.firstName} ${cvData.contact.lastName}`.trim() 
        : undefined,
    };
    
    data.experience = {
      isFilled: cvData.experiences.length > 0,
      summary: cvData.experiences.length > 0 
        ? `${cvData.experiences.length} expérience${cvData.experiences.length > 1 ? 's' : ''}`
        : undefined,
    };
    
    data.education = {
      isFilled: cvData.educations.length > 0,
      summary: cvData.educations.length > 0
        ? `${cvData.educations.length} formation${cvData.educations.length > 1 ? 's' : ''}`
        : undefined,
    };
    
    data.skills = {
      isFilled: cvData.skills.length > 0,
      summary: cvData.skills.length > 0
        ? `${cvData.skills.length} compétence${cvData.skills.length > 1 ? 's' : ''}`
        : undefined,
    };
    
    data.languages = {
      isFilled: cvData.languages.length > 0,
      summary: cvData.languages.length > 0
        ? `${cvData.languages.length} langue${cvData.languages.length > 1 ? 's' : ''}`
        : undefined,
    };
    
    data.certifications = {
      isFilled: cvData.certifications.length > 0,
      summary: cvData.certifications.length > 0
        ? `${cvData.certifications.length} certif.`
        : undefined,
    };
    
    data.projects = {
      isFilled: cvData.projects.length > 0,
      summary: cvData.projects.length > 0
        ? `${cvData.projects.length} projet${cvData.projects.length > 1 ? 's' : ''}`
        : undefined,
    };
    
    data.interests = {
      isFilled: cvData.interests.length > 0,
      summary: cvData.interests.length > 0
        ? `${cvData.interests.length} intérêt${cvData.interests.length > 1 ? 's' : ''}`
        : undefined,
    };
    
    data.profile = {
      isFilled: !!(cvData.profile && cvData.profile.length > 50),
      summary: cvData.profile && cvData.profile.length > 50
        ? `${cvData.profile.slice(0, 30)}...`
        : undefined,
    };
    
    data.finish = {
      isFilled: completedSteps.size >= 8,
    };

    return data;
  }, [cvData, completedSteps]);

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

  const goToLanding = () => {
    resetData();
    setCurrentStep('landing');
    success('Retour à l\'accueil');
  };

  const handleExport = () => {
    exportData();
    success('Données exportées avec succès');
  };

  const handleEditCV = useCallback((_cvId: string, loadedCvData: CVData, loadedSettings: CVSettings) => {
    setCVData(loadedCvData);
    setSettings(loadedSettings);
    setCurrentStep('contact');
    success('CV chargé en mode édition');
  }, [setCVData, setSettings, setCurrentStep, success]);

  const handleImport = async (file: File) => {
    try {
      await importData(file);
      success('Données importées avec succès');
    } catch (err) {
      error('Erreur lors de l\'importation des données');
    }
  };

  // Navigation Zen Mode
  const handleZenNavigation = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = steps.indexOf(currentStep as Exclude<Step, 'landing' | 'download'>);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const renderContent = () => {
    if (!isAuthenticated && currentStep !== 'landing') {
      setCurrentStep('landing');
      return null;
    }

    const content = (() => {
      switch (currentStep) {
        case 'landing':
          return (
            <LandingPage 
              onCreateNew={() => {
                if (isAuthenticated) {
                  setCurrentStep('contact');
                } else {
                  setShowAuthModal(true);
                }
              }} 
              onExistingCV={() => {
                if (isAuthenticated) {
                  setCurrentStep('contact');
                } else {
                  setShowAuthModal(true);
                }
              }}
              onImport={handleImport}
              isAuthenticated={isAuthenticated}
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
        case 'languages':
          return (
            <LanguagesForm
              languages={cvData.languages}
              onAdd={addLanguage}
              onUpdate={updateLanguage}
              onDelete={deleteLanguage}
              onReorder={reorderLanguages}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 'certifications':
          return (
            <CertificationsForm
              certifications={cvData.certifications}
              onAdd={addCertification}
              onUpdate={updateCertification}
              onDelete={deleteCertification}
              onReorder={reorderCertifications}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleNext}
            />
          );
        case 'projects':
          return (
            <ProjectsForm
              projects={cvData.projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
              onReorder={reorderProjects}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleNext}
            />
          );
        case 'interests':
          return (
            <InterestsForm
              interests={cvData.interests}
              onUpdate={updateInterests}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleNext}
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
              onHomeClick={goToLanding}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <PageTransition
        isActive={true}
        type="slideUp"
        key={currentStep}
      >
        {content}
      </PageTransition>
    );
  };

  const showPreview = currentStep !== 'landing' && currentStep !== 'download';
  const showProgress = currentStep !== 'landing' && currentStep !== 'download';

  // Sidebar avec VerticalStepper
  const sidebar = showProgress ? (
    <VerticalStepper
      steps={steps}
      currentStep={currentStep as Exclude<Step, 'landing' | 'download'>}
      completedSteps={completedSteps}
      onStepClick={(step) => setCurrentStep(step)}
      stepData={stepData}
    />
  ) : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {showProgress && (
          <ProgressBar 
            steps={steps} 
            currentStep={currentStep as Exclude<Step, 'landing' | 'download'>}
            cvData={cvData}
            settings={settings}
            setSettings={setSettings}
            onLoadCV={({ cvData: loadedCvData, settings: loadedSettings }) => {
              setCVData(loadedCvData);
              setSettings(loadedSettings);
            }}
            onEditCV={handleEditCV}
            onCreateNew={goToLanding}
            onHomeClick={() => {
              const hasData = cvData.contact.firstName || 
                              cvData.contact.lastName || 
                              cvData.experiences.length > 0 ||
                              cvData.educations.length > 0;
              
              if (hasData) {
                setModalState({
                  type: 'warning',
                  message: 'Êtes-vous sûr de vouloir retourner à l\'accueil ? Vos données non sauvegardées seront perdues.',
                  onConfirm: () => {
                    goToLanding();
                    setModalState({ type: null });
                  },
                  onCancel: () => setModalState({ type: null })
                });
              } else {
                goToLanding();
              }
            }}
          />
        )}
        
        {/* Layout principal */}
        <div className="flex min-h-[calc(100vh-64px)]">
          {/* Sidebar VerticalStepper - visible sur lg et plus */}
          {sidebar && (
            <div className="hidden lg:block flex-shrink-0">
              {sidebar}
            </div>
          )}
          
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
            {/* Formulaire */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${showPreview && showPreviewDesktop ? 'xl:w-1/2' : 'w-full'}`}>
              {showProgress && (
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <AutoSaveIndicator
                    lastSaved={lastSaved}
                    isSaving={isSaving}
                    isCloudEnabled={false}
                    versions={versions}
                  />
                  <div className="flex items-center gap-2">
                    <CompactActions
                      onUndo={undo}
                      onRedo={redo}
                      canUndo={canUndo}
                      canRedo={canRedo}
                    />
                    {showPreview && (
                      <DesktopPreviewToggle
                        isVisible={showPreviewDesktop}
                        onToggle={() => setShowPreviewDesktop(!showPreviewDesktop)}
                      />
                    )}
                  </div>
                </div>
              )}
              
              <StaggerContainer>
                <StaggerItem>
                  {renderContent()}
                </StaggerItem>
              </StaggerContainer>
            </div>
            
            {/* Preview desktop */}
            {showPreview && showPreviewDesktop && (
              <div className="hidden xl:flex xl:w-1/2 bg-slate-50 dark:bg-slate-900/50 items-start justify-center sticky top-0 h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div ref={previewRef} className="transform scale-[0.55] sm:scale-[0.6] origin-top">
                  <CVPreview cvData={cvData} settings={settings} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Preview Toggle */}
        {showPreview && (
          <MobilePreviewToggle
            preview={<CVPreview cvData={cvData} settings={settings} />}
            isVisible={true}
            onToggle={() => {}}
          />
        )}

        {/* Zen Mode */}
        <ZenMode
          isActive={isZenMode}
          onToggle={() => setIsZenMode(!isZenMode)}
          currentStep={currentStep}
          onStepChange={handleZenNavigation}
          hasNext={steps.indexOf(currentStep as Exclude<Step, 'landing' | 'download'>) < steps.length - 1}
          hasPrev={steps.indexOf(currentStep as Exclude<Step, 'landing' | 'download'>) > 0}
          preview={<CVPreview cvData={cvData} settings={settings} />}
        >
          {renderContent()}
        </ZenMode>

        {/* Floating Actions */}
        <FloatingActions
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onExport={handleExport}
          onReset={handleReset}
        />

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp />

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

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setCurrentStep('contact');
          }}
        />

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
