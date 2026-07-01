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
 *
 * POURQUOI LE CLONE :
 * html2canvas dans son contexte Canvas2D ne rend pas la largeur naturelle des espaces
 * pour certaines polices (Lato, Bebas Neue, etc.) — ctx.measureText(' ').width = 0.
 * La seule solution fiable est d'ajouter word-spacing CSS explicite AVANT que html2canvas
 * lise les computed styles. Cela doit être fait sur un clone dans le document principal
 * (pas via onclone qui utilise un document interne ignoré par getComputedStyle).
 *
 * POURQUOI position:absolute left:-9999px :
 * - Ne modifie pas l'élément visible par l'utilisateur
 * - html2canvas capture depuis les coordonnées propres de l'élément (0,0) → pas de troncature
 * - Contrairement à position:fixed, absolute ne décale pas le référentiel des enfants
 *
 * OVERFLOW visible sur conteneurs texte :
 * word-spacing:2px peut faire déborder les titres longs dans les layouts 2 colonnes.
 * On ouvre l'overflow sur tout sauf les conteneurs circulaires (photos de profil).
 */
export async function exportCVToPDF(
  element: HTMLElement,
  filename: string,
  pageMode: 'single' | 'auto-fit' | 'multi-page' = 'auto-fit'
): Promise<void> {
  await document.fonts.ready;

  // --- Cloner dans le document principal à gauche hors-viewport ---
  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.add('pdf-export-mode');
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = `${A4_W_PX}px`;
  clone.style.maxWidth = `${A4_W_PX}px`;
  clone.style.height = 'auto';
  clone.style.maxHeight = 'none';
  clone.style.overflow = 'visible';
  clone.style.transform = 'none';
  clone.style.zIndex = '-1';

  clone.querySelectorAll<HTMLElement>('*').forEach(el => {
    // word-spacing RELATIF (em) : scale avec la taille de police
    // 2px absolu était insuffisant pour Bebas Neue ≥36px (espace naturel=0px, 2px≈4% → invisible)
    // 0.2em = 2.8px à 14px, 9.6px à 48px → visible à toutes les tailles
    el.style.wordSpacing = '0.2em';
    // letter-spacing minimal : évite la fusion des glyphes (é, à, ê...) dans html2canvas
    el.style.letterSpacing = '0.01em';
    // overflow visible partout sauf photos de profil (rounded-full) et images
    if (!el.classList.contains('rounded-full') && el.tagName !== 'IMG') {
      el.style.overflow = 'visible';
      el.style.overflowX = 'visible';
      el.style.overflowY = 'visible';
    }
  });

  document.body.appendChild(clone);

  // 2 frames + 600ms : laisse le navigateur recalculer layout, polices et word-spacing relatif
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    const contentHeight = clone.scrollHeight;

    // 1. Capturer tout le contenu en une seule image haute résolution
    const fullCanvas = await html2canvas(clone, {
      scale: CAPTURE_SCALE,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_W_PX,
      height: contentHeight,
      windowWidth: A4_W_PX,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      letterRendering: false,
      foreignObjectRendering: false,
    } as Html2CanvasOptions);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageImgH = A4_H_PX * CAPTURE_SCALE;
    const totalImgHeight = fullCanvas.height;

    if (pageMode === 'single' || pageMode === 'auto-fit') {
      // ── Tout tenir sur 1 page — compression proportionnelle si nécessaire ──
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = fullCanvas.width;
      pageCanvas.height = pageImgH;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      if (totalImgHeight > pageImgH) {
        // Compression proportionnelle (maintient le ratio largeur/hauteur)
        const scaleRatio = pageImgH / totalImgHeight;
        const scaledW = Math.round(fullCanvas.width * scaleRatio);
        const xOffset = Math.round((pageCanvas.width - scaledW) / 2);
        ctx.drawImage(fullCanvas, 0, 0, fullCanvas.width, totalImgHeight, xOffset, 0, scaledW, pageImgH);
      } else {
        // Contenu tient déjà sur 1 page — pas de compression
        ctx.drawImage(fullCanvas, 0, 0);
      }

      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    } else {
      // ── Multi-page : découper le canvas en tranches A4 ──
      const totalPages = Math.ceil(totalImgHeight / pageImgH);
      let pageCount = totalPages;

      // Détecter et supprimer la dernière page si quasi-vide
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
          const r = imageData.data[i], g = imageData.data[i + 1], b = imageData.data[i + 2];
          if (r < 250 || g < 250 || b < 250) nonWhitePixels++;
        }
        if (nonWhitePixels / totalPixels < 0.02) pageCount = totalPages - 1;
      }

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
        ctx.drawImage(fullCanvas, 0, srcY, fullCanvas.width, srcH, 0, 0, fullCanvas.width, srcH);
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
    }

    pdf.save(filename);

  } finally {
    if (document.body.contains(clone)) document.body.removeChild(clone);
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
