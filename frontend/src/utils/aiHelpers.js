export const handleModelHallucinations = (classifications) => {
  if (!classifications || classifications.length === 0) return '';

  const headphoneKeywords = ['headphone', 'earphone', 'headset'];
  const headphoneHallucinations = ['frying pan', 'stethoscope', 'mask', 'seat belt'];
  
  // New: Jewelry/Accessories mapping for common misidentifications
  const jewelryHallucinations = ['face powder', 'pill bottle', 'disk', 'volcano', 'digital clock'];

  // Increase topK results from the model to 5 (handled in aiImageSearch.js)
  // If 'headphones' or 'earphones' appears anywhere in the top 5 results, prioritize it
  for (let c of classifications) {
    const className = c.className.toLowerCase();
    if (headphoneKeywords.some(hk => className.includes(hk))) {
      return 'headphone';
    }
  }

  const topPrediction = classifications[0].className.toLowerCase();
  const topProbability = classifications[0].probability;

  // Check top prediction against known jewelry hallucinations
  // If confidence is low (< 0.6) or it's a known hallucination, map to Jewelery
  if (jewelryHallucinations.some(h => topPrediction.includes(h)) || 
     (topPrediction.includes('face powder') && topProbability < 0.7)) {
    return 'jewelery';
  }

  // Check top prediction against known headphone hallucinations
  if (headphoneHallucinations.some(h => topPrediction.includes(h))) {
    return 'headphone';
  }

  // Otherwise return the top label
  return classifications[0].className.split(',')[0].trim().toLowerCase();
};

