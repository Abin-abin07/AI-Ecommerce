import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for success message from registration redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear location state to prevent repeating on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.token) localStorage.setItem('token', result.token);
        navigate("/");
      } else {
        console.error("Login Error:", result.error);
        if (
          result.error?.toLowerCase().includes("invalid") ||
          result.error?.toLowerCase().includes("credential") ||
          result.error?.toLowerCase().includes("password") ||
          result.error?.toLowerCase().includes("username") ||
          result.status === 401 ||
          result.status === 400
        ) {
          setErrorMessage("Invalid email or password. Please try again.");
          setError("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(result.error || "Server error. Please try again later.");
          setError(result.error || "Server error. Please try again later.");
        }
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);

      if (err.response?.status === 401 || err.response?.status === 400) {
        setErrorMessage("Invalid email or password. Please try again.");
        setError("Invalid email or password. Please try again.");
      } else {
        setErrorMessage(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err?.message ||
            "Server error. Please try again later."
        );
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err?.message ||
            "Server error. Please try again later."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your NEXIS account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium transition-all">
                {errorMessage}
              </div>
            )}
            {error && !errorMessage && <div className="login-error">{error}</div>}
            {successMessage && <div className="login-success">{successMessage}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-remember">
              <label>
                <input type="checkbox" name="remember" defaultChecked />
                Remember me
              </label>
              <Link to="/forgot-password" state={{ email: formData.email }} className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="login-banner">
          <div className="banner-content">
            <h2>NEXIS</h2>
            <p>AI-Powered E-Commerce</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
