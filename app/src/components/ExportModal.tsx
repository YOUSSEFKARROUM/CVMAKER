import { useEffect, useRef, useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { exportCVToPDF, exportToImage, downloadImage, printCV } from '../utils/pdfExport';
import { useToast } from '../hooks/useToast';
import { colors } from '../styles/design-system';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const PAYPAL_ENABLED = Boolean(PAYPAL_CLIENT_ID && BACKEND_URL);

if (import.meta.env.DEV) {
  // Aide au débogage en local sans exposer tout le client id
  // eslint-disable-next-line no-console
  console.log('[PayPal][Debug] Front config', {
    paypalClientIdPrefix: PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.slice(0, 6) : null,
    backendUrl: BACKEND_URL,
    enabled: PAYPAL_ENABLED,
  });
}

type PayPalButtonsInstance = {
  render: (container: HTMLElement) => void | Promise<void>;
  close?: () => void;
};

type PayPalOnApproveData = {
  orderID?: string;
  [key: string]: unknown;
};

interface PayPalNamespace {
  Buttons: (options: Record<string, unknown>) => PayPalButtonsInstance;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewElement: HTMLElement | null;
  filename: string;
}

export function ExportModal({ isOpen, onClose, previewElement, filename }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'image' | 'print'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { success, error } = useToast();
  const [hasPaid, setHasPaid] = useState(false);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const paypalButtonsRenderedRef = useRef(false);

  // Image Options
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [imageQuality, setImageQuality] = useState(0.95);

  const mustPayBeforeDownload = PAYPAL_ENABLED && isPaypalReady && !hasPaid && !paypalError;

  const handleExportPDF = async () => {
    if (mustPayBeforeDownload) {
      error("Veuillez d'abord effectuer le paiement PayPal pour télécharger votre CV en PDF.");
      return;
    }

    if (!previewElement) {
      error('Aperçu non disponible');
      return;
    }

    setIsExporting(true);
    try {
      // Utiliser la fonction optimisée pour les CV (A4 exact)
      await exportCVToPDF(previewElement, `${filename}.pdf`);
      success('PDF exporté avec succès');
      onClose();
    } catch (err) {
      error('Erreur lors de l\'export PDF');
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
      onClose();
    } catch (err) {
      error('Erreur lors de l\'export de l\'image');
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

  // Charger le SDK PayPal uniquement si nécessaire
  useEffect(() => {
    if (!isOpen || activeTab !== 'pdf') return;
    if (!PAYPAL_ENABLED) return;

    // eslint-disable-next-line no-console
    console.log('[PayPal][Debug] Chargement du SDK PayPal...');

    if (window.paypal) {
      setIsPaypalReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-cv-paypal-sdk="true"]'
    );
    if (existingScript) {
      existingScript.addEventListener(
        'load',
        () => {
          setIsPaypalReady(true);
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR&intent=CAPTURE`;
    script.async = true;
    script.dataset.cvPaypalSdk = 'true';
    script.onload = () => {
      setIsPaypalReady(true);
      // eslint-disable-next-line no-console
      console.log('[PayPal][Debug] SDK PayPal chargé.');
    };
    script.onerror = () => {
      setPaypalError("Impossible de charger le module de paiement PayPal pour le moment.");
      // eslint-disable-next-line no-console
      console.error('[PayPal][Debug] Erreur de chargement du SDK PayPal.');
    };
    document.body.appendChild(script);
  }, [isOpen, activeTab]);

  // Rendu des boutons PayPal
  useEffect(() => {
    if (!PAYPAL_ENABLED) return;
    if (!isOpen || activeTab !== 'pdf') return;
    if (!isPaypalReady || !window.paypal || !paypalContainerRef.current) return;
    if (paypalButtonsRenderedRef.current) return;

    const buttons = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'pill',
        label: 'pay',
      },
      createOrder: async () => {
        if (!BACKEND_URL) {
          throw new Error('Backend PayPal non configuré');
        }
        const response = await fetch(`${BACKEND_URL}/payments/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cvTitle: filename }),
        });

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(text || 'Erreur lors de la création de la commande PayPal.');
        }

        const data = await response.json();
        return data.id as string;
      },
      onApprove: async (data: PayPalOnApproveData) => {
        try {
          if (!BACKEND_URL) {
            throw new Error('Backend PayPal non configuré');
          }
          if (!data.orderID) {
            throw new Error('orderID manquant dans la réponse PayPal');
          }

          const response = await fetch(`${BACKEND_URL}/payments/capture-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: data.orderID }),
          });

          if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Erreur lors de la confirmation du paiement PayPal.');
          }

          const result = await response.json();
          if (result.status !== 'COMPLETED' && result.status !== 'APPROVED') {
            throw new Error('Paiement PayPal non complété.');
          }

          setHasPaid(true);
          setPaypalError(null);
          success('Paiement confirmé. Vous pouvez maintenant télécharger votre CV en PDF.');
        } catch (err) {
          console.error(err);
          error('Une erreur est survenue lors de la confirmation du paiement PayPal.');
        }
      },
      onError: (err: unknown) => {
        console.error(err);
        setPaypalError('Une erreur est survenue avec le module de paiement PayPal.');
      },
    });

    const renderButtons = async () => {
      try {
        await Promise.resolve(buttons.render(paypalContainerRef.current!));
        paypalButtonsRenderedRef.current = true;
      } catch (err) {
        console.error(err);
        setPaypalError("Impossible d'afficher les boutons PayPal.");
      }
    };

    renderButtons();

    return () => {
      if (buttons.close) {
        buttons.close();
      }
      paypalButtonsRenderedRef.current = false;
    };
  }, [isOpen, activeTab, isPaypalReady, filename, success, error]);

  // Réinitialiser l'état paiement à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setHasPaid(false);
      setPaypalError(null);
      paypalButtonsRenderedRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const accentStyle = { color: colors.primary[600] };
  const borderAccentStyle = { borderColor: colors.primary[500] };

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
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-b-2 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            style={activeTab === 'pdf' ? { ...borderAccentStyle, ...accentStyle } : undefined}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'image'
                ? 'border-b-2 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            style={activeTab === 'image' ? { ...borderAccentStyle, ...accentStyle } : undefined}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'print'
                ? 'border-b-2 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            style={activeTab === 'print' ? { ...borderAccentStyle, ...accentStyle } : undefined}
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'pdf' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Format A4 Optimisé</h3>
                <p className="text-sm text-blue-800">
                  Le PDF sera généré au format A4 exact (210mm x 297mm) avec une mise à l'échelle 
                  automatique pour que tout le contenu soit visible sur une seule page.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Caractéristiques :</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Format exact A4 (210mm x 297mm)</li>
                  <li>Haute qualité d'impression</li>
                  <li>Une seule page avec ajustement automatique</li>
                  <li>Compatible avec tous les logiciels PDF</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Conseil :</strong> Si votre CV contient beaucoup de contenu, 
                  il sera automatiquement réduit pour tenir sur une page A4. 
                  Pour un meilleur résultat, limitez votre CV à une page.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg space-y-2">
                <h3 className="font-medium text-emerald-900">
                  Paiement sécurisé pour le téléchargement PDF
                </h3>
                <p className="text-sm text-emerald-800">
                  Prix : <span className="font-semibold">2 € (≈ 20 DH)</span> par CV, via PayPal
                  (carte bancaire ou compte PayPal).
                </p>
                {PAYPAL_ENABLED ? (
                  <>
                    <div ref={paypalContainerRef} className="mt-2" />
                    {paypalError && (
                      <p className="text-xs text-red-600 mt-2">
                        {paypalError}
                      </p>
                    )}
                    {hasPaid && (
                      <p className="text-xs text-emerald-700 mt-1">
                        Paiement validé. Vous pouvez maintenant lancer le téléchargement PDF.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-amber-700 mt-2">
                    Le paiement PayPal n&apos;est pas encore configuré (variables d&apos;environnement
                    manquantes). En développement, le téléchargement reste gratuit.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-6">
              {/* Format */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Format d'image</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpeg', 'webp'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setImageFormat(format)}
                      className={`py-2 px-4 rounded-lg border transition-colors uppercase ${
                        imageFormat === format
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Qualité: {Math.round(imageQuality * 100)}%
                </Label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Conseil:</strong> Le format PNG offre la meilleure qualité mais des fichiers plus volumineux. 
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
                <h4 className="font-medium text-sm">Conseils d'impression:</h4>
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
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {activeTab === 'pdf' && (
            <Button
              onClick={handleExportPDF}
              disabled={isExporting || mustPayBeforeDownload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {mustPayBeforeDownload ? 'Télécharger après paiement' : 'Télécharger PDF'}
                </>
              )}
            </Button>
          )}
          {activeTab === 'image' && (
            <Button
              onClick={handleExportImage}
              disabled={isExporting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger Image
                </>
              )}
            </Button>
          )}
          {activeTab === 'print' && (
            <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Printer className="w-4 h-4 mr-2" />
              Ouvrir l'aperçu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
