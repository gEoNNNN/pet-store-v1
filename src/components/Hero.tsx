import Reveal from "./Reveal";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-heading">
      <div className={styles.bg} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <Reveal>
            <p className={styles.overline}>Farmavet · Sănătate animală</p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className={styles.title} id="hero-heading">
              Sănătatea animalelor tale începe <em>aici</em>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className={styles.lede}>
              Produse veterinare certificate, nutriție echilibrată și
              consultanță reală — pentru animalele de fermă și companionii
              de acasă. Totul într-un singur loc, aproape de tine.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className={styles.actions}>
              <a href="#products" className={styles.btnPrimary}>
                Vezi produsele
                <ArrowRightIcon className={styles.btnIcon} />
              </a>
              <a href="#contact" className={styles.btnLink}>
                Contactează-ne
                <ChevronRightIcon className={styles.btnLinkIcon} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
