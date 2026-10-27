import type { Metadata } from "next";
import Link from "next/link";
import { brandConfigs, categoryOptions } from "@/lib/adminCatalog";
import styles from "../../../Admin.module.css";
import ProductForm, { emptyProduct } from "../../../ProductForm";

export const metadata: Metadata = {
  title: "Adaugă produs | Panou Farmavet",
  robots: { index: false, follow: false },
};

export default async function AddProductPage() {
  return (
    <>
      <Link href="/admin/panou/produse" className={styles.backLink}>
        ← Înapoi la lista de produse
      </Link>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Adaugă un produs nou</h1>
        <p className={styles.subtitle}>
          Completează câmpurile; produsul apare imediat în catalogul public.
        </p>
      </div>
      <ProductForm
        mode="create"
        brands={brandConfigs.map((config) => ({
          slug: config.brandSlug,
          label: config.brand,
        }))}
        categories={categoryOptions()}
        initial={emptyProduct}
      />
    </>
  );
}
