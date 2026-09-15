import Link from "next/link";
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

const speciesItems = productCategories.map((category, index) => ({
  ...category,
  clipId: clipIds[index],
}));

export default function ProductCategories() {
  return (
    <section className={styles.section} id="products" aria-labelledby="products-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <div>
            <h2 className={styles.title} id="products-heading">
              Soluții veterinare
              <br />
              <em>pentru fiecare specie</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <p className={styles.sub}>
              Explorează categoriile disponibile și descoperă informațiile complete pentru
              produsele din catalogul Farmavet.
            </p>
            <Link href="/produse" className={styles.allProducts}>
              Vezi toate produsele
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
