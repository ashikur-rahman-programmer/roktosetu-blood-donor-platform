const PROMISES = [
  {
    title: "কোনোদিন টাকা লাগবে না",
    desc: "রেজিস্ট্রেশন থেকে শুরু করে জরুরি অনুরোধ পাঠানো পর্যন্ত সবকিছুই থাকবে ফ্রি — এটা প্রতিশ্রুতি।",
  },
  {
    title: "তথ্য বিক্রি হবে না",
    desc: "আপনার ফোন নম্বর, লোকেশন বা ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হবে না।",
  },
  {
    title: "মানুষ যাচাই করে দেখেন",
    desc: "ভুয়া বা নিষ্ক্রিয় প্রোফাইল সরিয়ে ফেলার জন্য একটা সক্রিয় মডারেশন টিম কাজ করে।",
  },
];

export default function Promise() {
  return (
    <section id="promise" className="border-t border-line bg-paper-raised">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-[46ch]">
          <span className="text-crimson font-mono-data text-[13px]">আমাদের প্রতিশ্রুতি</span>
          <h2 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl leading-tight text-ink">
            বিশ্বাসের ওপর দাঁড়িয়ে থাকা একটা প্ল্যাটফর্ম
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-x-8 gap-y-10">
          {PROMISES.map((p) => (
            <div key={p.title} className="border-t-2 border-ink pt-5">
              <h3 className="font-display font-bold text-lg text-ink">{p.title}</h3>
              <p className="mt-2.5 text-ink-soft leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
