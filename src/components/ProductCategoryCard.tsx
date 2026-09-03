import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/data/categories";
import { ArrowRightIcon } from "./icons";
import styles from "./ProductCategories.module.css";

export default function ProductCategoryCard({
  category,
  index,
}: {
  category: ProductCategory;
  index: number;
}) {
  return (
    <article className={styles.card}>
      <Link href={category.href} className={styles.cardLink}>
        <span className={styles.imageWrap}>
          <Image
            src={category.image}
            alt={category.title}
            fill
            sizes="(max-width: 680px) 82vw, (max-width: 1100px) 33vw, 20vw"
            className={styles.cardImage}
          />
          <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
        </span>
        <span className={styles.cardContent}>
          <span className={styles.cardRule} />
          <h3 className={styles.cardTitle}>{category.title}</h3>
          <p className={styles.cardDescription}>{category.description}</p>
          <span className={styles.cardCta}>
            Vezi produsele
            <ArrowRightIcon className={styles.cardCtaIcon} />
          </span>
        </span>
      </Link>
    </article>
  );
}
