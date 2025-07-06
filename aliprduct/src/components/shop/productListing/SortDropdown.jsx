import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutContext } from '..';

const SortDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('محبوب‌ترین'); // Default sort option
  const { data } = useContext(LayoutContext);

  const sortOptions = ['محبوب‌ترین', 'جدیدترین', 'ارزان‌ترین', 'گران‌ترین'];

  const handleSelectSort = (option) => {
    setSelectedSort(option);
    setIsOpen(false);
    // TODO: Dispatch action to sort products based on the selected option
    console.log("Sort by:", option);
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closed: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative inline-block text-left z-10">
      <div>
        <button
          type="button"
          className={`flex items-center justify-between w-full md:w-56 rounded-lg px-4 py-3 text-lg font-semibold
                     ${data.isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 neumorphism-light'}
                     text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-accent)] transition-all duration-150 neubrutal-border`}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedSort}
          <svg
            className={`w-6 h-6 ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl
                       ${data.isDarkMode ? 'bg-gray-700 liquid-glass' : 'bg-white neumorphism-light'}
                       ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectSort(option)}
                  className={`block w-full text-right px-4 py-3 text-lg
                              ${selectedSort === option ? 'font-bold text-[var(--color-accent)]' : 'text-[var(--color-text)]'}
                              ${data.isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}
                              transition-colors duration-150`}
                  role="menuitem"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
