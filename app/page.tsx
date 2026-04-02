import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainSolution from "@/components/PainSolution";
import Stats from "@/components/Stats";
import Products from "@/components/Products";
import Differentials from "@/components/Differentials";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PainSolution />
        <Stats />
        <Products />
        <Differentials />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
