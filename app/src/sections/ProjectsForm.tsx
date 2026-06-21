import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Plus, Trash2, ChevronUp, Folder, Link as LinkIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { SortableList } from '../components/SortableList';
import { fadeInUp, staggerContainer } from '../styles/design-system';
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

const emptyProject: Project = { id: '', name: '', description: '', link: '', technologies: [] };

const commonTechnologies = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Bootstrap',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Adobe XD',
  'WordPress', 'Shopify', 'Next.js', 'Gatsby', 'Express.js',
  'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
];

const labelCls = 'block text-xs font-medium uppercase tracking-wider text-muted-foreground';

export function ProjectsForm({
  projects, onAdd, onUpdate, onDelete, onReorder, onNext, onBack, onSkip,
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
    if (projects.length === 0) { onSkip(); } else { onNext(); }
  };

  const addTechnology = (tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    const currentTechs = newProject?.technologies || [];
    if (!currentTechs.includes(trimmed)) {
      setNewProject(prev => prev ? { ...prev, technologies: [...currentTechs, trimmed] } : prev);
    }
    setTechInput('');
  };

  const removeTechnology = (techToRemove: string, project: Project, isNew: boolean) => {
    const updated = project.technologies.filter(t => t !== techToRemove);
    if (isNew) { setNewProject({ ...project, technologies: updated }); }
    else { onUpdate(project.id, { technologies: updated }); }
  };

  const addTechToExisting = (project: Project) => {
    if (!techInput.trim() || project.technologies.includes(techInput.trim())) return;
    onUpdate(project.id, { technologies: [...project.technologies, techInput.trim()] });
    setTechInput('');
  };

  const renderProjectForm = (proj: Project, isNew: boolean) => (
    <Card variant="compact" hover className="mb-3 cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Folder className="w-4 h-4 text-blue" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {proj.name || t('projects.newProject')}
            </p>
            {proj.name && proj.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {proj.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="text-xs px-1.5 py-0.5 bg-blue/10 text-blue rounded">
                    {tech}
                  </span>
                ))}
                {proj.technologies.length > 3 && (
                  <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                    +{proj.technologies.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => isNew ? handleCancel() : onDelete(proj.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expandedId === proj.id ? '' : 'rotate-180'}`} />
          </Button>
        </div>
      </div>

      {expandedId === proj.id && (
        <div className="space-y-4 pt-3 border-t border-border">
          <FormField label={t('projects.name')}>
            <Input
              value={proj.name}
              onChange={e => isNew
                ? setNewProject({ ...proj, name: e.target.value })
                : onUpdate(proj.id, { name: e.target.value })}
              placeholder={t('projects.namePlaceholder')}
            />
          </FormField>

          <div>
            <p className={labelCls}>{t('projects.description')}</p>
            <textarea
              value={proj.description}
              onChange={e => isNew
                ? setNewProject({ ...proj, description: e.target.value })
                : onUpdate(proj.id, { description: e.target.value })}
              placeholder={t('projects.descriptionPlaceholder')}
              className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-lg bg-transparent text-foreground min-h-[90px] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 placeholder:text-muted-foreground/60"
            />
          </div>

          <div>
            <p className={labelCls}>{t('projects.link')}</p>
            <div className="relative mt-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={proj.link || ''}
                onChange={e => isNew
                  ? setNewProject({ ...proj, link: e.target.value })
                  : onUpdate(proj.id, { link: e.target.value })}
                placeholder="https://..."
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <p className={labelCls}>{t('projects.technologies')}</p>
            <div className="mt-2">
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {proj.technologies.map((tech, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted border border-border rounded-md text-sm text-foreground">
                      {tech}
                      <button
                        onClick={() => removeTechnology(tech, proj, isNew)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <Input
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isNew) { addTechnology(techInput); }
                    else { addTechToExisting(proj); }
                  }
                }}
                placeholder={t('projects.technologiesPlaceholder')}
              />
              {techInput && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonTechnologies
                    .filter(tech =>
                      tech.toLowerCase().includes(techInput.toLowerCase()) &&
                      !proj.technologies.includes(tech))
                    .slice(0, 5)
                    .map(tech => (
                      <button
                        key={tech}
                        onClick={() => {
                          if (isNew) { addTechnology(tech); }
                          else {
                            onUpdate(proj.id, { technologies: [...proj.technologies, tech] });
                            setTechInput('');
                          }
                        }}
                        className="text-xs px-2 py-1 bg-blue/8 text-blue rounded-md hover:bg-blue/15 transition-colors"
                      >
                        + {tech}
                      </button>
                    ))}
                </div>
              )}
            </div>
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
        <span className="text-blue">{t('projects.titleHighlight')}</span>{' '}
        {t('projects.title')}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{t('projects.subtitle')}</p>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Button variant="outline" size="sm" onClick={handleAdd} className="mb-4">
          <Plus className="w-4 h-4" />
          {t('projects.add')}
        </Button>

        <AnimatePresence mode="wait">
          {newProject && (
            <motion.div key="new" variants={fadeInUp}>
              {renderProjectForm(newProject, true)}
            </motion.div>
          )}
        </AnimatePresence>

        {projects.length === 0 && !newProject && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border mb-6"
          >
            <Folder className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{t('projects.emptyState')}</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> {t('projects.add')}
            </Button>
          </motion.div>
        )}

        {projects.length > 0 && (
          <SortableList items={projects} onReorder={onReorder}
            renderItem={proj => renderProjectForm(proj, false)} />
        )}
      </motion.div>

      <div className="mt-6 mb-8 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{t('projects.tipTitle')}</span>{' '}
          {t('projects.tipText')}
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
        </Button>
        <Button variant="blue" onClick={handleNext}>
          {t('projects.nextStep')} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
