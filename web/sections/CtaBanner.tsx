import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="border-t border-line">
      <div className="container-page py-20 md:py-28">
        <div className="rounded-3xl bg-ink px-8 py-14 md:px-16 md:py-20 text-center relative overflow-hidden">
          <h2 className="text-balance font-display font-extrabold text-3xl sm:text-[2.75rem] leading-tight text-paper-raised max-w-[22ch] mx-auto">
            আজ আপনি যুক্ত হলে, কাল হয়তো কারো জীবন বাঁচবে
          </h2>
          <p className="mt-5 text-paper-raised/70 text-lg max-w-[46ch] mx-auto">
            মাত্র এক মিনিটের রেজিস্ট্রেশন। বিনিময়ে, প্রয়োজনের সময় কেউ একজন
            আপনাকে খুঁজে পাবে।
          </p>
          <Link
            href="/register"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold px-8 py-3.5 hover:bg-crimson-deep transition-colors"
          >
            ফ্রি রেজিস্ট্রেশন করুন
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
