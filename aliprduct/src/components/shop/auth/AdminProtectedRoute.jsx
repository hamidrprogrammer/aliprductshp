import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticate, isAdmin } from "./fetchApi";

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!(isAdmin() && isAuthenticate())) {
    // اگر ادمین یا احراز هویت نشده، هدایت به صفحه پروفایل کاربر با حفظ مسیر فعلی
    return <Navigate to="/user/profile" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
