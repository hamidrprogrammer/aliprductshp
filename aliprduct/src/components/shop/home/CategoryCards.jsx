import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { getAllCategory } from "../../admin/categories/FetchApi";
import { HomeContext } from "./index"; // برای دسترسی به dispatch در صورت نیاز به loading state

const apiURL = import.meta.env.REACT_APP_API_URL;

const CategoryCards = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(HomeContext); // برای مدیریت loading
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });
      try {
        let responseData = await getAllCategory();
        if (responseData && responseData.Categories) {
          setCategories(responseData.Categories);
        }
        dispatch({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        dispatch({ type: "loading", payload: false });
      }
    };
    fetchData();
  }, [dispatch]);

  if (!categories) {
    return (
      <div className="my-16 text-center text-xl">
        در حال بارگذاری دسته‌بندی‌ها...
      </div>
    );
  }

  if (categories.length === 0) {
    return <div className="my-16 text-center text-xl">دسته‌بندی یافت نشد.</div>;
  }

  return (
    <section className="py-16 md:py-24 bg-[var(--color-background)] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-[var(--color-text)]">
          کاوش در دسته‌بندی‌های ما
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {categories.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/products/category/${item._id}`)}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 neumorphism-light dark:neumorphism-dark"
              // برای افکت tilt در آینده می‌توان از کتابخانه استفاده کرد
            >
              <img
                src={`${apiURL}/uploads/categories/${item.cImage}`}
                alt={item.cName}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {item.cName}
                </h3>
                <p className="text-gray-200 dark:text-gray-300 text-sm mb-3 line-clamp-2">{item.cDescription || 'توضیحات این دسته‌بندی به زودی اضافه خواهد شد.'}</p>
                <button className="text-white font-semibold tracking-wider py-2 px-4 rounded-md bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0 translate-y-4">
                  مشاهده محصولات
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
