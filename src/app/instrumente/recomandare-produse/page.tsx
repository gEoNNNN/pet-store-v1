import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ProductFinder from "@/components/ProductFinder";
import ToolPageShell from "@/components/ToolPageShell";
import { getProductSummaries } from "@/data/productCatalog.server";
import { toolBreadcrumbs } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Găsește produsul potrivit pentru animalul tău",
  description:
    "Răspunde la trei întrebări despre animalul tău și descoperă produse recomandate din catalogul Farmavet: hrană, vitamine și antiparazitare.",
  alternates: { canonical: "/instrumente/recomandare-produse" },
};

export default function ProductFinderPage() {
  const products = getProductSummaries();

  return (
    <>
      <JsonLd data={toolBreadcrumbs("Recomandare produse", "/instrumente/recomandare-produse")} />
      <ToolPageShell k="toolPages.finder">
        <ProductFinder products={products} />
      </ToolPageShell>
    </>
  );
}
