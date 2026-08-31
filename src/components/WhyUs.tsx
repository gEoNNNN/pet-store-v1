import Reveal from "./Reveal";
import { CheckCircleIcon } from "./icons";
import styles from "./WhyUs.module.css";

export default function WhyUs() {
  return (
    <section className={styles.whyUs} aria-labelledby="whyus-heading">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 className={styles.title} id="whyus-heading">
            Grijă expertă,
            <br />
            <em>la fiecare pas</em>
          </h2>
          <p className={styles.lede}>
            Farmavet simplifică achiziția produselor veterinare — tu te
            concentrezi pe animalele din grija ta, noi ne ocupăm de restul.
          </p>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.col}>
            <h3 className={styles.colTitle}>
              Fiecare produs, verificat
              <br />
              <em>de un medic veterinar</em>
            </h3>
            <p className={styles.colText}>
              Colaborăm direct cu medici veterinari licențiați. Fiecare lot
              este verificat înainte de a ajunge pe raft — tu primești doar
              produse sigure și certificate.
            </p>
            <p className={styles.colStat}>
              <CheckCircleIcon className={styles.statIcon} />
              100% produse certificate
            </p>
          </Reveal>

          <Reveal className={styles.stampWrap} delay={120}>
            <figure className={styles.stamp}>
              <img
                src="/stamp.jpg"
                alt="Ilustrație pictată cu o buburuză pe o creangă, în lumina soarelui"
                className={styles.stampImg}
                loading="lazy"
              />
            </figure>
          </Reveal>

          <Reveal className={styles.col} delay={200}>
            <h3 className={styles.colTitle}>
              Livrare rapidă,
              <br />
              <em>fără bătăi de cap</em>
            </h3>
            <p className={styles.colText}>
              Ambalaje cu protecție termică și curieri parteneri de încredere —
              comanda ta ajunge intactă, chiar și cele mai sensibile produse.
            </p>
            <p className={styles.colStat}>
              <CheckCircleIcon className={styles.statIcon} />
              Livrare în 24–48h, oriunde în țară
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
