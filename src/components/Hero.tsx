import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-heading">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.geometry} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <Reveal>
            <p className={styles.overline}>Farmavet · Sănătate animală</p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className={styles.title} id="hero-heading">
              Excelență în
              <br />
              <em>sănătatea animalelor.</em>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className={styles.lede}>
              Produse veterinare certificate, nutriție echilibrată și
              consultanță reală — pentru animalele de fermă și companionii
              de acasă. Totul într-un singur loc, aproape de tine.
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
