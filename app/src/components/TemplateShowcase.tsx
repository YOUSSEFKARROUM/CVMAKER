import { memo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTemplateComponent, getAllTemplates } from './templates';
import { TEMPLATE_SAMPLE_MAP, TEMPLATE_SETTINGS } from '../data/sampleCVData';
import { Button } from './ui/button';
import { fadeInUp } from '../styles/design-system';
import type { CVSettings } from '../types/cv';

interface Props {
  onSelectTemplate?: (templateId: string) => void;
  maxVisible?: number;
}

const TemplatePreviewCard = memo(
  ({
    templateId,
    templateName,
    onSelect,
  }: {
    templateId: string;
    templateName: string;
    onSelect?: (id: string) => void;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scale, setScale] = useState(0.32);

    useEffect(() => {
      const el = cardRef.current;
      if (!el) return;

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setIsVisible(true);
        },
        { rootMargin: '200px' },
      );

      const ro = new ResizeObserver(([entry]) => {
        setScale(entry.contentRect.width / 794);
      });

      io.observe(el);
      ro.observe(el);
      return () => {
        io.disconnect();
        ro.disconnect();
      };
    }, []);

    const TemplateComponent = getTemplateComponent(templateId);
    const cvData = TEMPLATE_SAMPLE_MAP[templateId] ?? TEMPLATE_SAMPLE_MAP['budapest'];
    const settings: CVSettings = {
      template: templateId,
      primaryColor: TEMPLATE_SETTINGS[templateId]?.primaryColor ?? '#1a1a1a',
      titleFont: 'Bebas Neue',
      bodyFont: 'Lato',
      language: 'fr',
      showSkillLevels: true,
      showSkillsAsTags: false,
      pageMode: 'auto-fit',
    };

    return (
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="group cursor-pointer"
        onClick={() => onSelect?.(templateId)}
      >
        <div
          ref={cardRef}
          className="relative aspect-[210/297] rounded-xl overflow-hidden border border-white/10 group-hover:border-blue/40 shadow-sm group-hover:shadow-xl bg-white transition-all duration-300"
        >
          {isVisible ? (
            <div
              className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
              style={{
                width: '794px',
                height: '1123px',
                transform: `scale(${scale})`,
              }}
            >
              <TemplateComponent cvData={cvData} settings={settings} />
            </div>
          ) : (
            <div className="absolute inset-0 bg-muted/20 animate-pulse" />
          )}
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-foreground">{templateName}</h3>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </motion.div>
    );
  },
);

TemplatePreviewCard.displayName = 'TemplatePreviewCard';

export default function TemplateShowcase({ onSelectTemplate, maxVisible = 9 }: Props) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const templates = getAllTemplates();
  const visible = showAll ? templates : templates.slice(0, maxVisible);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {visible.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: Math.min(i, 8) * 0.05 }}
          >
            <TemplatePreviewCard
              templateId={tpl.id}
              templateName={tpl.name}
              onSelect={onSelectTemplate}
            />
          </motion.div>
        ))}
      </div>

      {!showAll && templates.length > maxVisible && (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAll(true)}
            className="gap-2"
          >
            {t('landing.templates.showAll', {
              count: templates.length - maxVisible,
              defaultValue: `Voir les ${templates.length - maxVisible} autres modèles`,
            })}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
