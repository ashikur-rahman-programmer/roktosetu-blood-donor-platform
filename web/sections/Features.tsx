import {
  MapPinned,
  ShieldCheck,
  BellRing,
  CalendarClock,
  Award,
  HeartHandshake,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="border-t border-line">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-[46ch]">
          <span className="text-crimson font-mono-data text-[13px]">ফিচারসমূহ</span>
          <h2 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl leading-tight text-ink">
            প্রতিটা ফিচার তৈরি একটাই কারণে — সময় বাঁচানো
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-5">
          <div className="md:col-span-4 rounded-3xl border border-line bg-paper-raised p-8 md:p-10">
            <CalendarClock className="w-7 h-7 text-crimson" strokeWidth={1.75} />
            <h3 className="mt-5 font-display font-bold text-2xl text-ink">
              সবশেষ রক্তদানের তারিখ থেকেই হিসাব
            </h3>
            <p className="mt-3 text-ink-soft leading-relaxed max-w-[52ch]">
              প্রতিটা প্রোফাইলে দেখা যাবে ঠিক কত দিন আগে সেই মানুষটি সর্বশেষ
              রক্ত দিয়েছেন। রক্ত দেওয়ার পর এক ক্লিকে আপডেট করলেই দিনগণনা নতুন
              করে শুরু হয়ে যায় — কেউ ভুল তথ্য দিয়ে বিভ্রান্ত করতে পারবে না।
            </p>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-line bg-ink p-8 md:p-10 flex flex-col justify-between">
            <BellRing className="w-7 h-7 text-paper-raised" strokeWidth={1.75} />
            <div>
              <h3 className="mt-5 font-display font-bold text-xl text-paper-raised">
                জরুরি নোটিফিকেশন
              </h3>
              <p className="mt-2.5 text-paper-raised/70 leading-relaxed">
                এলাকায় জরুরি প্রয়োজন পোস্ট হলে মিলে যাওয়া ডোনাররা সাথে সাথে
                জানতে পারবেন।
              </p>
            </div>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-line bg-paper-raised p-8">
            <MapPinned className="w-7 h-7 text-crimson" strokeWidth={1.75} />
            <h3 className="mt-5 font-display font-bold text-xl text-ink">
              এলাকাভিত্তিক সার্চ
            </h3>
            <p className="mt-2.5 text-ink-soft leading-relaxed">
              বিভাগ, জেলা, উপজেলা ধরে সবচেয়ে কাছের উপলব্ধ ডোনার আগে দেখাবে।
            </p>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-line bg-paper-raised p-8">
            <ShieldCheck className="w-7 h-7 text-crimson" strokeWidth={1.75} />
            <h3 className="mt-5 font-display font-bold text-xl text-ink">
              প্রাইভেসি সুরক্ষিত
            </h3>
            <p className="mt-2.5 text-ink-soft leading-relaxed">
              ফোন নম্বর সরাসরি প্রকাশ্য নয় — ডোনার অনুমোদন করলেই তা শেয়ার হয়।
            </p>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-line bg-paper-raised p-8">
            <Award className="w-7 h-7 text-crimson" strokeWidth={1.75} />
            <h3 className="mt-5 font-display font-bold text-xl text-ink">
              স্বীকৃতি ও ব্যাজ
            </h3>
            <p className="mt-2.5 text-ink-soft leading-relaxed">
              যতবার রক্ত দিয়েছেন, প্রোফাইলে তার ইতিহাস আর ব্যাজ জমা হতে থাকবে।
            </p>
          </div>

          <div className="md:col-span-6 rounded-3xl border border-crimson/25 bg-crimson/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <HeartHandshake className="w-7 h-7 text-crimson shrink-0" strokeWidth={1.75} />
            <div>
              <h3 className="font-display font-bold text-xl text-ink">
                শুরু থেকে শেষ পর্যন্ত সম্পূর্ণ ফ্রি
              </h3>
              <p className="mt-2 text-ink-soft leading-relaxed">
                রেজিস্ট্রেশন, সার্চ, জরুরি অনুরোধ — কোনো ধাপেই কোনো চার্জ বা
                বিজ্ঞাপন নেই, এবং ভবিষ্যতেও থাকবে না।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
