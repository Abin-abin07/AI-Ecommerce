import { MOCK_PRODUCTS, generateMockEmbedding } from '../utils/mockData';

const BASE_URL = 'https://fakestoreapi.com';


export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    
    // Ensure all products have a tags array and embedding
    const normalizedData = data.map(p => ({
      ...p,
      tags: p.tags || [p.category],
      embedding: generateMockEmbedding(p.category)
    }));

    return [...normalizedData, ...MOCK_PRODUCTS];
  } catch (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS; // Fallback to mock data
  }
};

export const fetchProductById = async (id) => {
  const numericId = Number(id);
  const mockProduct = MOCK_PRODUCTS.find(p => p.id === numericId);
  
  if (mockProduct) return mockProduct;

  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return { ...data, tags: data.tags || [data.category] };
  } catch (error) {
    console.error("Error fetching product:", error);
    // Add fallback logging as requested
    console.log("Product not found. Missing ID:", id, "Available MOCK_PRODUCTS:", MOCK_PRODUCTS);
    return null;
  }
};


export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    const mockCategories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
    return [...new Set([...data, ...mockCategories])];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [...new Set(MOCK_PRODUCTS.map(p => p.category))];
  }
};
