
/**
 * Handles image loading errors by providing a fallback placeholder.
 * @param {Event} e - The error event from the img element
 */
export const handleImageError = (e) => {
  const placeholderUrl = 'https://placehold.co/600x400?text=Product+Image';
  if (e.target.src !== placeholderUrl) {
    e.target.src = placeholderUrl;
    e.target.className += ' is-placeholder';
  }
};

/**
 * Gets the correct asset URL for Vite environments.
 * Useful when mapping through products with local paths.
 * @param {string} path - The relative path from src/assets
 * @returns {string} The resolved URL
 */
export const getAssetUrl = (path) => {
  return new URL(`../assets/${path}`, import.meta.url).href;
};
