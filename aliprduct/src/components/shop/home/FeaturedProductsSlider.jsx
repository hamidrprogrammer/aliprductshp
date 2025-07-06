import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutContext } from '..'; // Assuming LayoutContext is in parent index
import axios from 'axios'; // For API calls

const apiURL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.REACT_APP_API_URL;


const ProductCard = ({ product }) => {
  const { data } = useContext(LayoutContext); // برای دسترسی به تم

  return (
    <motion.div
      className={`relative flex-shrink-0 w-72 md:w-80 lg:w-96 m-2 rounded-xl overflow-hidden shadow-xl transform transition-all duration-500 group
                  ${data.isDarkMode ? 'neumorphism-dark liquid-glass' : 'neumorphism-light'}`}
      whileHover={{ y: -10, boxShadow: data.isDarkMode ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={`${apiURL}/uploads/products/${product.pImages[0]}`} // Updated image path
        alt={product.pName}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className={`p-5 text-[var(--color-card-text)] ${data.isDarkMode ? 'bg-black/30' : 'bg-white/50'} backdrop-blur-sm`}>
        <h3 className="text-xl font-bold mb-2 truncate" title={product.pName}>
          {product.pName}
        </h3>
        <p className="text-sm mb-3 h-10 overflow-hidden line-clamp-2">
          {product.pDescription}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-extrabold text-[var(--color-accent)]">
            {product.pPrice.toLocaleString('fa-IR')} <span className="text-sm font-normal">تومان</span>
          </p>
          <button className="bg-[var(--color-accent)] text-white font-semibold py-2 px-5 rounded-lg neubrutal-border hover:opacity-90 transition-opacity duration-200">
            افزودن به سبد
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedProductsSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiURL}/api/product/featured`);
        if (response.data && response.data.Products) {
          setProducts(response.data.Products);
        } else {
          setProducts([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch featured products.");
        console.error("Fetch featured products error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 text-center">
        <p className="text-xl text-[var(--color-text)]">Loading featured products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 md:py-24 text-center">
        <p className="text-xl text-[var(--color-text)]">No featured products available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-opacity-50 dark:bg-opacity-50 bg-[var(--color-background)] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-0">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-[var(--color-text)]">
          پرفروش‌ترین‌های <span className="text-[var(--color-accent)]">هایرو</span>
        </h2>
        <div className="flex overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-[var(--color-accent)] scrollbar-track-transparent">
          <div className="flex flex-nowrap px-4 md:px-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSlider;
