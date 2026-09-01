import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { UserActivityProvider } from "./context/UserActivityContext";
import { Provider } from "react-redux";
import { store } from "./store";

import { WishlistProvider } from "./context/WishlistContext";
import axios from "axios";

// Global Axios Interceptor for 401 Unauthorized / Expired Tokens
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('access');
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <UserActivityProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </UserActivityProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
