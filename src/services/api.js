const BASE_URL = 'https://fakestoreapi.com';

// Robust mock data with tags for AI Image Search and filtering
const MOCK_PRODUCTS = [
  // MOBILE / SMARTPHONES (10 Items)
  {
    id: 201,
    title: "iPhone 15 Pro",
    price: 999.00,
    description: "Titanium design, A17 Pro chip, versatile 48MP main camera system.",
    category: "mobile",
    tags: ["mobile", "smartphone", "tech", "apple", "iphone", "ios"],
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 450 }
  },
  {
    id: 202,
    title: "Samsung Galaxy S24 Ultra",
    price: 1199.99,
    description: "Galaxy AI is here. Experience new levels of creativity and productivity.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "samsung", "galaxy", "tech"],
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 380 }
  },
  {
    id: 203,
    title: "Google Pixel 8 Pro",
    price: 899.00,
    description: "The all-pro phone engineered by Google. It's sleek, sophisticated and powerful.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "google", "pixel", "tech"],
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 210 }
  },
  {
    id: 204,
    title: "OnePlus 12",
    price: 799.00,
    description: "Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "oneplus", "tech"],
    image: "https://images.unsplash.com/photo-1707153644265-f6284697a48d?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 145 }
  },
  {
    id: 205,
    title: "Xiaomi 14 Ultra",
    price: 1299.00,
    description: "Legendary Leica optics for professional photography.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "xiaomi", "tech", "camera"],
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 98 }
  },
  {
    id: 206,
    title: "Sony Xperia 1 V",
    price: 1199.00,
    description: "Pro-level photography and cinematography in a smartphone.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "sony", "xperia", "tech"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 76 }
  },
  {
    id: 207,
    title: "Nothing Phone (2)",
    price: 599.00,
    description: "Unique Glyph interface and Nothing OS 2.0.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "nothing", "tech", "design"],
    image: "https://images.unsplash.com/photo-1689234850847-062e0868f051?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 230 }
  },
  {
    id: 208,
    title: "Motorola Edge 50 Pro",
    price: 699.00,
    description: "World's 1st Pantone validated camera and display.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "motorola", "tech"],
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.4, count: 112 }
  },
  {
    id: 209,
    title: "Asus ROG Phone 8",
    price: 1099.00,
    description: "Gaming phone with incredible performance and thermal cooling.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "asus", "rog", "gaming", "tech"],
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 85 }
  },
  {
    id: 210,
    title: "Realme GT 5G",
    price: 499.00,
    description: "Flagship killer with high refresh rate and fast charging.",
    category: "mobile",
    tags: ["mobile", "smartphone", "android", "realme", "tech"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.3, count: 167 }
  },

  // HARDWARE / STORAGE (10 Items)
  {
    id: 301,
    title: "WD Elements 2TB External HDD",
    price: 64.99,
    description: "Simple, fast, and portable external storage.",
    category: "hardware",
    tags: ["hardware", "storage", "hard drive", "external", "wd", "western digital"],
    image: "https://images.unsplash.com/photo-1531492746076-1a1bd9b29fc0?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 850 }
  },
  {
    id: 302,
    title: "Samsung T7 Shield SSD 1TB",
    price: 99.99,
    description: "Rugged durability and fast speeds for creators on the move.",
    category: "hardware",
    tags: ["hardware", "storage", "ssd", "external", "samsung", "fast"],
    image: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 520 }
  },
  {
    id: 303,
    title: "SanDisk Extreme Pro 1TB SSD",
    price: 129.99,
    description: "Powerful NVMe solid state performance in a portable, high-capacity drive.",
    category: "hardware",
    tags: ["hardware", "storage", "ssd", "external", "sandisk"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 310 }
  },
  {
    id: 304,
    title: "Seagate Expansion 4TB",
    price: 109.00,
    description: "Extra storage for your PC and Mac.",
    category: "hardware",
    tags: ["hardware", "storage", "hard drive", "external", "seagate"],
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 420 }
  },
  {
    id: 305,
    title: "Crucial X9 Pro 2TB",
    price: 149.00,
    description: "Accelerate your workflow with powerful performance.",
    category: "hardware",
    tags: ["hardware", "storage", "ssd", "external", "crucial"],
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 180 }
  },
  {
    id: 306,
    title: "LaCie Rugged Mini 2TB",
    price: 89.00,
    description: "Iconic rugged design, shock and drop resistant.",
    category: "hardware",
    tags: ["hardware", "storage", "hard drive", "external", "lacie", "rugged"],
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 215 }
  },
  {
    id: 307,
    title: "Kingston XS2000 1TB",
    price: 84.00,
    description: "Portable SSD with USB 3.2 Gen 2x2 performance.",
    category: "hardware",
    tags: ["hardware", "storage", "ssd", "external", "kingston"],
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 92 }
  },
  {
    id: 308,
    title: "PNY EliteX-PRO 1TB",
    price: 79.00,
    description: "Elite performance for demanding applications.",
    category: "hardware",
    tags: ["hardware", "storage", "ssd", "external", "pny"],
    image: "https://images.unsplash.com/photo-1628557118391-56cd60f5885f?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 64 }
  },
  {
    id: 309,
    title: "Corsair EX100U 2TB",
    price: 159.00,
    description: "Ultra-slim, high-speed portable storage.",
    category: "hardware",
    tags: ["hardware", "storage", "ssd", "external", "corsair"],
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 45 }
  },
  {
    id: 310,
    title: "Toshiba Canvio Basics 1TB",
    price: 52.00,
    description: "Simply plug and play for high-capacity storage.",
    category: "hardware",
    tags: ["hardware", "storage", "hard drive", "external", "toshiba"],
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.4, count: 560 }
  },

  // FITNESS / DUMBBELLS (10 Items)
  {
    id: 401,
    title: "Adjustable Dumbbells Set",
    price: 349.00,
    description: "Space-saving dumbbells that adjust from 5 to 52 lbs.",
    category: "fitness",
    tags: ["fitness", "dumbbells", "gym", "workout", "adjustable"],
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 1200 }
  },
  {
    id: 402,
    title: "Hex Rubber Dumbbells 20lbs",
    price: 59.99,
    description: "Durable rubber-coated hex dumbbells for home gym.",
    category: "fitness",
    tags: ["fitness", "dumbbells", "gym", "workout", "hex"],
    image: "https://images.unsplash.com/photo-1586406472616-b459ad48930d?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 450 }
  },
  {
    id: 403,
    title: "Kettlebell 16kg",
    price: 75.00,
    description: "Classic cast iron kettlebell for strength training.",
    category: "fitness",
    tags: ["fitness", "kettlebell", "gym", "workout", "iron"],
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 320 }
  },
  {
    id: 404,
    title: "Resistance Bands Set",
    price: 25.00,
    description: "Five levels of resistance for full-body workouts.",
    category: "fitness",
    tags: ["fitness", "bands", "workout", "gym"],
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917a63e?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 850 }
  },
  {
    id: 405,
    title: "Yoga Mat Pro",
    price: 45.00,
    description: "Extra thick, eco-friendly yoga mat for comfort.",
    category: "fitness",
    tags: ["fitness", "yoga", "mat", "workout"],
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 620 }
  },
  {
    id: 406,
    title: "Medicine Ball 5kg",
    price: 49.00,
    description: "Great for core training and explosive power.",
    category: "fitness",
    tags: ["fitness", "ball", "gym", "workout"],
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 180 }
  },
  {
    id: 407,
    title: "Jump Rope",
    price: 15.00,
    description: "High-speed jump rope for cardio workouts.",
    category: "fitness",
    tags: ["fitness", "cardio", "jump", "workout"],
    image: "https://images.unsplash.com/photo-1519034455743-bb75390e4972?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.4, count: 420 }
  },
  {
    id: 408,
    title: "Foam Roller",
    price: 22.00,
    description: "Muscle recovery and trigger point therapy.",
    category: "fitness",
    tags: ["fitness", "recovery", "gym", "workout"],
    image: "https://images.unsplash.com/photo-1600881333168-2ed47ce132d2?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 290 }
  },
  {
    id: 409,
    title: "Pull Up Bar",
    price: 35.00,
    description: "Doorway pull up bar for home strength training.",
    category: "fitness",
    tags: ["fitness", "strength", "gym", "workout"],
    image: "https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 340 }
  },
  {
    id: 410,
    title: "Weight Bench",
    price: 129.00,
    description: "Adjustable weight bench for flat, incline, and decline exercises.",
    category: "fitness",
    tags: ["fitness", "bench", "gym", "workout", "strength"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 156 }
  },
  {
    id: 311,
    title: "High-Speed USB-C Cable",
    price: 19.99,
    description: "Premium data transfer cable for external hard drives and smartphones.",
    category: "hardware",
    tags: ["hardware", "cable", "usb", "tech", "accessory"],
    image: "https://images.unsplash.com/photo-1610473068565-d6d7904a3717?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 85 }
  },
  {
    id: 312,
    title: "USB 3.0 Extension Lead",
    price: 12.50,
    description: "Extra length for your computer peripherals and storage devices.",
    category: "hardware",
    tags: ["hardware", "cable", "usb", "extension"],
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 42 }
  }
];

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    
    // Ensure all products have a tags array
    const normalizedData = data.map(p => ({
      ...p,
      tags: p.tags || [p.category]
    }));

    return [...normalizedData, ...MOCK_PRODUCTS];
  } catch (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS; // Fallback to mock data
  }
};

export const fetchProductById = async (id) => {
  const mockProduct = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
  if (mockProduct) return mockProduct;

  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return { ...data, tags: data.tags || [data.category] };
  } catch (error) {
    console.error("Error fetching product:", error);
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
