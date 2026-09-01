import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // per-field backend errors
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    // Clear field-specific error when user edits that field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.password2
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return false;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.password2,
        formData.firstName,
        formData.lastName,
      );

      if (result.success) {
        // Show success message and redirect to login
        navigate("/login", {
          state: {
            message:
              "Account created successfully! Please sign in.",
          },
        });
      } else {
        // Populate per-field errors from backend
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setFieldErrors(result.fieldErrors);
          // Only show a general top-level error if there's no field-specific one
          const hasOnlyFieldErrors = Object.keys(result.fieldErrors).every(
            (k) => k !== "non_field_errors" && k !== "detail"
          );
          if (hasOnlyFieldErrors) {
            setError(""); // suppress duplicate top bar — errors shown inline
          } else {
            setError(result.error || "Registration failed. Please try again.");
          }
        } else {
          setError(result.error || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setError(err?.message || "An unexpected error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="register-container">
        <div className="register-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join NEXIS and start shopping smarter</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* General / non-field errors */}
            {error && (
              <div className="register-error" role="alert">
                <span className="register-error-icon">⚠</span>
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="johndoe"
                disabled={isSubmitting}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isSubmitting}
                autoComplete="new-password"
                className={fieldErrors.password ? "input-error" : ""}
              />
              {/* Password strength hint */}
              <small className="password-hint">
                🔒 Password must include letters, numbers, and special characters
                (e.g.&nbsp;<strong>NexisShop2026!</strong>).
              </small>
              {/* Backend password validation errors */}
              {(fieldErrors.password || fieldErrors.password2 || fieldErrors.non_field_errors) && (
                <ul className="field-error-list">
                  {[...(fieldErrors.password || []), ...(fieldErrors.non_field_errors || [])].map(
                    (msg, i) => (
                      <li key={i} className="field-error-item">⚠ {msg}</li>
                    )
                  )}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password2">Confirm Password *</label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isSubmitting}
                autoComplete="new-password"
                className={fieldErrors.password2 ? "input-error" : ""}
              />
              {/* Confirm password backend errors */}
              {fieldErrors.password2 && (
                <ul className="field-error-list">
                  {fieldErrors.password2.map((msg, i) => (
                    <li key={i} className="field-error-item">⚠ {msg}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="register-banner">
          <div className="banner-content">
            <h2>NEXIS</h2>
            <p>AI-Powered E-Commerce</p>
            <ul className="banner-features">
              <li>Visual search with AI</li>
              <li>Smart recommendations</li>
              <li>Secure checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
