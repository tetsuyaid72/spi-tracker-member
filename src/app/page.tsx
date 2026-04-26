"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      const role = (session.user as any).role || "USER";
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/map");
      }
    } else {
      setShowLanding(true);
    }
  }, [session, isPending, router]);

  if (!showLanding) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0c0e1a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center p-2">
            <img src="/spi.png" alt="SPI" className="w-full h-full object-contain brightness-0 invert dark:invert-0" />
          </div>
          <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0e1a]">
      <LandingNav />
      <HeroSection />
      <TrustSection />
      <ProblemSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}