import { productCategories } from "@/data/categories";
import ProductCategoryCard from "./ProductCategoryCard";
import Reveal from "./Reveal";
import styles from "./ProductCategories.module.css";

export default function ProductCategories() {
  return (
    <section className={styles.section} id="products" aria-labelledby="products-heading">
      <Reveal className={styles.panelReveal}>
        <div className={styles.panel}>
          <img
            src="/cerbg2.png"
            alt=""
            aria-hidden="true"
            className={styles.panelBg}
          />
          <div className={styles.panelInner}>
            <Reveal>
              <div className={styles.header}>
                <h2 className={styles.title} id="products-heading">
                  Tot ce au nevoie
                  <br />
                  <em>animalele tale</em>
                </h2>
                <p className={styles.sub}>
                  Cinci game, cinci lumi diferite — alege specia și descoperă
                  produsele potrivite pentru ea.
                </p>
              </div>
            </Reveal>

            <div className={styles.grid}>
              {productCategories.map((category, index) => (
                <Reveal key={category.title} delay={index * 120}>
                  <ProductCategoryCard category={category} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
