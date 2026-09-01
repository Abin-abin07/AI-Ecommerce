/**
 * Generates product recommendations based on user browsing history.
 *
 * @param {Array} allProducts - List of all available products
 * @param {Object} viewedCategories - Map of category names to view counts
 * @param {Array} viewedProducts - List of recently viewed product objects
 * @returns {Array} - Sorted array of recommended products
 */
export const getRecommendations = (allProducts, viewedCategories, viewedProducts) => {
  if (!allProducts || allProducts.length === 0) return [];

  // If no history, return random or newest products (we'll just slice the first few for now)
  if (Object.keys(viewedCategories).length === 0 && viewedProducts.length === 0) {
    // Return a random selection as default recommendation
    return [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 8);
  }

  const viewedProductIds = new Set(viewedProducts.map(p => p.id));

  // Score each product
  const scoredProducts = allProducts.map(product => {
    let score = 0;

    // 1. Category affinity
    if (viewedCategories[product.category]) {
      // Add points based on how many times category was viewed (cap at 10)
      score += Math.min(viewedCategories[product.category], 10) * 2;
    }

    // 2. Already viewed penalty
    // We might still want to recommend viewed items, but lower priority than new items in favorite categories
    if (viewedProductIds.has(product.id)) {
      score -= 5;
    }

    // 3. Rating bonus
    if (product.rating && product.rating.rate) {
      score += product.rating.rate;
    }

    return { ...product, recommendationScore: score };
  });

  // Sort by score descending
  scoredProducts.sort((a, b) => b.recommendationScore - a.recommendationScore);

  // Return top 8 recommendations
  return scoredProducts.slice(0, 8);
};
