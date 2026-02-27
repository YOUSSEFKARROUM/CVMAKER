import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
}

const formatDimensions = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
};

/**
 * Exporte un CV vers PDF avec format A4 exact
 * Cette version garantit que le CV tient sur une page avec les bonnes proportions
 */
export async function exportCVToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // Attendre que tout soit chargé
  await document.fonts.ready;
  await new Promise(resolve => setTimeout(resolve, 500));

  const format = 'a4';
  const dims = formatDimensions[format];
  const pageWidth = dims.width;  // 210mm
  const pageHeight = dims.height; // 297mm

  // Sauvegarder les styles et classes originaux
  const originalStyles = {
    width: element.style.width,
    height: element.style.height,
    maxWidth: element.style.maxWidth,
    maxHeight: element.style.maxHeight,
    transform: element.style.transform,
    transformOrigin: element.style.transformOrigin,
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    margin: element.style.margin,
    padding: element.style.padding,
  };
  const hadPdfExportClass = element.classList.contains('pdf-export-mode');

  try {
    // 1. Préparer l'élément pour une capture parfaite
    // Ajouter classe pour styles PDF
    element.classList.add('pdf-export-mode');
    
    // Forcer une taille fixe exactement A4 pour le rendu
    element.style.width = '210mm';
    element.style.maxWidth = '210mm';
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.margin = '0';
    element.style.padding = '0';
    element.style.transform = 'none';
    element.style.position = 'relative';
    element.style.left = '0';
    element.style.top = '0';

    // Attendre le rendu
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2. Capturer avec html2canvas
    // Utiliser un scale élevé pour la qualité, mais nous réduirons ensuite
    const canvas = await html2canvas(element, {
      scale: 3, // Haute qualité
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    // 3. Créer le PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 4. Calculer les dimensions pour fit parfait dans A4
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgRatio = imgWidth / imgHeight;
    const pageRatio = pageWidth / pageHeight;

    let finalWidth: number;
    let finalHeight: number;
    let x: number;
    let y: number;

    // Déterminer comment ajuster l'image
    if (imgRatio > pageRatio) {
      // L'image est plus large que la page (relativement)
      // On l'ajuste à la largeur de la page
      finalWidth = pageWidth;
      finalHeight = pageWidth / imgRatio;
      x = 0;
      y = (pageHeight - finalHeight) / 2; // Centrer verticalement
    } else {
      // L'image est plus haute que la page
      // On l'ajuste à la hauteur de la page
      finalHeight = pageHeight;
      finalWidth = pageHeight * imgRatio;
      x = (pageWidth - finalWidth) / 2; // Centrer horizontalement
      y = 0;
    }

    // Si l'image dépasse toujours, la réduire davantage
    if (finalWidth > pageWidth || finalHeight > pageHeight) {
      const scaleX = pageWidth / finalWidth;
      const scaleY = pageHeight / finalHeight;
      const scale = Math.min(scaleX, scaleY);
      finalWidth *= scale;
      finalHeight *= scale;
      x = (pageWidth - finalWidth) / 2;
      y = (pageHeight - finalHeight) / 2;
    }

    // 5. Convertir en image et ajouter au PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    pdf.addImage(
      imgData,
      'JPEG',
      x,
      y,
      finalWidth,
      finalHeight,
      undefined,
      'SLOW' // Meilleure qualité
    );

    // 6. Sauvegarder
    pdf.save(filename);

  } finally {
    // Toujours restaurer les styles et classes originaux
    if (!hadPdfExportClass) {
      element.classList.remove('pdf-export-mode');
    }
    element.style.width = originalStyles.width;
    element.style.height = originalStyles.height;
    element.style.maxWidth = originalStyles.maxWidth;
    element.style.maxHeight = originalStyles.maxHeight;
    element.style.transform = originalStyles.transform;
    element.style.transformOrigin = originalStyles.transformOrigin;
    element.style.position = originalStyles.position;
    element.style.left = originalStyles.left;
    element.style.top = originalStyles.top;
    element.style.margin = originalStyles.margin;
    element.style.padding = originalStyles.padding;
  }
}

/**
 * Fonction legacy - utiliser exportCVToPDF à la place
 */
export async function exportToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const { filename = `CV-${Date.now()}.pdf` } = options;
  return exportCVToPDF(element, filename);
}

export async function exportToImage(
  element: HTMLElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  return canvas.toDataURL(`image/${format}`, quality);
}

export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function generateThumbnail(
  element: HTMLElement,
  width: number = 300
): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const thumbnailCanvas = document.createElement('canvas');
  const aspectRatio = canvas.height / canvas.width;
  thumbnailCanvas.width = width;
  thumbnailCanvas.height = width * aspectRatio;

  const ctx = thumbnailCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      thumbnailCanvas.width,
      thumbnailCanvas.height
    );
  }

  return thumbnailCanvas.toDataURL('image/jpeg', 0.8);
}

export function printCV(elementId: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const element = document.getElementById(elementId);
  if (!element) return;

  // Cloner l'élément pour modification
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Forcer les styles pour l'impression
  clonedElement.style.width = '210mm';
  clonedElement.style.minHeight = '297mm';
  clonedElement.style.maxWidth = '210mm';
  clonedElement.style.margin = '0';
  clonedElement.style.padding = '0';
  clonedElement.style.transform = 'none';
  clonedElement.style.boxShadow = 'none';

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV - Impression</title>
        <style>
          ${styles}
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body { 
            margin: 0; 
            padding: 0;
            background: white;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${clonedElement.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 1000);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
