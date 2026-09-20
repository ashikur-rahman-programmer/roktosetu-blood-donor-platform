import Hero from "@/sections/Hero";
import Motivation from "@/sections/Motivation";
import HowItWorks from "@/sections/HowItWorks";
import Features from "@/sections/Features";
import Promise from "@/sections/Promise";
import CtaBanner from "@/sections/CtaBanner";

export default function Home() {
  return (
    <main>
      <Hero />
      <Motivation />
      <HowItWorks />
      <Features />
      <Promise />
      <CtaBanner />
    </main>
  );
}
