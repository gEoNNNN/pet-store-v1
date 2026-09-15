import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-heading">
      <div className={styles.bg} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <Reveal delay={120}>
            <h1 className={styles.title} id="hero-heading">
              Excelență în
              <br />
              <em>sănătatea animalelor.</em>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className={styles.lede}>
              Catalog online cu produse veterinare certificate și nutriție
              echilibrată — pentru animalele de fermă și companionii de acasă.
              Răsfoiește portofoliul complet de branduri internaționale, cu
              informații detaliate pentru fiecare produs.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className={styles.actions}>
              <Link href="/produse" className={styles.btnPrimary}>
                Descoperă portofoliul
                <ArrowRightIcon className={styles.btnIcon} />
              </Link>
              <a href="#about" className={styles.btnLink}>
                Despre Farmavet
                <ChevronRightIcon className={styles.btnLinkIcon} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
