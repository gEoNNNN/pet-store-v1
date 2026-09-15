import type { Metadata } from "next";
import ProductFinder from "@/components/ProductFinder";
import ToolPageShell from "@/components/ToolPageShell";
import { getProductSummaries } from "@/data/productCatalog.server";

export const metadata: Metadata = {
  title: "Găsește produsul potrivit | Farmavet",
  description: "Răspunde la trei întrebări și descoperă produse Brit și Carnilove din catalogul Farmavet.",
};

export default function ProductFinderPage() {
  const products = getProductSummaries();

  return (
    <ToolPageShell
      eyebrow="Recomandare produse"
      title="Găsește produsul potrivit"
      description="Selectează animalul, scopul și etapa de viață. Recomandările sunt alese din produsele reale disponibile în catalog."
    >
      <ProductFinder products={products} />
    </ToolPageShell>
  );
}
