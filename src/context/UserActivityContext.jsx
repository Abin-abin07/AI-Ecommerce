import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserActivityContext = createContext();

export const useUserActivity = () => useContext(UserActivityContext);

export const UserActivityProvider = ({ children }) => {
  const [viewedProducts, setViewedProducts] = useState(() => {
    const saved = localStorage.getItem('ecom_viewed_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewedCategories, setViewedCategories] = useState(() => {
    const saved = localStorage.getItem('ecom_viewed_categories');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('ecom_viewed_products', JSON.stringify(viewedProducts));
  }, [viewedProducts]);

  useEffect(() => {
    localStorage.setItem('ecom_viewed_categories', JSON.stringify(viewedCategories));
  }, [viewedCategories]);

  const trackProductView = useCallback((product) => {
    setViewedProducts((prev) => {
      // Keep only unique products, max 20
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 20);
    });

    setViewedCategories((prev) => {
      const currentCount = prev[product.category] || 0;
      return {
        ...prev,
        [product.category]: currentCount + 1
      };
    });
  }, []);

  return (
    <UserActivityContext.Provider
      value={{
        viewedProducts,
        viewedCategories,
        trackProductView
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
};
