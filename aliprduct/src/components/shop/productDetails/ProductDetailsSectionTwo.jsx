import React, { Fragment, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AllReviews from "./AllReviews";
import ReviewForm from "./ReviewForm";

import { ProductDetailsContext } from ".";

import { isAuthenticate } from "../auth/fetchApi";
import { LayoutContext } from "..";

// import "./style.css"; // Assuming styles are handled by Tailwind or global CSS

const Menu = () => {
  const { data: productData, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData } = useContext(LayoutContext);

  const activeClasses = "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]";
  const inactiveClasses = "text-gray-500 dark:text-gray-400 hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent)]";

  return (
    <Fragment>
      <div className="flex items-center justify-center space-x-6 md:space-x-8 space-x-reverse border-b border-gray-300 dark:border-gray-700 mb-8">
        <button
          onClick={(e) => dispatch({ type: "menu", payload: true })}
          className={`px-4 py-4 text-lg md:text-xl font-semibold focus:outline-none transition-colors duration-200 ${
            productData.menu ? activeClasses : inactiveClasses
          }`}
        >
          توضیحات محصول
        </button>
        <button
          onClick={(e) => dispatch({ type: "menu", payload: false })}
          className={`px-4 py-4 text-lg md:text-xl font-semibold relative focus:outline-none transition-colors duration-200 ${
            !productData.menu ? activeClasses : inactiveClasses
          }`}
        >
          <span>نظرات کاربران</span>
          {layoutData.singleProductDetail && layoutData.singleProductDetail.pRatingsReviews && (
            <span className={`absolute -top-1 -right-3 text-xs bg-[var(--color-accent)] text-white rounded-full px-2 py-0.5 ${productData.menu ? 'opacity-70' : ''}`}>
              {layoutData.singleProductDetail.pRatingsReviews.length}
            </span>
          )}
        </button>
      </div>
    </Fragment>
  );
};

const RatingReview = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AllReviews />
      {isAuthenticate() ? (
        <ReviewForm />
      ) : (
        <div className="mt-8 p-4 bg-red-100 dark:bg-red-800 dark:bg-opacity-30 text-red-700 dark:text-red-300 rounded-lg text-center">
          برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.
        </div>
      )}
    </motion.div>
  );
};

const ProductDetailsSectionTwo = (props) => {
  const { data: productData } = useContext(ProductDetailsContext);
  const { data: layoutData } = useContext(LayoutContext);
  const [singleProduct, setSingleproduct] = useState({});

  useEffect(() => {
    setSingleproduct(
      layoutData.singleProductDetail ? layoutData.singleProductDetail : {}
    );
  }, [layoutData.singleProductDetail]);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <Fragment>
      <section className="py-12 md:py-16 bg-[var(--color-background)] dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6 md:px-12">
          <Menu />
          <motion.div
            key={productData.menu ? "description" : "reviews"} // Change key to trigger animation on tab change
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 prose prose-lg dark:prose-invert max-w-none leading-relaxed text-right text-[var(--color-text)]"
          >
            {productData.menu ? (
              <div dangerouslySetInnerHTML={{ __html: singleProduct.pDescription?.replace(/\n/g, '<br />') || 'توضیحات محصول به زودی اضافه خواهد شد.' }} />
            ) : (
              <RatingReview />
            )}
          </motion.div>
        </div>
      </section>
      {/* Additional Info Section (Category, Tags etc.) - Can be styled with Neubrutalism */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6 md:px-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-gray-600 dark:text-gray-400">
          {singleProduct.pCategory && (
            <div className="flex items-center space-x-2 space-x-reverse neubrutal-border bg-white dark:bg-gray-700 px-4 py-2 rounded-md">
              <span className="font-semibold">دسته‌بندی:</span>
              <span>{singleProduct.pCategory.cName}</span>
            </div>
          )}
          {/* Placeholder for tags or other info */}
          {singleProduct.pTags && singleProduct.pTags.length > 0 && (
             <div className="flex items-center space-x-2 space-x-reverse neubrutal-border bg-white dark:bg-gray-700 px-4 py-2 rounded-md">
              <span className="font-semibold">برچسب‌ها:</span>
              {singleProduct.pTags.map(tag => <span key={tag} className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">{tag}</span>)}
            </div>
          )}
        </div>
      </section>
    </Fragment>
  );
};

export default ProductDetailsSectionTwo;
