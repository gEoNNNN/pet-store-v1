import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon, CheckCircleIcon } from "./icons";
import styles from "./WhyUs.module.css";

const stats = [
  { value: "5", label: "game specializate" },
  { value: "7", label: "branduri partenere" },
  { value: "24–48h", label: "livrare națională" },
];

export default function WhyUs() {
  return (
    <section className={styles.whyUs} id="about" aria-labelledby="whyus-heading">
      <div className={`container ${styles.layout}`}>
        <Reveal className={styles.visual}>
          <figure className={styles.mainImage}>
            <Image
              src="/footer.png"
              alt="Peisaj rural și sediu Farmavet"
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
          <p className={styles.kicker}>Despre Farmavet</p>
          <h2 className={styles.title} id="whyus-heading">
            Încredere construită prin
            <em> grijă și profesionalism</em>
          </h2>
          <p className={styles.lede}>
            Farmavet simplifică achiziția produselor veterinare — tu te concentrezi pe animalele
            din grija ta, noi ne ocupăm de restul.
          </p>

          <div className={styles.assurances}>
            <div>
              <CheckCircleIcon className={styles.assuranceIcon} />
              <span>
                <strong>Produse verificate</strong>
                Colaborăm cu medici veterinari și furnizori de încredere.
              </span>
            </div>
            <div>
              <CheckCircleIcon className={styles.assuranceIcon} />
              <span>
                <strong>Livrare sigură</strong>
                Ambalaje adecvate și curieri parteneri pentru produse sensibile.
              </span>
            </div>
          </div>

          <Link href="/#contact" className={styles.cta}>
            Discută cu echipa noastră
            <ArrowRightIcon className={styles.ctaIcon} />
          </Link>
        </Reveal>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <Reveal className={styles.stat} delay={index * 80} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
