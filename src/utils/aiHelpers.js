export const handleModelHallucinations = (classifications) => {
  if (!classifications || classifications.length === 0) return '';

  const headphoneKeywords = ['headphone', 'earphone', 'headset'];
  const headphoneHallucinations = ['frying pan', 'stethoscope', 'mask', 'seat belt'];

  // Increase topK results from the model to 5 (handled in aiImageSearch.js)
  // If 'headphones' or 'earphones' appears anywhere in the top 5 results, prioritize it
  for (let c of classifications) {
    const className = c.className.toLowerCase();
    if (headphoneKeywords.some(hk => className.includes(hk))) {
      return 'headphone';
    }
  }

  // Check top prediction against known hallucinations
  const topPrediction = classifications[0].className.toLowerCase();
  if (headphoneHallucinations.some(h => topPrediction.includes(h))) {
    return 'headphone';
  }

  // Otherwise return the top label
  return classifications[0].className.split(',')[0].trim().toLowerCase();
};
