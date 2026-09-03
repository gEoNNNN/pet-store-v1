import LogoLoop, { type LogoItem } from "./LogoLoop";
import Reveal from "./Reveal";
import styles from "./Partners.module.css";

const partnerLogos: LogoItem[] = Array.from({ length: 7 }, (_, i) => ({
  src: `/logos/logo${i + 1}.png`,
  alt: `Partener Farmavet ${i + 1}`,
}));

export default function Partners() {
  return (
    <section className={styles.partners} id="brands" aria-labelledby="brands-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <p>Partenerii noștri</p>
          <h2 id="brands-heading">Branduri internaționale, selectate cu încredere</h2>
        </Reveal>
        <Reveal className={styles.loopReveal} delay={100}>
          <div className={styles.loopWrap}>
            <LogoLoop
              logos={partnerLogos}
              speed={38}
              direction="left"
              logoHeight={50}
              gap={68}
              pauseOnHover
              fadeOut
              fadeOutColor="#ffffff"
              scaleOnHover
              ariaLabel="Branduri partenere de încredere"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
