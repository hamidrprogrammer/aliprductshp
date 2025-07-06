import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutContext } from '..';

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useContext(LayoutContext);

  return (
    <div className={`border-b ${data.isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 px-1 text-right focus:outline-none"
      >
        <span className="font-semibold text-lg text-[var(--color-text)]">{title}</span>
        <motion.svg
          className={`w-6 h-6 text-[var(--color-accent)] transform transition-transform duration-300`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } },
              collapsed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } }
            }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-1 text-sm text-gray-600 dark:text-gray-400">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductFilters = () => {
  // Mock data for filters - In a real app, this would come from API or be predefined
  const filterOptions = {
    type: ['مبل راحتی', 'کاناپه', 'صندلی ناهارخوری', 'میز جلو مبلی', 'سرویس خواب'],
    color: ['سفید', 'مشکی', 'طوسی', 'قهوه‌ای', 'کرم', 'آبی'],
    material: ['پارچه', 'چرم', 'چوب', 'فلز', 'شیشه'],
    priceRanges: [
      { label: 'کمتر از ۵ میلیون تومان', value: '0-5000000' },
      { label: '۵ تا ۱۵ میلیون تومان', value: '5000000-15000000' },
      { label: '۱۵ تا ۳۰ میلیون تومان', value: '15000000-30000000' },
      { label: 'بیشتر از ۳۰ میلیون تومان', value: '3000000-' },
    ],
  };

  // TODO: Add state and handlers for selected filters

  return (
    <aside className="w-full md:w-64 lg:w-72 p-4 space-y-6">
      <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6">فیلترها</h3>

      <AccordionItem title="نوع محصول">
        <ul className="space-y-2">
          {filterOptions.type.map(option => (
            <li key={option} className="flex items-center">
              <input type="checkbox" id={`type-${option}`} className="form-checkbox h-5 w-5 text-[var(--color-accent)] rounded border-gray-400 dark:border-gray-600 focus:ring-[var(--color-accent)] dark:bg-gray-700" />
              <label htmlFor={`type-${option}`} className="mr-3 text-[var(--color-text)]">{option}</label>
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title="رنگ">
        <div className="flex flex-wrap gap-2">
          {filterOptions.color.map(color => (
            <button
              key={color}
              title={color}
              className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-all"
              style={{ backgroundColor: color.toLowerCase() === 'سفید' ? '#ffffff' : color.toLowerCase() === 'مشکی' ? '#000000' : color.toLowerCase() === 'طوسی' ? '#808080' : color.toLowerCase() === 'قهوه‌ای' ? '#A52A2A' : color.toLowerCase() === 'کرم' ? '#FFFDD0' : color.toLowerCase() === 'آبی' ? '#0000FF' : 'transparent' }}
              // Add active state styling
            />
          ))}
        </div>
      </AccordionItem>

      <AccordionItem title="جنس">
        <ul className="space-y-2">
          {filterOptions.material.map(option => (
            <li key={option} className="flex items-center">
              <input type="checkbox" id={`material-${option}`} className="form-checkbox h-5 w-5 text-[var(--color-accent)] rounded border-gray-400 dark:border-gray-600 focus:ring-[var(--color-accent)] dark:bg-gray-700" />
              <label htmlFor={`material-${option}`} className="mr-3 text-[var(--color-text)]">{option}</label>
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title="محدوده قیمت">
        <ul className="space-y-2">
          {filterOptions.priceRanges.map(range => (
            <li key={range.value} className="flex items-center">
              <input type="radio" name="priceRange" id={`price-${range.value}`} className="form-radio h-5 w-5 text-[var(--color-accent)] border-gray-400 dark:border-gray-600 focus:ring-[var(--color-accent)] dark:bg-gray-700" />
              <label htmlFor={`price-${range.value}`} className="mr-3 text-[var(--color-text)]">{range.label}</label>
            </li>
          ))}
        </ul>
      </AccordionItem>

      <button className="w-full py-3 px-4 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 neubrutal-border neubrutal-shadow transition-opacity duration-200">
        اعمال فیلترها
      </button>
    </aside>
  );
};

export default ProductFilters;
