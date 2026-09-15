import LogoLoop, { type LogoItem } from "./LogoLoop";
import Reveal from "./Reveal";
import styles from "./Partners.module.css";

const partnerLogos: LogoItem[] = [
  { src: "/logos/logo1.png", alt: "Brit" },
  { src: "/logos/logo2.png", alt: "Royal Canin" },
  { src: "/logos/logo3.png", alt: "Grandorf" },
  { src: "/logos/logo4.png", alt: "Trixie" },
  { src: "/logos/logo5.png", alt: "Beaphar" },
  { src: "/logos/logo6.png", alt: "Fitmin" },
  { src: "/logos/logo7.png", alt: "Carnilove" },
];

export default function Partners() {
  return (
    <section className={styles.partners} id="professionals" aria-labelledby="brands-heading">
      <span className={styles.anchor} id="brands" aria-hidden="true" />
      <div className="container">
        <Reveal className={styles.header}>
          <p>Partenerii noștri</p>
          <h2 id="brands-heading">Branduri de încredere, alături de noi</h2>
        </Reveal>
        <Reveal className={styles.loopReveal} delay={100}>
          <div className={styles.loopWrap}>
            <LogoLoop
              logos={partnerLogos}
              speed={42}
              direction="left"
              logoHeight={56}
              gap={18}
              pauseOnHover
              fadeOut
              fadeOutColor="#ffffff"
              scaleOnHover
              ariaLabel="Branduri partenere Farmavet"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
