import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import WhyUs from "@/components/WhyUs";
import ProductCategories from "@/components/ProductCategories";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Partners />
        <WhyUs />
        <ProductCategories />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
