import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LayoutContext } from '..';

// Mock data for featured products (جایگزین با داده‌های واقعی از API)
const mockProducts = [
  {
    _id: '1',
    pName: 'مبل راحتی مدرن آوانگارد',
    pPrice: 12500000,
    pImages: ['https://images.unsplash.com/photo-1540574163024-58c7cdd427a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
    pDescription: 'ترکیبی از هنر و راحتی، مناسب برای فضاهای مدرن و مینیمال.',
  },
  {
    _id: '2',
    pName: 'صندلی ناهارخوری لوکس ونیز',
    pPrice: 3800000,
    pImages: ['https://images.unsplash.com/photo-1592078615290-033ee585e965?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'],
    pDescription: 'طراحی ایتالیایی با بهترین متریال، برای تجربه‌ای بی‌نظیر از صرف غذا.',
  },
  {
    _id: '3',
    pName: 'میز جلو مبلی شیشه‌ای کلاسیک',
    pPrice: 5200000,
    pImages: ['https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
    pDescription: 'شفافیت و زیبایی در کنار هم، مناسب برای دکوراسیون‌های لوکس.',
  },
  {
    _id: '4',
    pName: 'کاناپه تخت‌خواب‌شو هوشمند',
    pPrice: 18900000,
    pImages: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
    pDescription: 'راحتی در روز، آسایش در شب. بهترین انتخاب برای فضاهای کوچک.',
  },
];

const apiURL = import.meta.env.REACT_APP_API_URL;

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
        src={product.pImages[0]} // Assuming first image is the primary one
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
  // TODO: Fetch actual featured products
  const products = mockProducts;

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
