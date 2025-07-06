import React, { useEffect, useState, useContext } from 'react';
import FeaturedProductsSlider from '../home/FeaturedProductsSlider'; // استفاده مجدد از اسلایدر صفحه اصلی
import { getAllProduct } from '../../admin/products/FetchApi'; // برای دریافت محصولات به عنوان نمونه
import { ProductDetailsContext } from './index';
import { LayoutContext } from '..';

// Mock data for related products (جایگزین با منطق واقعی برای پیدا کردن محصولات مرتبط)
const mockRelatedProducts = [
    { _id: '5', pName: 'مبل تک نفره کلاسیک رترو', pPrice: 7800000, pImages: ['https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'], pDescription: 'بازگشتی به شکوه گذشته با طراحی مدرن.' },
    { _id: '6', pName: 'میز عسلی چوب گردو آمریکایی', pPrice: 4500000, pImages: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'], pDescription: 'کیفیت بی‌نظیر چوب گردو با طراحی مینیمال.' },
    { _id: '7', pName: 'پاف راحتی مخملی لوکس', pPrice: 2900000, pImages: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'], pDescription: 'نهایت راحتی و زیبایی برای فضای استراحت شما.' },
];


const RelatedProducts = ({ currentProductId, categoryId }) => {
  const { dispatch } = useContext(ProductDetailsContext);
  const [relatedProducts, setRelatedProducts] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      dispatch({ type: "loading", payload: true }); // ممکن است بخواهید loading state جداگانه‌ای برای این بخش داشته باشید
      try {
        // در یک برنامه واقعی، محصولات مرتبط بر اساس categoryId یا الگوریتم‌های دیگر فیلتر می‌شوند.
        // فعلا از mockProducts یا تعداد محدودی از کل محصولات استفاده می‌کنیم.
        // let responseData = await getAllProduct();
        // if (responseData && responseData.Products) {
        //   const filteredProducts = responseData.Products.filter(p => p._id !== currentProductId && p.pCategory === categoryId).slice(0, 5);
        //   setRelatedProducts(filteredProducts.length > 0 ? filteredProducts : mockRelatedProducts.slice(0,3) );
        // } else {
        //   setRelatedProducts(mockRelatedProducts.slice(0,3));
        // }
        setRelatedProducts(mockRelatedProducts); // استفاده موقت از داده‌های mock
        dispatch({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        setRelatedProducts(mockRelatedProducts); // Fallback to mock data
        dispatch({ type: "loading", payload: false });
      }
    };

    if (currentProductId && categoryId) {
      fetchRelatedProducts();
    } else {
        setRelatedProducts(mockRelatedProducts); // Fallback if no categoryId or currentProductId
    }
  }, [currentProductId, categoryId, dispatch]);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // یا یک پیام که محصول مرتبطی یافت نشد
  }

  // برای اینکه FeaturedProductsSlider با داده‌های جدید کار کند، باید آن را کمی تغییر دهیم تا products را به عنوان prop بپذیرد
  // یا یک context جدید برای محصولات مرتبط ایجاد کنیم. فعلا فرض می‌کنیم که می‌توانیم داده‌ها را به آن پاس دهیم.
  // از آنجایی که FeaturedProductsSlider از mockProducts داخلی استفاده می‌کند، باید آن را تغییر دهیم.
  // برای سادگی، در اینجا یک نسخه ساده شده از اسلایدر را پیاده‌سازی می‌کنیم.

  return (
    <section className="py-12 md:py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-12">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-[var(--color-text)]">
          محصولات مشابه که شاید بپسندید
        </h2>
        {/*
          در اینجا از کامپوننت FeaturedProductsSlider که قبلا برای صفحه اصلی ساختیم، استفاده نمی‌کنیم
          چون آن کامپوننت داده‌های خود را از mock داخلی می‌گیرد.
          به جای آن، یک اسلایدر ساده‌تر برای محصولات مرتبط در اینجا پیاده‌سازی می‌کنیم
          یا FeaturedProductsSlider را طوری تغییر می‌دهیم که بتواند محصولات را به عنوان prop دریافت کند.
          برای این مرحله، یک نمایش ساده با اسکرول افقی ایجاد می‌کنیم.
        */}
        <div className="flex overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-[var(--color-accent)] scrollbar-track-transparent">
          <div className="flex flex-nowrap px-2 md:px-0">
            {relatedProducts.map((product, index) => (
              // استفاده از ProductCard از کامپوننت FeaturedProductsSlider (نیاز به import و export مناسب)
              // فرض می‌کنیم ProductCard به صورت جداگانه قابل استفاده است
              // یا یک کارت محصول مشابه در اینجا تعریف می‌کنیم.
              // برای سادگی، یک کارت ساده در اینجا قرار می‌دهیم.
              <SimpleProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// یک کامپوننت کارت ساده برای محصولات مرتبط (می‌تواند با ProductCard اصلی ترکیب یا جایگزین شود)
const SimpleProductCard = ({ product, index }) => {
    const navigate = useNavigate();
    const { data } = useContext(LayoutContext);
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.1, duration: 0.4 }
        }
      };

    return (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={`relative flex-shrink-0 w-64 md:w-72 m-2 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 group
                      ${data.isDarkMode ? 'neumorphism-dark liquid-glass' : 'neumorphism-light'}`}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          <img
            src={product.pImages[0]}
            alt={product.pName}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`p-4 ${data.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <h3 className="text-md font-bold truncate mb-1 group-hover:text-[var(--color-accent)] transition-colors duration-300" title={product.pName}>
              {product.pName}
            </h3>
            <p className="text-lg font-semibold text-[var(--color-accent)]">
              {product.pPrice.toLocaleString('fa-IR')} <span className="text-xs">تومان</span>
            </p>
          </div>
        </motion.div>
      );
}


export default RelatedProducts;
