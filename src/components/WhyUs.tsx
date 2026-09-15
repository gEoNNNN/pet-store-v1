import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon, CheckCircleIcon } from "./icons";
import styles from "./WhyUs.module.css";

export default function WhyUs() {
  return (
    <section className={styles.whyUs} id="about" aria-labelledby="whyus-heading">
      <div className={`container ${styles.layout}`}>
        <Reveal className={styles.visual}>
          <figure className={styles.mainImage}>
            <Image
              src="/magazin.jpeg"
              alt="Magazin Farmavet"
              fill
              sizes="(max-width: 840px) 100vw, 52vw"
              className={styles.mainImageAsset}
            />
          </figure>
          <div className={styles.visualLabel}>
            <span>Farmavet</span>
            <strong>Grijă expertă, la fiecare pas.</strong>
          </div>
        </Reveal>

        <Reveal className={styles.content} delay={120}>
          <h2 className={styles.title} id="whyus-heading">
            Încredere construită prin
            <em> grijă și profesionalism</em>
          </h2>
          <p className={styles.lede}>
            Farmavet pune la dispoziția ta un catalog online cu produse
            veterinare certificate — tu răsfoiești și alegi cu încredere,
            noi îți oferim informațiile de care ai nevoie pentru fiecare
            produs în parte.
          </p>

          <div className={styles.assurances}>
            <div>
              <CheckCircleIcon className={styles.assuranceIcon} />
              <span>
                <strong>Produse verificate</strong>
                Colaborăm cu furnizori de încredere și branduri internaționale.
              </span>
            </div>
            <div>
              <CheckCircleIcon className={styles.assuranceIcon} />
              <span>
                <strong>Informații complete</strong>
                Ingrediente, valori nutriționale, gramaje și ghiduri de hrănire pentru fiecare produs.
              </span>
            </div>
          </div>

          <Link href="/#contact" className={styles.cta}>
            Discută cu echipa noastră
            <ArrowRightIcon className={styles.ctaIcon} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
