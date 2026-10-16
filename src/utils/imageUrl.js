// Image URL Resolution and Fallback Utility for Hari Hara Jewellery Works

export const DEFAULT_JEWELLERY_IMAGE = '/luxury-hero-banner.jpg';

/**
 * Returns the backend server base URL (e.g., "http://13.211.179.179:5000" or "" in proxy dev mode)
 */
export const getBackendServerUrl = () => {
  // If explicitly configured
  const explicitImageBase = import.meta.env.VITE_IMAGE_BASE_URL;
  if (explicitImageBase && explicitImageBase.trim()) {
    return explicitImageBase.trim().replace(/\/+$/, '');
  }

  // Derive from VITE_API_BASE_URL (e.g., "http://13.211.179.179:5000/api/" or "https://backend.com/api")
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase && (apiBase.startsWith('http://') || apiBase.startsWith('https://'))) {
    try {
      const url = new URL(apiBase);
      const cleanPath = url.pathname.replace(/\/api\/?$/, '').replace(/\/+$/, '');
      return `${url.origin}${cleanPath}`;
    } catch {
      return apiBase.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    }
  }

  return '';
};

/**
 * Resolves an image URL safely:
 * - Empty / null -> returns fallback
 * - Absolute URLs (http://, https://) -> returns as is
 * - Inline Data URIs (data:image/...) or blob URIs -> returns as is
 * - Backend uploads (/uploads/... or uploads/...) -> prefixes with backend server host
 * - Local public assets (/category-xxx.jpg, /luxury-hero-banner.jpg) -> returns as is
 */
export const getImageUrl = (url, fallback = DEFAULT_JEWELLERY_IMAGE) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const cleanUrl = url.trim();

  // Already absolute or inline data
  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('blob:')
  ) {
    return cleanUrl;
  }

  // Uploaded backend media
  if (cleanUrl.startsWith('/uploads/') || cleanUrl.startsWith('uploads/')) {
    const backendServer = getBackendServerUrl();
    const normalizedPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    return backendServer ? `${backendServer}${normalizedPath}` : normalizedPath;
  }

  // Local frontend public folder assets
  return cleanUrl;
};

/**
 * Fallback handler for <img onError={handleImageError} />
 * Prevents broken image icons and infinite loops.
 */
export const handleImageError = (e, fallback = DEFAULT_JEWELLERY_IMAGE) => {
  if (e?.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};
