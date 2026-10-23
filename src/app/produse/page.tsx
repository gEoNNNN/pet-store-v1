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

type ProductsPageProps = {
  searchParams?: Promise<{ cat?: string; brand?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const products = getProductSummaries();

  return (
    <>
      <Navbar activeItem="products" />
      <main id="main">
        <ProductCatalog
          products={products}
          initialCategory={(resolved.cat as any) || "Toate"}
          initialBrand={(resolved.brand as any) || "Toate"}
        />
      </main>
      <Footer />
    </>
  );
}
