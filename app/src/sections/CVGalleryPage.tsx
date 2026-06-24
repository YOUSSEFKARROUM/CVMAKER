import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, FileText, Edit3, Upload } from 'lucide-react';
import { useCloudCV } from '../hooks/useCloudCV';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/useToast';
import { staggerContainer, fadeInUp } from '../styles/design-system';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { CVThumbnail } from '../components/CVThumbnail';
import type { CVData, CVSettings } from '../types/cv';

interface CVGalleryPageProps {
  onLoadCV: (cv: { cvData: CVData; settings: CVSettings }) => void;
  onCreateNew: () => void;
  onImport: (file: File) => Promise<void>;

}

function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1)   return 'à l\'instant';
  if (diffMins < 60)  return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays === 1) return 'hier';
  if (diffDays < 30)  return `il y a ${diffDays} j`;
  const months = Math.floor(diffDays / 30);
  if (months < 12)    return `il y a ${months} mois`;
  return `il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="aspect-[3/4] animate-pulse bg-surface-2 rounded-md" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 bg-surface-2 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-surface-2 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export function CVGalleryPage({ onLoadCV, onCreateNew, onImport }: CVGalleryPageProps) {
  useAuth();
  const { cvs, loading, deleteFromCloud, error: cloudError, refreshCVs } = useCloudCV();
  const { success, error: showError } = useToast();

  const [isDeleting,    setIsDeleting]    = useState<string | null>(null);
  const [loadingCV,     setLoadingCV]     = useState<string | null>(null);
  const [isImporting,   setIsImporting]   = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoad = useCallback((cv: typeof cvs[0]) => {
    if (loadingCV) return;
    setLoadingCV(cv.id);
    setTimeout(() => { onLoadCV({ cvData: cv.cvData, settings: cv.settings }); setLoadingCV(null); }, 200);
  }, [onLoadCV, loadingCV]);

  const handleDelete = useCallback((cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(cvId);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const cvId = deleteTarget;
    setDeleteTarget(null);
    setIsDeleting(cvId);
    try {
      await deleteFromCloud(cvId);
      success('CV supprimé');
    } catch (err: any) {
      showError(err.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  }, [deleteTarget, deleteFromCloud, success, showError]);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) { showError('Veuillez sélectionner un fichier .json'); return; }
    setIsImporting(true);
    try { await onImport(file); }
    catch (err: any) { showError(err.message || 'Format de fichier invalide'); }
    finally { setIsImporting(false); }
  }, [onImport, showError]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div
      className="min-h-screen bg-background relative"
      onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      {/* ── Drag-and-drop overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {isDraggingOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-blue/8 backdrop-blur-[1px] border-2 border-dashed border-blue/60 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-card border border-border rounded-xl px-8 py-6 shadow-overlay text-center">
              <Upload className="w-8 h-8 text-blue mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Déposer votre fichier JSON</p>
              <p className="text-xs text-muted-foreground mt-0.5">Lâchez pour importer votre CV</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Supabase error banner ────────────────────────────────────────── */}
      {cloudError && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            <span className="font-medium">Erreur Supabase :</span>
            <span>{cloudError}</span>
            <button
              onClick={() => refreshCVs(true)}
              className="ml-auto shrink-0 underline underline-offset-2 hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* ── Page title + actions ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-1 h-8 rounded-full bg-gradient-to-b from-blue to-blue/20" />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Mes CVs</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                <span className={loading ? '' : cvs.length > 0 ? 'text-blue font-medium' : ''}>
                  {loading
                    ? 'Chargement…'
                    : cvs.length === 0
                    ? 'Aucun CV sauvegardé'
                    : `${cvs.length} CV${cvs.length > 1 ? 's' : ''}`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              {isImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {isImporting ? 'Import…' : 'Importer JSON'}
            </Button>
            <Button variant="blue" size="sm" onClick={onCreateNew}>
              <Plus className="w-3.5 h-3.5" />
              Nouveau CV
            </Button>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-8">

        {/* ── Skeleton loading ────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {!loading && cvs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-14 text-center"
          >
            {/* Stacked CV cards illustration */}
            <div className="relative w-44 h-56 mx-auto mb-12">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute inset-0 bg-blue/12 blur-3xl scale-[1.8]" />

              {/* Card 3 — back */}
              <div className="absolute inset-0 rounded-2xl bg-surface-2 border border-border -rotate-6 -translate-x-5 translate-y-3 shadow-xs" />

              {/* Card 2 — middle */}
              <div className="absolute inset-0 rounded-2xl bg-surface-1 border border-border -rotate-3 -translate-x-2.5 translate-y-1.5 shadow-xs" />

              {/* Card 1 — front */}
              <div className="absolute inset-0 rounded-2xl bg-card border border-border shadow-sm overflow-hidden flex flex-col">
                {/* Colored header strip */}
                <div className="h-10 bg-gradient-to-r from-blue/10 to-blue/5 border-b border-border flex items-center px-3 gap-2 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue/60" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="h-1.5 bg-blue/30 rounded-full w-14" />
                    <div className="h-1 bg-muted/50 rounded-full w-10" />
                  </div>
                </div>
                {/* Content lines */}
                <div className="flex-1 p-3 flex flex-col gap-2 justify-center">
                  <div className="h-1.5 bg-muted rounded-full w-4/5" />
                  <div className="h-1.5 bg-muted/70 rounded-full w-3/5" />
                  <div className="h-px bg-border my-1" />
                  <div className="h-1.5 bg-muted/50 rounded-full w-full" />
                  <div className="h-1.5 bg-muted/50 rounded-full w-5/6" />
                  <div className="h-1.5 bg-muted/50 rounded-full w-4/6" />
                  <div className="h-px bg-border my-1" />
                  <div className="flex gap-1">
                    <div className="h-4 w-8 bg-blue/15 rounded" />
                    <div className="h-4 w-10 bg-blue/10 rounded" />
                    <div className="h-4 w-7 bg-blue/10 rounded" />
                  </div>
                </div>
              </div>

              {/* Floating "+" badge */}
              <div className="absolute -bottom-3 -right-3 w-11 h-11 rounded-full bg-blue border-2 border-background shadow-cta flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-foreground" />
              </div>
            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
              Aucun CV pour l'instant
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Créez votre premier CV professionnel en quelques minutes — gratuit, sans inscription obligatoire.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
              <Button variant="blue" size="lg" onClick={onCreateNew}>
                <Plus className="w-4 h-4" />
                Créer mon premier CV
              </Button>
              <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                <Upload className="w-4 h-4" />
                Importer un fichier JSON
              </Button>
            </div>

            {/* Drag hint */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-border text-xs text-muted-foreground/60">
              <FileText className="w-3.5 h-3.5" />
              Glissez-déposez un fichier .json pour importer directement
            </div>
          </motion.div>
        )}

        {/* ── CV grid ─────────────────────────────────────────────────── */}
        {!loading && cvs.length > 0 && (
          <>
            {/* Import hint */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground"
            >
              <Upload className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Vous pouvez aussi{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium text-blue hover:underline underline-offset-2 focus-visible:outline-none"
                >
                  importer un fichier JSON
                </button>
                {' '}ou le glisser-déposer n'importe où sur la page.
              </span>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {cvs.map(cv => (
                  <motion.div
                    key={cv.id}
                    layout
                    variants={fadeInUp}
                    exit={{ opacity: 0, scale: 0.97 }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    onClick={() => handleLoad(cv)}
                    className={`group relative bg-card rounded-xl border cursor-pointer overflow-hidden transition-colors duration-150 ${
                      loadingCV === cv.id
                        ? 'border-blue/60 ring-2 ring-blue/20'
                        : 'border-border hover:border-blue/40'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-1 rounded-md">
                      <CVThumbnail cvData={cv.cvData} settings={cv.settings} />

                      {loadingCV === cv.id && (
                        <div className="absolute inset-0 bg-blue/10 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-blue animate-spin" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end justify-center pb-3">
                        <span className="inline-flex items-center gap-1.5 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
                          <Edit3 className="w-3 h-3" />
                          Ouvrir et modifier
                        </span>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="px-3.5 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {cv.name
                              || `${cv.cvData.contact.firstName} ${cv.cvData.contact.lastName}`.trim()
                              || 'CV sans nom'}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Modifié {formatRelativeDate(cv.updatedAt)}
                          </p>
                        </div>

                        {/* Action buttons — appear on card hover */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex-shrink-0">
                          <button
                            onClick={e => { e.stopPropagation(); handleLoad(cv); }}
                            title="Modifier"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => handleDelete(cv.id, e)}
                            disabled={isDeleting === cv.id}
                            title="Supprimer ce CV"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {isDeleting === cv.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {deleteTarget && (
        <ConfirmationModal
          message="Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
