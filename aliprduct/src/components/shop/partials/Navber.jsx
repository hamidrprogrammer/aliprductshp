import React, { Fragment, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css"; // اگر استایل خاصی برای Navbar دارید
import { logout } from "./Action";
import { LayoutContext } from "../index";
import { isAdmin } from "../auth/fetchApi";

const Navber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, dispatch } = useContext(LayoutContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navberToggleOpen = () =>
    dispatch({ type: "hamburgerToggle", payload: !data.navberHamburger });

  const loginModalOpen = () =>
    dispatch({ type: "loginSignupModalToggle", payload: true }); // همیشه باز شود

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  const mobileMenuVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
    closed: { x: "100%", opacity: 0, transition: { type: "spring", stiffness: 120, damping: 20, delay: 0.1 } },
  };

  const userMenuVariants = {
    open: { opacity: 1, y: 0, display: "block", transition: { duration: 0.2 } },
    closed: { opacity: 0, y: -10, transition: { duration: 0.2 }, transitionEnd: { display: "none" } },
  };

  const handleLogout = () => {
    logout(() => {
      dispatch({ type: "logout" });
      setIsUserMenuOpen(false);
      navigate("/");
    });
  };

  // بستن منوی کاربر با کلیک بیرون از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <Fragment>
      {/* Header مشابه template.html */}
      <nav className="fixed top-0 w-full z-30 bg-[var(--color-header-background)] text-[var(--color-text-primary)] shadow-md backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span
                onClick={() => navigate("/")}
                className="text-3xl font-bold cursor-pointer text-[var(--color-accent)]" // رنگ لوگو از رنگ تاکید
              >
                Hayroo {/* یا لوگوی تصویری */}
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-reverse lg:space-x-8">
              <NavLink to="/" currentPath={location.pathname}>فروشگاه</NavLink>
              <NavLink to="/blog" currentPath={location.pathname}>وبلاگ</NavLink>
              <NavLink to="/about" currentPath={location.pathname}>درباره ما</NavLink> {/* اضافه شده */}
              <NavLink to="/contact-us" currentPath={location.pathname}>تماس با ما</NavLink>
            </div>

            {/* Icons and User Section */}
            <div className="flex items-center space-x-reverse space-x-3 md:space-x-4">
              <IconButton title="جستجو" onClick={() => console.log("Search clicked")}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </IconButton>

              <IconButton title="لیست علاقه‌مندی‌ها" onClick={() => navigate("/wish-list")} isActive={location.pathname === "/wish-list"}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </IconButton>

              <IconButton title="سبد خرید" onClick={cartModalOpen}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 21a1 1 0 000-2 1 1 0 000 2zm13 0a1 1 0 000-2 1 1 0 000 2z"></path></svg>
                {/* Badge for cart items could be added here */}
              </IconButton>

              {/* User/Login Button */}
              {localStorage.getItem("jwt") ? (
                <div className="relative user-menu-container">
                  <IconButton title="حساب کاربری" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </IconButton>
                  <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={userMenuVariants}
                      className="absolute left-0 mt-2 w-48 bg-[var(--color-card-background)] dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-[var(--color-border)]"
                    >
                      <UserMenuItem onClick={() => { navigate("/user/profile"); setIsUserMenuOpen(false); }}>پروفایل</UserMenuItem>
                      {isAdmin() && (
                        <UserMenuItem onClick={() => { navigate("/admin/dashboard"); setIsUserMenuOpen(false); }}>مدیریت</UserMenuItem>
                      )}
                      <UserMenuItem onClick={handleLogout}>خروج</UserMenuItem>
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={loginModalOpen}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-colors duration-150"
                >
                  ورود / ثبت‌نام
                </button>
              )}

              {/* Theme Toggle - giữ nguyên hoặc thay đổi icon cho phù hợp template */}
              <IconButton title="تغییر تم" onClick={() => dispatch({ type: "toggleTheme" })}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {data.isDarkMode ? ( /* Sun icon */
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    ) : ( /* Moon icon */
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    )}
                </svg>
              </IconButton>
            </div>

            {/* Mobile Menu Icon */}
            <div className="lg:hidden">
              <IconButton title="منو" onClick={navberToggleOpen}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
        {data.navberHamburger && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ x: "100%" }} // اطمینان از شروع از خارج صفحه
          >
            {/* Overlay for mobile menu */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={navberToggleOpen}></div>

            <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[var(--color-card-background)] shadow-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-bold text-[var(--color-accent)]">Hayroo</span>
                <IconButton title="بستن منو" onClick={navberToggleOpen}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                </IconButton>
              </div>
              <nav className="flex-grow">
                <MobileNavLink to="/" onClick={navberToggleOpen}>فروشگاه</MobileNavLink>
                <MobileNavLink to="/blog" onClick={navberToggleOpen}>وبلاگ</MobileNavLink>
                <MobileNavLink to="/about" onClick={navberToggleOpen}>درباره ما</MobileNavLink>
                <MobileNavLink to="/contact-us" onClick={navberToggleOpen}>تماس با ما</MobileNavLink>
              </nav>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </nav>
    </Fragment>
  );
};

// Helper components for NavLinks to avoid repetition
const NavLink = ({ to, currentPath, children }) => {
  const navigate = useNavigate();
  const isActive = currentPath === to;
  return (
    <span
      onClick={() => navigate(to)}
      className={`px-3 py-2 rounded-md text-md font-medium cursor-pointer transition-colors duration-150
                  ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-white'}`}
    >
      {children}
    </span>
  );
};

const MobileNavLink = ({ to, onClick, children }) => {
  const navigate = useNavigate();
  return (
    <span
      onClick={() => { navigate(to); onClick(); }}
      className="block px-3 py-3 rounded-md text-lg font-medium text-[var(--color-text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
    >
      {children}
    </span>
  );
};

const IconButton = ({ onClick, title, children, isActive }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-accent)] transition-colors duration-150 ${isActive ? 'text-[var(--color-accent)] dark:text-[var(--color-accent)]' : ''}`}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
};

const UserMenuItem = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full text-right px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
};

export default Navber;
