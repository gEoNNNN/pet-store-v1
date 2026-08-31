import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = {
  title: "Catalog produse veterinare | Farmavet",
  description:
    "Descoperă produse veterinare certificate, hrană și suplimente pentru animale de companie, bovine, ovine, păsări și porcine.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar activeItem="products" />
      <main id="main">
        <ProductCatalog />
      </main>
      <Footer />
    </>
  );
}
