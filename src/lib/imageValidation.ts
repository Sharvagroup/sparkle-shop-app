// Product image validation (WebP only)
export const ALLOWED_PRODUCT_IMAGE_TYPE = 'image/webp';
export const ALLOWED_PRODUCT_IMAGE_EXTENSION = '.webp';
export const ALLOWED_PRODUCT_IMAGE_ACCEPT = 'image/webp,.webp';

// Site/branding image validation (WebP and SVG)
export const ALLOWED_SITE_IMAGE_TYPE = ['image/webp', 'image/svg+xml'];
export const ALLOWED_SITE_IMAGE_EXTENSION = ['.webp', '.svg'];
export const ALLOWED_SITE_IMAGE_ACCEPT = 'image/webp,.webp,image/svg+xml,.svg';

// Legacy exports for backward compatibility
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

export const validateProductImage = (file: File): { valid: boolean; error?: string } => {
  if (file.type !== ALLOWED_PRODUCT_IMAGE_TYPE && !file.name.toLowerCase().endsWith(ALLOWED_PRODUCT_IMAGE_EXTENSION)) {
    return { 
      valid: false, 
      error: 'Product images must be in WebP format. Please convert your image to WebP before uploading.' 
    };
  }
  return { valid: true };
};

export const validateSiteImage = (file: File): { valid: boolean; error?: string } => {
  const fileTypeValid = ALLOWED_SITE_IMAGE_TYPE.includes(file.type);
  const fileExtensionValid = ALLOWED_SITE_IMAGE_EXTENSION.some(ext => file.name.toLowerCase().endsWith(ext));

  if (!fileTypeValid && !fileExtensionValid) {
    return { 
      valid: false, 
      error: 'Only WebP and SVG formats are allowed for site images.' 
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
