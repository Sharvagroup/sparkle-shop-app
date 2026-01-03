export const ALLOWED_IMAGE_TYPE = 'image/webp';
export const ALLOWED_IMAGE_EXTENSION = '.webp';
export const ALLOWED_IMAGE_ACCEPT = 'image/webp,.webp';

export const validateWebPImage = (file: File): { valid: boolean; error?: string } => {
  if (file.type !== 'image/webp' && !file.name.toLowerCase().endsWith('.webp')) {
    return { 
      valid: false, 
      error: 'Only WebP format is allowed. Please convert your image to WebP before uploading.' 
    };
  }
  return { valid: true };
};

export const validateImageSize = (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image must be less than ${maxSizeMB}MB` };
  }
  return { valid: true };
};
