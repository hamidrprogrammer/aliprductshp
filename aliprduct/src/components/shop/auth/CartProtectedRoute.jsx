import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticate } from "./fetchApi";

const CartProtectedRoute = ({ children }) => {
  const location = useLocation();

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!(cart.length !== 0 && isAuthenticate())) {
    // هدایت به صفحه اصلی با حفظ مسیر فعلی
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default CartProtectedRoute;
