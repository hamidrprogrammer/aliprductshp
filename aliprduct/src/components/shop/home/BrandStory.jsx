import React from 'react';

const BrandStory = () => {
  // در آینده می‌توان برای افکت پارالاکس از event listener برای اسکرول استفاده کرد
  // یا از کتابخانه‌هایی مانند framer-motion برای انیمیشن‌های اسکرول-محور پیشرفته‌تر.

  return (
    <section
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 text-[var(--color-text)] transition-colors duration-300"
      // style={{ backgroundAttachment: 'fixed' }} // یک روش ساده برای پارالاکس، اما ممکن است محدودیت‌هایی داشته باشد
    >
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
          داستان برند ما: <span className="text-[var(--color-accent)]">اصالت در هر تار و پود</span>
        </h2>
        <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-6">
          ما در هایرو، با عشق و اشتیاق به هنر مبلمان، داستان‌هایی از زیبایی و کیفیت را در خانه‌های شما خلق می‌کنیم. هر قطعه از مبلمان ما، نتیجه ساعت‌ها تلاش، دقت در انتخاب مواد اولیه و طراحی منحصربه‌فرد است.
        </p>
        <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-6">
          هدف ما فراتر از تولید یک محصول است؛ ما به دنبال ایجاد فضایی هستیم که در آن خاطرات شیرین شما شکل می‌گیرد و هر لحظه از زندگی در آن، ارزشمندتر می‌شود. با هایرو، تجربه‌ای متفاوت از زندگی لوکس و آرامش‌بخش را تجربه کنید.
        </p>
        <button
          className="bg-transparent text-[var(--color-accent)] border-2 border-[var(--color-accent)] font-semibold py-3 px-10 rounded-lg hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 text-lg neubrutal-border hover:shadow-lg dark:hover:text-gray-900"
        >
          بیشتر بدانید
        </button>
      </div>
    </section>
  );
};

export default BrandStory;
