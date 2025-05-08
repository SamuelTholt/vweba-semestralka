import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Pomocná funkcia na dekódovanie JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return e;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.userId, name: decoded.userName, role: decoded.userRole });
        setToken(storedToken);
      } else {
        logout();
      }
    }
  }, []);

  // Automatické odhlásenie a upozornenie
  useEffect(() => {
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded?.exp) return;

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilLogout = expirationTime - currentTime;
    const timeUntilWarning = timeUntilLogout - 60000; // 1 minúta pred expiráciou

    if (timeUntilLogout <= 0) {
      logout();
      return;
    }

    // Upozornenie
    const warningTimeout = setTimeout(() => {
      alert("Vaša relácia čoskoro vyprší (do 1 minúty). Ak chcete pokračovať, prihláste sa znova.");
    }, Math.max(0, timeUntilWarning));

    // Automatický logout
    const logoutTimeout = setTimeout(() => {
      alert("Boli ste odhlásený! Prihláste sa znova.");
      logout();
    }, timeUntilLogout);

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
    };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const decoded = parseJwt(newToken);
    setUser({ id: decoded.userId, name: decoded.userName, role: decoded.userRole });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
