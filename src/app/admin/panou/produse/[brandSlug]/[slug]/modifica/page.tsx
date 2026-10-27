import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandConfigs, categoryOptions, findProduct } from "@/lib/adminCatalog";
import styles from "../../../../../Admin.module.css";
import ProductForm, {
  type ProductFormInitial,
} from "../../../../../ProductForm";

export const metadata: Metadata = {
  title: "Modifică produs | Panou Farmavet",
  robots: { index: false, follow: false },
};

type EditProps = {
  params: Promise<{ brandSlug: string; slug: string }>;
};

function stringList(raw: unknown): string {
  if (!Array.isArray(raw)) return "";
  return raw
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

export default async function EditProductPage({ params }: EditProps) {
  const { brandSlug, slug } = await params;
  const found = findProduct(brandSlug, slug);
  if (!found) notFound();

  const raw = found.raw;
  const packageSizes = stringList(raw.package_sizes) || stringList(raw.variants);

  const initial: ProductFormInitial = {
    brandSlug: found.config.brandSlug,
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    slug,
    category: String(raw.category ?? ""),
    description: String(raw.description ?? ""),
    image: String(raw.image ?? ""),
    labels: stringList(raw.labels),
    packageSizes,
    sourceUrl: String(raw.url ?? ""),
  };

  return (
    <>
      <Link href="/admin/panou/produse" className={styles.backLink}>
        ← Înapoi la lista de produse
      </Link>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Modifică produsul</h1>
        <p className={styles.subtitle}>
          Marca {found.config.brand}, fișierul {found.config.fileName}. Salvează
          după ce ai terminat.
        </p>
      </div>
      <ProductForm
        mode="edit"
        brands={brandConfigs.map((config) => ({
          slug: config.brandSlug,
          label: config.brand,
        }))}
        categories={categoryOptions()}
        initial={initial}
      />
    </>
  );
}
