export default function Motivation() {
  return (
    <section id="motivation" className="border-t border-line">
      <div className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-16">
          <div>
            <span className="text-crimson font-mono-data text-[13px]">কেন বানানো হলো</span>
            <h2 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl leading-tight text-ink">
              এই প্ল্যাটফর্মের পেছনের গল্পটা খুব সাধারণ
            </h2>
          </div>

          <div className="space-y-6 text-ink-soft text-[17px] leading-relaxed">
            <p>
              জরুরি অস্ত্রোপচার, দুর্ঘটনা, থ্যালাসেমিয়া বা প্রসবকালীন
              জটিলতা — এমন মুহূর্তে সবচেয়ে বড় বাধা হয়ে দাঁড়ায় একটা সহজ
              প্রশ্ন: &ldquo;এই মুহূর্তে কে আসলে রক্ত দিতে পারবে?&rdquo;
            </p>
            <p>
              ফেসবুক গ্রুপে পোস্ট দেওয়া হয়, পরিচিতদের ফোন করা হয়, কিন্তু
              বেশিরভাগ সময় দেখা যায় যাকে পাওয়া যাচ্ছে সে মাত্র কয়েক
              সপ্তাহ আগেই রক্ত দিয়েছেন, অথবা তার সঠিক লোকেশন কেউ জানে না।
              এই অনিশ্চয়তার মধ্যেই সবচেয়ে বেশি সময় নষ্ট হয়ে যায়।
            </p>
            <div className="border-l-2 border-crimson pl-5 py-1">
              <p className="text-ink font-display font-semibold text-xl leading-snug text-balance">
                RoktoSetu তৈরি হয়েছে এই একটাই লক্ষ্য নিয়ে — &ldquo;কে এখন
                সত্যিই রক্ত দিতে পারবেন&rdquo; এই তথ্যটা এক জায়গায়, নির্ভুল
                আর হালনাগাদ রাখা।
              </p>
            </div>
            <p>
              কোনো হাসপাতাল বা রক্তদান সংস্থার বিকল্প নয় এটি — বরং তাদের
              পাশাপাশি দাঁড়িয়ে, সাধারণ মানুষ যাতে একে অপরের পাশে দাঁড়াতে
              পারে, তার একটা সহজ মাধ্যম মাত্র। সম্পূর্ণ বিনামূল্যে, কোনো
              বিজ্ঞাপন বা মুনাফার চিন্তা ছাড়াই।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
