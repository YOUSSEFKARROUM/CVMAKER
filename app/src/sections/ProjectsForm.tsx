import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Folder, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SortableList } from '../components/SortableList';
import type { Project } from '../types/cv';

interface ProjectsFormProps {
  projects: Project[];
  onAdd: (project: Project) => void;
  onUpdate: (id: string, project: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onReorder: (projects: Project[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const emptyProject: Project = {
  id: '',
  name: '',
  description: '',
  link: '',
  technologies: [],
};

const commonTechnologies = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Bootstrap',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Adobe XD',
  'WordPress', 'Shopify', 'Next.js', 'Gatsby', 'Express.js',
  'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
];

export function ProjectsForm({
  projects,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onNext,
  onBack,
  onSkip,
}: ProjectsFormProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');

  const handleAdd = () => {
    const id = crypto.randomUUID();
    setNewProject({ ...emptyProject, id });
    setTechInput('');
    setExpandedId(id);
  };

  const handleSave = () => {
    if (newProject && newProject.name.trim()) {
      onAdd(newProject);
      setNewProject(null);
      setExpandedId(null);
      setTechInput('');
    }
  };

  const handleCancel = () => {
    setNewProject(null);
    setExpandedId(null);
    setTechInput('');
  };

  const handleNext = () => {
    if (projects.length === 0) {
      onSkip();
    } else {
      onNext();
    }
  };

  const addTechnology = (tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    
    const currentTechs = newProject?.technologies || [];
    if (!currentTechs.includes(trimmed)) {
      const updated = [...currentTechs, trimmed];
      if (newProject) {
        setNewProject({ ...newProject, technologies: updated });
      }
    }
    setTechInput('');
  };

  const removeTechnology = (techToRemove: string, project: Project, isNew: boolean) => {
    const updated = project.technologies.filter(t => t !== techToRemove);
    if (isNew) {
      setNewProject({ ...project, technologies: updated });
    } else {
      onUpdate(project.id, { technologies: updated });
    }
  };

  const addTechToExisting = (project: Project) => {
    if (!techInput.trim()) return;
    if (!project.technologies.includes(techInput.trim())) {
      onUpdate(project.id, { 
        technologies: [...project.technologies, techInput.trim()] 
      });
    }
    setTechInput('');
  };

  const renderProjectForm = (proj: Project, isNew: boolean) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Folder className="w-5 h-5 text-[#2196F3]" />
          <div>
            <p className="font-medium">{proj.name || t('projects.newProject')}</p>
            {proj.name && proj.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {proj.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {tech}
                  </span>
                ))}
                {proj.technologies.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    +{proj.technologies.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isNew ? handleCancel() : onDelete(proj.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${expandedId === proj.id ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {expandedId === proj.id && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase text-gray-500">{t('projects.name')}</Label>
            <Input
              value={proj.name}
              onChange={(e) => isNew
                ? setNewProject({ ...proj, name: e.target.value })
                : onUpdate(proj.id, { name: e.target.value })
              }
              placeholder={t('projects.namePlaceholder')}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">{t('projects.description')}</Label>
            <textarea
              value={proj.description}
              onChange={(e) => isNew
                ? setNewProject({ ...proj, description: e.target.value })
                : onUpdate(proj.id, { description: e.target.value })
              }
              placeholder={t('projects.descriptionPlaceholder')}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md min-h-[100px] resize-none"
            />
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">{t('projects.link')}</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={proj.link || ''}
                onChange={(e) => isNew
                  ? setNewProject({ ...proj, link: e.target.value })
                  : onUpdate(proj.id, { link: e.target.value })
                }
                placeholder="https://..."
                className="mt-1 pl-10"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase text-gray-500">{t('projects.technologies')}</Label>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {proj.technologies.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech, proj, isNew)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (isNew) {
                        addTechnology(techInput);
                      } else {
                        addTechToExisting(proj);
                      }
                    }
                  }}
                  placeholder={t('projects.technologiesPlaceholder')}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {commonTechnologies
                  .filter(tech => 
                    tech.toLowerCase().includes(techInput.toLowerCase()) && 
                    techInput.length > 0 &&
                    !proj.technologies.includes(tech)
                  )
                  .slice(0, 5)
                  .map((tech) => (
                    <button
                      key={tech}
                      onClick={() => {
                        if (isNew) {
                          addTechnology(tech);
                        } else {
                          onUpdate(proj.id, { 
                            technologies: [...proj.technologies, tech] 
                          });
                          setTechInput('');
                        }
                      }}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      + {tech}
                    </button>
                  ))}
              </div>
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
        <span className="text-[#2196F3]">{t('projects.titleHighlight')}</span> {t('projects.title')}
      </h2>
      <p className="text-gray-500 mb-8">
        {t('projects.subtitle')}
      </p>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-[#2196F3] font-medium mb-4 hover:underline"
      >
        <Plus className="w-5 h-5" />
        {t('projects.add')}
      </button>

      {newProject && renderProjectForm(newProject, true)}

      {projects.length > 0 && (
        <SortableList
          items={projects}
          onReorder={onReorder}
          renderItem={(proj) => renderProjectForm(proj, false)}
        />
      )}

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>{t('projects.tipTitle')}</strong> {t('projects.tipText')}
        </p>
      </div>

      <div className="flex justify-between mt-8">
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
          {t('projects.nextStep')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
