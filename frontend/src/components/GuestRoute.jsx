import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check for token in local storage

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
