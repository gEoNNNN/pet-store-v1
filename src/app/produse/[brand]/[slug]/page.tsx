import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import { getProduct, getProducts } from "@/data/productCatalog.server";
import { productBreadcrumbs, productSchema } from "@/lib/schema";
import ProductDetailView from "./ProductDetailView";

type ProductPageProps = {
  params: Promise<{ brand: string; slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((product) => ({ brand: product.brandSlug, slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { brand, slug } = await params;
  const product = getProduct(brand, slug);
  if (!product) return {};
  const summary = product.description.slice(0, 160);
  // Brandul „Farmavet" nu se repetă în titlu: template-ul din layout adaugă deja „| Farmavet".
  const brandSuffix = product.brand === "Farmavet" ? "" : ` — ${product.brand}`;
  const displayTitle = `${product.name}${brandSuffix}`;
  return {
    // Template-ul din layout adaugă „| Farmavet" la final.
    title: displayTitle,
    description: summary,
    alternates: {
      canonical: product.href,
    },
    openGraph: {
      title: displayTitle,
      description: summary,
      url: product.href,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: summary,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { brand, slug } = await params;
  const product = getProduct(brand, slug);
  if (!product) notFound();

  return (
    <>
      <Navbar activeItem="products" />
      <JsonLd data={[productSchema(product), productBreadcrumbs(product)]} />
      <ProductDetailView product={product} />
      <Footer />
    </>
  );
}
