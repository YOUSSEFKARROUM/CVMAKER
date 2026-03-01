import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FilePlus, 
  Sparkles, 
  Zap, 
  Globe, 
  ChevronRight,
  Star,
  Shield,
  Download,
  Palette,
  Eye,
  ArrowRight,
  MousePointerClick,
  Clock,
  FileCheck,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../components/Logo';

interface LandingPageProps {
  onCreateNew: () => void;
  onExistingCV: () => void;
  onImport: (file: File) => Promise<void>;
  isAuthenticated: boolean;
}

// Template Preview Components
function BudapestPreview() {
  return (
    <div className="h-full flex">
      <div className="w-1/3 bg-emerald-600 p-3 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-sm font-bold">JD</div>
        <div className="space-y-2">
          <div className="h-2 bg-white/30 rounded w-full" />
          <div className="h-2 bg-white/30 rounded w-3/4" />
        </div>
      </div>
      <div className="flex-1 p-3 bg-white">
        <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
        <div className="h-3 bg-emerald-500 rounded w-1/2 mb-4" />
        <div className="h-2 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );
}

function StanfordPreview() {
  return (
    <div className="h-full flex">
      <div className="w-1/3 bg-slate-700 p-3 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-sm font-bold">JD</div>
        <div className="h-2 bg-white/30 rounded w-full mb-1" />
        <div className="h-2 bg-white/30 rounded w-3/4" />
      </div>
      <div className="flex-1 p-3 bg-white">
        <div className="h-3 bg-slate-800 rounded w-1/3 mb-2" />
        <div className="h-2 bg-slate-200 rounded w-full mb-1" />
        <div className="h-2 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  );
}

function CambridgePreview() {
  return (
    <div className="h-full bg-white">
      <div className="bg-blue-600 p-2 text-white text-center text-xs font-bold mb-3">Curriculum Vitae</div>
      <div className="px-3">
        <div className="h-3 bg-slate-800 rounded w-2/3 mb-2" />
        <div className="h-2 bg-blue-500 rounded w-1/3 mb-3" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-2 bg-slate-200 rounded" />
          <div className="h-2 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function OxfordPreview() {
  return (
    <div className="h-full flex">
      <div className="flex-1 p-3 bg-white">
        <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
        <div className="border-l-2 border-gray-300 pl-2">
          <div className="h-2 bg-slate-200 rounded w-full" />
        </div>
      </div>
      <div className="w-1/3 p-3 border-l border-gray-200">
        <div className="text-xs font-bold mb-2">CV</div>
        <div className="h-2 bg-gray-300 rounded w-full mb-1" />
        <div className="h-2 bg-gray-300 rounded w-3/4" />
      </div>
    </div>
  );
}

function OtagoPreview() {
  return (
    <div className="h-full bg-white p-3">
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-2 mb-3">
        <div>
          <div className="h-4 bg-slate-800 rounded w-24 mb-1" />
          <div className="h-2 bg-gray-500 rounded w-16" />
        </div>
        <div className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center text-xs font-bold">CV</div>
      </div>
      <div className="grid grid-cols-4 gap-1 mb-3">
        <div className="h-2 bg-slate-200 rounded" />
        <div className="h-2 bg-slate-200 rounded" />
        <div className="h-2 bg-slate-200 rounded" />
        <div className="h-2 bg-slate-200 rounded" />
      </div>
      <div className="h-2 bg-slate-200 rounded w-full" />
    </div>
  );
}

function BerkeleyPreview() {
  return (
    <div className="h-full bg-white p-3">
      <div className="flex items-center gap-3 mb-3 border-b-2 pb-2" style={{borderColor: '#6366f1'}}>
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0" />
        <div>
          <div className="h-3 bg-slate-800 rounded w-24 mb-1" />
          <div className="h-2 bg-indigo-500 rounded w-16" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-2 bg-slate-200 rounded" />
        <div className="h-2 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

function HarvardPreview() {
  return (
    <div className="h-full flex">
      <div className="w-1/3 bg-blue-600 p-3 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-3" />
        <div className="h-2 bg-white/40 rounded w-full mb-1" />
        <div className="h-2 bg-white/30 rounded w-3/4" />
        <div className="mt-3 space-y-1">
          <div className="h-1.5 bg-white/30 rounded-full w-full" />
          <div className="h-1.5 bg-white/30 rounded-full w-4/5" />
        </div>
      </div>
      <div className="flex-1 p-3 bg-white">
        <div className="h-3 bg-slate-800 rounded w-1/3 mb-2" />
        <div className="flex gap-2">
          <div className="w-12 h-2 bg-slate-300 rounded" />
          <div className="flex-1 border-l-2 border-blue-500 pl-2">
            <div className="h-2 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AucklandPreview() {
  return (
    <div className="h-full bg-white p-3">
      <div className="border-2 border-gray-800 p-2 mb-3 text-center">
        <div className="h-3 bg-slate-800 rounded w-2/3 mx-auto" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="h-2 bg-slate-800 rounded w-1/2 mb-2" />
          <div className="h-2 bg-slate-200 rounded w-full" />
        </div>
        <div>
          <div className="h-2 bg-slate-800 rounded w-1/2 mb-2" />
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-700" />
            <div className="h-2 w-2 rounded-full bg-gray-700" />
            <div className="h-2 w-2 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EdinburghPreview() {
  return (
    <div className="h-full">
      <div className="bg-indigo-800 p-3 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0" />
        <div className="h-3 bg-white rounded w-24" />
      </div>
      <div className="flex">
        <div className="w-1/3 p-3 border-r border-gray-200">
          <div className="h-2 bg-slate-800 rounded w-3/4 mb-2" />
          <div className="h-2 bg-gray-300 rounded w-full mb-1" />
          <div className="h-2 bg-gray-300 rounded w-4/5" />
        </div>
        <div className="flex-1 p-3">
          <div className="h-2 bg-slate-800 rounded w-1/2 mb-2" />
          <div className="h-2 bg-slate-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

function PrincetonPreview() {
  return (
    <div className="h-full bg-white p-3">
      <div className="text-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto mb-2" />
        <div className="h-3 bg-slate-800 rounded w-16 mx-auto" />
      </div>
      <div className="border-b border-gray-200 pb-2 mb-3">
        <div className="h-2 bg-slate-800 rounded w-1/3 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-2 bg-slate-200 rounded" />
          <div className="h-2 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="border-l-2 border-gray-300 pl-3">
        <div className="h-2 bg-slate-700 rounded w-1/2 mb-1" />
        <div className="h-2 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );
}

const templates = [
  { name: 'Budapest', color: 'from-emerald-500 to-teal-600', users: '12K+', Preview: BudapestPreview },
  { name: 'Stanford', color: 'from-slate-600 to-gray-700', users: '9K+', Preview: StanfordPreview },
  { name: 'Cambridge', color: 'from-blue-600 to-blue-700', users: '11K+', Preview: CambridgePreview },
  { name: 'Oxford', color: 'from-indigo-600 to-purple-700', users: '7K+', Preview: OxfordPreview },
  { name: 'Otago', color: 'from-gray-600 to-slate-700', users: '5K+', Preview: OtagoPreview },
  { name: 'Berkeley', color: 'from-indigo-500 to-blue-600', users: '8K+', Preview: BerkeleyPreview },
  { name: 'Harvard', color: 'from-blue-700 to-indigo-800', users: '13K+', Preview: HarvardPreview },
  { name: 'Auckland', color: 'from-teal-600 to-emerald-700', users: '6K+', Preview: AucklandPreview },
  { name: 'Edinburgh', color: 'from-indigo-800 to-slate-800', users: '7K+', Preview: EdinburghPreview },
  { name: 'Princeton', color: 'from-slate-700 to-gray-800', users: '8K+', Preview: PrincetonPreview },
];

const TESTIMONIAL_KEYS = ['testimonial1', 'testimonial2', 'testimonial3'] as const;
const FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4'] as const;

export function LandingPage({ onCreateNew, onImport, isAuthenticated }: LandingPageProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      onCreateNew();
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      await onImport(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Logo animated={true} showText={true} size="md" />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToSection('templates')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded">
                {t('landing.nav.templates')}
              </button>
              <button onClick={() => scrollToSection('features')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded">
                {t('landing.nav.features')}
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded">
                {t('landing.nav.testimonials')}
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded">
                {t('landing.nav.faq')}
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                onClick={onCreateNew}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-500"
              >
                {t('landing.createCV')}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 py-4"
          >
            <div className="max-w-7xl mx-auto px-6 space-y-3">
              <button onClick={() => scrollToSection('templates')} className="block w-full text-left py-2 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.templates')}</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.features')}</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.testimonials')}</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-2 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.faq')}</button>
              <button onClick={onCreateNew} className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-500">
                {t('landing.createCV')}
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section - Green Background */}
      <section className="relative bg-emerald-500 pt-32 pb-48 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-10 w-20 h-20 bg-white/10 rounded-2xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-40 right-10 w-16 h-16 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 right-1/4 w-8 h-8 bg-white/20 rounded-lg"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {t('landing.hero.title1')}
            <br />
            {t('landing.hero.title2')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-emerald-50 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={onCreateNew}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold rounded-xl shadow-2xl shadow-violet-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-600"
            >
              <FilePlus className="w-6 h-6" />
              {t('landing.hero.cta')}
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-emerald-100 font-medium"
          >
            {t('landing.hero.boost', { percent: '65' })}
          </motion.p>
        </div>

        {/* Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Feature Card - Overlapping */}
      <section className="relative z-20 -mt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 lg:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-6">
                  <MousePointerClick className="w-4 h-4" />
                  {t('landing.featureCard.badge')}
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                  {t('landing.featureCard.title')}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {t('landing.featureCard.description')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-medium">{t('landing.featureCard.15min')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">{t('landing.featureCard.free')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-violet-600" />
                    </div>
                    <span className="font-medium">{t('landing.featureCard.pdf')}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
                >
                  {/* CV Preview Mock */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                        JD
                      </div>
                      <div className="flex-1">
                        <div className="h-5 bg-slate-800 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-emerald-500 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-100 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-5/6" />
                      <div className="h-2 bg-slate-100 rounded w-4/6" />
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex gap-2">
                        {['React', 'TypeScript', 'Node.js'].map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-4 -right-4 bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      {t('landing.featureCard.aiBadge')}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', labelKey: 'landing.stats.cvsCreated', icon: FilePlus },
              { value: '4.9/5', labelKey: 'landing.stats.rating', icon: Star },
              { value: '10+', labelKey: 'landing.stats.templates', icon: Palette },
              { value: '100%', labelKey: 'landing.stats.free', icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white shadow-md flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-600">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              {t('landing.templatesSection.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('landing.templatesSection.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.templatesSection.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={onCreateNew}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl transition-all">
                  {/* Template Preview */}
                  <div className={`h-48 bg-gradient-to-br ${template.color} p-4`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                      <template.Preview />
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{template.name}</h3>
                        <p className="text-sm text-slate-500">{template.users} {t('landing.templatesSection.users')}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-emerald-500/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {t('landing.templatesSection.useTemplate')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              onClick={onCreateNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {t('landing.templatesSection.viewAll')}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
              {t('landing.howItWorks.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('landing.howItWorks.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: '1', titleKey: 'landing.howItWorks.step1Title', descKey: 'landing.howItWorks.step1Desc', icon: FilePlus, color: 'bg-emerald-500' },
              { number: '2', titleKey: 'landing.howItWorks.step2Title', descKey: 'landing.howItWorks.step2Desc', icon: Palette, color: 'bg-violet-500' },
              { number: '3', titleKey: 'landing.howItWorks.step3Title', descKey: 'landing.howItWorks.step3Desc', icon: Download, color: 'bg-blue-500' },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow h-full">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="text-5xl font-bold text-slate-100 absolute top-6 right-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t(step.titleKey)}</h3>
                  <p className="text-slate-600">{t(step.descKey)}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-violet-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              {t('landing.featuresSection.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('landing.featuresSection.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.featuresSection.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'landing.features.ai.title', desc: 'landing.features.ai.description', color: 'from-violet-500 to-purple-600' },
              { icon: Zap, title: 'landing.features.fast.title', desc: 'landing.features.fast.description', color: 'from-amber-500 to-orange-600' },
              { icon: Eye, title: 'landing.features.preview.title', desc: 'landing.features.preview.description', color: 'from-blue-500 to-cyan-600' },
              { icon: Download, title: 'landing.features.export.title', desc: 'landing.features.export.description', color: 'from-emerald-500 to-teal-600' },
              { icon: Globe, title: 'landing.features.lang.title', desc: 'landing.features.lang.description', color: 'from-pink-500 to-rose-600' },
              { icon: Shield, title: 'landing.features.privacy.title', desc: 'landing.features.privacy.description', color: 'from-indigo-500 to-blue-600' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {t(feature.title)}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t(feature.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              {t('landing.testimonialsSection.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('landing.testimonialsSection.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.testimonialsSection.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIAL_KEYS.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{t(`landing.${key}.content`)}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    {t(`landing.${key}.name`).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{t(`landing.${key}.name`)}</div>
                    <div className="text-sm text-slate-500">{t(`landing.${key}.role`)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-4">
              {t('landing.faqSection.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('landing.faqSection.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('landing.faqSection.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-4">
            {FAQ_KEYS.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
                >
                  <span className="font-semibold text-slate-900 pr-8">{t(`landing.${key}.question`)}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-slate-600 leading-relaxed">{t(`landing.${key}.answer`)}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-12 lg:p-16 text-center"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative z-10">
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t('landing.cta.title')}
              </motion.h2>
              <motion.p
                className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {t('landing.cta.subtitle')}
              </motion.p>
              <motion.button
                onClick={onCreateNew}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <FilePlus className="w-6 h-6" />
                <span>{t('landing.cta.button')}</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Logo size="md" showText={true} animated={false} className="mb-6" />
              <p className="text-slate-400 mb-6 max-w-md">
                {t('landing.footer.tagline')}
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900" tabIndex={0} role="button">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.navigation')}</h4>
              <ul className="space-y-3 text-slate-400">
                <li><button type="button" onClick={() => scrollToSection('templates')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.templates')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('features')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.features')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.testimonials')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.nav.faq')}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.legal')}</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.footer.legalLinks.mentions')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.footer.legalLinks.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">{t('landing.footer.legalLinks.terms')}</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">{t('landing.footer.copyright')}</p>
            <p className="text-slate-500 text-sm">{t('landing.footer.madeWith')}</p>
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
  );
}
