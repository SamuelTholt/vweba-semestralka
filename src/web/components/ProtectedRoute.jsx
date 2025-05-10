import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as jwtDecode from "jwt-decode"; // Namiesto default importu používame named import

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setAuthorized(false);
        return;
      }
      
      try {

        const decodedToken = jwtDecode.jwtDecode(token);
        

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          alert("Tvoje prihlásenie vypršalo. Prosím, prihlás sa znovu.");
          setAuthorized(false);
          return;
        }
        

        if (requiredRole && decodedToken.userRole !== requiredRole) {
          alert(`Na prístup k tejto stránke potrebuješ oprávnenie: ${requiredRole}`);
          setAuthorized(false);
          return;
        }
        

        setAuthorized(true);
      } catch (error) {
        console.error("Chyba pri dekódovaní tokenu:", error);
        localStorage.removeItem("token");
        setAuthorized(false);
      }
    };
    
    checkAuth();
  }, [requiredRole]);
  
  if (authorized === null) {
    return <div className="text-center p-4">Overujem oprávnenia...</div>;
  }
  
  if (!authorized) {
    return <Navigate to="/login" replace />;
  }
  

  return children;
};

export default ProtectedRoute;