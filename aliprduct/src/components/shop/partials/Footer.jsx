import React, { Fragment, useContext } from "react";
import moment from "moment";
import { LayoutContext } from "../index"; // برای دسترسی به وضعیت تم

const Footer = (props) => {
  const { data } = useContext(LayoutContext);

  return (
    <Fragment>
      <footer
        className={`z-10 py-12 px-4 md:px-12 text-[var(--color-text)] transition-colors duration-300 ${
          data.isDarkMode ? 'liquid-glass dark' : 'bg-white shadow-t-lg' // افکت شیشه‌ای برای تم تاریک و پس‌زمینه سفید برای تم روشن
        }`}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-right">
          {/* Column 1: About Us */}
          <div className="space-y-4">
            <h5 className="text-xl font-bold uppercase tracking-wider">درباره ما</h5>
            <p className="text-sm">
              ما به ارائه بهترین مبلمان با طراحی مدرن و کیفیت بی‌نظیر متعهد هستیم. تجربه خریدی لوکس و ماندگار را با ما تجربه کنید.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="text-xl font-bold uppercase tracking-wider">لینک‌های مفید</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="hover:text-[var(--color-accent)]">فروشگاه</a></li>
              <li><a href="/contact-us" className="hover:text-[var(--color-accent)]">تماس با ما</a></li>
              <li><a href="/faq" className="hover:text-[var(--color-accent)]">سوالات متداول</a></li>
              <li><a href="/privacy-policy" className="hover:text-[var(--color-accent)]">حریم خصوصی</a></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h5 className="text-xl font-bold uppercase tracking-wider">خبرنامه</h5>
            <p className="text-sm">برای دریافت آخرین اخبار و پیشنهادات ویژه، در خبرنامه ما عضو شوید.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-grow p-3 rounded-lg border-2 border-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none bg-transparent placeholder-[var(--color-text)] neubrutal-border"
              />
              <button
                type="submit"
                className="p-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 neubrutal-border neubrutal-shadow"
              >
                عضویت
              </button>
            </form>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-4">
            <h5 className="text-xl font-bold uppercase tracking-wider">شبکه‌های اجتماعی</h5>
            <div className="flex justify-center md:justify-end space-x-4 space-x-reverse">
              {/* Replace with actual icons and links */}
              <a href="#" className="hover:text-[var(--color-accent)]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88A10.001 10.001 0 0022 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="hover:text-[var(--color-accent)]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="hover:text-[var(--color-accent)]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.05 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zm-1.04 2.503a.5.5 0 00-.5.5v1.505a.5.5 0 00.5.5h2.08a.5.5 0 00.5-.5V5.003a.5.5 0 00-.5-.5h-2.08zm3.982 1.898a.5.5 0 00-.5.5v6.098a.5.5 0 00.5.5h1.505a.5.5 0 00.5-.5V6.901a.5.5 0 00-.5-.5h-1.505zm-5.48 0a.5.5 0 00-.5.5v6.098a.5.5 0 00.5.5h1.505a.5.5 0 00.5-.5V6.901a.5.5 0 00-.5-.5H9.777zM12 9.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--color-text)] border-opacity-20 text-center text-sm">
          <p>&copy; {moment().format("YYYY")} تمامی حقوق برای Hayroo محفوظ است. طراحی و توسعه توسط Hasan-py.</p>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
