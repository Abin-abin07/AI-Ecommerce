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
