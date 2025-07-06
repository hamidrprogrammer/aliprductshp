import React, { Fragment, useContext } from "react";
import moment from "moment";
import { LayoutContext } from "../index"; // برای دسترسی به وضعیت تم

const Footer = (props) => {
  const { data } = useContext(LayoutContext); // برای دسترسی به isDarkMode در صورت نیاز به استایل‌های شرطی

  return (
    <Fragment>
      <footer
        className={`py-12 md:py-16 px-4 md:px-8 text-[var(--color-footer-text)] bg-[var(--color-footer-background)] transition-colors duration-300`}
      >
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center md:text-right">
          {/* Column 1: Site Name & Slogan */}
          <div className="space-y-4">
            <h5 className="text-2xl font-bold text-[var(--color-accent)] uppercase tracking-wider">
              Hayroo {/* یا لوگوی شما */}
            </h5>
            <p className="text-sm text-[var(--color-text-secondary)] dark:text-gray-400">
              مبلمانی که داستان شما را روایت می‌کند. کیفیت، زیبایی و اصالت.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold uppercase tracking-wider text-[var(--color-text-primary)] dark:text-gray-200">
              لینک‌های سریع
            </h5>
            <ul className="space-y-2 text-sm">
              <li><FooterLink href="/">فروشگاه</FooterLink></li>
              <li><FooterLink href="/about">درباره ما</FooterLink></li>
              <li><FooterLink href="/blog">وبلاگ</FooterLink></li>
              <li><FooterLink href="/contact-us">تماس با ما</FooterLink></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold uppercase tracking-wider text-[var(--color-text-primary)] dark:text-gray-200">
              خدمات مشتریان
            </h5>
            <ul className="space-y-2 text-sm">
              <li><FooterLink href="/faq">سوالات متداول</FooterLink></li>
              <li><FooterLink href="/shipping-policy">قوانین ارسال</FooterLink></li>
              <li><FooterLink href="/refund-policy">قوانین بازگشت کالا</FooterLink></li>
              <li><FooterLink href="/terms-and-conditions">شرایط و ضوابط</FooterLink></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div className="space-y-6">
            <div>
              <h5 className="text-lg font-semibold uppercase tracking-wider text-[var(--color-text-primary)] dark:text-gray-200 mb-3">
                عضویت در خبرنامه
              </h5>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="آدرس ایمیل شما"
                  className="flex-grow p-3 rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none bg-transparent placeholder-[var(--color-text-secondary)] dark:placeholder-gray-500 text-[var(--color-text-primary)] dark:text-white"
                />
                <button
                  type="submit"
                  className="p-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
                >
                  عضویت
                </button>
              </form>
            </div>
            <div>
              <h5 className="text-lg font-semibold uppercase tracking-wider text-[var(--color-text-primary)] dark:text-gray-200 mb-3">
                ما را دنبال کنید
              </h5>
              <div className="flex justify-center md:justify-start space-x-4 space-x-reverse">
                {/* Replace with actual icons and links */}
                <SocialIcon href="#" label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88A10.001 10.001 0 0022 12z" clipRule="evenodd" /></svg>
                </SocialIcon>
                <SocialIcon href="#" label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </SocialIcon>
                <SocialIcon href="#" label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.05 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm4.75-7.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" /></svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 md:mt-12 pt-8 border-t border-[var(--color-border)] border-opacity-20 text-center text-sm text-[var(--color-text-secondary)] dark:text-gray-500">
          <p>&copy; {moment().format("YYYY")} تمامی حقوق برای Hayroo محفوظ است. طراحی و توسعه توسط Hasan-py.</p>
        </div>
      </footer>
    </Fragment>
  );
};

// Helper components for Footer Links and Social Icons
const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="hover:text-[var(--color-accent)] transition-colors duration-150">
      {children}
    </a>
  </li>
);

const SocialIcon = ({ href, label, children }) => (
  <a href={href} aria-label={label} className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-150">
    {children}
  </a>
);

export default Footer;
