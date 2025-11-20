import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const logged = isAuthenticated();


  return logged ? children : <Navigate to="/NotFound" replace />;
};
