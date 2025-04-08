import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        let redirectPath = "/";
      
        if (user.role === "user") {
          redirectPath = "/user-dashboard";
        } else if (user.role === "admin") {
          redirectPath = "/admin-dashboard";
        } else if (user.role === "coordinator") {
          redirectPath = "/coordinator-dashboard";
        }
      
        return <Navigate to={redirectPath} />;
      }
      
    return children || <h2>Not Found</h2>; 
};

export default ProtectedRoute;
