import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import ProductCategories from "@/components/ProductCategories";
import ToolsSection from "@/components/ToolsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Partners />
        <ProductCategories />
        <ToolsSection />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
