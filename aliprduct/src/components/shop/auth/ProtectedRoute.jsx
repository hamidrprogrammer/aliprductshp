import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticate, isAdmin } from "./fetchApi";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!(isAuthenticate() && !isAdmin())) {
    // هدایت به صفحه اصلی با حفظ مسیر فعلی در state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
