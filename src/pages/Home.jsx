import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../services/api';
import { getRecommendations } from '../services/aiRecommendations';
import { searchProductsByTerms } from '../services/aiImageSearch';
import { useUserActivity } from '../context/UserActivityContext';
import ProductCard from '../components/ProductCard';
import ImageSearchModal from '../components/ImageSearchModal';
import Navbar from '../components/Navbar';
import { Sparkles, Loader2 } from 'lucide-react';
import { ProductSkeleton } from '../components/Skeleton';
import { 
  setSearchTerms, 
  setFilteredProducts, 
  setIsSearching, 
  setIsAnalyzing,
  clearSearch 
} from '../store/searchSlice';
import './Home.css';



const Home = () => {
  const dispatch = useDispatch();
  const { searchTerms, filteredProducts, isSearching, isAnalyzing } = useSelector((state) => state.search);
  
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  
  const { viewedCategories, viewedProducts } = useUserActivity();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
        dispatch(setFilteredProducts(data));
        
        const recs = getRecommendations(data, viewedCategories, viewedProducts);
        setRecommendations(recs);
      } catch (error) {
        console.error("Error loading home data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  const handleImageSearch = (terms) => {
    dispatch(setIsSearching(true));
    setTimeout(() => {
      dispatch(setSearchTerms(terms));
      if (terms && terms.length > 0) {
        const results = searchProductsByTerms(products, terms);
        dispatch(setFilteredProducts(results));
      } else {
        dispatch(setFilteredProducts(products));
      }
      dispatch(setIsSearching(false));
      dispatch(setIsAnalyzing(false));
    }, 600);
  };

  const handleTextSearch = (term) => {
    if (!term || !term.trim()) {
      dispatch(clearSearch(products));
      return;
    }
    dispatch(setSearchTerms([term]));
    const lowerTerm = term.toLowerCase();
    const results = products.filter(product => {
      const tagsString = product.tags ? product.tags.join(' ') : '';
      return (product.title && product.title.toLowerCase().includes(lowerTerm)) || 
             (product.description && product.description.toLowerCase().includes(lowerTerm)) ||
             (product.category && product.category.toLowerCase().includes(lowerTerm)) ||
             (tagsString.toLowerCase().includes(lowerTerm));
    });
    dispatch(setFilteredProducts(results));
  };

  /**
   * MEMOIZED FILTERING LOGIC:
   * Ensures at least 5-6 products are shown.
   * If exact matches are few, fills with related items (USB cables for hardware, etc.)
   */
  const displayedProducts = useMemo(() => {
    if (searchTerms.length === 0) return filteredProducts;
    
    if (filteredProducts.length > 0) {
      // If we have 5 or more, just show them
      if (filteredProducts.length >= 5) return filteredProducts;
      
      // If fewer than 5, find related products in the same category
      const mainCategory = filteredProducts[0].category;
      
      // Find related items that aren't already in filtered results
      const relatedItems = products.filter(p => 
        p.category === mainCategory && 
        !filteredProducts.some(fp => fp.id === p.id)
      );
      
      // Fill up to 6 products total
      return [...filteredProducts, ...relatedItems].slice(0, 6);
    }
    
    return [];
  }, [filteredProducts, products, searchTerms]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="spinner" />
        <p>Loading Nexis...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar 
        onOpenImageSearch={() => setIsImageSearchOpen(true)} 
        onTextSearch={handleTextSearch}
      />
      
      <div className="container page home-page">
        {searchTerms.length > 0 && (
          <div className="search-results-header glass">
            <div>
              <h3>Search Results</h3>
              <p>Found {filteredProducts.length} results matching: {searchTerms.join(', ')}</p>
            </div>
            <button className="btn btn-secondary" onClick={() => dispatch(clearSearch(products))}>Clear Search</button>
          </div>
        )}

        {searchTerms.length === 0 && recommendations.length > 0 && (
          <section className="recommendations-section">
            <div className="section-header">
              <Sparkles className="section-icon" size={24} />
              <h2>Recommended for You</h2>
            </div>
            <div className="grid-products">
              {recommendations.slice(0, 4).map(product => (
                <ProductCard key={`rec-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}

        <section className="all-products-section">
          <h2>{searchTerms.length > 0 ? 'Results for your search' : 'Explore All Products'}</h2>
          
          {(isSearching || isAnalyzing) ? (
            <div className="grid-products">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="no-results glass" style={{ width: '100%' }}>
              <p>No products found matching your search.</p>
              {recommendations.length > 0 && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ margin: '1rem 0', color: 'var(--accent)' }}>You might also like:</h3>
                  <div className="grid-products" style={{ width: '100%', marginBottom: '2rem' }}>
                    {recommendations.slice(0, 4).map(product => (
                      <ProductCard key={`fallback-rec-${product.id}`} product={product} />
                    ))}
                  </div>
                </div>
              )}
              <button className="btn btn-primary" onClick={() => dispatch(clearSearch(products))}>View All Products</button>
            </div>
          ) : (
            <div className="grid-products">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      <ImageSearchModal 
        isOpen={isImageSearchOpen} 
        onClose={() => setIsImageSearchOpen(false)}
        onSearch={handleImageSearch}
        onStartAnalysis={() => dispatch(setIsAnalyzing(true))}
      />
    </>
  );
};

export default Home;
