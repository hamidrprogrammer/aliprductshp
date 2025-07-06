import React, { Fragment, useContext, useEffect } from "react";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi"; // Assuming this is still needed for initial/force fetch
import { isAuthenticate } from "../auth/fetchApi";
import { cartList, subTotal, quantity, totalCost, removeFromCart } from "./Mixins"; // removeFromCart from mixins
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const apiURL = import.meta.env.REACT_APP_API_URL || import.meta.env.VITE_REACT_APP_API_URL;

const CartModalItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center space-x-3 space-x-reverse py-3 border-b border-[var(--color-border)] dark:border-gray-700 last:border-b-0">
      <img
        className="w-16 h-16 object-cover rounded-md shadow"
        src={`${apiURL}/uploads/products/${item.pImages[0]}`}
        alt={item.pName}
        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/80x80/cccccc/969696?text=No+Image"; }}
      />
      <div className="flex-grow">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{item.pName}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {quantity(item._id)} عدد × {item.pPrice.toLocaleString('fa-IR')} تومان
        </p>
      </div>
      <div className="text-sm font-semibold text-[var(--color-text-primary)]">
        {subTotal(item._id, item.pPrice).toLocaleString('fa-IR')} ت
      </div>
      <button onClick={() => onRemove(item._id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 p-1 rounded-full" title="حذف">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
};

const CartModal = () => {
  const navigate = useNavigate();
  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  const cartModalToggle = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  useEffect(() => {
    // Initial fetch if needed, or rely on cart updates from other components
    if (data.cartModal && (!products || products.length === 0)) {
      fetchData();
    }
    if (products) { // Recalculate total cost whenever products in cart change
        dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.cartModal, products]); // products dependency added

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
      } else {
        dispatch({ type: "cartProduct", payload: [] });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "cartProduct", payload: [] });
    }
  };

  const handleRemoveProduct = (id) => {
    removeFromCart(id); // This function should update localStorage
    const updatedCart = cartList(); // Get updated cart list from localStorage
    const updatedProducts = products.filter(p => p._id !== id);

    dispatch({ type: "inCart", payload: updatedCart }); // Update cart item count indicator
    dispatch({ type: "cartProduct", payload: updatedProducts }); // Update product list in modal
  };

  const currentTotalCost = totalCost();

  const modalVariants = {
    hidden: { x: "100%", opacity: 0, transition: { type: "spring", stiffness: 150, damping: 25, mass: 0.8 } },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 25, mass: 0.8 } },
  };


  return (
    <Fragment>
      {/* Black Overlay */}
      <AnimatePresence>
        {data.cartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cartModalToggle}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Cart Modal Panel */}
      <AnimatePresence>
        {data.cartModal && (
          <motion.section
            key="cartModal"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            className="fixed z-40 top-0 right-0 w-full max-w-sm md:max-w-md h-full bg-[var(--color-card-background)] text-[var(--color-text-primary)] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-semibold">سبد خرید</h2>
              <button onClick={cartModalToggle} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-5">
              {products && products.length > 0 ? (
                <AnimatePresence>
                  {products.map((item) => (
                    <CartModalItem key={item._id} item={item} onRemove={handleRemoveProduct} />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <p className="text-lg text-[var(--color-text-secondary)]">سبد خرید شما خالی است.</p>
                </div>
              )}
            </div>

            {products && products.length > 0 && (
              <div className="p-5 border-t border-[var(--color-border)] space-y-4">
                <div className="flex justify-between text-lg font-semibold text-[var(--color-text-primary)]">
                  <span>جمع کل:</span>
                  <span>{currentTotalCost.toLocaleString('fa-IR')} تومان</span>
                </div>
                <button
                  onClick={() => {
                    navigate("/cart");
                    cartModalToggle();
                  }}
                  className="w-full py-3 px-4 rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-semibold hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-150"
                >
                  مشاهده سبد خرید
                </button>
                {isAuthenticate() ? (
                  <button
                    onClick={() => {
                      navigate("/checkout");
                      cartModalToggle();
                    }}
                    className="w-full py-3 px-4 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
                  >
                    ادامه و پرداخت
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      cartModalToggle(); // Close cart modal
                      dispatch({ type: "loginSignupModalToggle", payload: true }); // Open login modal
                    }}
                    className="w-full py-3 px-4 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
                  >
                    ورود و ادامه خرید
                  </button>
                )}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default CartModal;
