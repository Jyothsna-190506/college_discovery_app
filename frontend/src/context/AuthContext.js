import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch {
          // Token invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || "Login failed");
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || "Registration failed");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const toggleFavorite = async (collegeId) => {
    if (!user) {
      throw new Error("Please log in to save favorites");
    }
    const res = await API.post("/users/favorites/toggle", { collegeId });
    if (res.data.success) {
      // Update local favorites list in user state
      setUser((prev) => {
        if (!prev) return prev;
        const favs = prev.favorites || [];
        const exists = favs.some(
          (f) => (typeof f === "string" ? f : f._id) === collegeId
        );
        const updatedFavs = exists
          ? favs.filter((f) => (typeof f === "string" ? f : f._id) !== collegeId)
          : [...favs, collegeId];
        return { ...prev, favorites: updatedFavs };
      });
      return res.data;
    }
  };

  const isFavorite = (collegeId) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some(
      (f) => (typeof f === "string" ? f : f._id) === collegeId
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        toggleFavorite,
        isFavorite,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
