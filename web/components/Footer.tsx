import Link from "next/link";
import { Droplet, MessageCircle, Globe, Mail } from "lucide-react";

const LINKS = [
  {
    heading: "প্ল্যাটফর্ম",
    items: [
      { label: "ডোনার খুঁজুন", href: "/search" },
      { label: "ডোনার হিসেবে যুক্ত হন", href: "/register" },
      { label: "জরুরি অনুরোধ", href: "/emergency" },
      { label: "আমার প্রোফাইল", href: "/profile" },
    ],
  },
  {
    heading: "সম্পর্কে",
    items: [
      { label: "আমাদের প্রতিশ্রুতি", href: "/#promise" },
      { label: "কেন এই প্ল্যাটফর্ম", href: "/#motivation" },
      { label: "যোগাযোগ", href: "mailto:hello@roktosetu.org" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="container-page py-16">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr] gap-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-crimson text-paper-raised">
                <Droplet className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
              </span>
              <span className="font-display font-extrabold text-lg text-ink">
                RoktoSetu
              </span>
            </div>
            <p className="mt-4 text-ink-soft leading-relaxed max-w-[36ch]">
              একটি স্বেচ্ছাসেবী, সম্পূর্ণ বিনামূল্যের কমিউনিটি প্ল্যাটফর্ম।
              কোনো হাসপাতাল বা লাইসেন্সপ্রাপ্ত রক্তব্যাংকের বিকল্প নয় —
              জরুরি প্রয়োজনে সবসময় নিকটস্থ হাসপাতাল ও অনুমোদিত ব্লাড ব্যাংকের
              সঙ্গেও যোগাযোগ করুন।
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="কমিউনিটি গ্রুপ"
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-crimson hover:border-crimson/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="ওয়েবসাইট"
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-crimson hover:border-crimson/40 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@roktosetu.org"
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-crimson hover:border-crimson/40 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-display font-semibold text-ink text-sm">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-ink-soft hover:text-crimson transition-colors text-[15px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-soft/80 font-mono-data">
            © {new Date().getFullYear()} RoktoSetu — সবার জন্য, বিনামূল্যে
          </p>
          <p className="text-sm text-ink-soft/80">
            তৈরি হয়েছে ভালোবাসা থেকে, মুনাফার জন্য নয়
          </p>
        </div>
      </div>
    </footer>
  );
}
