import { useEffect, useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Printer, Loader2, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { exportCVToPDF, exportToImage, downloadImage, printCV } from '../utils/pdfExport';
import { useToast } from '../hooks/useToast';
import { colors } from '../styles/design-system';
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
  const [activeTab, setActiveTab] = useState<'pdf' | 'image' | 'print'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { success, error } = useToast();
  const { checkDownloadStatus } = useDownloadRequest();
  const { isAdmin } = useAdmin();

  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Image Options
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [imageQuality, setImageQuality] = useState(0.95);

  useEffect(() => {
    if (!isOpen) return;
    setCheckingAccess(true);
    checkDownloadStatus()
      .then(setDownloadStatus)
      .finally(() => setCheckingAccess(false));
  }, [isOpen]);

  const canDownloadNow = isAdmin || (
    (downloadStatus?.hasAccess ?? false) && (downloadStatus?.downloadsRemaining ?? 0) > 0
  );

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

      // Décrémenter le quota et incrémenter total_downloads
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

  const handleExportImage = async () => {
    if (!previewElement) {
      error('Aperçu non disponible');
      return;
    }
    setIsExporting(true);
    try {
      const dataUrl = await exportToImage(previewElement, imageFormat, imageQuality);
      downloadImage(dataUrl, `${filename}.${imageFormat}`);
      success('Image exportée avec succès');
      onSuccess?.();
      onClose();
    } catch {
      error("Erreur lors de l'export de l'image");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!previewElement) {
      error('Aperçu non disponible');
      return;
    }
    printCV(previewElement.id || 'cv-preview');
    onClose();
  };

  if (!isOpen) return null;

  const accentStyle = { color: colors.primary[600] };
  const borderAccentStyle = { borderColor: colors.primary[500] };

  const { hasAccess, downloadsRemaining, requestStatus } = downloadStatus ?? {
    hasAccess: false, downloadsRemaining: 0, requestStatus: { status: 'none' },
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Download className="w-5 h-5" style={accentStyle} />
            Exporter votre CV
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {(['pdf', 'image', 'print'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab
                  ? 'border-b-2 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              style={activeTab === tab ? { ...borderAccentStyle, ...accentStyle } : undefined}
            >
              {tab === 'pdf' && <FileText className="w-4 h-4" />}
              {tab === 'image' && <ImageIcon className="w-4 h-4" />}
              {tab === 'print' && <Printer className="w-4 h-4" />}
              {tab === 'pdf' ? 'PDF' : tab === 'image' ? 'Image' : 'Imprimer'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'pdf' && (
            <div className="space-y-6">
              {/* Info format A4 */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Format A4 Optimisé</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Le PDF sera généré au format A4 exact (210mm × 297mm) avec une mise à l'échelle
                  automatique pour que tout le contenu soit visible sur une seule page.
                </p>
              </div>

              {/* Zone accès / paiement */}
              {checkingAccess ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </div>

              ) : isAdmin ? (
                <div className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-green-700 font-medium">
                    Accès administrateur — téléchargement gratuit
                  </span>
                </div>

              ) : hasAccess && downloadsRemaining > 0 ? (
                <div>
                  <div className="flex items-center gap-2 justify-center px-4 py-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-700 font-medium">
                      Accès approuvé — {downloadsRemaining} téléchargement{downloadsRemaining > 1 ? 's' : ''} restant{downloadsRemaining > 1 ? 's' : ''}
                    </span>
                  </div>
                  <Button variant="blue" size="lg" className="w-full gap-2" onClick={handleExportPDF} disabled={isExporting}>
                    {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {isExporting ? 'Export en cours...' : 'Télécharger PDF'}
                  </Button>
                </div>

              ) : hasAccess && downloadsRemaining <= 0 ? (
                <div>
                  <div className="flex items-center gap-2 justify-center px-4 py-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="text-sm text-amber-700 font-medium">
                      Quota épuisé — effectuez un nouveau paiement pour 4 téléchargements
                    </span>
                  </div>
                  <PaymentInstructions
                    cvName={filename}
                    templateUsed={cvTemplate}
                    onRequestSent={() => setDownloadStatus(prev => prev ? {
                      ...prev,
                      requestStatus: { status: 'pending' },
                    } : prev)}
                  />
                </div>

              ) : requestStatus.status === 'pending' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Demande en cours de traitement
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Votre paiement est en cours de vérification. Vous recevrez l'accès sous 24h maximum.
                  </p>
                </div>

              ) : requestStatus.status === 'rejected' ? (
                <div>
                  {requestStatus.note && (
                    <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <X className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-sm text-red-700">Refusé : {requestStatus.note}</span>
                    </div>
                  )}
                  <PaymentInstructions
                    cvName={filename}
                    templateUsed={cvTemplate}
                    onRequestSent={() => setDownloadStatus(prev => prev ? {
                      ...prev,
                      requestStatus: { status: 'pending' },
                    } : prev)}
                  />
                </div>

              ) : (
                <PaymentInstructions
                  cvName={filename}
                  templateUsed={cvTemplate}
                  onRequestSent={() => setDownloadStatus(prev => prev ? {
                    ...prev,
                    requestStatus: { status: 'pending' },
                  } : prev)}
                />
              )}
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Format d'image</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpeg', 'webp'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setImageFormat(format)}
                      className={`py-2 px-4 rounded-lg border transition-colors uppercase ${
                        imageFormat === format
                          ? 'border-blue bg-blue/5 dark:bg-blue/10 text-blue'
                          : 'border-border bg-card text-foreground hover:border-blue/40'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Qualité: {Math.round(imageQuality * 100)}%
                </Label>
                <input
                  type="range" min="0.5" max="1" step="0.05"
                  value={imageQuality}
                  onChange={e => setImageQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Conseil :</strong> Le format PNG offre la meilleure qualité mais des fichiers plus volumineux.
                  JPEG est recommandé pour un bon compromis qualité/taille.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Aperçu avant impression</h3>
                <p className="text-sm text-gray-600">
                  Une fenêtre d'aperçu s'ouvrira avec les options d'impression de votre navigateur.
                  Vous pourrez y sélectionner votre imprimante et ajuster les paramètres.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Conseils d'impression :</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Utilisez du papier blanc de bonne qualité (80g/m² minimum)</li>
                  <li>Sélectionnez l'impression en couleur pour un meilleur rendu</li>
                  <li>Vérifiez que les marges sont correctement configurées</li>
                  <li>Activez l'option "Imprimer les arrière-plans graphiques" si disponible</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Annuler</Button>

          {activeTab === 'pdf' && canDownloadNow && (
            <Button
              onClick={handleExportPDF}
              disabled={isExporting || checkingAccess}
              className="bg-blue hover:bg-blue/90 text-blue-foreground"
            >
              {isExporting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Export en cours...</>
              ) : checkingAccess ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Vérification...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" />
                  {isAdmin ? 'Télécharger gratuitement' : `Télécharger (${downloadsRemaining} restant${downloadsRemaining > 1 ? 's' : ''})`}
                </>
              )}
            </Button>
          )}

          {activeTab === 'image' && (
            <Button onClick={handleExportImage} disabled={isExporting}
                    className="bg-blue hover:bg-blue/90 text-blue-foreground">
              {isExporting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Export en cours...</>
                : <><Download className="w-4 h-4 mr-2" />Télécharger Image</>
              }
            </Button>
          )}

          {activeTab === 'print' && (
            <Button onClick={handlePrint} className="bg-blue hover:bg-blue/90 text-blue-foreground">
              <Printer className="w-4 h-4 mr-2" />Ouvrir l'aperçu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
