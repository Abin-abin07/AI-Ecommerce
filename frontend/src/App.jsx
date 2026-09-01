import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import "./App.css";

// Protected Layout Component
const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="app-container">
        <main className="page">{children}</main>
      </div>
    </>
  );
};

// Public Layout Component (for Login/Register)
const PublicLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicLayout>
              <ForgotPassword />
            </PublicLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedLayout>
              <ProductDetails />
            </ProtectedLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedLayout>
              <Cart />
            </ProtectedLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedLayout>
              <Checkout />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
