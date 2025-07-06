import React, { Fragment, useEffect, useState, useContext } from "react"; // Added useContext
import { useParams, useNavigate } from "react-router-dom";
import Layout, { LayoutContext } from "../layout"; // LayoutContext for theme
import { productByCategory } from "../../admin/products/FetchApi";
import { isWishReq, unWishReq, isWish } from "./Mixins"; // For wishlist
import { motion } from 'framer-motion';

const apiURL = import.meta.env.REACT_APP_API_URL;

const Submenu = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-24 lg:mt-28 mb-6 md:mb-8">
        <div className="flex justify-between items-center py-3 border-b border-[var(--color-border)]">
          <div className="text-sm flex items-center space-x-2 space-x-reverse text-[var(--color-text-secondary)]">
            <span
              className="hover:text-[var(--color-accent)] cursor-pointer"
              onClick={() => navigate("/")}
            >
              فروشگاه
            </span>
            <svg className="w-3 h-3 transform rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-[var(--color-text-primary)] font-medium cursor-default">{category}</span>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

// ProductFilters and SortDropdown would be separate components,
// their internal styling needs to be updated based on template.html in a later step or if specifically requested.
// For now, we are focusing on the ProductCard and overall page layout.
// import ProductFilters from "../productListing/ProductFilters";
// import SortDropdown from "../productListing/SortDropdown";


const ProductCard = ({ product, index, wList, setWlist }) => { // Added wList and setWlist
  const navigate = useNavigate();
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext); // For theme and cart dispatch

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05, duration: 0.4 }
    }
  };

  const addToCartHandler = (e) => {
    e.stopPropagation();
    layoutDispatch({ type: "addProductToCart", payload: product, quantity: 1 });
    layoutDispatch({ type: "cartModalToggle", payload: true });
    console.log('Add to cart from category page:', product.pName);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`relative flex flex-col h-full rounded-xl overflow-hidden
                  bg-[var(--color-card-background)] text-[var(--color-card-text)]
                  shadow-lg group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1`}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="relative w-full h-56 md:h-64 overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={`${apiURL}/uploads/products/${product.pImages[0]}`}
          alt={product.pName}
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300/cccccc/969696?text=No+Image"; }}
        />
        <div className="absolute top-2 right-2 z-10">
           <button
            onClick={(e) => {
              e.stopPropagation();
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
        <div className="mt-auto flex justify-between items-center pt-2">
          <p className="text-xl md:text-2xl font-bold text-[var(--color-accent)]">
            {product.pPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
          </p>
          <button
            onClick={addToCartHandler}
            className="bg-[var(--color-accent)] text-white text-xs md:text-sm font-medium py-2 px-3 md:px-4 rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const AllProduct = ({ products }) => {
  const category =
    products && products.length > 0 ? products[0].pCategory.cName : "محصولات";
  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")) || []);

  return (
    <Fragment>
      <Submenu category={category} />
      <div className="flex flex-col md:flex-row container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16"> {/* Added pb for spacing */}
        {/* <aside className="w-full md:w-1/4 lg:w-1/5 p-4"> */}
          {/* ProductFilters would go here - placeholder for now */}
          {/* <div className="bg-[var(--color-card-background)] p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">فیلترها</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">به زودی...</p>
          </div> */}
        {/* </aside> */}
        <main className="flex-1 p-0 md:px-4"> {/* Adjusted padding */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4 md:mb-0">
              {category}
            </h1>
            {/* SortDropdown would go here - placeholder for now */}
            {/* <div className="bg-[var(--color-card-background)] p-2 rounded-lg shadow">
              <p className="text-sm text-[var(--color-text-secondary)]">مرتب‌سازی به زودی...</p>
            </div> */}
          </div>
          {products && products.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {products.map((item, index) => (
                <ProductCard key={item._id} product={item} index={index} wList={wList} setWlist={setWlist} />
              ))}
            </div>
          ) : (
            <div className="col-span-full flex items-center justify-center py-24 text-xl text-[var(--color-text-secondary)]">
              محصولی در این دسته‌بندی یافت نشد.
            </div>
          )}
        </main>
      </div>
    </Fragment>
  );
};

const PageComponent = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for this component
  const { catId } = useParams();
  const { dispatch: homeDispatch } = useContext(HomeContext); // If HomeContext manages global loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // homeDispatch({ type: "loading", payload: true }); // Optional: use global loading
      try {
        let responseData = await productByCategory(catId);
        if (responseData && responseData.Products) {
          setProducts(responseData.Products);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        // homeDispatch({ type: "loading", payload: false });
      }
    };
    fetchData();
  }, [catId /*, homeDispatch*/]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
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

  return (
    <Fragment>
      <AllProduct products={products} />
    </Fragment>
  );
};

const ProductByCategory = (props) => {
  return (
    <Fragment>
      <Layout children={<PageComponent />} />
    </Fragment>
  );
};

export default ProductByCategory;
