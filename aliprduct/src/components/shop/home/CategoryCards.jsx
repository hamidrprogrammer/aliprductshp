import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { getAllCategory } from "../../admin/categories/FetchApi";
import { HomeContext } from "./index";

const apiURL = import.meta.env.REACT_APP_API_URL;

const CategoryCards = () => {
  const navigate = useNavigate();
  const { data: homeData, dispatch: homeDispatch } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true); // Local loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // homeDispatch({ type: "loading", payload: true }); // Redundant if local loading is used
      try {
        let responseData = await getAllCategory();
        if (responseData && responseData.Categories) {
          setCategories(responseData.Categories);
        }
      } catch (error) {
        console.log(error);
        // Consider setting an error state here to show to the user
      } finally {
        setLoading(false);
        // homeDispatch({ type: "loading", payload: false });
      }
    };
    fetchData();
  }, [/*homeDispatch*/]); // homeDispatch removed if not used for global loading

  if (loading) {
    return (
      <div className="my-16 text-center text-xl text-[var(--color-text-secondary)]">
        در حال بارگذاری دسته‌بندی‌ها...
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <div className="my-16 text-center text-xl text-[var(--color-text-secondary)]">دسته‌بندی یافت نشد.</div>;
  }

  return (
    <section className="py-12 md:py-20 bg-[var(--color-background)] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-[var(--color-text-primary)]">
          کاوش در دسته‌بندی‌های ما
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/products/category/${item._id}`)}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer
                         bg-[var(--color-card-background)] text-[var(--color-card-text)]
                         transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative w-full h-64 md:h-72"> {/* Fixed height for images */}
                <img
                  src={`${apiURL}/uploads/categories/${item.cImage}`}
                  alt={item.cName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  // Fallback image if item.cImage is not available
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300/cccccc/969696?text=No+Image"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              <div className="p-5 md:p-6 absolute bottom-0 left-0 right-0">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 truncate group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {item.cName}
                </h3>
                <p className="text-gray-200 text-xs md:text-sm mb-3 line-clamp-2 h-8 md:h-10"> {/* Fixed height for description */}
                  {item.cDescription || 'توضیحات این دسته‌بندی به زودی اضافه خواهد شد.'}
                </p>
                <button
                  className="mt-2 text-sm font-medium text-[var(--color-accent)] opacity-0 group-hover:opacity-100
                             transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out
                             flex items-center"
                >
                  مشاهده محصولات
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
