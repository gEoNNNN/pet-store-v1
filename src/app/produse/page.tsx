import type { Metadata } from "next";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";
import { getProductSummaries } from "@/data/productCatalog.server";
import { collectionSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Catalog produse veterinare și hrană pentru animale",
  description:
    "Catalog complet Farmavet: medicamente veterinare, antiparazitare, vitamine și suplimente, hrană Brit și Carnilove pentru câini, pisici și rozătoare, accesorii pentru animale de fermă.",
  alternates: {
    canonical: "/produse",
  },
  openGraph: {
    title: "Catalog produse veterinare și hrană pentru animale | Farmavet",
    description:
      "Medicamente veterinare, antiparazitare, vitamine, hrană Brit și Carnilove și accesorii — tot catalogul Farmavet într-un singur loc.",
    url: "/produse",
  },
};

type ProductsPageProps = {
  searchParams?: Promise<{ cat?: string; brand?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const products = getProductSummaries();

  return (
    <>
      <Navbar activeItem="products" />
      <JsonLd data={collectionSchema(products)} />
      <main id="main">
        <ProductCatalog
          products={products}
          initialCategory={(resolved.cat as any) || "Toate"}
          initialBrand={(resolved.brand as any) || "Toate"}
          initialQuery={resolved.q || ""}
        />
      </main>
      <Footer />
    </>
  );
}
