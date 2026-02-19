import { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Printer, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { exportToPDF, exportToImage, downloadImage, printCV } from '../utils/pdfExport';
import { useToast } from '../hooks/useToast';
import type { PDFExportOptions } from '../utils/pdfExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewElement: HTMLElement | null;
  filename: string;
}

export function ExportModal({ isOpen, onClose, previewElement, filename }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'image' | 'print'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { success, error } = useToast();

  // PDF Options
  const [pdfOptions, setPdfOptions] = useState<PDFExportOptions>({
    format: 'a4',
    orientation: 'portrait',
    quality: 2,
    margins: { top: 10, right: 10, bottom: 10, left: 10 },
    includeHeader: false,
    includeFooter: false,
    headerText: '',
    footerText: '',
  });

  // Image Options
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [imageQuality, setImageQuality] = useState(0.95);

  const handleExportPDF = async () => {
    if (!previewElement) {
      error('Aperçu non disponible');
      return;
    }

    setIsExporting(true);
    try {
      await exportToPDF(previewElement, {
        ...pdfOptions,
        filename: `${filename}.pdf`,
      });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-[#2196F3]" />
            Exporter votre CV
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-b-2 border-[#2196F3] text-[#2196F3]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'image'
                ? 'border-b-2 border-[#2196F3] text-[#2196F3]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'print'
                ? 'border-b-2 border-[#2196F3] text-[#2196F3]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'pdf' && (
            <div className="space-y-6">
              {/* Format */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Format de page</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['a4', 'letter', 'legal'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setPdfOptions({ ...pdfOptions, format })}
                      className={`py-2 px-4 rounded-lg border transition-colors ${
                        pdfOptions.format === format
                          ? 'border-[#2196F3] bg-blue-50 text-[#2196F3]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Orientation</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPdfOptions({ ...pdfOptions, orientation: 'portrait' })}
                    className={`py-2 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      pdfOptions.orientation === 'portrait'
                        ? 'border-[#2196F3] bg-blue-50 text-[#2196F3]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-3 h-4 border border-current rounded-sm" />
                    Portrait
                  </button>
                  <button
                    onClick={() => setPdfOptions({ ...pdfOptions, orientation: 'landscape' })}
                    className={`py-2 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      pdfOptions.orientation === 'landscape'
                        ? 'border-[#2196F3] bg-blue-50 text-[#2196F3]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-4 h-3 border border-current rounded-sm" />
                    Paysage
                  </button>
                </div>
              </div>

              {/* Quality */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Qualité: {pdfOptions.quality}x
                </Label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.5"
                  value={pdfOptions.quality}
                  onChange={(e) => setPdfOptions({ ...pdfOptions, quality: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Standard</span>
                  <span>Haute</span>
                  <span>Ultra</span>
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-[#2196F3] font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Options avancées
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                    {/* Margins */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Marges (mm)</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                          <div key={side}>
                            <Label className="text-xs text-gray-500 capitalize">{side}</Label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={pdfOptions.margins?.[side] || 10}
                              onChange={(e) =>
                                setPdfOptions({
                                  ...pdfOptions,
                                  margins: {
                                    ...pdfOptions.margins,
                                    [side]: parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Header/Footer */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Inclure un en-tête</Label>
                        <Switch
                          checked={pdfOptions.includeHeader}
                          onCheckedChange={(checked) =>
                            setPdfOptions({ ...pdfOptions, includeHeader: checked })
                          }
                        />
                      </div>
                      {pdfOptions.includeHeader && (
                        <input
                          type="text"
                          placeholder="Texte de l'en-tête"
                          value={pdfOptions.headerText}
                          onChange={(e) =>
                            setPdfOptions({ ...pdfOptions, headerText: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded"
                        />
                      )}

                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Inclure un pied de page</Label>
                        <Switch
                          checked={pdfOptions.includeFooter}
                          onCheckedChange={(checked) =>
                            setPdfOptions({ ...pdfOptions, includeFooter: checked })
                          }
                        />
                      </div>
                      {pdfOptions.includeFooter && (
                        <input
                          type="text"
                          placeholder="Texte du pied de page"
                          value={pdfOptions.footerText}
                          onChange={(e) =>
                            setPdfOptions({ ...pdfOptions, footerText: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded"
                        />
                      )}
                    </div>
                  </div>
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
                          ? 'border-[#2196F3] bg-blue-50 text-[#2196F3]'
                          : 'border-gray-200 hover:border-gray-300'
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
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {activeTab === 'pdf' && (
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-[#2196F3] hover:bg-[#1976D2]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </>
              )}
            </Button>
          )}
          {activeTab === 'image' && (
            <Button
              onClick={handleExportImage}
              disabled={isExporting}
              className="bg-[#2196F3] hover:bg-[#1976D2]"
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
            <Button onClick={handlePrint} className="bg-[#2196F3] hover:bg-[#1976D2]">
              <Printer className="w-4 h-4 mr-2" />
              Ouvrir l'aperçu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
