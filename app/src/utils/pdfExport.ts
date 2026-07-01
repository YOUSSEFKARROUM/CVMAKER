import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
}

// Dimensions A4 en pixels à 96dpi (référence pour le slicing)
const A4_W_PX = 794;
const A4_H_PX = 1123;
// Scale de capture — 2 donne du 1588×2246 par page, qualité suffisante
const CAPTURE_SCALE = 2;
type Html2CanvasOptions = NonNullable<Parameters<typeof html2canvas>[1]> & {
  letterRendering?: boolean;
};

/**
 * Exporte un CV vers PDF multi-page A4.
 * Capture l'élément en haute résolution, puis le découpe en tranches A4.
 *
 * Fix mots collés : letterRendering:false — html2canvas rend les mots entiers
 * (ctx.fillText(mot)) plutôt que caractère par caractère. En mode letter-by-letter,
 * ctx.measureText(' ').width = 0 dans certains contextes Canvas → espaces invisibles.
 */
export async function exportCVToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  await document.fonts.ready;
  await new Promise(resolve => setTimeout(resolve, 300));

  const hadPdfExportClass = element.classList.contains('pdf-export-mode');
  const saved = {
    width: element.style.width,
    maxWidth: element.style.maxWidth,
    height: element.style.height,
    maxHeight: element.style.maxHeight,
    transform: element.style.transform,
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    overflow: element.style.overflow,
    overflowX: element.style.overflowX,
    overflowY: element.style.overflowY,
  };

  try {
    element.classList.add('pdf-export-mode');
    element.style.width = `${A4_W_PX}px`;
    element.style.maxWidth = `${A4_W_PX}px`;
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.transform = 'none';
    element.style.position = 'relative';
    element.style.left = '0';
    element.style.top = '0';
    element.style.overflow = 'visible';
    element.style.overflowX = 'visible';
    element.style.overflowY = 'visible';

    await new Promise(resolve => setTimeout(resolve, 300));

    // 1. Capturer tout le contenu en une seule image haute résolution
    const fullCanvas = await html2canvas(element, {
      scale: CAPTURE_SCALE,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_W_PX,
      height: element.scrollHeight,
      windowWidth: A4_W_PX,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      letterRendering: false,  // Fix mots collés : rendu mot-par-mot, espaces gérés nativement
      foreignObjectRendering: false,
    } as Html2CanvasOptions);

    const totalImgHeight = fullCanvas.height; // en px canvas (scale inclus)
    const pageImgH = A4_H_PX * CAPTURE_SCALE;  // hauteur d'une page en px canvas
    const totalPages = Math.ceil(totalImgHeight / pageImgH);
    let pageCount = totalPages;

    if (totalPages > 1) {
      const lastPageStart = (totalPages - 1) * pageImgH;
      const lastPageHeight = totalImgHeight - lastPageStart;
      const lastPageCanvas = document.createElement('canvas');
      lastPageCanvas.width = fullCanvas.width;
      lastPageCanvas.height = Math.min(pageImgH, lastPageHeight);
      const lastPageCtx = lastPageCanvas.getContext('2d')!;
      lastPageCtx.drawImage(
        fullCanvas,
        0, lastPageStart, fullCanvas.width, lastPageHeight,
        0, 0, fullCanvas.width, lastPageHeight
      );

      const imageData = lastPageCtx.getImageData(0, 0, lastPageCanvas.width, lastPageCanvas.height);
      let nonWhitePixels = 0;
      const totalPixels = imageData.data.length / 4;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        if (r < 250 || g < 250 || b < 250) {
          nonWhitePixels++;
        }
      }

      if (nonWhitePixels / totalPixels < 0.02) {
        pageCount = totalPages - 1;
      }
    }

    // 2. Créer le PDF A4
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = 210; // mm
    const pdfH = 297; // mm

    // Canvas tampon pour chaque tranche de page
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = fullCanvas.width;
    pageCanvas.height = pageImgH;
    const ctx = pageCanvas.getContext('2d')!;

    for (let page = 0; page < pageCount; page++) {
      if (page > 0) pdf.addPage();

      const srcY = page * pageImgH;
      const srcH = Math.min(pageImgH, totalImgHeight - srcY);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        fullCanvas,
        0, srcY, fullCanvas.width, srcH,  // source
        0, 0, fullCanvas.width, srcH       // destination
      );

      const pageImg = pageCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(pageImg, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST');
    }

    pdf.save(filename);

  } finally {
    if (!hadPdfExportClass) element.classList.remove('pdf-export-mode');
    element.style.width = saved.width;
    element.style.maxWidth = saved.maxWidth;
    element.style.height = saved.height;
    element.style.maxHeight = saved.maxHeight;
    element.style.transform = saved.transform;
    element.style.position = saved.position;
    element.style.left = saved.left;
    element.style.top = saved.top;
    element.style.overflow = saved.overflow;
    element.style.overflowX = saved.overflowX;
    element.style.overflowY = saved.overflowY;
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
