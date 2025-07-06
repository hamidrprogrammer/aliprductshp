import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
// import Slider from "./Slider"; // حذف اسلایدر قدیمی
import ProductCategory from "./ProductCategory"; // این دیگر استفاده نمی‌شود، می‌توان بعدا حذف کرد
import BrandStory from "./BrandStory";
import FeaturedProductsSlider from "./FeaturedProductsSlider"; // ایمپورت اسلایدر جدید
import CategoryCards from "./CategoryCards"; // ایمپورت کارت‌های دسته‌بندی
import OurBenefits from "./OurBenefits"; // ایمپورت کامپوننت جدید
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct"; // این بخش محصولات کلی است، شاید نیاز به بازنگری داشته باشد

export const HomeContext = createContext();

const HomeComponent = () => {
  return (
    <Fragment>
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
        <div className="relative z-10 p-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            مبلمانی که داستان شما را روایت می‌کند
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
            کیفیت، زیبایی و اصالت را به خانه خود بیاورید.
          </p>
          <button
            className="bg-[var(--color-accent)] text-white text-lg md:text-xl font-semibold py-4 px-8 rounded-lg neubrutal-border neubrutal-shadow hover:opacity-90 transform transition-transform duration-150 hover:scale-105"
          >
            مشاهده مبل در فضای واقعی
          </button>
        </div>
      </section>

      <BrandStory />

      {/* Featured Products Slider Section */}
      <FeaturedProductsSlider />

      {/* Category Cards Section */}
      <CategoryCards />

      {/* Our Benefits Section */}
      <OurBenefits />

      {/* All Products Section - شاید این بخش به صفحه "فروشگاه" منتقل شود یا با طراحی بهتری نمایش داده شود */}
      <section className="m-4 md:mx-8 my-12 md:my-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {/* <h2 className="col-span-full text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[var(--color-text)]">
          همه محصولات
        </h2> */}
        {/* کامپوننت SingleProduct در اینجا لوپ می‌شود، باید محصولات واقعی را fetch کند */}
        <SingleProduct />
      </section>
    </Fragment>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
