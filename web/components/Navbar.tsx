"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Droplet, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "কেন এই প্ল্যাটফর্ম", href: "/#motivation" },
  { label: "কীভাবে কাজ করে", href: "/#how-it-works" },
  { label: "ফিচারসমূহ", href: "/#features" },
  { label: "জরুরি অনুরোধ", href: "/emergency" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper-raised/90 backdrop-blur border-b border-line shadow-[0_1px_0_0_rgba(28,19,16,0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container-page flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-crimson text-paper-raised">
            <Droplet className="w-4.5 h-4.5" strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight text-ink">
            RoktoSetu
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[15px] text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink-soft hover:text-ink transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              অ্যাডমিন
            </Link>
          )}
          <Link
            href="/profile"
            className="text-[15px] font-semibold text-ink-soft hover:text-ink transition-colors"
          >
            আমার প্রোফাইল
          </Link>
          <Link
            href="/search"
            className="text-[15px] font-semibold text-crimson hover:text-crimson-deep transition-colors"
          >
            জরুরি খুঁজুন
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-full bg-ink text-paper-raised text-[15px] font-semibold px-5 py-2.5 hover:bg-crimson-deep transition-colors"
          >
            ডোনার হন
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="মেনু খুলুন"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-line text-ink"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-line bg-paper-raised">
          <ul className="container-page py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-[15px] text-ink-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 flex flex-col gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-center text-[15px] font-semibold text-ink-soft border border-line rounded-full py-2.5"
                >
                  অ্যাডমিন
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-center text-[15px] font-semibold text-ink-soft border border-line rounded-full py-2.5"
              >
                আমার প্রোফাইল
              </Link>
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="text-center text-[15px] font-semibold text-crimson border border-crimson/30 rounded-full py-2.5"
              >
                জরুরি খুঁজুন
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="text-center rounded-full bg-ink text-paper-raised text-[15px] font-semibold py-2.5"
              >
                ডোনার হন
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
