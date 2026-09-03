import Link from "next/link";
import { productCategories } from "@/data/categories";
import ProductCategoryCard from "./ProductCategoryCard";
import Reveal from "./Reveal";
import { ArrowRightIcon } from "./icons";
import styles from "./ProductCategories.module.css";

export default function ProductCategories() {
  return (
    <section className={styles.section} id="products" aria-labelledby="products-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <div>
            <p className={styles.kicker}>Portofoliul Farmavet</p>
            <h2 className={styles.title} id="products-heading">
              Soluții veterinare
              <br />
              <em>pentru fiecare specie</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <p className={styles.sub}>
              Cinci game specializate, selectate pentru nevoile reale ale animalelor și ale
              profesioniștilor care le îngrijesc.
            </p>
            <Link href="/produse" className={styles.allProducts}>
              Vezi toate produsele
              <ArrowRightIcon className={styles.allProductsIcon} />
            </Link>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {productCategories.map((category, index) => (
            <Reveal key={category.title} delay={index * 90}>
              <ProductCategoryCard category={category} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
