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
    <ToolPageShell k="toolPages.finder">
      <ProductFinder products={products} />
    </ToolPageShell>
  );
}
