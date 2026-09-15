import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";
import { getProductSummaries } from "@/data/productCatalog.server";

export const metadata: Metadata = {
  title: "Produse Brit și Carnilove | Farmavet",
  description:
    "Descoperă catalogul complet de hrană Brit și Carnilove pentru câini, pisici și rozătoare, cu ingrediente și informații nutriționale.",
};

export default function ProductsPage() {
  const products = getProductSummaries();

  return (
    <>
      <Navbar activeItem="products" />
      <main id="main">
        <ProductCatalog products={products} />
      </main>
      <Footer />
    </>
  );
}
