import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  includeHeader?: boolean;
  includeFooter?: boolean;
  headerText?: string;
  footerText?: string;
}

const formatDimensions = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
};

export async function exportToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const { 
    filename = `CV-${Date.now()}.pdf`, 
    quality = 2,
    scale = 2,
    format = 'a4',
    orientation = 'portrait',
    margins = { top: 10, right: 10, bottom: 10, left: 10 },
    includeHeader = false,
    includeFooter = false,
    headerText = '',
    footerText = '',
  } = options;

  try {
    // Get format dimensions
    const dims = formatDimensions[format];
    const pageWidth = orientation === 'portrait' ? dims.width : dims.height;
    const pageHeight = orientation === 'portrait' ? dims.height : dims.width;

    // Calculate content dimensions
    const contentWidth = pageWidth - (margins.left || 0) - (margins.right || 0);
    const contentHeight = pageHeight - (margins.top || 0) - (margins.bottom || 0);

    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in cloned document
        const clonedElement = clonedDoc.body.querySelector('[data-cv-preview]');
        if (clonedElement) {
          (clonedElement as HTMLElement).style.fontFamily = element.style.fontFamily;
        }
      },
    });

    // Calculate PDF dimensions
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const imgData = canvas.toDataURL('image/jpeg', quality);

    let heightLeft = imgHeight;
    let position = margins.top || 0;
    let pageNumber = 1;

    // Add first page
    addPageContent(pdf, imgData, position, imgWidth, imgHeight, margins);
    
    // Add header if enabled
    if (includeHeader && headerText) {
      addHeader(pdf, headerText, margins, pageWidth);
    }
    
    // Add footer if enabled
    if (includeFooter && footerText) {
      addFooter(pdf, footerText, margins, pageWidth, pageHeight, pageNumber);
    }

    heightLeft -= contentHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      pageNumber++;
      position = (margins.top || 0) - (imgHeight - heightLeft);
      pdf.addPage();
      addPageContent(pdf, imgData, position, imgWidth, imgHeight, margins);
      
      if (includeHeader && headerText) {
        addHeader(pdf, headerText, margins, pageWidth);
      }
      
      if (includeFooter && footerText) {
        addFooter(pdf, footerText, margins, pageWidth, pageHeight, pageNumber);
      }
      
      heightLeft -= contentHeight;
    }

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export PDF');
  }
}

function addPageContent(
  pdf: jsPDF,
  imgData: string,
  position: number,
  imgWidth: number,
  imgHeight: number,
  margins: { top?: number; right?: number; bottom?: number; left?: number }
): void {
  pdf.addImage(
    imgData,
    'JPEG',
    margins.left || 0,
    position,
    imgWidth,
    imgHeight,
    undefined,
    'FAST'
  );
}

function addHeader(
  pdf: jsPDF,
  text: string,
  margins: { top?: number; right?: number; bottom?: number; left?: number },
  pageWidth: number
): void {
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    text,
    pageWidth / 2,
    (margins.top || 10) - 5,
    { align: 'center' }
  );
}

function addFooter(
  pdf: jsPDF,
  text: string,
  margins: { top?: number; right?: number; bottom?: number; left?: number },
  pageWidth: number,
  pageHeight: number,
  pageNumber: number
): void {
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `${text} - Page ${pageNumber}`,
    pageWidth / 2,
    pageHeight - (margins.bottom || 10) + 5,
    { align: 'center' }
  );
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

  // Create a thumbnail canvas
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
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
