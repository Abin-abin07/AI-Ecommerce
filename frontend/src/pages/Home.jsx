import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../services/api';
import { getRecommendations } from '../services/aiRecommendations';

import { useVision } from '../hooks/useVision';
import { useUserActivity } from '../context/UserActivityContext';
import ProductCard from '../components/ProductCard';
import ImageSearchModal from '../components/ImageSearchModal';

import { Sparkles, Loader2 } from 'lucide-react';
import { ProductSkeleton } from '../components/Skeleton';
import { 
  setSearchTerms, 
  setFilteredProducts, 
  setIsSearching, 
  setIsAnalyzing,
  setIsImageSearchOpen,
  clearSearch 
} from '../store/searchSlice';
import './Home.css';



const Home = () => {
  const dispatch = useDispatch();
  const { searchTerms, filteredProducts, isSearching: isSearchLoading, isAnalyzing, isImageSearchOpen } = useSelector((state) => state.search);
  
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFeatures, setImageFeatures] = useState(null);
  const [isSearching, setIsSearchingLocal] = useState(false); // Local state as requested
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  
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

  const handleImageSearch = (terms, features) => {
    dispatch(setIsSearching(true));
    setIsImageSearchActive(true);
    setImageFeatures(features);
    setIsSearchingLocal(true); // Enable AI search results view
    
    setTimeout(() => {
      dispatch(setSearchTerms(terms));
      // useVision handles the filtering now
      dispatch(setIsSearching(false));
      dispatch(setIsAnalyzing(false));
    }, 600);
  };

  const handleClearSearch = () => {
    setIsImageSearchActive(false);
    setImageFeatures(null);
    setIsSearchingLocal(false);
    dispatch(clearSearch(products));
  };

  /**
   * MEMOIZED FILTERING LOGIC:
   * Uses the new useVision hook to sort products by similarity score
   * and always return the top 5 closest matches for image search.
   */
  const { results: displayedProducts, isPerfectMatch, aiDetectedLabel, needsCategoryReset } = useVision(
    products, 
    imageFeatures, 
    searchTerms,
    isImageSearchActive
  );

  // Sync displayedProducts back to redux if needed by other components, though Home uses displayedProducts directly
  useEffect(() => {
    if (displayedProducts !== filteredProducts && searchTerms.length > 0) {
      dispatch(setFilteredProducts(displayedProducts));
    }
  }, [displayedProducts, dispatch, searchTerms, filteredProducts]);


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
      
      <div className="container page home-page">
        {isSearching && (
          <div className="search-results-header glass">
            <div>
              <h3>AI Search Results</h3>
              <p>Found {displayedProducts.length} results for: {isImageSearchActive && aiDetectedLabel ? aiDetectedLabel : searchTerms.join(', ')}</p>
              {isImageSearchActive && aiDetectedLabel && (
                <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  AI detected: {aiDetectedLabel.charAt(0).toUpperCase() + aiDetectedLabel.slice(1)}
                </p>
              )}
            </div>
            <button className="btn btn-secondary" onClick={handleClearSearch}>Clear Search</button>
          </div>
        )}

        {!isSearching && recommendations.length > 0 && (
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
          <h2>{isSearching ? 'Results for your search' : 'Explore All Products'}</h2>
          
          {(isSearchLoading || isAnalyzing) ? (
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
              <button className="btn btn-primary" onClick={handleClearSearch}>View All Products</button>
            </div>
          ) : (
            <>
              {isImageSearchActive && needsCategoryReset && (
                <div className="similar-results-notice glass" style={{ width: '100%', marginBottom: '2rem', padding: '1.5rem', textAlign: 'center', borderRadius: '16px', borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
                    <Sparkles size={20} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle', color: 'var(--accent)' }} />
                    We couldn't find an exact match for <strong>{aiDetectedLabel}</strong>. Here are some related products you might like!
                  </p>
                </div>
              )}
              {isImageSearchActive && !isPerfectMatch && !needsCategoryReset && searchTerms.length > 0 && (
                <div className="similar-results-notice glass" style={{ width: '100%', marginBottom: '2rem', padding: '1rem', textAlign: 'center', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-light)' }}>
                    <Sparkles size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent)' }} />
                    Showing products similar to your upload
                  </p>
                </div>
              )}

              {displayedProducts.length > 0 ? (
                <div className="grid-products">
                  {displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>No matching products found</h3>
                  <button className="btn btn-primary" onClick={handleClearSearch}>Search for something else</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <ImageSearchModal 
        isOpen={isImageSearchOpen} 
        onClose={() => dispatch(setIsImageSearchOpen(false))}
        onSearch={handleImageSearch}
        onStartAnalysis={() => dispatch(setIsAnalyzing(true))}
      />
    </>
  );
};

export default Home;
