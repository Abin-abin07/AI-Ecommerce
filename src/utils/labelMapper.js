/**
 * Maps AI-generated labels to specific product catalog categories and tags.
 * This helps resolve misidentifications (e.g., jewelry being seen as 'face powder')
 * and expands general labels to specific catalog search terms.
 */
export const mapAiLabelToCatalogTags = (labels) => {
  if (!labels || !Array.isArray(labels)) return [];

  const mapping = {
    // Jewelry specific fixes
    'face powder': ['jewelry', 'accessories', 'gold'], // Fix common misidentification
    'ring': ['jewelry', 'rings', 'accessories'],
    'necklace': ['jewelry', 'accessories'],
    'bracelet': ['jewelry', 'accessories'],
    'metal': ['jewelry', 'tunnels', 'gauges', 'steel'],
    'gold': ['jewelry', 'rose gold', 'accessories'],
    
    // Tunnels & Gauges specific
    'circular': ['tunnels', 'gauges', 'jewelry'],
    'hole': ['tunnels', 'gauges'],
    
    // Electronics & Storage fixes
    'clothing': ['apparel', 'fashion'],
    'shoe': ['footwear', 'sneakers'],
    'electronics': ['gadgets', 'tech'],
    'hard drive': ['electronics', 'storage', 'disk'],
    'disk drive': ['electronics', 'storage', 'hard drive'],
    'magnetic disk': ['electronics', 'storage', 'hard drive'],
    'mobile accessories': ['electronics', 'storage', 'hard drive', 'ssd'], // Fix specific misidentification requested by user
    'modem': ['electronics', 'storage', 'hard drive'],
    'cellular telephone': ['electronics', 'gadgets']
  };

  const catalogTags = new Set();
  
  labels.forEach(label => {
    const lowerLabel = label.toLowerCase();
    
    // Add the original label
    catalogTags.add(lowerLabel);
    
    // Add mapped tags if they exist
    if (mapping[lowerLabel]) {
      mapping[lowerLabel].forEach(tag => catalogTags.add(tag));
    }
  });

  return Array.from(catalogTags);
};
