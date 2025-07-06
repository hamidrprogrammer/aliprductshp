import React, { Fragment, useEffect, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cartListProduct /*, removeFromCart */ } from "../partials/FetchApi"; // removeFromCart might be needed if we allow removal from checkout
import { isAuthenticate } from "../auth/fetchApi";
import { subTotal, totalCost, quantity, updateQuantityInCart } from "../partials/Mixins"; // Added quantity
import { LayoutContext } from "..";

const apiURL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.REACT_APP_API_URL;

// Mock city list -  در یک برنامه واقعی این لیست از API دریافت می‌شود یا یک لیست جامع‌تر خواهد بود
const cities = ["تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرج", "اهواز", "قم", "کرمانشاه", "ارومیه", "رشت", "زاهدان", "همدان", "کرمان", "یزد", "اردبیل", "بندرعباس", "اراک", "اسلام‌شهر", "زنجان", "سنندج", "قزوین", "خرم‌آباد", "گرگان", "ساری"];

// کامپوننت نمایش محصولات در خلاصه سفارش
const CheckoutProductsList = ({ products }) => {
  const navigate = useNavigate();
  const { data: layoutData } = useContext(LayoutContext);

  if (!products || products.length === 0) {
    return <div className={`text-center py-4 ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>سبد خرید شما برای پرداخت خالی است.</div>;
  }

  return (
    <Fragment>
      <div className="space-y-4">
        {products.map((product, index) => {
          return (
            <div
              key={product._id + "_" + index} // More unique key
              className={`flex items-center space-x-3 space-x-reverse pb-4 ${index !== products.length - 1 ? (layoutData.isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}
            >
              <img
                className="w-20 h-20 object-cover rounded-lg shadow-md"
                src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                alt={product.pName}
              />
              <div className="flex-grow">
                <div className={`font-semibold truncate ${layoutData.isDarkMode ? 'text-gray-100' : 'text-gray-800'}`} title={product.pName}>
                  {product.pName}
                </div>
                <div className={`text-sm ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  تعداد: {quantity(product._id)}
                </div>
              </div>
              <div className={`font-semibold text-sm whitespace-nowrap ${layoutData.isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {subTotal(product._id, product.pPrice).toLocaleString('fa-IR')} تومان
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};


export const CheckoutComponent = (props) => {
  const navigate = useNavigate();
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    fullName: "",
    address: "",
    phone: "",
    city: cities[0],
    postalCode: "",
    notes: "",
    error: false,
    success: false,
    // clientToken: null, // Braintree related
    // instance: {}, // Braintree related
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!layoutData.cartProduct || layoutData.cartProduct.length === 0) {
        if(!state.success) { // فقط اگر پرداخت موفقیت آمیز نبوده هدایت کن
          navigate("/cart");
        }
    }
    layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutData.cartProduct, history, state.success]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "نام و نام خانوادگی نمی‌تواند خالی باشد.";
        break;
      case "address":
        if (!value.trim()) error = "آدرس نمی‌تواند خالی باشد.";
        break;
      case "phone":
        if (!value.trim()) error = "شماره تلفن نمی‌تواند خالی باشد.";
        else if (!/^(09\d{9})$/.test(value)) error = "فرمت شماره تلفن (09xxxxxxxxx) صحیح نیست.";
        break;
      case "city":
        if (!value) error = "انتخاب شهر الزامی است.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value, error: false });
    const error = validateField(name, value);
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    errors.fullName = validateField("fullName", state.fullName);
    errors.address = validateField("address", state.address);
    errors.phone = validateField("phone", state.phone);
    errors.city = validateField("city", state.city);

    const validErrors = Object.values(errors).filter(err => err !== "");
    setFormErrors(errors);
    return validErrors.length === 0;
  };

  const handlePayment = () => {
    if (!validateForm()) {
      setState({...state, error: "لطفاً تمامی فیلدهای ستاره‌دار را به درستی تکمیل کنید."});
      // Scroll to first error (optional)
      const firstErrorField = Object.keys(formErrors).find(key => formErrors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if(element) element.focus();
      }
      return;
    }

    layoutDispatch({ type: "loading", payload: true });
    // شبیه‌سازی فرآیند پرداخت
    setTimeout(() => {
      console.log("اطلاعات پرداخت:", state);
      // پاک کردن سبد خرید پس از پرداخت موفق
      localStorage.removeItem("cart");
      layoutDispatch({ type: "cartProduct", payload: [] });
      layoutDispatch({ type: "cartTotalCost", payload: 0 });
      layoutDispatch({ type: "inCart", payload: [] });
      layoutDispatch({ type: "loading", payload: false });
      setState(prevState => ({ ...prevState, success: true, error: false }));
    }, 2500);
  };

  // هزینه ارسال و پیام هوشمند
  const currentTotalCost = layoutData.cartTotalCost || 0;
  const freeShippingThreshold = 5000000; // ۵ میلیون تومان
  const shippingCost = currentTotalCost > 0 && currentTotalCost < freeShippingThreshold ? 35000 : 0;
  const finalTotal = currentTotalCost + shippingCost;
  const remainingForFreeShipping = freeShippingThreshold - currentTotalCost;

  if (layoutData.loading && !state.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="w-16 h-16 animate-spin text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      </div>
    );
  }

  return (
    <Fragment>
      <AnimatePresence>
        {state.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => { /* Allow closing overlay if needed, or redirect */ }}
          >
            <motion.div
              initial={{ scale: 0.7, y: -30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className={`p-8 md:p-10 rounded-2xl shadow-2xl text-center max-w-md w-full ${layoutData.isDarkMode ? 'bg-gray-800 neumorphism-dark' : 'bg-white neumorphism-light'}`}
            >
              <motion.svg
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay:0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="w-20 h-20 md:w-24 md:h-24 text-green-500 dark:text-green-400 mx-auto mb-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-3">پرداخت با موفقیت انجام شد!</h2>
              <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 mb-8">از خرید شما سپاسگزاریم. سفارش شما ثبت و جهت پردازش ارسال گردید.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setState({ ...state, success: false });
                  navigate("/user/orders");
                }}
                className="w-full py-3.5 px-8 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-lg hover:opacity-90 neubrutal-border neubrutal-shadow--light transition-all duration-150"
              >
                پیگیری سفارشات
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!state.success && (
      <section className={`pt-28 md:pt-32 lg:pt-36 pb-16 px-4 md:px-12 min-h-screen ${layoutData.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-[var(--color-text)]">نهایی کردن خرید</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Form Section */}
            <motion.div
              initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{duration:0.5, delay:0.2}}
              className={`lg:col-span-2 p-6 md:p-8 rounded-2xl shadow-xl ${layoutData.isDarkMode ? 'bg-gray-800 neumorphism-dark' : 'bg-white neumorphism-light'}`}
            >
              <h2 className="text-2xl font-semibold mb-6 pb-4 border-b ${layoutData.isDarkMode ? 'border-gray-700' : 'border-gray-300'} text-[var(--color-text)]">اطلاعات ارسال</h2>
              {state.error && (
                <div className="bg-red-100 dark:bg-red-800 dark:bg-opacity-40 border border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6 text-sm" role="alert">
                  <strong className="font-bold">خطا:</strong> {state.error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col">
                  <label htmlFor="fullName" className={`pb-2 font-semibold ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>نام و نام خانوادگی <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" id="fullName" value={state.fullName} onChange={handleChange} className={`p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] neubrutal-border ${layoutData.isDarkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-gray-50 border-gray-300 placeholder-gray-500'} ${formErrors.fullName ? 'border-red-500 dark:border-red-500' : ''}`} placeholder="مثال: علی محمدی" />
                  {formErrors.fullName && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{formErrors.fullName}</p>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className={`pb-2 font-semibold ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>شماره تلفن <span className="text-red-500">*</span></label>
                  <input value={state.phone} name="phone" onChange={handleChange} type="tel" id="phone" className={`p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] neubrutal-border ${layoutData.isDarkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-gray-50 border-gray-300 placeholder-gray-500'} ${formErrors.phone ? 'border-red-500 dark:border-red-500' : ''}`} placeholder="مثال: 09123456789" />
                  {formErrors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{formErrors.phone}</p>}
                </div>
              </div>
              <div className="flex flex-col mt-5">
                <label htmlFor="address" className={`pb-2 font-semibold ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>آدرس کامل <span className="text-red-500">*</span></label>
                <textarea value={state.address} name="address" onChange={handleChange} id="address" rows="3" className={`p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] neubrutal-border ${layoutData.isDarkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-gray-50 border-gray-300 placeholder-gray-500'} ${formErrors.address ? 'border-red-500 dark:border-red-500' : ''}`} placeholder="استان، شهر، خیابان اصلی، خیابان فرعی، کوچه، پلاک، واحد"></textarea>
                {formErrors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{formErrors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
                <div className="flex flex-col">
                  <label htmlFor="city" className={`pb-2 font-semibold ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>شهر <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select id="city" name="city" value={state.city} onChange={handleChange} className={`p-3.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] neubrutal-border appearance-none ${layoutData.isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300'} ${formErrors.city ? 'border-red-500 dark:border-red-500' : ''}`}>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <div className={`absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                  {formErrors.city && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{formErrors.city}</p>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="postalCode" className={`pb-2 font-semibold ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>کد پستی</label>
                  <input type="text" name="postalCode" id="postalCode" value={state.postalCode} onChange={handleChange} className={`p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] neubrutal-border ${layoutData.isDarkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-gray-50 border-gray-300 placeholder-gray-500'}`} placeholder="اختیاری" />
                </div>
              </div>
               <div className="flex flex-col mt-5">
                <label htmlFor="notes" className={`pb-2 font-semibold ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>یادداشت سفارش</label>
                <textarea value={state.notes} name="notes" onChange={handleChange} id="notes" rows="3" className={`p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] neubrutal-border ${layoutData.isDarkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-gray-50 border-gray-300 placeholder-gray-500'}`} placeholder="توضیحات یا درخواست‌های اضافی (اختیاری)"></textarea>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b ${data.isDarkMode ? 'border-gray-700' : 'border-gray-300'} text-[var(--color-text)]">روش پرداخت</h3>
                <div className={`p-4 rounded-lg ${layoutData.isDarkMode ? 'border border-gray-600 bg-gray-700/50' : 'border bg-gray-100'}`}>
                  <p className={`text-center ${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    در حال حاضر تنها امکان پرداخت آنلاین از طریق درگاه بانکی معتبر فراهم است.
                  </p>
                </div>
              </div>

              {/* Braintree DropIn کامنت شد
              {state.clientToken !== null ? (
                <Fragment>
                  <DropIn
                    options={{
                      authorization: state.clientToken,
                      paypal: { flow: "vault" },
                    }}
                    onInstance={(instance) => (state.instance = instance)}
                  />
                   <div onClick={handlePayment} ... > Pay now </div>
                </Fragment>
              ) : ( <div>Loading payment options...</div> )}
              */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2, boxShadow: `8px 8px 0px var(${layoutData.isDarkMode ? 'rgba(var(--color-accent-rgb), 0.7)' : 'rgba(var(--color-text-rgb), 0.8)'})`}}
                whileTap={{ scale: 0.98, y:0, boxShadow: `4px 4px 0px var(${layoutData.isDarkMode ? 'rgba(var(--color-accent-rgb), 0.5)' : 'rgba(var(--color-text-rgb), 0.6)'})` }}
                onClick={handlePayment}
                className={`w-full mt-10 py-4 px-6 rounded-xl text-xl font-bold transition-all duration-150 neubrutal-border
                            ${layoutData.isDarkMode ? 'bg-[var(--color-accent)] text-gray-900 hover:bg-yellow-400 border-yellow-500'
                                                   : 'bg-[var(--color-accent)] text-white hover:bg-blue-700 border-blue-700'}`}
                style={{
                  '--color-accent-rgb': '59, 130, 246', // Assuming blue-500
                  '--color-text-rgb': '31, 41, 55', // Assuming gray-800
                }}
              >
                پرداخت و ثبت نهایی سفارش
              </motion.button>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration:0.5, delay:0.3}}
              className={`lg:col-span-1 p-6 md:p-8 rounded-2xl shadow-xl lg:sticky lg:top-32 ${layoutData.isDarkMode ? 'bg-gray-800 neumorphism-dark' : 'bg-white neumorphism-light'}`}
            >
              <h2 className="text-2xl font-semibold mb-6 pb-4 border-b ${layoutData.isDarkMode ? 'border-gray-700' : 'border-gray-300'} text-[var(--color-text)]">خلاصه سفارش</h2>
              <CheckoutProductsList products={layoutData.cartProduct} />
              {layoutData.cartProduct && layoutData.cartProduct.length > 0 && (
                <div className={`mt-6 pt-6 border-t ${layoutData.isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <div className="space-y-3 text-md md:text-lg">
                    <div className="flex justify-between">
                      <span className={`${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>جمع محصولات:</span>
                      <span className="font-semibold">{currentTotalCost.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${layoutData.isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>هزینه ارسال:</span>
                      <span className="font-semibold">{shippingCost > 0 ? shippingCost.toLocaleString('fa-IR') + ' تومان' : 'رایگان'}</span>
                    </div>
                    {remainingForFreeShipping > 0 && shippingCost > 0 && currentTotalCost > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 text-center py-2.5 px-3 bg-green-500/10 dark:bg-green-500/20 rounded-lg border border-green-500/30">
                        {remainingForFreeShipping.toLocaleString('fa-IR')} تومان تا ارسال رایگان!
                      </p>
                    )}
                    <div className={`flex justify-between font-bold text-xl md:text-2xl pt-4 border-t ${layoutData.isDarkMode ? 'border-gray-600' : 'border-gray-300'} text-[var(--color-text)]`}>
                      <span>مبلغ نهایی:</span>
                      <span>{finalTotal.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/cart')}
                    className={`w-full text-center mt-8 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base
                               ${layoutData.isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 neubrutal-border--dark' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 neubrutal-border'}`}
                  >
                    بازگشت و ویرایش سبد خرید
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      )}
    </Fragment>
  );
};

// کامپوننت نمایش محصولات در خلاصه سفارش
const CheckoutProducts = ({ products }) => {
  const navigate = useNavigate();
  const { data: layoutData } = useContext(LayoutContext);

  if (!products || products.length === 0) {
    return <div className={`text-center py-4 ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>سبد خرید شما برای پرداخت خالی است.</div>;
  }

  return (
    <Fragment>
      <div className="space-y-4">
        {products.map((product, index) => {
          return (
            <div
              key={product._id + "_" + index} // More unique key
              className={`flex items-center space-x-3 space-x-reverse pb-4 ${index !== products.length - 1 ? (layoutData.isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}
            >
              <img
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-md cursor-pointer"
                src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                alt={product.pName}
                onClick={() => navigate(`/products/${product._id}`)}
              />
              <div className="flex-grow">
                <div className={`font-semibold truncate text-sm md:text-base ${layoutData.isDarkMode ? 'text-gray-100' : 'text-gray-800'}`} title={product.pName}>
                  {product.pName}
                </div>
                <div className={`text-xs md:text-sm ${layoutData.isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  تعداد: {quantity(product._id)}
                </div>
              </div>
              <div className={`font-semibold text-xs md:text-sm whitespace-nowrap ${layoutData.isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {subTotal(product._id, product.pPrice).toLocaleString('fa-IR')} تومان
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
