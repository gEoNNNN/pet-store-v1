import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getProduct, getProducts } from "@/data/productCatalog.server";
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
  return {
    title: `${product.name} | ${product.brand} | Farmavet`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      images: [{ url: product.image }],
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
      <ProductDetailView product={product} />
      <Footer />
    </>
  );
}
