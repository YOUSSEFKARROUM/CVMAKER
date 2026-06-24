import { useEffect, useState } from 'react';
import { X, Download, Loader2, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportCVToPDF } from '../utils/pdfExport';
import { useToast } from '../hooks/useToast';
import { supabase } from '../supabase/client';
import { useDownloadRequest } from '../hooks/useDownloadRequest';
import { useAdmin } from '../hooks/useAdmin';
import PaymentInstructions from './PaymentInstructions';
import type { DownloadStatus } from '../hooks/useDownloadRequest';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewElement: HTMLElement | null;
  filename: string;
  cvTemplate?: string;
  onSuccess?: () => void;
}

export function ExportModal({ isOpen, onClose, previewElement, filename, cvTemplate = '', onSuccess }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { success, error } = useToast();
  const { checkDownloadStatus } = useDownloadRequest();
  const { isAdmin } = useAdmin();

  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setCheckingAccess(true);
    checkDownloadStatus()
      .then(setDownloadStatus)
      .finally(() => setCheckingAccess(false));
  }, [isOpen]);

  const { hasAccess, downloadsRemaining, requestStatus } = downloadStatus ?? {
    hasAccess: false,
    downloadsRemaining: 0,
    requestStatus: { status: 'none' },
  };

  const canDownloadNow = isAdmin || (hasAccess && downloadsRemaining > 0);

  const handleExportPDF = async () => {
    if (!previewElement) {
      error('Aperçu non disponible');
      return;
    }
    setIsExporting(true);
    try {
      await exportCVToPDF(previewElement, `${filename}.pdf`);
      success('PDF exporté avec succès !');
      onSuccess?.();

      if (!isAdmin && downloadStatus) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('downloads_remaining, total_downloads')
              .eq('id', user.id)
              .single();
            await supabase.from('profiles').update({
              downloads_remaining: Math.max(0, (profile?.downloads_remaining ?? 0) - 1),
              total_downloads: (profile?.total_downloads ?? 0) + 1,
              updated_at: new Date().toISOString(),
            }).eq('id', user.id);
            setDownloadStatus(prev => prev ? {
              ...prev,
              downloadsRemaining: Math.max(0, (prev.downloadsRemaining ?? 0) - 1),
            } : prev);
          }
        } catch (err) {
          console.warn('Failed to update download quota:', err);
        }
      }
    } catch {
      error("Erreur lors de l'export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Download className="w-5 h-5 text-blue-500" />
            Télécharger votre CV en PDF
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-5">
          {checkingAccess ? (
            <div className="py-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Vérification de l'accès...</p>
            </div>

          ) : isAdmin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm text-green-700 font-medium">
                  Accès administrateur — téléchargement gratuit
                </span>
              </div>
            </div>

          ) : hasAccess && downloadsRemaining > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm text-green-700 font-medium">
                  Accès approuvé — {downloadsRemaining} téléchargement{downloadsRemaining > 1 ? 's' : ''} restant{downloadsRemaining > 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="blue" size="lg" className="w-full gap-2"
                      onClick={handleExportPDF} disabled={isExporting}>
                {isExporting
                  ? <><Loader2 className="w-5 h-5 animate-spin" />Export en cours...</>
                  : <><Download className="w-5 h-5" />Télécharger PDF</>
                }
              </Button>
            </div>

          ) : hasAccess && downloadsRemaining <= 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-sm text-amber-700 font-medium">
                  Quota épuisé — effectuez un nouveau paiement pour 4 téléchargements
                </span>
              </div>
              <PaymentInstructions
                cvName={filename}
                templateUsed={cvTemplate}
                onRequestSent={() => setDownloadStatus(prev => prev
                  ? { ...prev, requestStatus: { status: 'pending' } }
                  : prev
                )}
              />
            </div>

          ) : requestStatus.status === 'pending' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Demande en cours de traitement
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Votre paiement est en cours de vérification. Vous recevrez l'accès sous 24h maximum.
              </p>
            </div>

          ) : requestStatus.status === 'rejected' ? (
            <div className="space-y-4">
              {requestStatus.note && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700">Refusé : {requestStatus.note}</span>
                </div>
              )}
              <PaymentInstructions
                cvName={filename}
                templateUsed={cvTemplate}
                onRequestSent={() => setDownloadStatus(prev => prev
                  ? { ...prev, requestStatus: { status: 'pending' } }
                  : prev
                )}
              />
            </div>

          ) : (
            <PaymentInstructions
              cvName={filename}
              templateUsed={cvTemplate}
              onRequestSent={() => setDownloadStatus(prev => prev
                ? { ...prev, requestStatus: { status: 'pending' } }
                : prev
              )}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          {canDownloadNow && (
            <Button
              onClick={handleExportPDF}
              disabled={isExporting || checkingAccess}
              className="bg-blue hover:bg-blue/90 text-blue-foreground"
            >
              {isExporting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Export en cours...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" />
                  {isAdmin ? 'Télécharger' : `Télécharger (${downloadsRemaining} restant${downloadsRemaining > 1 ? 's' : ''})`}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
