const fs = require('fs');

const apiPath = 'd:\\\\AI-Ecom\\\\src\\\\services\\\\api.js';
const mockDataPath = 'd:\\\\AI-Ecom\\\\src\\\\utils\\\\mockData.js';

let apiContent = fs.readFileSync(apiPath, 'utf8');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

const regex = /\/\/ Robust mock data[\s\S]*?(?=export const fetchProducts)/;
const match = apiContent.match(regex);

if (match) {
  const mockProductsCode = match[0];
  
  // Remove from api.js
  apiContent = apiContent.replace(mockProductsCode, '');
  
  // Replace import in api.js
  apiContent = apiContent.replace(
    'import { MOCK_PRODUCTS_EXTENDED, generateMockEmbedding } from \'../utils/mockData\';',
    'import { MOCK_PRODUCTS, generateMockEmbedding } from \'../utils/mockData\';'
  );
  
  // Update fetchProducts inside api.js to use MOCK_PRODUCTS
  apiContent = apiContent.replace(
    'const allMock = [...enhancedMockProducts, ...MOCK_PRODUCTS_EXTENDED];',
    'const allMock = [...enhancedMockProducts];'
  );
  
  apiContent = apiContent.replace(
    'const mockProduct = MOCK_PRODUCTS.find(p => p.id === parseInt(id));',
    'const mockProduct = MOCK_PRODUCTS.find(p => p.id === Number(id));'
  );

  fs.writeFileSync(apiPath, apiContent);
  
  // Make MOCK_PRODUCTS exported and insert it to mockData.js
  const exportedMockProductsCode = mockProductsCode.replace('const MOCK_PRODUCTS = [', 'export const MOCK_PRODUCTS = [');
  
  // Combine MOCK_PRODUCTS_EXTENDED items into MOCK_PRODUCTS
  // Find the end of exportedMockProductsCode
  // exportedMockProductsCode ends with `];\n\n`
  // MOCK_PRODUCTS_EXTENDED looks like `export const MOCK_PRODUCTS_EXTENDED = [\n...];\n`
  // Let's just append MOCK_PRODUCTS_EXTENDED items to exportedMockProductsCode array
  
  // Wait, let's just make MOCK_PRODUCTS and MOCK_PRODUCTS_EXTENDED separate arrays in mockData.js, 
  // but combine them in export at the bottom or rename MOCK_PRODUCTS_EXTENDED items directly inside MOCK_PRODUCTS.
  
  // Actually, let's just extract the items from MOCK_PRODUCTS_EXTENDED and put them in MOCK_PRODUCTS!
  
  const extMatch = mockDataContent.match(/export const MOCK_PRODUCTS_EXTENDED = \[\s*([\s\S]*?)\s*\];/);
  if (extMatch) {
     const extItems = extMatch[1];
     // Insert extItems into exportedMockProductsCode
     const newExportedMockProductsCode = exportedMockProductsCode.replace(/\];\s*$/, ',\n  ' + extItems + '\n];\n');
     
     // Remove MOCK_PRODUCTS_EXTENDED from mockDataContent
     mockDataContent = mockDataContent.replace(extMatch[0], '');
     
     // Add newExportedMockProductsCode
     mockDataContent += '\n' + newExportedMockProductsCode;
     
     fs.writeFileSync(mockDataPath, mockDataContent);
     console.log('Successfully merged and updated!');
  } else {
     console.log('Could not find MOCK_PRODUCTS_EXTENDED in mockData.js');
  }

} else {
  console.log('Could not find MOCK_PRODUCTS block in api.js');
}
