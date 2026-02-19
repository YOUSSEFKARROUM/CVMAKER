export interface PhotoUploadResult {
  dataUrl: string;
  file: File;
}

export function validatePhoto(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Le fichier est trop volumineux. Taille maximum: 5MB.' };
  }

  return { valid: true };
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function resizeImage(
  dataUrl: string,
  maxWidth: number = 400,
  maxHeight: number = 400
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create canvas and resize
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw image with white background (for transparent images)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export function createCircularImage(dataUrl: string, size: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Create circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw image
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export async function processPhotoUpload(file: File): Promise<PhotoUploadResult> {
  // Validate
  const validation = validatePhoto(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Read file
  const dataUrl = await readFileAsDataURL(file);

  // Resize
  const resizedDataUrl = await resizeImage(dataUrl, 400, 400);

  return {
    dataUrl: resizedDataUrl,
    file,
  };
}
