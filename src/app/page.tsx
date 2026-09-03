import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Partners from "@/components/Partners";
import WhyUs from "@/components/WhyUs";
import Insights from "@/components/Insights";
import ProductCategories from "@/components/ProductCategories";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <ProductCategories />
        <Partners />
        <WhyUs />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
