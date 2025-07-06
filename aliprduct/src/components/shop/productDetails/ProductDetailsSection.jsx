import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";
import RelatedProducts from "./RelatedProducts";

import { getSingleProduct } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";

import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { updateQuantity, addToCart } from "./Mixins";
import { totalCost } from "../partials/Mixins";

const apiURL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.REACT_APP_API_URL;

// Lightbox component for image zoom
const Lightbox = ({ image, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
    onClick={onClose}
  >
    <motion.img
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.5 }}
      src={image}
      alt="Lightbox"
      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
    />
  </motion.div>
);

const ProductDetailsSection = () => {
  let { id } = useParams();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const sProduct = layoutData.singleProductDetail;

  const [pImages, setPimages] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [quantitiy, setQuantitiy] = useState(1);
  const [, setAlertq] = useState(false);
  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")) || []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      setTimeout(() => {
        if (responseData.Product) {
          layoutDispatch({
            type: "singleProductDetail",
            payload: responseData.Product,
          });
          setPimages(responseData.Product.pImages);
          setActiveImageIndex(0);
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() });
        }
        if (responseData.error) {
          console.error(responseData.error);
        }
      }, 500);
    } catch (error) {
      console.error(error);
    }
    fetchCartProduct();
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-16 h-16 animate-spin text-[var(--color-accent)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  if (!sProduct) {
    return (
      <div className="text-center py-20 text-2xl text-gray-500">
        محصولی یافت نشد.
      </div>
    );
  }

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory._id,
          product: sProduct.pName,
          category: sProduct.pCategory.cName,
        }}
      />

      <section className="m-4 md:mx-12 md:my-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer neumorphism-light dark:neumorphism-dark"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                  src={`${apiURL}/uploads/products/${pImages?.[activeImageIndex]}`}
                  alt={sProduct.pName}
                  initial={{ opacity: 0.5, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.5, x: -50 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"
                  />
                </svg>
              </div>
            </div>

            {/* Thumbnails */}
            {pImages && pImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {pImages.map((image, index) => (
                  <img
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`cursor-pointer w-full h-20 md:h-28 object-cover rounded-lg border-2 transition-all duration-200 ${
                      activeImageIndex === index
                        ? "border-[var(--color-accent)] shadow-md scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    src={`${apiURL}/uploads/products/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] leading-tight">
              {sProduct.pName}
            </h1>

            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-extrabold text-[var(--color-accent)]">
                {sProduct.pPrice.toLocaleString("fa-IR")}{" "}
                <span className="text-lg font-normal">تومان</span>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isWish(sProduct._id, wList)
                    ? unWishReq(e, sProduct._id, setWlist)
                    : isWishReq(e, sProduct._id, setWlist);
                }}
                className={`p-3 rounded-full transition-all duration-300 ${
                  data.isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } ${
                  isWish(sProduct._id, wList)
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                title={
                  isWish(sProduct._id, wList)
                    ? "حذف از علاقه‌مندی‌ها"
                    : "افزودن به علاقه‌مندی‌ها"
                }
              >
                <svg
                  className="w-7 h-7"
                  fill={isWish(sProduct._id, wList) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Quantity selector and add to cart */}
            <div className="my-4 md:my-6">
              {sProduct.pQuantity === 0 ? (
                <span className="text-xl font-semibold text-red-500 dark:text-red-400 block py-3 text-center rounded-lg border-2 border-red-500 dark:border-red-400">
                  ناموجود
                </span>
              ) : (
                <Fragment>
                  {+quantitiy === +sProduct.pQuantity && (
                    <span className="text-sm text-red-500 dark:text-red-400 mb-2 block">
                      موجودی محدود
                    </span>
                  )}
                  <div
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 ${
                      +quantitiy === +sProduct.pQuantity
                        ? "border-red-500 dark:border-red-400"
                        : data.isDarkMode
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="text-lg font-semibold text-[var(--color-text)]">
                      تعداد:
                    </span>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <button
                        onClick={() =>
                          updateQuantity(
                            "decrease",
                            sProduct.pQuantity,
                            quantitiy,
                            setQuantitiy,
                            setAlertq
                          )
                        }
                        disabled={quantitiy <= 1}
                        className={`p-2 rounded-md transition-colors ${
                          data.isDarkMode
                            ? "hover:bg-gray-600 disabled:opacity-50"
                            : "hover:bg-gray-200 disabled:opacity-50"
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <span className="text-xl font-bold w-8 text-center">
                        {quantitiy}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            "increase",
                            sProduct.pQuantity,
                            quantitiy,
                            setQuantitiy,
                            setAlertq
                          )
                        }
                        disabled={quantitiy >= sProduct.pQuantity}
                        className={`p-2 rounded-md transition-colors ${
                          data.isDarkMode
                            ? "hover:bg-gray-600 disabled:opacity-50"
                            : "hover:bg-gray-200 disabled:opacity-50"
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Fragment>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              {sProduct.pQuantity > 0 ? (
                layoutData.inCart !== null && layoutData.inCart.includes(sProduct._id) ? (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-lg bg-gray-400 dark:bg-gray-600 text-white text-lg font-semibold cursor-not-allowed opacity-75"
                  >
                    موجود در سبد خرید
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      addToCart(
                        sProduct._id,
                        quantitiy,
                        sProduct.pPrice,
                        layoutDispatch,
                        setQuantitiy,
                        setAlertq,
                        fetchData,
                        totalCost
                      )
                    }
                    className="w-full py-4 px-6 rounded-lg bg-[var(--color-accent)] text-white text-lg font-semibold hover:opacity-90 neubrutal-border neubrutal-shadow transform transition-all duration-150 hover:scale-105 active:scale-95"
                  >
                    افزودن به سبد خرید
                  </button>
                )
              ) : null}

              <button
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg neubrutal-border transition-all duration-150 hover:scale-105 active:scale-95 ${
                  data.isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-[var(--color-text)] hover:bg-gray-100 border-[var(--color-text)]"
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  مشاهده در فضای واقعی (AR)
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* بخش توضیحات و بررسی‌ها */}
      <ProductDetailsSectionTwo />

      {/* محصولات مرتبط */}
      {sProduct && sProduct.pCategory && (
        <RelatedProducts
          currentProductId={sProduct._id}
          categoryId={sProduct.pCategory._id}
        />
      )}

      {/* Lightbox نمایش بزرگ تصویر */}
      {lightboxOpen && pImages && (
        <Lightbox
          image={`${apiURL}/uploads/products/${pImages[activeImageIndex]}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Fragment>
  );
};

export default ProductDetailsSection;
