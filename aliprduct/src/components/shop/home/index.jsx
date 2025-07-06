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
      {/* Hero Section Updated */}
      <section
        className="relative min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        // تصویر پس‌زمینه باید با تصویر مشابه از template.html جایگزین شود یا یک گرادیانت مناسب اعمال گردد
        // برای مثال، یک گرادیانت تیره: style={{ backgroundImage: "linear-gradient(to bottom, var(--color-background-dark-start, #1f2937), var(--color-background-dark-end, #111827))" }}
        // یا یک تصویر مشابه template.html:
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505843490538-5133c6c7d0e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=90')" }} // مثال: تصویر مبلمان مدرن
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay برای کنتراست بهتر متن */}
        <div className="relative z-10 p-6 md:p-12 max-w-3xl">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            // فونت و وزن فونت از طریق Tailwind یا index.css کنترل می‌شود
            // text-shadow می‌تواند برای خوانایی بیشتر اضافه شود اگر در template.html وجود دارد
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            مبلمانی که داستان شما را روایت می‌کند
          </h1>
          <p
            className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            کیفیت، زیبایی و اصالت را به خانه خود بیاورید. بهترین‌ها را برای شما گرد هم آورده‌ایم.
          </p>
          <button
            // استایل دکمه باید دقیقا مشابه template.html باشد
            className="bg-[var(--color-accent)] text-white text-md md:text-lg font-semibold py-3 px-8 md:py-4 md:px-10 rounded-lg shadow-lg hover:bg-[var(--color-accent-hover)] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-50"
          >
            مشاهده محصولات ویژه
          </button>
        </div>
      </section>

      {/* سایر بخش‌ها بدون تغییر در این مرحله باقی می‌مانند، اما پس‌زمینه و رنگ متن آن‌ها باید با متغیرهای جدید کار کند */}
      <BrandStory />
      <FeaturedProductsSlider />
      <CategoryCards />
      <OurBenefits />

      <section className="m-4 md:mx-8 my-12 md:my-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {/* <h2 className="col-span-full text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[var(--color-text)]">
          همه محصولات
        </h2> */}
        <SingleProduct /> {/* استایل کارت‌های این بخش در مرحله مربوط به خودش بازطراحی می‌شود */}
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
