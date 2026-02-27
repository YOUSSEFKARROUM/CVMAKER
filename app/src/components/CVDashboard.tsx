import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Star,
  FolderOpen,
  X,
  Loader2,
  CloudOff,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useCloudCV } from '../hooks/useCloudCV';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/useToast';
import type { CVData, CVSettings } from '../types/cv';

interface CVDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onLoadCV: (cv: { cvData: CVData; settings: CVSettings }) => void;
  onEditCV: (cvId: string) => void;
  loading?: boolean;
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  }
};

export function CVDashboard({ 
  isOpen, 
  onClose, 
  onCreateNew, 
  onLoadCV, 
  onEditCV,
  loading: externalLoading 
}: CVDashboardProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { cvs, loading: cloudLoading, deleteFromCloud, refreshCVs, error: cloudError, isCloudEnabled } = useCloudCV();
  const { success, error: showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loadingCV, setLoadingCV] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loading = externalLoading || cloudLoading;

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSelectedCV(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCVs = useMemo(() => {
    return cvs
      .filter(cv => 
        cv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.cvData.contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.cvData.contact.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'date') {
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        }
        return a.name.localeCompare(b.name);
      });
  }, [cvs, searchQuery, sortBy]);

  const handleDuplicate = useCallback(async (_cv: typeof cvs[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCV(null);
    showError('Fonctionnalité en cours de développement');
  }, [showError]);

  const handleDelete = useCallback(async (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCV(null);
    if (!confirm(t('cloud.confirmDelete') || 'Êtes-vous sûr de vouloir supprimer ce CV ?')) return;
    
    setIsDeleting(cvId);
    try {
      await deleteFromCloud(cvId);
      success('CV supprimé avec succès');
    } catch (err: any) {
      showError(err.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  }, [deleteFromCloud, success, showError, t]);

  const handleLoad = useCallback((cv: typeof cvs[0]) => {
    if (loadingCV) return; // Éviter les clics multiples
    
    console.log('Loading CV:', cv.name, cv.id);
    setLoadingCV(cv.id);
    
    // Petit délai pour montrer le feedback visuel
    setTimeout(() => {
      onLoadCV({ cvData: cv.cvData, settings: cv.settings });
      setLoadingCV(null);
      onClose();
    }, 300);
  }, [onLoadCV, onClose, loadingCV]);

  const handleEdit = useCallback((cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCV(null);
    onEditCV(cvId);
  }, [onEditCV]);

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }, []);

  const getTemplateColor = useCallback((template: string) => {
    const colors: Record<string, string> = {
      budapest: 'from-blue-500 to-indigo-600',
      chicago: 'from-purple-500 to-pink-600',
      brunei: 'from-emerald-500 to-teal-600',
      vladivostok: 'from-orange-500 to-red-600',
      sydney: 'from-cyan-500 to-blue-600',
      shanghai: 'from-rose-500 to-pink-600',
      kiev: 'from-violet-500 to-purple-600',
      rotterdam: 'from-amber-500 to-orange-600',
      tokyo: 'from-gray-600 to-gray-800',
      modern: 'from-indigo-500 to-purple-600',
    };
    return colors[template] || colors.modern;
  }, []);

  // Bloquer le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop - couvre tout l'écran complètement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm dark:bg-black/95"
          />

          {/* Modal */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-indigo-500 to-purple-600"
            >
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('cloud.myCVs') || 'Mes CVs'}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {filteredCVs.length} {filteredCVs.length === 1 ? 'CV' : 'CVs'} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onCreateNew}
              className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('landing.createCV') || 'Créer un CV'}</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder={t('cloud.searchPlaceholder') || "Rechercher un CV..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="date">{t('cloud.sortByDate') || "Date"}</option>
              <option value="name">{t('cloud.sortByName') || "Nom"}</option>
            </select>

            <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 dark:bg-slate-900">
          {!isAuthenticated ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Connexion requise
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-4">
                Connectez-vous pour accéder à vos CV sauvegardés dans le cloud.
              </p>
            </motion.div>
          ) : !isCloudEnabled ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <CloudOff className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Stockage cloud indisponible
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-4">
                {cloudError || "Le stockage cloud n'est pas configuré. Vos CV sont sauvegardés localement dans votre navigateur."}
              </p>
              <Button onClick={onCreateNew} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                {t('landing.createCV') || 'Créer un CV'}
              </Button>
            </motion.div>
          ) : loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : filteredCVs.length === 0 ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {searchQuery ? t('cloud.noSearchResults') || "Aucun résultat" : t('cloud.noCVs') || "Aucun CV"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-4">
                {searchQuery 
                  ? "Essayez avec d'autres termes de recherche"
                  : "Commencez par créer votre premier CV"
                }
              </p>
              {!searchQuery && (
                <Button onClick={onCreateNew} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('landing.createCV') || 'Créer un CV'}
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredCVs.map((cv, index) => (
                  <motion.div
                    key={cv.id}
                    variants={fadeIn}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => handleLoad(cv)}
                    className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer overflow-hidden ${
                      viewMode === 'list' ? 'flex items-center p-4' : ''
                    } ${loadingCV === cv.id ? 'ring-2 ring-indigo-500' : ''}`}
                  >
                    {/* Thumbnail */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-16 h-16 rounded-xl flex-shrink-0' : 'h-40'}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${getTemplateColor(cv.settings.template)}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {loadingCV === cv.id ? (
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                          <span className="text-white text-2xl font-bold opacity-30">
                            {cv.cvData.contact.firstName?.charAt(0) || 'C'}
                            {cv.cvData.contact.lastName?.charAt(0) || 'V'}
                          </span>
                        )}
                      </div>
                      {index === 0 && loadingCV !== cv.id && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded-full">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </div>
                      )}
                      {loadingCV === cv.id && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Chargement...</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className={`${viewMode === 'list' ? 'ml-4 flex-1' : 'p-4'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                          {cv.name}
                          {loadingCV === cv.id && (
                            <span className="ml-2 text-xs text-indigo-500">(chargement...)</span>
                          )}
                        </h3>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCV(selectedCV === cv.id ? null : cv.id);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                          
                          {/* Dropdown */}
                          <AnimatePresence>
                            {selectedCV === cv.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20"
                              >
                                <button
                                  onClick={(e) => handleEdit(cv.id, e)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 dark:text-slate-200"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  {t('nav.edit') || 'Modifier'}
                                </button>
                                <button
                                  onClick={(e) => handleDuplicate(cv, e)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 dark:text-slate-200"
                                >
                                  <Copy className="w-4 h-4" />
                                  {t('cloud.duplicate') || "Dupliquer"}
                                </button>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                                <button
                                  onClick={(e) => handleDelete(cv.id, e)}
                                  disabled={isDeleting === cv.id}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2 disabled:opacity-50"
                                >
                                  {isDeleting === cv.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                  {t('nav.delete') || 'Supprimer'}
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(cv.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cv.settings.template}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('nav.previous') || "Retour"}
          </Button>
          <span>
            {filteredCVs.length} / {cvs.length} CVs
          </span>
          <Button variant="ghost" size="sm" onClick={() => refreshCVs()} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (t('cloud.refresh') || "Actualiser")}
          </Button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
}
