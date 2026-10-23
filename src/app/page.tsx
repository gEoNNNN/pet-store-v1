import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import VeterinaryCategoriesGrid from "@/components/VeterinaryCategoriesGrid";
import ProductCategories from "@/components/ProductCategories";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import ToolsSection from "@/components/ToolsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Partners />
        <VeterinaryCategoriesGrid />
        <ProductCategories />
        <WhyUs />
        <Testimonials />
        <Contact />
        <ToolsSection />
      </main>
      <Footer />
    </>
  );
}
