import Header from "@/marketing/components/layout/Header";
import Footer from "@/marketing/components/layout/Footer";
import HeroSection from "@/marketing/components/sections/HeroSection";
import CredibilityBar from "@/marketing/components/sections/CredibilityBar";
import ProgramsSection from "@/marketing/components/sections/ProgramsSection";
import WhyChooseUsSection from "@/marketing/components/sections/WhyChooseUsSection";
import JourneySection from "@/marketing/components/sections/JourneySection";
import TestimonialsSection from "@/marketing/components/sections/TestimonialsSection";
import BookingSection from "@/marketing/components/sections/BookingSection";

export function MarketingLandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-altimeter font-sans text-navy">
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <HeroSection />
        <CredibilityBar />
        <ProgramsSection />
        <WhyChooseUsSection />
        <JourneySection />
        <TestimonialsSection />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
}
