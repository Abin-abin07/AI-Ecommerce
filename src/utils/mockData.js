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

export const MOCK_PRODUCTS_EXTENDED = [
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
    id: 602, title: "AirPods Max", price: 549, description: "High-fidelity audio.",
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
  }
];
