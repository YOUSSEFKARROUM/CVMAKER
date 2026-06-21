import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../styles/design-system';
import {
  FilePlus, Sparkles, Zap, Globe, Star, Shield, Download,
  Palette, Eye, ArrowRight, MousePointerClick, Clock,
  FileCheck, ChevronDown, Menu, X, Check,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import TemplateShowcase from '../components/TemplateShowcase';

interface LandingPageProps {
  onCreateNew: () => void;
  onExistingCV: () => void;
  onImport: (file: File) => Promise<void>;
  isAuthenticated: boolean;
}

// ─── Hero mock CV — premium Harvard-style preview ─────────────────────────────
function HeroMockCV() {
  return (
    <div className="flex bg-white min-h-[220px]">
      <div className="w-2/5 bg-[#1e40af] p-5 flex flex-col">
        <div className="w-12 h-12 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-white text-xs font-bold shrink-0">
          JD
        </div>
        <div className="text-center space-y-1.5 mb-5">
          <div className="h-2.5 bg-white/90 rounded-full w-3/4 mx-auto" />
          <div className="h-1.5 bg-white/50 rounded-full w-1/2 mx-auto" />
        </div>
        <div className="space-y-2 mt-auto">
          <div className="text-[7px] text-white/50 uppercase tracking-widest mb-1">Compétences</div>
          {(['w-4/5', 'w-2/3', 'w-3/4'] as const).map((w, i) => (
            <div key={i} className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className={`h-1.5 bg-white/70 rounded-full ${w}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-5 bg-white">
        <div className="mb-4">
          <div className="h-2 bg-gray-700 rounded w-5/12 mb-2" />
          <div className="space-y-1.5">
            <div className="h-1.5 bg-gray-200 rounded w-full" />
            <div className="h-1.5 bg-gray-200 rounded w-5/6" />
            <div className="h-1.5 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 mb-3">
          <div className="h-2 bg-gray-700 rounded w-1/4 mb-2" />
          <div className="space-y-1.5">
            {[true, true, false].map((full, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-700 shrink-0" />
                <div className={`h-1.5 bg-gray-200 rounded ${full ? 'w-full' : 'w-3/4'}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['React', 'Node.js', 'Python'].map(tag => (
            <span key={tag} className="text-[7px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Sparkles,          titleKey: 'landing.features.ai.title',      descKey: 'landing.features.ai.description'      },
  { icon: Zap,               titleKey: 'landing.features.fast.title',    descKey: 'landing.features.fast.description'    },
  { icon: Eye,               titleKey: 'landing.features.preview.title', descKey: 'landing.features.preview.description' },
  { icon: Download,          titleKey: 'landing.features.export.title',  descKey: 'landing.features.export.description'  },
  { icon: Globe,             titleKey: 'landing.features.lang.title',    descKey: 'landing.features.lang.description'    },
  { icon: Shield,            titleKey: 'landing.features.privacy.title', descKey: 'landing.features.privacy.description' },
];

const TESTIMONIAL_KEYS = ['testimonial1', 'testimonial2', 'testimonial3'] as const;
const FAQ_KEYS         = ['faq1', 'faq2', 'faq3', 'faq4'] as const;

const FREE_FEATURES     = ['Création illimitée de CV', 'Auto-sauvegarde cloud', 'Aperçu en temps réel', '19 templates disponibles', 'Export JSON'];
const PREMIUM_FEATURES  = ['Tout du plan gratuit', 'PDF haute définition', 'Optimisé ATS', 'Sans filigrane', 'Téléchargement instantané'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium tracking-wide uppercase mb-4">
      {children}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LandingPage({ onCreateNew, onImport, isAuthenticated }: LandingPageProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) { onCreateNew(); return; }
    const file = e.target.files?.[0];
    if (file) await onImport(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const NAV_SECTIONS = ['templates', 'features', 'testimonials', 'faq'] as const;

  return (
    // Force dark mode on the entire landing page for a premium dark aesthetic
    <div className="dark">
      <div className="relative min-h-screen bg-background overflow-x-hidden">

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <motion.nav
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              <Logo animated size="md" showText />

              <div className="hidden lg:flex items-center gap-6">
                {NAV_SECTIONS.map(key => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {t(`landing.nav.${key}`)}
                  </button>
                ))}
              </div>

              <div className="hidden lg:block">
                <Button variant="blue" size="sm" onClick={onCreateNew}>
                  {t('landing.createCV')}
                  <ArrowRight />
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(v => !v)}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:hidden bg-background border-t border-border py-4"
            >
              <div className="max-w-6xl mx-auto px-6 space-y-1">
                {NAV_SECTIONS.map(key => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    {t(`landing.nav.${key}`)}
                  </button>
                ))}
                <div className="pt-2">
                  <Button variant="blue" className="w-full" onClick={onCreateNew}>
                    {t('landing.createCV')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.nav>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-20 overflow-hidden">
          {/* Grid texture */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern" />
          {/* Blue radial glow */}
          <div className="pointer-events-none absolute inset-0 hero-glow" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

            {/* Social proof pill */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-1 text-muted-foreground text-xs mb-8"
            >
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full border border-background bg-blue" />
                <div className="w-4 h-4 rounded-full border border-background bg-success" />
                <div className="w-4 h-4 rounded-full border border-background bg-warning" />
              </div>
              {t('landing.hero.boost', { percent: '65' })}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.06 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.08]"
            >
              {t('landing.hero.title1')}
              <br />
              {/* Accent word — gradient from white to blue */}
              <span className="bg-gradient-to-br from-white to-blue bg-clip-text text-transparent">
                {t('landing.hero.title2')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.12 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('landing.hero.subtitle')}
            </motion.p>

            {/* Single dominant CTA */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.18 }}
            >
              <Button variant="blue" size="xl" onClick={onCreateNew}>
                <FilePlus />
                {t('landing.hero.cta')}
                <ArrowRight />
              </Button>
            </motion.div>

            {/* Hero mock CV — tilted 3-D card */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.28, duration: 0.4 }}
              className="relative mx-auto mt-16 max-w-xl"
            >
              <div className="[transform:perspective(1200px)_rotateX(4deg)_rotateY(-2deg)] rounded-xl overflow-hidden border border-border shadow-overlay">
                <HeroMockCV />
              </div>
              {/* Subtle glow under the card */}
              <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-blue/15 blur-2xl rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* ── Stats bar ───────────────────────────────────────────────────── */}
        <section className="border-y border-border bg-surface-1">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: '50K+',  labelKey: 'landing.stats.cvsCreated' },
                { value: '4.9/5', labelKey: 'landing.stats.rating'     },
                { value: '19',    labelKey: 'landing.stats.templates'   },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="text-3xl font-bold text-blue">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t(stat.labelKey)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature showcase card ────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card variant="marketing">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue/10 text-blue text-xs font-medium mb-5">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      {t('landing.featureCard.badge')}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 tracking-tight">
                      {t('landing.featureCard.title')}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {t('landing.featureCard.description')}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { icon: Clock,     key: 'featureCard.15min' },
                        { icon: FileCheck, key: 'featureCard.free'  },
                        { icon: Download,  key: 'featureCard.pdf'   },
                      ].map(({ icon: Icon, key }) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue" />
                          </div>
                          <span className="text-foreground font-medium">{t(`landing.${key}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock CV preview */}
                  <div className="relative">
                    <div className="rounded-lg border border-border bg-background p-6">
                      <div className="bg-white rounded-md shadow-sm p-5">
                        <div className="flex gap-4 mb-5">
                          <div className="w-14 h-14 rounded-lg bg-blue/10 flex items-center justify-center text-blue font-bold text-lg shrink-0">
                            JD
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                            <div className="h-2.5 bg-blue-200 rounded w-1/2" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-100 rounded w-full" />
                          <div className="h-2 bg-gray-100 rounded w-5/6" />
                          <div className="h-2 bg-gray-100 rounded w-4/6" />
                        </div>
                        <div className="mt-5 pt-5 border-t border-gray-100 flex gap-2 flex-wrap">
                          {['React', 'TypeScript', 'Node.js'].map(s => (
                            <span key={s} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue text-blue-foreground text-xs font-medium shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('landing.featureCard.aiBadge')}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── Templates ───────────────────────────────────────────────────── */}
        <section id="templates" className="py-20 bg-surface-1">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <SectionBadge>{t('landing.templatesSection.badge')}</SectionBadge>
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
                {t('landing.templates.title', 'Des modèles professionnels, prêts à l\'emploi')}
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                {t('landing.templates.subtitle', '19 templates conçus pour maximiser vos chances. Choisissez, personnalisez, téléchargez.')}
              </p>
            </motion.div>

            <TemplateShowcase onSelectTemplate={() => onCreateNew()} />
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionBadge>{t('landing.howItWorks.badge')}</SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {t('landing.howItWorks.title')}
              </h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {[
                { num: '01', titleKey: 'landing.howItWorks.step1Title', descKey: 'landing.howItWorks.step1Desc', icon: FilePlus  },
                { num: '02', titleKey: 'landing.howItWorks.step2Title', descKey: 'landing.howItWorks.step2Desc', icon: Palette   },
                { num: '03', titleKey: 'landing.howItWorks.step3Title', descKey: 'landing.howItWorks.step3Desc', icon: Download  },
              ].map((step, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card variant="standard" className="relative h-full">
                    <div className="text-5xl font-bold text-muted/20 absolute top-4 right-5 select-none">{step.num}</div>
                    <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center text-blue mb-5">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{t(step.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-2.5 w-5 h-px bg-border z-10" />
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Features grid ───────────────────────────────────────────────── */}
        <section id="features" className="py-20 bg-surface-1">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionBadge>{t('landing.featuresSection.badge')}</SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t('landing.featuresSection.title')}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('landing.featuresSection.subtitle')}
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {FEATURES.map((f, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card variant="standard" hover className="h-full">
                    <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center text-blue mb-4">
                      <f.icon className="w-[18px] h-[18px]" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">{t(f.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Testimonials ────────────────────────────────────────────────── */}
        <section id="testimonials" className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionBadge>{t('landing.testimonialsSection.badge')}</SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t('landing.testimonialsSection.title')}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('landing.testimonialsSection.subtitle')}
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {TESTIMONIAL_KEYS.map((key, i) => (
                <motion.div key={key} variants={fadeInUp}>
                  <Card variant="standard" className="h-full flex flex-col">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      "{t(`landing.${key}.content`)}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center text-blue text-xs font-bold shrink-0">
                        {t(`landing.${key}.name`).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{t(`landing.${key}.name`)}</div>
                        <div className="text-xs text-muted-foreground">{t(`landing.${key}.role`)}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 bg-surface-1">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionBadge>Tarifs</SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                Simple et transparent
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Créez votre CV gratuitement. Payez uniquement quand vous êtes prêt à télécharger.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Free */}
              <motion.div variants={fadeInUp}>
                <Card variant="marketing" className="h-full flex flex-col">
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Plan</p>
                    <h3 className="text-xl font-bold text-foreground">Gratuit</h3>
                    <p className="mt-3">
                      <span className="text-4xl font-bold text-foreground">0 €</span>
                      <span className="text-sm text-muted-foreground"> / toujours</span>
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {FREE_FEATURES.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-success shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="lg" className="w-full" onClick={onCreateNew}>
                    Commencer gratuitement
                  </Button>
                </Card>
              </motion.div>

              {/* Premium */}
              <motion.div variants={fadeInUp} className="relative">
                {/* Popular badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1 bg-blue text-blue-foreground text-xs font-semibold rounded-full whitespace-nowrap">
                    Le + populaire
                  </span>
                </div>
                <Card variant="marketing" className="h-full flex flex-col border-blue">
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Plan</p>
                    <h3 className="text-xl font-bold text-foreground">Téléchargement PDF</h3>
                    <p className="mt-3">
                      <span className="text-4xl font-bold text-blue">2 €</span>
                      <span className="text-sm text-muted-foreground"> / CV</span>
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {PREMIUM_FEATURES.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-success shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="blue" size="lg" className="w-full" onClick={onCreateNew}>
                    Créer mon CV
                    <ArrowRight />
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-20">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionBadge>{t('landing.faqSection.badge')}</SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t('landing.faqSection.title')}
              </h2>
              <p className="text-muted-foreground">{t('landing.faqSection.subtitle')}</p>
            </motion.div>

            <div className="space-y-2">
              {FAQ_KEYS.map((key, i) => (
                <motion.div
                  key={key}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <span className="text-sm font-medium text-foreground pr-6">{t(`landing.${key}.question`)}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-150 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="px-5 pb-4"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.${key}.answer`)}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ──────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-xl bg-surface-2 border border-border p-12 lg:p-16 text-center overflow-hidden"
            >
              {/* Reuse hero-glow class — no inline style needed */}
              <div className="pointer-events-none absolute inset-0 hero-glow" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
                  {t('landing.cta.title')}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  {t('landing.cta.subtitle')}
                </p>
                <Button variant="blue" size="xl" onClick={onCreateNew}>
                  <FilePlus />
                  {t('landing.cta.button')}
                  <ArrowRight />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="py-12 bg-surface-1 border-t border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-10 mb-10">
              <div className="md:col-span-2">
                <Logo size="md" showText animated={false} className="mb-4" />
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {t('landing.footer.tagline')}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  {t('landing.footer.navigation')}
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {NAV_SECTIONS.map(key => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(key)}
                        className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        {t(`landing.nav.${key}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  {t('landing.footer.legal')}
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.legalLinks.mentions')}</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.legalLinks.privacy')}</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.legalLinks.terms')}</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>{t('landing.footer.copyright')}</p>
              <p>{t('landing.footer.madeWith')}</p>
            </div>
          </div>
        </footer>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
