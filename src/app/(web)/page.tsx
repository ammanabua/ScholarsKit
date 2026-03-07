"use client";

import { useEffect, useState } from "react";

import WebNavbar from "@/components/web/WebNavbar";
import Hero from "@/components/web/Hero";
import Features from "@/components/web/Features";
import HowItWorks from "@/components/web/HowItWorks";
import Demo from "@/components/web/Demo";
import Testimonials from "@/components/web/Testimonials";
import Pricing from "@/components/web/Pricing";
import FAQ from "@/components/web/FAQ";
import CTA from "@/components/web/CTA";
import ScrollToTop from "@/components/web/ScrollToTop";
import WebFooter from "@/components/web/WebFooter";




export default function Page() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [, setNavbarScrolled] = useState(false);


  // Navbar scroll effect and scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      setNavbarScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <div className="bg-white text-slate-900">
      <WebNavbar />

      {/* HERO SECTION */}
      <Hero />
      
      {/* FEATURES SECTION */}
      <Features />

      {/* HOW IT WORKS SECTION */}
      <HowItWorks />

      {/* INTERACTIVE DEMO */}
      <Demo />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* PRICING */}
      <Pricing />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CTA />

      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTop showScrollTop={showScrollTop} />

      {/* FOOTER */}
      <WebFooter />
    </div>
  );
}
