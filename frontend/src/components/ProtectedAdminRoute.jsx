import { Navigate } from "react-router-dom";
import { decodeTokenFn } from "../utils/utils";

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeTokenFn(token);

  if (!token || !decodedToken) {
    return <Navigate to="/login" />;
  }

  if (decodedToken.role !== "ADMIN_ROLE") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedAdminRoute;
