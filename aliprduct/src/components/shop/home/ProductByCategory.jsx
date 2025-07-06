import React, { Fragment, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import Layout, { LayoutContext } from "../layout";
import { productByCategory } from "../../admin/products/FetchApi";
import { useNavigate } from 'react-router-dom';

const apiURL = import.meta.env.REACT_APP_API_URL;

const Submenu = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      {/* Submenu Section */}
      <section className="mx-4 mt-24 md:mx-12 md:mt-32 lg:mt-24">
        <div className="flex justify-between items-center">
          <div className="text-sm flex space-x-3">
            <span
              className="hover:text-yellow-700 cursor-pointer"
              onClick={(e) => navigate("/")}
            >
              Shop
            </span>
            <span className="text-yellow-700 cursor-default">{category}</span>
          </div>
          <div>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </section>
      {/* Submenu Section */}
    </Fragment>
  );
};

import ProductFilters from "../productListing/ProductFilters";
import SortDropdown from "../productListing/SortDropdown";
import { motion } from 'framer-motion';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const { data } = useContext(LayoutContext);

  // ایجاد تأخیر متفاوت برای هر کارت برای انیمیشن staggered
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`relative col-span-1 m-2 group overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2
                  ${data.isDarkMode ? 'neumorphism-dark liquid-glass' : 'neumorphism-light'}`}
      onClick={(e) => navigate(`/products/${product._id}`)}
    >
      <div className="relative w-full h-72 md:h-80 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={`${apiURL}/uploads/products/${product.pImages[0]}`}
          alt={product.pName}
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); /* TODO: Add to wishlist logic */ console.log('Add to wishlist'); }}
            className={`p-2 rounded-full transition-colors duration-200 ${data.isDarkMode ? 'bg-gray-700 hover:bg-red-500 text-white' : 'bg-white hover:bg-red-500 hover:text-white text-gray-700'}`}
            title="افزودن به علاقه‌مندی‌ها"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>
        </div>
      </div>
      <div className={`p-4 ${data.isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <h3 className="text-lg font-bold truncate mb-1 group-hover:text-[var(--color-accent)] transition-colors duration-300" title={product.pName}>
          {product.pName}
        </h3>
        <p className="text-2xl font-extrabold text-[var(--color-accent)] mb-3">
          {product.pPrice.toLocaleString('fa-IR')} <span className="text-sm font-normal">تومان</span>
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); /* TODO: Add to cart logic */ console.log('Add to cart'); }}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 neubrutal-border text-sm
                      ${data.isDarkMode ? 'bg-gray-700 hover:bg-[var(--color-accent)] text-white' : 'bg-white hover:bg-[var(--color-accent)] hover:text-white border-[var(--color-text)]'}`}
        >
          افزودن به سبد خرید
        </button>
      </div>
    </motion.div>
  );
};


const AllProduct = ({ products }) => {
  const navigate = useNavigate();
  const category =
    products && products.length > 0 ? products[0].pCategory.cName : "";

  return (
    <Fragment>
      <Submenu category={category} />
      <div className="flex flex-col md:flex-row">
        <ProductFilters />
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">محصولات {category}</h2>
            <SortDropdown />
          </div>
          {products && products.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              // برای Masonry با CSS Columns:
              // style={{ columnCount: 3, columnGap: '1rem' }}
            >
              {products.map((item, index) => (
                // برای Masonry با CSS Columns:
                // <div key={index} className="mb-4 inline-block w-full">
                <ProductCard key={item._id} product={item} index={index} />
                // </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex items-center justify-center py-24 text-2xl text-gray-500 dark:text-gray-400">
              محصولی یافت نشد.
            </div>
          )}
        </main>
      </div>
    </Fragment>
  );
};

const PageComponent = () => {
  const [products, setProducts] = useState(null);
  const { catId } = useParams();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await productByCategory(catId);
      if (responseData && responseData.Products) {
        setProducts(responseData.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
