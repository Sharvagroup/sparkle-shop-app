// Product images - WebP only (for performance and consistency)
export const ALLOWED_PRODUCT_IMAGE_TYPE = 'image/webp';
export const ALLOWED_PRODUCT_IMAGE_ACCEPT = 'image/webp,.webp';

// Site/branding images - WebP and SVG allowed (for animations and vector graphics)
export const ALLOWED_SITE_IMAGE_TYPES = ['image/webp', 'image/svg+xml'];
export const ALLOWED_SITE_IMAGE_ACCEPT = 'image/webp,.webp,image/svg+xml,.svg';

// Legacy exports for backward compatibility
export const ALLOWED_IMAGE_TYPE = ALLOWED_PRODUCT_IMAGE_TYPE;
export const ALLOWED_IMAGE_EXTENSION = '.webp';
export const ALLOWED_IMAGE_ACCEPT = ALLOWED_PRODUCT_IMAGE_ACCEPT;

/**
 * Validate product images - WebP only
 * Use for: Products, Categories, Collections, Reviews
 */
export const validateProductImage = (file: File): { valid: boolean; error?: string } => {
  const isWebP = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
  if (!isWebP) {
    return { 
      valid: false, 
      error: 'Product images must be in WebP format. Please convert your image to WebP before uploading.' 
    };
  }
  return { valid: true };
};

/**
 * Validate site/branding images - WebP and SVG allowed
 * Use for: Logos, banners, backgrounds, icons, About page images
 */
export const validateSiteImage = (file: File): { valid: boolean; error?: string } => {
  const isWebP = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
  const isSVG = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  
  if (!isWebP && !isSVG) {
    return { 
      valid: false, 
      error: 'Only WebP and SVG formats are allowed for site images.' 
    };
  }
  return { valid: true };
};

// Legacy alias - now validates product images (WebP only)
export const validateWebPImage = validateProductImage;

export const validateImageSize = (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image must be less than ${maxSizeMB}MB` };
  }
  return { valid: true };
};
