import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({ name: decoded.userName, role: decoded.userRole });
        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const decoded = JSON.parse(atob(newToken.split(".")[1]));
    setUser({ name: decoded.userName, role: decoded.userRole });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
