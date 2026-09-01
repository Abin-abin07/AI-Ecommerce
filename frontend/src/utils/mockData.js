/**
 * Generates mock reviews for a product
 * @param {number} productId 
 * @param {string} category 
 * @returns {Array} Array of review objects
 */
export const generateMockReviews = (productId, category) => {
  const users = [
    'John D.', 'Sarah M.', 'David W.', 'Elena R.', 'Marcus T.', 
    'Jessica L.', 'Thomas K.', 'Anna B.', 'Robert P.', 'Lisa V.'
  ];
  
  const comments = {
    "electronics": [
      "Great drive, works perfectly with my PS4!",
      "Super fast performance, definitely worth the price.",
      "The build quality is excellent. Very sturdy.",
      "Easy to set up and works as advertised.",
      "Impressive specs for the price point."
    ],
    "jewelery": [
      "Absolutely stunning piece, looks even better in person.",
      "High quality craftsmanship. My partner loved it!",
      "Very elegant and goes with everything.",
      "The finish is perfect. No scratches or dullness.",
      "Beautifully packaged, makes for a great gift."
    ],
    "men's clothing": [
      "Perfect fit and the material feels premium.",
      "Very comfortable for all-day wear.",
      "Classic style that never goes out of fashion.",
      "Color is exactly as shown in the pictures.",
      "Durable fabric, hasn't shrunk after several washes."
    ],
    "women's clothing": [
      "So stylish and flattering. Got many compliments!",
      "The fabric is so soft and breathable.",
      "Beautiful design, perfect for special occasions.",
      "True to size and very well made.",
      "My new favorite outfit, highly recommend!"
    ]
  };

  const defaultComments = [
    "Excellent product, highly recommended!",
    "Good value for money.",
    "Very satisfied with my purchase.",
    "Fast delivery and great quality.",
    "Exactly what I was looking for."
  ];

  const categoryComments = comments[category] || defaultComments;
  const numReviews = Math.floor(Math.random() * 5) + 3; // 3 to 7 reviews
  
  return [...Array(numReviews)].map((_, i) => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomComment = categoryComments[Math.floor(Math.random() * categoryComments.length)];
    const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
    
    // Generate a random date within the last 6 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    return {
      id: `${productId}-rev-${i}`,
      userName: randomUser,
      rating: randomRating,
      comment: randomComment,
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  });
};

export const generateMockEmbedding = (category) => {
  const vec = new Array(1000).fill(0);
  
  if (category === 'electronics') {
    for (let i = 0; i < 10; i++) vec[i] = Math.random() * 0.5 + 0.5;
  } else if (category === 'clothing' || category === "men's clothing" || category === "women's clothing") {
    for (let i = 11; i < 20; i++) vec[i] = Math.random() * 0.5 + 0.5;
  } else if (category === 'jewelery') {
    for (let i = 21; i < 30; i++) vec[i] = Math.random() * 0.5 + 0.5;
  } else if (category === 'hardware') {
    for (let i = 31; i < 40; i++) vec[i] = Math.random() * 0.5 + 0.5;
  } else if (category === 'fitness') {
    for (let i = 41; i < 50; i++) vec[i] = Math.random() * 0.5 + 0.5;
  } else if (category === 'mobile') {
    for (let i = 51; i < 60; i++) vec[i] = Math.random() * 0.5 + 0.5;
  } else {
    for (let i = 61; i < 70; i++) vec[i] = Math.random() * 0.5 + 0.5;
  }
  
  let sum = 0;
  for(let i=0; i<1000; i++) sum += vec[i]*vec[i];
  const mag = Math.sqrt(sum);
  return vec.map(v => v / (mag || 1));
};

export const MOCK_PRODUCTS = [
  // MOBILE / SMARTPHONES (10 Items)
  {
    id: 201, title: "iPhone 15 Pro", price: 999.00, description: "Titanium design, A17 Pro chip, versatile 48MP main camera system.",
    category: "mobile", tags: ["mobile", "smartphone", "tech", "apple", "iphone", "ios"],
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 450 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 202, title: "Samsung Galaxy S24 Ultra", price: 1199.99, description: "Galaxy AI is here. Experience new levels of creativity and productivity.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "samsung", "galaxy", "tech"],
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 380 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 211, title: "Google Pixel 8 Pro", price: 899.00, description: "The all-pro phone engineered by Google. It's sleek, sophisticated and powerful.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "google", "pixel", "tech"],
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 210 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 204, title: "OnePlus 12", price: 799.00, description: "Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "oneplus", "tech"],
    image: "https://images.unsplash.com/photo-1707153644265-f6284697a48d?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 145 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 205, title: "Xiaomi 14 Ultra", price: 1299.00, description: "Legendary Leica optics for professional photography.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "xiaomi", "tech", "camera"],
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 98 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 206, title: "Sony Xperia 1 V", price: 1199.00, description: "Pro-level photography and cinematography in a smartphone.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "sony", "xperia", "tech"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 76 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 207, title: "Nothing Phone (2)", price: 599.00, description: "Unique Glyph interface and Nothing OS 2.0.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "nothing", "tech", "design"],
    image: "https://images.unsplash.com/photo-1689234850847-062e0868f051?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 230 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 208, title: "Motorola Edge 50 Pro", price: 699.00, description: "World's 1st Pantone validated camera and display.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "motorola", "tech"],
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.4, count: 112 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 209, title: "Asus ROG Phone 8", price: 1099.00, description: "Gaming phone with incredible performance and thermal cooling.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "asus", "rog", "gaming", "tech"],
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 85 }, embedding: generateMockEmbedding('mobile')
  },
  {
    id: 210, title: "Realme GT 5G", price: 499.00, description: "Flagship killer with high refresh rate and fast charging.",
    category: "mobile", tags: ["mobile", "smartphone", "android", "realme", "tech"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.3, count: 167 }, embedding: generateMockEmbedding('mobile')
  },

  // HARDWARE / STORAGE (10 Items)
  {
    id: 301, title: "WD Elements 2TB External HDD", price: 64.99, description: "Simple, fast, and portable external storage.",
    category: "hardware", tags: ["hardware", "storage", "hard drive", "external", "wd", "western digital"],
    image: "https://images.unsplash.com/photo-1531492746076-1a1bd9b29fc0?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 850 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 302, title: "Samsung T7 Shield SSD 1TB", price: 99.99, description: "Rugged durability and fast speeds for creators on the move.",
    category: "hardware", tags: ["hardware", "storage", "ssd", "external", "samsung", "fast"],
    image: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 520 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 303, title: "SanDisk Extreme Pro 1TB SSD", price: 129.99, description: "Powerful NVMe solid state performance in a portable, high-capacity drive.",
    category: "hardware", tags: ["hardware", "storage", "ssd", "external", "sandisk"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 310 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 304, title: "Seagate Expansion 4TB", price: 109.00, description: "Extra storage for your PC and Mac.",
    category: "hardware", tags: ["hardware", "storage", "hard drive", "external", "seagate"],
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 420 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 305, title: "Crucial X9 Pro 2TB", price: 149.00, description: "Accelerate your workflow with powerful performance.",
    category: "hardware", tags: ["hardware", "storage", "ssd", "external", "crucial"],
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 180 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 306, title: "LaCie Rugged Mini 2TB", price: 89.00, description: "Iconic rugged design, shock and drop resistant.",
    category: "hardware", tags: ["hardware", "storage", "hard drive", "external", "lacie", "rugged"],
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 215 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 307, title: "Kingston XS2000 1TB", price: 84.00, description: "Portable SSD with USB 3.2 Gen 2x2 performance.",
    category: "hardware", tags: ["hardware", "storage", "ssd", "external", "kingston"],
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 92 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 308, title: "PNY EliteX-PRO 1TB", price: 79.00, description: "Elite performance for demanding applications.",
    category: "hardware", tags: ["hardware", "storage", "ssd", "external", "pny"],
    image: "https://images.unsplash.com/photo-1628557118391-56cd60f5885f?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 64 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 309, title: "Corsair EX100U 2TB", price: 159.00, description: "Ultra-slim, high-speed portable storage.",
    category: "hardware", tags: ["hardware", "storage", "ssd", "external", "corsair"],
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 45 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 310, title: "Toshiba Canvio Basics 1TB", price: 52.00, description: "Simply plug and play for high-capacity storage.",
    category: "hardware", tags: ["hardware", "storage", "hard drive", "external", "toshiba"],
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.4, count: 560 }, embedding: generateMockEmbedding('hardware')
  },

  // FITNESS / DUMBBELLS (10 Items)
  {
    id: 401, title: "Adjustable Dumbbells Set", price: 349.00, description: "Space-saving dumbbells that adjust from 5 to 52 lbs.",
    category: "fitness", tags: ["fitness", "dumbbells", "gym", "workout", "adjustable"],
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 1200 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 402, title: "Hex Rubber Dumbbells 20lbs", price: 59.99, description: "Durable rubber-coated hex dumbbells for home gym.",
    category: "fitness", tags: ["fitness", "dumbbells", "gym", "workout", "hex"],
    image: "https://images.unsplash.com/photo-1586406472616-b459ad48930d?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 450 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 403, title: "Kettlebell 16kg", price: 75.00, description: "Classic cast iron kettlebell for strength training.",
    category: "fitness", tags: ["fitness", "kettlebell", "gym", "workout", "iron"],
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 320 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 404, title: "Resistance Bands Set", price: 25.00, description: "Five levels of resistance for full-body workouts.",
    category: "fitness", tags: ["fitness", "bands", "workout", "gym"],
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917a63e?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 850 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 405, title: "Yoga Mat Pro", price: 45.00, description: "Extra thick, eco-friendly yoga mat for comfort.",
    category: "fitness", tags: ["fitness", "yoga", "mat", "workout"],
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 620 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 406, title: "Medicine Ball 5kg", price: 49.00, description: "Great for core training and explosive power.",
    category: "fitness", tags: ["fitness", "ball", "gym", "workout"],
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 180 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 407, title: "Jump Rope", price: 15.00, description: "High-speed jump rope for cardio workouts.",
    category: "fitness", tags: ["fitness", "cardio", "jump", "workout"],
    image: "https://images.unsplash.com/photo-1519034455743-bb75390e4972?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.4, count: 420 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 408, title: "Foam Roller", price: 22.00, description: "Muscle recovery and trigger point therapy.",
    category: "fitness", tags: ["fitness", "recovery", "gym", "workout"],
    image: "https://images.unsplash.com/photo-1600881333168-2ed47ce132d2?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 290 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 409, title: "Pull Up Bar", price: 35.00, description: "Doorway pull up bar for home strength training.",
    category: "fitness", tags: ["fitness", "strength", "gym", "workout"],
    image: "https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 340 }, embedding: generateMockEmbedding('fitness')
  },
  {
    id: 410, title: "Weight Bench", price: 129.00, description: "Adjustable weight bench for flat, incline, and decline exercises.",
    category: "fitness", tags: ["fitness", "bench", "gym", "workout", "strength"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 156 }, embedding: generateMockEmbedding('fitness')
  },

  // HARDWARE ACCESSORIES (2 Items)
  {
    id: 311, title: "High-Speed USB-C Cable", price: 19.99, description: "Premium data transfer cable for external hard drives and smartphones.",
    category: "hardware", tags: ["hardware", "cable", "usb", "tech", "accessory"],
    image: "https://images.unsplash.com/photo-1610473068565-d6d7904a3717?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 85 }, embedding: generateMockEmbedding('hardware')
  },
  {
    id: 312, title: "USB 3.0 Extension Lead", price: 12.50, description: "Extra length for your computer peripherals and storage devices.",
    category: "hardware", tags: ["hardware", "cable", "usb", "extension"],
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 42 }, embedding: generateMockEmbedding('hardware')
  },

  // Laptops (5)
  {
    id: 501, title: "MacBook Pro 16", price: 2499, description: "Powerful M3 Max chip.",
    category: "electronics", tags: ["electronics", "laptop", "macbook", "apple", "computer"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 120 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 502, title: "Dell XPS 15", price: 1899, description: "Stunning 4K OLED display.",
    category: "electronics", tags: ["electronics", "laptop", "dell", "windows", "computer"],
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 95 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 503, title: "Lenovo ThinkPad X1", price: 1699, description: "The ultimate business laptop.",
    category: "electronics", tags: ["electronics", "laptop", "lenovo", "business", "computer"],
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 210 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 504, title: "ASUS ROG Zephyrus", price: 2199, description: "High-end gaming laptop.",
    category: "electronics", tags: ["electronics", "laptop", "asus", "gaming", "computer"],
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 150 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 505, title: "HP Spectre x360", price: 1499, description: "Versatile 2-in-1 convertible.",
    category: "electronics", tags: ["electronics", "laptop", "hp", "convertible", "computer"],
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 85 }, embedding: generateMockEmbedding('electronics')
  },
  
  // Headphones (5)
  {
    id: 601, title: "Sony WH-1000XM5", price: 398, description: "Industry leading noise canceling.",
    category: "electronics", tags: ["headphone", "audio", "electronics", "music", "sony", "wireless"],
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 420 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 203, title: "AirPods Max", price: 549, description: "High-fidelity audio.",
    category: "electronics", tags: ["headphone", "audio", "electronics", "music", "apple", "wireless"],
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 310 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 603, title: "Bose QuietComfort 45", price: 329, description: "Iconic quiet comfort.",
    category: "electronics", tags: ["headphone", "audio", "electronics", "music", "bose", "wireless"],
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 530 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 604, title: "Sennheiser Momentum 4", price: 349, description: "Premium sound and battery life.",
    category: "electronics", tags: ["headphone", "audio", "electronics", "music", "sennheiser", "wireless"],
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 180 }, embedding: generateMockEmbedding('electronics')
  },
  {
    id: 605, title: "Jabra Elite 85h", price: 249, description: "Smart active noise cancellation.",
    category: "electronics", tags: ["headphone", "audio", "electronics", "music", "jabra", "wireless"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.5, count: 210 }, embedding: generateMockEmbedding('electronics')
  },

  // JEWELERY (5 Items)
  {
    id: 701, title: "Diamond Engagement Ring", price: 1299.99, description: "Classic 14K white gold engagement ring.",
    category: "jewelery", tags: ["jewelery", "ring", "diamond", "gold", "accessory"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.9, count: 85 }, embedding: generateMockEmbedding('jewelery')
  },
  {
    id: 702, title: "Pearl Necklace", price: 249.00, description: "Elegant freshwater pearl necklace.",
    category: "jewelery", tags: ["jewelery", "necklace", "pearl", "accessory"],
    image: "https://images.unsplash.com/photo-1535633302703-b0703af6c392?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.7, count: 120 }, embedding: generateMockEmbedding('jewelery')
  },
  {
    id: 703, title: "Gold Bracelet 18K", price: 450.00, description: "Solid 18K yellow gold chain bracelet.",
    category: "jewelery", tags: ["jewelery", "bracelet", "gold", "accessory"],
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 56 }, embedding: generateMockEmbedding('jewelery')
  },
  {
    id: 704, title: "Silver Stud Earrings", price: 45.00, description: "Simple sterling silver stud earrings.",
    category: "jewelery", tags: ["jewelery", "earrings", "silver", "accessory"],
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.6, count: 230 }, embedding: generateMockEmbedding('jewelery')
  },
  {
    id: 705, title: "Sapphire Pendant", price: 599.00, description: "Deep blue sapphire pendant with silver chain.",
    category: "jewelery", tags: ["jewelery", "pendant", "necklace", "sapphire", "accessory"],
    image: "https://images.unsplash.com/photo-1599643478117-5cb153968d9f?auto=format&fit=crop&q=80&w=800",
    rating: { rate: 4.8, count: 42 }, embedding: generateMockEmbedding('jewelery')
  }
];

