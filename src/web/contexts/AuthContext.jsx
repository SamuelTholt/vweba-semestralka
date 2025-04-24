import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setUser({ name: decoded.userName, role: decoded.userRole });
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({ name: decoded.userName, role: decoded.userRole });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
