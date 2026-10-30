"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { productCategories } from "@/data/categories";
import Reveal from "./Reveal";
import SpeciesStackInteractor from "./ui/SpeciesStackInteractor";
import { ArrowRightIcon } from "./icons";
import styles from "./ProductCategories.module.css";

const clipIds = [
  "species-strips",
  "species-mosaic",
  "species-pixels",
  "species-columns",
  "species-focus",
];

export default function ProductCategories() {
  const { t } = useI18n();

  const speciesItems = productCategories.map((category, index) => ({
    ...category,
    title: t(["species", category.title, "title"]),
    description: t(["species", category.title, "desc"]),
    clipId: clipIds[index],
  }));

  return (
    <section className={styles.section} id="products" aria-labelledby="products-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <div>
            <h2 className={styles.title} id="products-heading">
              {t("cats.titleTop")}
              <br />
              <em>{t("cats.titleEm")}</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <p className={styles.sub}>{t("cats.sub")}</p>
            <Link href="/produse" className={styles.allProducts}>
              {t("nav.viewAllProducts")}
              <ArrowRightIcon className={styles.allProductsIcon} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <SpeciesStackInteractor items={speciesItems} />
        </Reveal>
      </div>
    </section>
  );
}
