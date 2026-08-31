import Link from "next/link";
import type { ProductCategory } from "@/data/categories";
import styles from "./ProductCategories.module.css";

export default function ProductCategoryCard({
  category,
}: {
  category: ProductCategory;
}) {
  return (
    <article className={styles.card}>
      <img
        src={category.image}
        alt={category.title}
        className={styles.cardImage}
        loading="lazy"
      />
      <h3 className={styles.cardTitle}>{category.title}</h3>
      <Link href={category.href} className={styles.cardCta}>
        Vezi produse
      </Link>
    </article>
  );
}
