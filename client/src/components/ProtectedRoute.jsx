// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
   const { isLoading, isAuthenticated } = useAuth();

   if (isLoading) return <div>Loading...</div>;

   if (!isAuthenticated) return <Navigate to="/login" replace />;

   return children;
};

export default ProtectedRoute;
