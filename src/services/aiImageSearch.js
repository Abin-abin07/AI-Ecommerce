import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { createWorker } from 'tesseract.js';
import { mapAiLabelToCatalogTags } from '../utils/labelMapper';

let mobilenetModel = null;
let cocoSsdModel = null;
let tesseractWorker = null;

/**
 * Loads the AI models and OCR worker
 */
export const loadModel = async () => {
  if (mobilenetModel && cocoSsdModel && tesseractWorker) {
    return { mobilenetModel, cocoSsdModel, tesseractWorker };
  }
  
  try {
    await tf.ready();
    
    // Load vision models and Tesseract worker in parallel
    const [mobile, coco, worker] = await Promise.all([
      mobilenet.load({ version: 2, alpha: 1.0 }),
      cocossd.load(),
      createWorker('eng')
    ]);
    
    mobilenetModel = mobile;
    cocoSsdModel = coco;
    tesseractWorker = worker;
    
    console.log("AI Vision & OCR engines loaded successfully");
    return { mobilenetModel, cocoSsdModel, tesseractWorker };
  } catch (error) {
    console.error("Error loading AI models:", error);
    throw error;
  }
};

/**
 * Preprocesses image using Canvas API for better recognition
 */
const preprocessImage = (imageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Standard MobileNet size is 224x224
  canvas.width = 224;
  canvas.height = 224;
  
  // Center crop and resize
  const minDim = Math.min(imageElement.width, imageElement.height);
  const sx = (imageElement.width - minDim) / 2;
  const sy = (imageElement.height - minDim) / 2;
  
  ctx.drawImage(imageElement, sx, sy, minDim, minDim, 0, 0, 224, 224);
  return canvas;
};

/**
 * Classifies, detects objects, and performs OCR on an image
 */
export const classifyImage = async (imageElement) => {
  try {
    const { mobilenetModel, cocoSsdModel, tesseractWorker } = await loadModel();
    
    // Preprocess image for vision models
    const processedCanvas = preprocessImage(imageElement);
    
    // Run all models in parallel: Classification, Object Detection, and OCR
    const [classification, detection, ocrResult] = await Promise.all([
      mobilenetModel.classify(processedCanvas),
      cocoSsdModel.detect(processedCanvas),
      tesseractWorker.recognize(imageElement) // OCR works best on original image
    ]);
    
    const aspectRatio = imageElement.width / imageElement.height;
    
    return {
      classification,
      detection,
      ocrText: ocrResult.data.text,
      aspectRatio
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { classification: [], detection: [], ocrText: '', aspectRatio: 1 };
  }
};

/**
 * Extracts key search terms with OCR priority
 */
export const extractSearchTerms = (predictions) => {
  if (!predictions) return [];
  
  const rawTerms = new Set();
  const { classification = [], detection = [], ocrText = '', aspectRatio } = predictions;
  
  // 1. Process OCR text (EXTREME PRIORITY - reads labels like "WD", "iPhone", etc.)
  if (ocrText && ocrText.trim()) {
    const lines = ocrText.toLowerCase().split('\n');
    lines.forEach(line => {
      const words = line.split(/[^a-z0-9]/).filter(w => w.length > 1);
      words.forEach(word => {
        // Filter out common meaningless OCR noise
        if (word.length > 2 && !['and', 'the', 'for'].includes(word)) {
          rawTerms.add(word);
        }
      });
    });
    console.log("OCR terms extracted:", Array.from(rawTerms));
  }

  const CONFIDENCE_THRESHOLD = 0.85; 
  let highConfidenceFound = rawTerms.size > 0; 
  
  // 2. Process COCO-SSD detections (Priority for specific objects)
  detection.forEach(d => {
    // Ignore 'person' if we have other objects, as it's usually background
    if (d.class.toLowerCase() === 'person') return;

    if (d.score >= CONFIDENCE_THRESHOLD) {
      highConfidenceFound = true;
      rawTerms.add(d.class.toLowerCase());
      
      // Specific check for metal bar structures (often classified as 'tie' or 'stick' by general models)
      if (d.class.toLowerCase() === 'tie' || d.class.toLowerCase() === 'umbrella') {
        if (aspectRatio > 2.0) {
          rawTerms.add('pull up bar');
          rawTerms.add('fitness');
        }
      }
    }
  });
  
  // 3. Process MobileNet classifications
  classification.forEach(p => {
    if (p.className.toLowerCase().includes('person') || p.className.toLowerCase().includes('human')) return;

    if (p.probability >= CONFIDENCE_THRESHOLD) {
      highConfidenceFound = true;
      const classes = p.className.split(',').map(c => c.trim().toLowerCase());
      classes.forEach(c => rawTerms.add(c));
    }
  });

  // CRITICAL FIX: Hardware vs Mobile Misidentification
  // External hard drives are often boxy (1.0 - 1.5 aspect ratio)
  if (aspectRatio > 0.8 && aspectRatio < 1.6) {
    const phoneLabels = ['cellular telephone', 'mobile phone', 'hand-held computer', 'iphone'];
    const mobilePrediction = classification.find(p => 
      phoneLabels.some(label => p.className.toLowerCase().includes(label))
    );
    
    // If it's boxy and either NO phone was found OR phone has low confidence (< 85%)
    // Scan OCR results for "WD", "External", "SSD", "HDD", "Passport"
    const hasHardwareKeywords = Array.from(rawTerms).some(t => 
      ['wd', 'external', 'ssd', 'hdd', 'passport', 'storage', 'hard'].includes(t.toLowerCase())
    );

    if (hasHardwareKeywords || (mobilePrediction && mobilePrediction.probability < CONFIDENCE_THRESHOLD)) {
      console.log("Shape suggests hardware/storage. Prioritizing Hardware category over Mobile.");
      rawTerms.add('hardware');
      rawTerms.add('external storage');
      rawTerms.add('hard drive');
      
      // If confidence is very low, we want to return the whole category
      if (!mobilePrediction || mobilePrediction.probability < 0.5) {
        rawTerms.add('electronics');
      }
    }
  }

  // CRITICAL FIX: Pull-up Bar vs Medicine Ball
  // Pull up bars are very wide (high aspect ratio)
  if (aspectRatio > 2.0) {
    rawTerms.add('pull up bar');
    rawTerms.add('gym');
    rawTerms.add('fitness');
    rawTerms.add('strength');
  } else if (aspectRatio > 0.8 && aspectRatio < 1.2) {
    const genericFitness = ['gym', 'fitness', 'sport', 'exercise', 'medicine ball', 'barbell'];
    const fitnessPrediction = classification.find(p => 
      genericFitness.some(label => p.className.toLowerCase().includes(label))
    );
    
    if (fitnessPrediction) {
      if (fitnessPrediction.probability < CONFIDENCE_THRESHOLD) {
        // Low confidence fitness - suggest the whole category
        rawTerms.add('fitness');
        rawTerms.add('gym equipment');
      } else {
        const classes = fitnessPrediction.className.split(',').map(c => c.trim().toLowerCase());
        classes.forEach(c => rawTerms.add(c));
      }
    }
  }
  
  // Fallback if still nothing or confidence is low
  if (!highConfidenceFound && rawTerms.size <= 2) {
    const weakHints = classification.filter(p => p.probability > 0.2);
    if (weakHints.length > 0) {
      weakHints.forEach(h => {
        const classes = h.className.split(',').map(c => c.trim().toLowerCase());
        classes.forEach(c => rawTerms.add(c));
      });
    }
  }
  
  return mapAiLabelToCatalogTags(Array.from(rawTerms));
};

/**
 * Filters products based on search terms
 */
export const searchProductsByTerms = (products, terms) => {
  if (!terms || terms.length === 0) return [];
  
  const termExpansion = {
    'laptop': ['computer', 'electronics'],
    'cell phone': ['phone', 'smartphone', 'mobile'],
    'cup': ['mug', 'glass', 'coffee'],
    'shoe': ['sneaker', 'running'],
    'person': ['clothing', 'apparel', 'fashion'],
    'backpack': ['bag', 'travel'],
    'monitor': ['screen', 'display'],
    'jewelry': ['gold', 'tunnels', 'gauges', 'necklace', 'ring', 'metal'],
    'gold': ['jewelry', 'tunnels', 'gauges', 'metal'],
    'rose gold': ['metal', 'jewelry'],
    'wd': ['hard drive', 'storage', 'hardware'],
    'seagate': ['hard drive', 'storage', 'hardware']
  };
  
  const expandedTerms = new Set([...terms]);
  terms.forEach(term => {
    if (termExpansion[term]) {
      termExpansion[term].forEach(t => expandedTerms.add(t));
    }
  });
  
  const finalTerms = Array.from(expandedTerms);
  
  return products.filter(product => {
    const tagsString = product.tags ? product.tags.join(' ') : '';
    const searchString = `${product.title} ${product.description} ${product.category} ${tagsString}`.toLowerCase();
    return finalTerms.some(term => searchString.includes(term));
  });
};
