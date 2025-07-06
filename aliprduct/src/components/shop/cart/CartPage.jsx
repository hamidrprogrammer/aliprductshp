import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { cartListProduct } from "../partials/FetchApi";
import { removeFromCart, updateQuantityInCart, quantity, subTotal, totalCost } from "../partials/Mixins"; // اطمینان از ایمپورت صحیح توابع
import { isAuthenticate } from "../auth/fetchApi";
import { LayoutContext } from "..";
import { cartList } from "../productDetails/Mixins";

const apiURL = import.meta.env.REACT_APP_API_URL;

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
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`flex items-center space-x-4 space-x-reverse p-4 border-b ${layoutData.isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <img
        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg shadow-md"
        src={`${apiURL}/uploads/products/${product.pImages[0]}`}
        alt={product.pName}
      />
      <div className="flex-grow">
        <h3 className={`text-lg md:text-xl font-semibold ${layoutData.isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{product.pName}</h3>
        <p className={`text-sm ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          قیمت واحد: {product.pPrice.toLocaleString('fa-IR')} تومان
        </p>
        <div className="flex items-center mt-2">
          <span className={`text-sm mr-2 ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>تعداد:</span>
          <div className={`flex items-center border rounded-md ${layoutData.isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <button onClick={() => handleQuantityChange('decrease')} className={`px-3 py-1 text-lg ${layoutData.isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-r-md transition-colors`}>-</button>
            <span className={`px-4 py-1 text-md font-semibold ${layoutData.isDarkMode ? 'text-white bg-gray-700' : 'text-gray-800 bg-gray-100'}`}>{itemQuantity}</span>
            <button onClick={() => handleQuantityChange('increase')} className={`px-3 py-1 text-lg ${layoutData.isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-l-md transition-colors`}>+</button>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-md md:text-lg font-semibold ${layoutData.isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          جمع: {(product.pPrice * itemQuantity).toLocaleString('fa-IR')} تومان
        </p>
        <button
          onClick={() => onRemove(product._id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 text-sm mt-2 transition-colors"
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
  const products = layoutData.cartProduct; // محصولات از layoutContext خوانده می‌شوند

  useEffect(() => {
    // fetchData در App.js یا یک context بالاتر برای بارگذاری اولیه سبد خرید فراخوانی می‌شود
    // در اینجا فقط برای اطمینان از به‌روز بودن هزینه کل
    layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
  }, [products, layoutDispatch]);


  const handleRemoveProduct = (productId) => {
    removeFromCart(productId); // این تابع باید در FetchApi یا Mixins پیاده‌سازی شود
    // Refresh cart from localStorage and update context
    const updatedCart = cartList();
    layoutDispatch({ type: "inCart", payload: updatedCart });
    layoutDispatch({ type: "cartProduct", payload: null }); // Clear and then fetch

    cartListProduct().then(res => {
        if(res && res.Products){
            layoutDispatch({ type: "cartProduct", payload: res.Products });
            layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
        } else {
            layoutDispatch({ type: "cartProduct", payload: [] }); // Set to empty array if no products
            layoutDispatch({ type: "cartTotalCost", payload: 0 });
        }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantityInCart(productId, newQuantity); // این تابع باید در Mixins پیاده‌سازی شود
    // Refresh cart from localStorage and update context
    const updatedCart = cartList();
    layoutDispatch({ type: "inCart", payload: updatedCart });
    layoutDispatch({ type: "cartProduct", payload: null }); // Clear and then fetch

     cartListProduct().then(res => {
        if(res && res.Products){
            layoutDispatch({ type: "cartProduct", payload: res.Products });
            layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
        } else {
            layoutDispatch({ type: "cartProduct", payload: [] });
            layoutDispatch({ type: "cartTotalCost", payload: 0 });
        }
    });
  };

  // هزینه ارسال و پیام هوشمند (منطق ساده شده)
  const shippingCost = layoutData.cartTotalCost > 500000 ? 0 : 35000;
  const freeShippingThreshold = 500000;
  const remainingForFreeShipping = freeShippingThreshold - (layoutData.cartTotalCost || 0);


  return (
    <div className={`min-h-screen pt-24 md:pt-28 pb-12 ${layoutData.isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">سبد خرید شما</h1>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Product List */}
            <div className={`lg:col-span-2 rounded-xl shadow-lg ${layoutData.isDarkMode ? 'bg-gray-800 neumorphism-dark' : 'bg-white neumorphism-light'}`}>
              <AnimatePresence>
                {products.map((product, index) => (
                  <CartItem
                    key={product._id + index} // افزودن index به key برای unique بودن در صورت آیتم‌های تکراری (که نباید اتفاق بیفتد)
                    product={product}
                    quantity={quantity(product._id)} // تابع quantity از Mixins
                    onRemove={handleRemoveProduct}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary (Sticky) */}
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <div className={`p-6 rounded-xl shadow-lg ${layoutData.isDarkMode ? 'neumorphism-dark liquid-glass' : 'bg-white neumorphism-light'}`}>
                <h2 className="text-2xl font-semibold mb-6 border-b pb-4 ${layoutData.isDarkMode ? 'border-gray-700' : 'border-gray-300'}">خلاصه سفارش</h2>
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span>جمع محصولات:</span>
                    <span>{(layoutData.cartTotalCost || 0).toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>هزینه ارسال:</span>
                    <span>{shippingCost > 0 ? shippingCost.toLocaleString('fa-IR') + ' تومان' : 'رایگان'}</span>
                  </div>
                  {remainingForFreeShipping > 0 && shippingCost > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 text-center py-2 bg-green-100 dark:bg-green-800 dark:bg-opacity-30 rounded-md">
                      {remainingForFreeShipping.toLocaleString('fa-IR')} تومان تا ارسال رایگان!
                    </p>
                  )}
                  <div className={`flex justify-between font-bold text-xl pt-4 border-t ${layoutData.isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    <span>مبلغ قابل پرداخت:</span>
                    <span>{((layoutData.cartTotalCost || 0) + shippingCost).toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isAuthenticate()) {
                      navigate("/checkout");
                    } else {
                      layoutDispatch({ type: "loginSignupModalToggle", payload: true });
                      // می‌توانید پیامی هم برای کاربر نمایش دهید که برای ادامه باید لاگین کند
                    }
                  }}
                  className="w-full mt-8 py-4 px-6 rounded-lg bg-[var(--color-accent)] text-white text-lg font-semibold hover:opacity-90 neubrutal-border neubrutal-shadow transform transition-all duration-150"
                >
                  {isAuthenticate() ? 'ادامه فرایند خرید' : 'ورود و ادامه خرید'}
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`py-16 text-center rounded-xl shadow-lg ${layoutData.isDarkMode ? 'bg-gray-800 neumorphism-dark' : 'bg-white neumorphism-light'}`}>
            <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <p className="text-2xl font-semibold mb-4">سبد خرید شما خالی است!</p>
            <p className="text-gray-500 dark:text-gray-400 mb-8">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
            <button
              onClick={() => navigate('/')}
              className="py-3 px-8 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 neubrutal-border neubrutal-shadow transition-opacity"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
