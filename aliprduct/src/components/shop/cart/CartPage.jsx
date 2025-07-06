import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
// import { cartListProduct } from "../partials/FetchApi"; // Assuming cart products are now primarily managed via LayoutContext
import { removeFromCart, updateQuantityInCart, quantity, subTotal, totalCost, cartList } from "../partials/Mixins";
import { isAuthenticate } from "../auth/fetchApi";
import Layout, { LayoutContext } from "../layout"; // Import Layout and LayoutContext from the correct path

const apiURL = import.meta.env.REACT_APP_API_URL || import.meta.env.VITE_REACT_APP_API_URL;

const CartItem = ({ product, quantity, onRemove, onUpdateQuantity }) => {
  const { data: layoutData } = useContext(LayoutContext);
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleQuantityChange = (action) => {
    let newQuantity = itemQuantity;
    if (action === 'increase') {
      newQuantity = Math.min(itemQuantity + 1, product.pQuantity); // Respect stock
    } else if (action === 'decrease') {
      newQuantity = Math.max(1, itemQuantity - 1);
    }
    setItemQuantity(newQuantity);
    onUpdateQuantity(product._id, newQuantity);
  };

  return (
    <motion.div
      layout // برای انیمیشن حذف
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`flex items-center space-x-4 space-x-reverse p-4 md:p-5 border-b border-[var(--color-border)]`}
    >
      <img
        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow" // Slightly smaller image, more refined shadow
        src={`${apiURL}/uploads/products/${product.pImages[0]}`}
        alt={product.pName}
        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/100x100/cccccc/969696?text=No+Image"; }}
      />
      <div className="flex-grow">
        <h3 className={`text-md md:text-lg font-semibold text-[var(--color-text-primary)]`}>{product.pName}</h3>
        <p className={`text-xs md:text-sm text-[var(--color-text-secondary)] mt-1`}>
          قیمت واحد: {product.pPrice.toLocaleString('fa-IR')} تومان
        </p>
        <div className="flex items-center mt-3">
          <span className={`text-xs md:text-sm ml-2 text-[var(--color-text-secondary)]`}>تعداد:</span>
          <div className={`flex items-center border border-[var(--color-border)] rounded-md overflow-hidden`}>
            <button onClick={() => handleQuantityChange('decrease')} className={`px-2 py-1 text-md md:text-lg text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-150`}>-</button>
            <span className={`px-3 py-1 text-sm md:text-md font-medium text-[var(--color-text-primary)] bg-gray-50 dark:bg-gray-700`}>{itemQuantity}</span>
            <button onClick={() => handleQuantityChange('increase')} className={`px-2 py-1 text-md md:text-lg text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-150`}>+</button>
          </div>
        </div>
      </div>
      <div className="text-left rtl:text-right flex flex-col items-end">
        <p className={`text-md md:text-lg font-semibold text-[var(--color-text-primary)]`}>
          {(product.pPrice * itemQuantity).toLocaleString('fa-IR')} تومان
        </p>
        <button
          onClick={() => onRemove(product._id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 text-xs md:text-sm mt-1 transition-colors"
        >
          حذف
        </button>
      </div>
    </motion.div>
  );
};


const CartPage = () => {
  const navigate = useNavigate();
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
  const products = layoutData.cartProduct;

  useEffect(() => {
    // Ensure cart total is updated when products change
    if (products) {
        layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
    }
  }, [products, layoutDispatch]);


  const handleRemoveProduct = (productId) => {
    removeFromCart(productId);
    const updatedCart = cartList(); // Get updated cart list from localStorage
    const updatedProducts = products.filter(p => p._id !== productId); // Update local product list

    layoutDispatch({ type: "inCart", payload: updatedCart });
    layoutDispatch({ type: "cartProduct", payload: updatedProducts });
    // totalCost will be recalculated in useEffect due to products change
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantityInCart(productId, newQuantity);
    // Create a new array with updated quantities for products
    const updatedProducts = products.map(p =>
        p._id === productId ? { ...p, pQuantityInCart: newQuantity } : p // Assuming pQuantityInCart or similar exists
    );
    layoutDispatch({ type: "cartProduct", payload: updatedProducts });
    // totalCost will be recalculated in useEffect
  };

  const currentTotalCost = totalCost(); // Recalculate based on current cart in localStorage
  const shippingCost = currentTotalCost > 500000 ? 0 : 35000;
  const freeShippingThreshold = 500000;
  const remainingForFreeShipping = freeShippingThreshold - currentTotalCost;

  return (
    <Layout> {/* Wrap content with Layout */}
      <div className={`min-h-screen pt-24 md:pt-32 pb-12 bg-[var(--color-background)] text-[var(--color-text-primary)]`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[var(--color-text-primary)]">سبد خرید شما</h1>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-start">
              {/* Product List */}
              <div className={`lg:col-span-2 rounded-xl shadow-xl bg-[var(--color-card-background)] border border-[var(--color-border)]`}>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <CartItem
                      key={product._id}
                      product={product}
                      quantity={quantity(product._id)}
                      onRemove={handleRemoveProduct}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary (Sticky) */}
              <div className="lg:col-span-1 lg:sticky lg:top-32"> {/* Adjusted top for fixed navbar */}
                <div className={`p-6 rounded-xl shadow-xl bg-[var(--color-card-background)] border border-[var(--color-border)]`}>
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4 border-[var(--color-border)] text-[var(--color-text-primary)]">خلاصه سفارش</h2>
                  <div className="space-y-3 text-md text-[var(--color-text-secondary)]">
                    <div className="flex justify-between">
                      <span>جمع محصولات:</span>
                      <span className="font-medium text-[var(--color-text-primary)]">{currentTotalCost.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="flex justify-between">
                      <span>هزینه ارسال:</span>
                      <span className="font-medium text-[var(--color-text-primary)]">{shippingCost > 0 ? shippingCost.toLocaleString('fa-IR') + ' تومان' : 'رایگان'}</span>
                    </div>
                    {remainingForFreeShipping > 0 && shippingCost > 0 && (
                      <p className="text-xs text-center py-2 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 dark:bg-opacity-30 rounded-md">
                        {remainingForFreeShipping.toLocaleString('fa-IR')} تومان تا ارسال رایگان!
                      </p>
                    )}
                    <div className={`flex justify-between font-bold text-lg md:text-xl pt-4 border-t border-[var(--color-border)] text-[var(--color-text-primary)]`}>
                      <span>مبلغ قابل پرداخت:</span>
                      <span>{(currentTotalCost + shippingCost).toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isAuthenticate()) {
                        navigate("/checkout");
                      } else {
                        layoutDispatch({ type: "loginSignupModalToggle", payload: true });
                      }
                    }}
                    className="w-full mt-8 py-3 px-6 rounded-lg bg-[var(--color-accent)] text-white text-lg font-semibold shadow-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] focus:ring-opacity-50 transition-all duration-150"
                  >
                    {isAuthenticate() ? 'ادامه فرایند خرید' : 'ورود و ادامه خرید'}
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`py-16 text-center rounded-xl shadow-xl bg-[var(--color-card-background)] border border-[var(--color-border)]`}>
              <svg className="w-20 h-20 md:w-24 md:h-24 mx-auto text-gray-400 dark:text-gray-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <p className="text-xl md:text-2xl font-semibold mb-4 text-[var(--color-text-primary)]">سبد خرید شما خالی است!</p>
              <p className="text-[var(--color-text-secondary)] mb-8 px-4">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
              <button
                onClick={() => navigate('/')}
                className="py-3 px-8 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-md hover:bg-[var(--color-accent-hover)] transition-all duration-150"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
