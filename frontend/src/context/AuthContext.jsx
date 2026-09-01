import React, { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = "http://localhost:8000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem("tokens");
    const storedUser = localStorage.getItem("user");

    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored auth data:", err);
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username: email,
        password: password,
      });

      const { access, refresh, user: userData } = response.data;

      setTokens({ access, refresh });
      setUser(userData);

      // Store in localStorage
      localStorage.setItem("tokens", JSON.stringify({ access, refresh }));
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, user: userData, token: access };
    } catch (err) {
      console.log("DETAILED BACKEND ERROR:", err.response?.data);
      let message = "Login failed. Please try again.";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          const errors = [];
          for (const key in data) {
            if (Array.isArray(data[key])) {
              errors.push(`${key}: ${data[key].join(" ")}`);
            } else if (typeof data[key] === "string") {
              errors.push(`${key}: ${data[key]}`);
            }
          }
          if (errors.length > 0) {
            message = errors.join(" | ");
          } else if (data.detail) {
            message = data.detail;
          }
        } else if (typeof data === "string") {
          message = data;
        }
      }
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(
    async (
      username,
      email,
      password,
      password2,
      firstName = "",
      lastName = "",
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/register/`, {
          username,
          email,
          password,
          password2,
          first_name: firstName,
          last_name: lastName,
        });

        return { success: true, user: response.data.user };
      } catch (err) {
        console.log("DETAILED BACKEND ERROR:", err?.response?.data);
        let message = "Registration failed. Please try again.";
        let fieldErrors = {}; // structured: { fieldName: ["msg1", "msg2"] }

        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data === "object" && !Array.isArray(data)) {
            const flatErrors = [];
            for (const key in data) {
              const val = data[key];
              const msgs = Array.isArray(val) ? val : [String(val)];
              fieldErrors[key] = msgs;
              // Build a human-readable flat message (strip field prefix for non_field_errors)
              if (key === "non_field_errors") {
                flatErrors.push(...msgs);
              } else {
                flatErrors.push(`${key}: ${msgs.join(" ")}`);
              }
            }
            if (flatErrors.length > 0) message = flatErrors.join(" | ");
            else if (data.detail) message = data.detail;
          } else if (typeof data === "string") {
            message = data;
          }
        }

        setError(message);
        return { success: false, error: message, fieldErrors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Logout function
  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");

    // Optionally call logout endpoint
    if (tokens?.access) {
      axios
        .post(
          `${API_BASE_URL}/logout/`,
          {},
          {
            headers: { Authorization: `Bearer ${tokens.access}` },
          },
        )
        .catch((err) => console.error("Logout request failed:", err));
    }
  }, [tokens]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    if (!tokens?.refresh) {
      logout();
      return false;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/refresh/`, {
        refresh: tokens.refresh,
      });

      const newAccessToken = response.data.access;
      const newTokens = { ...tokens, access: newAccessToken };

      setTokens(newTokens);
      localStorage.setItem("tokens", JSON.stringify(newTokens));

      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return false;
    }
  }, [tokens, logout]);

  // Get current access token
  const getAccessToken = useCallback(() => {
    return tokens?.access || null;
  }, [tokens]);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!tokens?.access;

  // Update user state
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const value = {
    user,
    tokens,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    getAccessToken,
    isAuthenticated,
    setError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
