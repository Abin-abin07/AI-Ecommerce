import { useMemo } from 'react';

// Cosine similarity between two 1D arrays
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Fallback fuzzy search using tag matching (Jaccard-like text similarity)
const calculateTextSimilarity = (terms, product) => {
  if (!terms || terms.length === 0) return 0;
  
  // Expanded dictionary for fuzzy matching
  const termExpansion = {
    'laptop': ['computer', 'electronics', 'tech'],
    'cell phone': ['phone', 'smartphone', 'mobile', 'electronics'],
    'cup': ['mug', 'glass', 'coffee'],
    'shoe': ['sneaker', 'running', 'apparel'],
    'person': ['clothing', 'apparel', 'fashion'],
    'backpack': ['bag', 'travel', 'accessories'],
    'monitor': ['screen', 'display', 'electronics'],
    'hardware': ['storage', 'ssd', 'hdd', 'wd', 'seagate'],
    'fitness': ['gym', 'workout', 'weights', 'dumbbells', 'health'],
    'headphones': ['electronics', 'tech', 'audio', 'earbuds', 'headset']
  };

  const expandedTerms = new Set([...terms]);
  terms.forEach(term => {
    const lowerTerm = term.toLowerCase();
    if (termExpansion[lowerTerm]) {
      termExpansion[lowerTerm].forEach(t => expandedTerms.add(t));
    }
  });

  const finalTerms = Array.from(expandedTerms);
  const productText = `${product.title} ${product.description} ${product.category} ${(product.tags || []).join(' ')}`.toLowerCase();
  
  let matchCount = 0;
  finalTerms.forEach(term => {
    if (productText.includes(term.toLowerCase())) {
      matchCount += 1;
    }
  });
  
  // Score is relative to the number of search terms, can be > 1 if multiple hits, which is fine for sorting
  return matchCount / Math.max(finalTerms.length, 1);
};

/**
 * useVision - Handles sorting and filtering of products based on visual features or text terms.
 * Guarantees a return of at least 5 products for visual searches using soft thresholding.
 */
export const useVision = (products, imageFeatures, searchTerms, isImageSearchActive) => {
  return useMemo(() => {
    // If no search is active, just return empty to let the UI show default state
    if ((!searchTerms || searchTerms.length === 0) && !isImageSearchActive) {
      return { results: products, isPerfectMatch: true, aiDetectedLabel: null };
    }

    const aiLabel = imageFeatures?.topLabel || '';
    const isHeadphone = aiLabel === 'headphone' || aiLabel === 'headphones';
    const isTechRelated = ['electronic', 'audio', 'computer', 'laptop', 'headphone', 'tech', 'device', 'hardware'].some(t => aiLabel.includes(t));
    const isComputerDetected = ['computer', 'laptop', 'macbook', 'desktop'].some(t => aiLabel.includes(t));

    // Hard Filter: Strict filter for headphones, else general tech filter
    let eligibleProducts = products;
    if (isHeadphone) {
      eligibleProducts = products.filter(p => 
        p.category.toLowerCase() === 'electronics' && 
        (p.title.toLowerCase().includes('headphone') || (p.tags && p.tags.some(t => t.toLowerCase().includes('headphone'))))
      );
    } else if (isTechRelated) {
      eligibleProducts = products.filter(p => !p.category.toLowerCase().includes('clothing'));
    }
    
    // Stop Category Mixing: If computer is detected, explicitly exclude accessories like SSD, Hard Drive, Cables
    if (isComputerDetected) {
      const excludedKeywords = ['ssd', 'hard drive', 'hdd', 'cable', 'wd', 'seagate'];
      eligibleProducts = eligibleProducts.filter(p => {
        const productText = `${p.title} ${(p.tags || []).join(' ')}`.toLowerCase();
        return !excludedKeywords.some(keyword => productText.includes(keyword));
      });
    }

    // Score all eligible products in the catalog
    const scoredProducts = eligibleProducts.map(product => {
      let cosineScore = 0;
      let usingFallback = false;

      // 1. Feature Extraction & Embedding matching
      if (imageFeatures?.embedding && product.embedding) {
        cosineScore = cosineSimilarity(imageFeatures.embedding, product.embedding);
      } 
      // 2. Fallback Search: Fuzzy matching on AI-generated tags
      else {
        cosineScore = calculateTextSimilarity(searchTerms, product);
        usingFallback = true;
      }

      // Keyword Match logic for Exact Keyword Priority
      let keywordMatchScore = 0;
      if (aiLabel) {
        const productText = `${product.title} ${(product.tags || []).join(' ')}`.toLowerCase();
        // Exact match of the entire label
        if (productText.includes(aiLabel)) {
          keywordMatchScore = 1;
        } else {
          // Or match individual significant words (like 'computer' or 'laptop' from 'desktop computer')
          const labelWords = aiLabel.split(' ').filter(w => w.length > 2);
          for (let word of labelWords) {
            if (productText.includes(word)) {
              keywordMatchScore = 1;
              break;
            }
          }
        }
      }

      // Weighted Similarity calculation
      // Ensure score uses 70% cosine similarity and 30% keyword match
      const finalScore = (cosineScore * 0.7) + (keywordMatchScore * 0.3);

      return { product, score: finalScore, usingFallback };
    });

    // Sort the entire product catalog by similarity score descending
    scoredProducts.sort((a, b) => b.score - a.score);

    // If it's a text search, we can be more strict
    if (!isImageSearchActive) {
      const strictMatches = scoredProducts.filter(p => p.score > 0).map(p => p.product);
      return {
        results: strictMatches,
        isPerfectMatch: strictMatches.length > 0,
        aiDetectedLabel: null
      };
    }

    // Determine if the match is "perfect" or just "similar"
    const topScore = scoredProducts.length > 0 ? scoredProducts[0].score : 0;
    const isPerfectMatch = topScore >= 0.5;

    let topMatches = [];
    let needsCategoryReset = false;
    
    // If we're strictly filtering for headphones, skip the generic soft fallback
    if (isHeadphone) {
      topMatches = scoredProducts.slice(0, 5);
    } else {
      // Similarity Thresholding / Soft Fallback
      // If no product has a high similarity score, show the top 4 products from the same category as the AI label
      if (topScore < 0.2 && aiLabel) {
         // Try to map aiLabel to a broad category
         const mappedCategory = isTechRelated ? 'electronics' : aiLabel;
         
         const fallbackProducts = products.filter(p => 
           p.category.toLowerCase().includes(mappedCategory) || 
           (p.tags && p.tags.some(t => t.toLowerCase().includes(mappedCategory)))
         );
         
         if (fallbackProducts.length >= 4) {
           topMatches = fallbackProducts.slice(0, 4).map(p => ({ product: p }));
         } else {
           // Category Reset
           needsCategoryReset = true;
           const electronicsProducts = products.filter(p => p.category.toLowerCase().includes('electronics'));
           if (electronicsProducts.length > 0) {
             topMatches = electronicsProducts.slice(0, 4).map(p => ({ product: p }));
           } else {
             topMatches = scoredProducts.slice(0, 4);
           }
         }
      } else {
        // Always return the top 5 closest matches normally
        topMatches = scoredProducts.slice(0, 5);
      }
    }

    return {
      results: topMatches.map(m => m.product || m),
      isPerfectMatch,
      topScore,
      aiDetectedLabel: aiLabel,
      needsCategoryReset
    };
  }, [products, imageFeatures, searchTerms, isImageSearchActive]);
};
