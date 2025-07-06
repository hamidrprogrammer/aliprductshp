import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutContext } from '../index'; // اطمینان از مسیر صحیح
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const apiURL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.REACT_APP_API_URL;

const ProductCard = ({ product }) => {
  const { data } = useContext(LayoutContext);
  const navigate = useNavigate();

  return (
    <motion.div
      className={`relative flex flex-col h-full rounded-xl overflow-hidden
                  bg-[var(--color-card-background)] text-[var(--color-card-text)]
                  shadow-lg group transition-all duration-300 ease-in-out hover:shadow-2xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/products/${product._id}`)} // Navigate on card click
    >
      <div className="relative w-full h-56 md:h-64 overflow-hidden"> {/* Fixed height for images */}
        <img
          src={`${apiURL}/uploads/products/${product.pImages[0]}`}
          alt={product.pName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300/cccccc/969696?text=No+Image"; }}
        />
        {/* Optional: Add a subtle overlay or badges if needed, similar to template.html */}
      </div>
      <div className={`flex flex-col flex-grow p-4 md:p-5`}>
        <h3 className="text-lg md:text-xl font-semibold mb-2 truncate h-14 md:h-16 flex items-center" title={product.pName}>
          {product.pName}
        </h3>
        {/* Description can be shorter or removed if cards in template.html are more compact */}
        {/* <p className="text-xs md:text-sm mb-3 h-10 overflow-hidden line-clamp-2">
          {product.pDescription}
        </p> */}
        <div className="mt-auto flex justify-between items-center pt-2">
          <p className="text-xl md:text-2xl font-bold text-[var(--color-accent)]">
            {product.pPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
          </p>
          {/* Button can be styled to match template.html - e.g., icon only or smaller text */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              // Add to cart logic here
              console.log("Add to cart:", product.pName);
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
      <section className="py-12 md:py-20 text-center">
        <p className="text-lg text-[var(--color-text-secondary)]">درحال بارگذاری محصولات ویژه...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-20 text-center">
        <p className="text-lg text-red-500">خطا: {error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-20 text-center">
        <p className="text-lg text-[var(--color-text-secondary)]">محصول ویژه‌ای در حال حاضر موجود نیست.</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-[var(--color-background)] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-[var(--color-text-primary)]">
          پرفروش‌ترین‌های <span className="text-[var(--color-accent)]">هایرو</span>
        </h2>
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={20} // فاصله بین اسلایدها
          slidesPerView={1.5} // تعداد اسلایدهای قابل مشاهده در موبایل
          centeredSlides={true}
          loop={products.length > 3} // لوپ در صورتی که تعداد محصولات کافی باشد
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true, el: '.swiper-custom-pagination' }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 2.5,
              spaceBetween: 25,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
              centeredSlides: false,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
              centeredSlides: false,
            },
          }}
          className="!pb-12 md:!pb-16" // افزایش padding-bottom برای جا دادن pagination
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto pb-2"> {/* Ensure slides have auto height for content */}
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute top-1/2 left-0 md:-left-4 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute top-1/2 right-0 md:-right-4 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {/* Custom Pagination Container */}
          <div className="swiper-custom-pagination text-center mt-4"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedProductsSlider;
