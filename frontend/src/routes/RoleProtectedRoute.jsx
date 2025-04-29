import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import PropTypes from "prop-types";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Ensure this page exists
  }

  return children;
};
RoleProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleProtectedRoute;
