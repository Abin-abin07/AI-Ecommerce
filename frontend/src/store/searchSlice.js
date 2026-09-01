import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerms: [],
  filteredProducts: [],
  isSearching: false,
  isAnalyzing: false,
  isImageSearchOpen: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerms: (state, action) => {
      state.searchTerms = action.payload;
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setIsAnalyzing: (state, action) => {
      state.isAnalyzing = action.payload;
    },
    setIsImageSearchOpen: (state, action) => {
      state.isImageSearchOpen = action.payload;
    },
    clearSearch: (state, action) => {
      state.searchTerms = [];
      state.filteredProducts = action.payload || []; // action.payload will be all products
      state.isSearching = false;
      state.isAnalyzing = false;
    }
  },
});

export const { 
  setSearchTerms, 
  setFilteredProducts, 
  setIsSearching, 
  setIsAnalyzing,
  setIsImageSearchOpen,
  clearSearch 
} = searchSlice.actions;

export default searchSlice.reducer;
