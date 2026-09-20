"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-page pt-14 md:pt-24 pb-16 md:pb-24">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="badge-pulse inline-flex items-center text-crimson font-mono-data text-[13px] tracking-wide">
              এখন পাবনা সহ সারাদেশে চালু হচ্ছে
            </span>

            <h1 className="text-balance mt-5 font-display font-extrabold text-[2.5rem] leading-[1.1] sm:text-6xl sm:leading-[1.08] text-ink">
              রক্ত লাগবে? খোঁজার আগেই যেন দেরি না হয়ে যায়।
            </h1>

            <p className="text-balance mt-6 text-lg text-ink-soft max-w-[52ch] leading-relaxed">
              জরুরি মুহূর্তে সঠিক গ্রুপের, কাছাকাছি এলাকার, এবং সত্যিই এখন রক্ত
              দিতে সক্ষম এমন একজন মানুষ খুঁজে পাওয়াই সবচেয়ে কঠিন কাজ।
              RoktoSetu একটি সম্পূর্ণ বিনামূল্যের প্ল্যাটফর্ম যা এই খোঁজাখুঁজিকে
              কয়েক সেকেন্ডে নামিয়ে আনে।
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold px-7 py-3.5 hover:bg-crimson-deep transition-colors"
              >
                বিনামূল্যে ডোনার হিসেবে যুক্ত হন
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 text-ink font-semibold px-7 py-3.5 hover:border-ink/40 transition-colors"
              >
                <Search className="w-4 h-4" />
                এখনই ডোনার খুঁজুন
              </Link>
            </div>

            <p className="mt-5 text-sm text-ink-soft/80">
              কোনো বিজ্ঞাপন নেই। কোনো সাবস্ক্রিপশন নেই। শুধু মানুষ, মানুষের
              পাশে।
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-line bg-paper-raised p-6 sm:p-8 shadow-[0_1px_0_0_rgba(28,19,16,0.03)]">
              <PulseLine />
              <div className="mt-6 grid grid-cols-4 gap-2.5">
                {BLOOD_GROUPS.map((group, i) => (
                  <div
                    key={group}
                    className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-paper py-3.5 border border-line"
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className="absolute inline-flex h-full w-full rounded-full bg-living-green opacity-60 animate-ping"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-living-green" />
                    </span>
                    <span className="font-mono-data font-semibold text-ink text-[15px]">
                      {group}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-[13px] text-ink-soft">
                প্রতিটি গ্রুপের জন্য —{" "}
                <span className="text-living-green font-semibold">
                  সবুজ মানে এখন উপলব্ধ
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PulseLine() {
  return (
    <svg
      viewBox="0 0 400 90"
      className="w-full h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M0 45 H120 L145 45 L160 10 L180 80 L198 45 L215 45 L230 25 L245 45 H400"
        stroke="#c81d33"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}
