"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "০১",
    title: "রেজিস্ট্রেশন করুন",
    desc: "নাম, রক্তের গ্রুপ, বিভাগ-জেলা-উপজেলা আর ফোন নম্বর দিয়ে এক মিনিটে প্রোফাইল তৈরি করুন। আগে কখনো রক্ত দিয়ে থাকলে তারিখটাও যোগ করুন।",
  },
  {
    n: "০২",
    title: "উপলব্ধতা চালু থাকবে",
    desc: "প্রোফাইল তৈরি হওয়ার পর থেকেই আপনি ডিফল্টভাবে 'উপলব্ধ' থাকবেন, যতক্ষণ না আপনি রক্ত দেন বা নিজে বন্ধ করে রাখেন।",
  },
  {
    n: "০৩",
    title: "কেউ খুঁজলে দেখা যাবে",
    desc: "কারো জরুরি প্রয়োজনে আপনার গ্রুপ আর এলাকা মিলে গেলে, আপনি সার্চ রেজাল্টে এবং জরুরি নোটিফিকেশনে দেখা যাবেন।",
  },
  {
    n: "০৪",
    title: "অনুমতি দিয়ে যোগাযোগ",
    desc: "কেউ আপনার নম্বর সরাসরি দেখতে পাবে না। 'যোগাযোগের অনুরোধ' এলে আপনি অনুমোদন করলেই নম্বর শেয়ার হবে।",
  },
  {
    n: "০৫",
    title: "রক্ত দেওয়ার পর এক ক্লিক",
    desc: "রক্ত দেওয়ার পর প্রোফাইলে গিয়ে 'আজ রক্ত দিয়েছি' বাটনে চাপ দিন। সেদিনের তারিখ থেকেই নতুন হিসাব শুরু হয়ে যাবে।",
  },
  {
    n: "০৬",
    title: "স্বয়ংক্রিয়ভাবে আবার উপলব্ধ",
    desc: "মেডিকেল গাইডলাইন অনুযায়ী প্রয়োজনীয় বিশ্রামের সময় শেষ হলে, সিস্টেম নিজে থেকেই আপনাকে আবার 'উপলব্ধ' করে দেবে।",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line bg-paper-raised">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-[46ch]">
          <span className="text-crimson font-mono-data text-[13px]">প্রসেস</span>
          <h2 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl leading-tight text-ink">
            কীভাবে কাজ করে
          </h2>
          <p className="mt-4 text-ink-soft text-[17px] leading-relaxed">
            ছয়টা সহজ ধাপ — একবার যুক্ত হলে বাকিটা প্ল্যাটফর্ম নিজেই সামলে নেয়।
          </p>
        </div>

        <div className="relative mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="pointer-events-none absolute left-0 right-0 top-0 hidden h-full lg:block"
            aria-hidden
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="relative pl-0"
            >
              <span className="font-mono-data text-crimson/70 text-sm">{step.n}</span>
              <h3 className="mt-2 font-display font-bold text-xl text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-ink-soft leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
