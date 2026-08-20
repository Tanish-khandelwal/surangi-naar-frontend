/**
 * Helper function to safely format image URLs across the application.
 * Fixes missing leading slashes, bare filenames, and backend upload URLs.
 */
export const getImageUrl = (path) => {
  if (!path) return '/images/products/real_product_1.jpg';

  // Return full URLs or data URLs directly
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // If path is absolute starting with slash
  if (path.startsWith('/')) {
    return path;
  }

  // If path starts with images/
  if (path.startsWith('images/')) {
    return `/${path}`;
  }

  // If path starts with uploads/ (backend static uploads)
  if (path.startsWith('uploads/')) {
    const backendHost = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${backendHost}/${path}`;
  }

  // Bare filename like "real_product_2.jpg"
  return `/images/products/${path}`;
};
