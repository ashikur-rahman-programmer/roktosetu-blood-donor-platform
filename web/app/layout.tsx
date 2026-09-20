import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const manrope = localFont({
  src: "../public/fonts/Manrope.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "../public/fonts/IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoktoSetu – Blood Donor Network Bangladesh",
  description:
    "সম্পূর্ণ ফ্রি প্ল্যাটফর্ম যেখানে রক্তের গ্রুপ, লোকেশন আর সবশেষ কবে রক্ত দিয়েছেন তা দেখে সহজে বিশ্বস্ত ডোনার খুঁজে পাওয়া যায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${manrope.variable} ${plexMono.variable} antialiased bg-paper`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
