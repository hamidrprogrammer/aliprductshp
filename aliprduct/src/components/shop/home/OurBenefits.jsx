import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LayoutContext } from '..';

// Placeholder SVG icons (می‌توانند با Lottie یا Lordicon جایگزین شوند)
const DeliveryIcon = () => (
  <svg className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16m-7 1h7m-7 0H5"></path>
  </svg>
);

const WarrantyIcon = () => (
  <svg className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);

const SupportIcon = () => (
  <svg className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 0A9.955 9.955 0 0112 5.045V3m-2.045 5.591A9.955 9.955 0 005.636 18.364m12.728-12.728A9.955 9.955 0 0118.955 12h2.045m-5.591 2.045A9.955 9.955 0 005.636 5.636m12.728 12.728L12 12"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a2 2 0 100-4 2 2 0 000 4z"></path>
  </svg>
);


const OurBenefits = () => {
  const { data } = useContext(LayoutContext);

  const benefits = [
    { title: 'ارسال رایگان و سریع', description: 'سفارشات شما در سریع‌ترین زمان و بدون هزینه اضافی به دستتان می‌رسد.', icon: <DeliveryIcon /> },
    { title: 'گارانتی معتبر محصولات', description: 'تمامی محصولات ما دارای گارانتی کیفیت و اصالت کالا هستند.', icon: <WarrantyIcon /> },
    { title: 'پشتیبانی ۲۴/۷', description: 'تیم پشتیبانی ما همواره آماده پاسخگویی به سوالات و نیازهای شماست.', icon: <SupportIcon /> },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-16 md:py-24 bg-opacity-50 dark:bg-opacity-50 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-[var(--color-text)]">
          چرا <span className="text-[var(--color-accent)]">هایرو</span> را انتخاب کنید؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={`group p-6 md:p-8 rounded-xl text-center transition-all duration-300 hover:shadow-2xl
                          ${data.isDarkMode ? 'neumorphism-dark liquid-glass' : 'bg-white neumorphism-light'}`}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible" // Animate when in view
              viewport={{ once: true, amount: 0.3 }}
              custom={index}
            >
              <div className="flex justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300">{benefit.title}</h3>
              <p className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBenefits;
