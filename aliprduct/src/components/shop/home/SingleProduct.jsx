import React, { Fragment, useState, useEffect, useContext } from "react";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index"; // Assuming this context provides products or a way to set them
import { LayoutContext } from ".."; // For theme
import { isWishReq, unWishReq, isWish } from "./Mixins";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For potential animations

const apiURL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.REACT_APP_API_URL;

const SingleProductCard = ({ product, wList, setWlist }) => {
  const navigate = useNavigate();
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext); // Renamed to avoid conflict with HomeContext data

  const addToCart = () => {
    layoutDispatch({ type: "addProductToCart", payload: product, quantity: 1 });
    layoutDispatch({ type: "cartModalToggle", payload: true });
    console.log("Add to cart:", product.pName);
  };

  return (
    <motion.div
      className={`relative flex flex-col h-full rounded-xl overflow-hidden
                  bg-[var(--color-card-background)] text-[var(--color-card-text)]
                  shadow-lg group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="relative w-full h-56 md:h-64 overflow-hidden">
        <img
          src={`${apiURL}/uploads/products/${product.pImages[0]}`}
          alt={product.pName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300/cccccc/969696?text=No+Image"; }}
        />
        {/* WishList Icon - Styled to match Navber icons */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              isWish(product._id, wList) ? unWishReq(e, product._id, setWlist) : isWishReq(e, product._id, setWlist);
            }}
            title={isWish(product._id, wList) ? "Remove from Wishlist" : "Add to Wishlist"}
            className="p-2 rounded-full bg-white/30 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm transition-colors duration-150"
          >
            <svg
              className={`w-5 h-5 md:w-6 md:h-6 cursor-pointer transition-all duration-300 ease-in
                          ${isWish(product._id, wList) ? 'text-red-500 fill-current' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'}`}
              fill={isWish(product._id, wList) ? "currentColor" : "none"}
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
          </button>
        </div>
      </div>
      <div className={`flex flex-col flex-grow p-4 md:p-5`}>
        <h3 className="text-lg md:text-xl font-semibold mb-1 truncate h-12 md:h-14 flex items-center" title={product.pName}>
          {product.pName}
        </h3>
        {/* Ratings - if available and part of template.html design */}
        {product.pRatingsReviews && product.pRatingsReviews.length > 0 && (
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs md:text-sm text-yellow-500 mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span>{product.pRatingsReviews.length} {/* Replace with actual average rating if available */}</span>
          </div>
        )}
        <div className="mt-auto flex justify-between items-center pt-2">
          <p className="text-xl md:text-2xl font-bold text-[var(--color-accent)]">
            {product.pPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
            }}
            className="bg-[var(--color-accent)] text-white text-xs md:text-sm font-medium py-2 px-3 md:px-4 rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const SingleProduct = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const { products, loading: homeLoading } = data;

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList")) || []
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });
      try {
        let responseData = await getAllProduct();
          if (responseData && responseData.Products) {
            dispatch({ type: "setProducts", payload: responseData.Products });
          }
          dispatch({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        dispatch({ type: "loading", payload: false });
      }
    };

    if (!products || products.length === 0) {
        fetchData();
    } else {
        dispatch({ type: "loading", payload: false });
    }
  }, [dispatch]); // Removed products from dependency array

  if (homeLoading) {
    return (
      <div className="col-span-full flex items-center justify-center py-24">
        <svg
          className="w-12 h-12 animate-spin text-[var(--color-accent)]"
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

  if (!products || products.length === 0) {
      return (
        <div className="col-span-full flex items-center justify-center py-24 text-xl text-[var(--color-text-secondary)]">
            محصولی یافت نشد.
        </div>
      )
  }

  return (
    <Fragment>
      {products.map((item) => (
        <SingleProductCard key={item._id} product={item} wList={wList} setWlist={setWlist} />
      ))}
    </Fragment>
  );
};

export default SingleProduct;
