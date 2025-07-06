import React, { Fragment, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";
import { logout } from "./Action";
import { LayoutContext } from "../index";
import { isAdmin } from "../auth/fetchApi";

const Navber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, dispatch } = useContext(LayoutContext);

  const navberToggleOpen = () =>
    dispatch({ type: "hamburgerToggle", payload: !data.navberHamburger });

  const loginModalOpen = () =>
    dispatch({ type: "loginSignupModalToggle", payload: !data.loginSignupModal });

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  const mobileMenuVariants = {
    open: { x: 0, transition: { stiffness: 100, damping: 20 } },
    closed: { x: "100%", transition: { stiffness: 100, damping: 20 } },
  };

  const handleLogout = () => {
    logout(() => {
      dispatch({ type: "logout" });
      navigate("/");
    });
  };

  return (
    <Fragment>
      <nav className="fixed top-0 w-full z-20 shadow-lg lg:shadow-none bg-[var(--color-card-background)] text-[var(--color-text)] dark:bg-[var(--color-card-background)] dark:text-[var(--color-text)] transition-colors duration-300">
        <div className="m-4 md:mx-12 md:my-6 flex justify-between items-center">
          {/* Mobile Menu Icon and Mobile Logo */}
          <div className="flex items-center lg:hidden">
            <svg
              onClick={navberToggleOpen}
              className="w-8 h-8 cursor-pointer text-[var(--color-text)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span
              onClick={() => navigate("/")}
              style={{ letterSpacing: "0.10rem" }}
              className="font-bold uppercase text-[var(--color-text)] text-2xl cursor-pointer px-2"
            >
              Hayroo
            </span>
          </div>

          {/* Desktop Menu Links (Left Aligned) */}
          <div className="hidden lg:flex items-center space-x-4">
            <span
              className="hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold tracking-wider cursor-pointer text-lg"
              onClick={() => navigate("/")}
            >
              فروشگاه
            </span>
            <span
              className="hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold tracking-wider cursor-pointer text-lg"
              onClick={() => navigate("/blog")}
            >
              وبلاگ
            </span>
            <span
              className="hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold tracking-wider cursor-pointer text-lg"
              onClick={() => navigate("/contact-us")}
            >
              تماس با ما
            </span>
          </div>

          {/* Desktop Logo (Right Aligned) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <span
              onClick={() => navigate("/")}
              style={{ letterSpacing: "0.70rem" }}
              className="font-bold tracking-widest uppercase text-2xl cursor-pointer text-[var(--color-text)]"
            >
              Hayroo
            </span>
          </div>

          {/* Icons (Wishlist, Theme Toggle, User, Cart) */}
          <div className="flex items-center justify-end space-x-2 lg:space-x-3">
            {/* WishList Icon */}
            <div
              onClick={() => navigate("/wish-list")}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 cursor-pointer"
              title="Wishlist"
            >
              <svg
                className={`${
                  location.pathname === "/wish-list"
                    ? "fill-current text-[var(--color-accent)]"
                    : "text-[var(--color-text)]"
                } w-7 h-7 cursor-pointer`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            {/* Theme Toggle */}
            <div
              onClick={() => dispatch({ type: "toggleTheme" })}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 cursor-pointer"
              title="تغییر تم"
            >
              <svg
                className="w-7 h-7 text-[var(--color-text)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {data.isDarkMode ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                )}
              </svg>
            </div>

            {/* User and Logout */}
            {localStorage.getItem("jwt") ? (
              <div className="relative group">
                <svg
                  className="cursor-pointer w-7 h-7 text-[var(--color-text)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                  <path d="M6 20v-2c0-2.21 3.58-4 6-4s6 1.79 6 4v2" />
                </svg>
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => navigate("/user/profile")}
                  >
                    پروفایل
                  </button>
                  {isAdmin() && (
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      مدیریت
                    </button>
                  )}
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    خروج
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={loginModalOpen}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg px-4 py-2 font-semibold"
              >
                ورود / ثبت‌نام
              </button>
            )}

            {/* Cart Icon */}
            <div
              onClick={cartModalOpen}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 cursor-pointer"
              title="Cart"
            >
              <svg
                className="w-7 h-7 text-[var(--color-text)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                />
                <circle cx="7" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial="closed"
          animate={data.navberHamburger ? "open" : "closed"}
          variants={mobileMenuVariants}
          className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-[var(--color-card-background)] text-[var(--color-text)] shadow-xl p-6 z-30 lg:hidden"
          style={{ x: "100%" }}
        >
          <div className="flex justify-end mb-6">
            <svg
              onClick={navberToggleOpen}
              className="w-8 h-8 cursor-pointer text-[var(--color-text)] hover:text-[var(--color-accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="flex flex-col space-y-5">
            <span
              className="font-semibold text-xl tracking-wider hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent)] cursor-pointer py-2 border-b border-gray-300 dark:border-gray-700"
              onClick={() => {
                navigate("/");
                navberToggleOpen();
              }}
            >
              فروشگاه
            </span>
            <span
              className="font-semibold text-xl tracking-wider hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent)] cursor-pointer py-2 border-b border-gray-300 dark:border-gray-700"
              onClick={() => {
                navigate("/blog");
                navberToggleOpen();
              }}
            >
              وبلاگ
            </span>
            <span
              className="font-semibold text-xl tracking-wider hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent)] cursor-pointer py-2"
              onClick={() => {
                navigate("/contact-us");
                navberToggleOpen();
              }}
            >
              تماس با ما
            </span>
          </div>
        </motion.div>
      </nav>
    </Fragment>
  );
};

export default Navber;
