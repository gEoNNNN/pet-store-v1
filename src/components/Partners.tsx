import LogoLoop, { type LogoItem } from "./LogoLoop";
import Reveal from "./Reveal";
import styles from "./Partners.module.css";

const partnerLogos: LogoItem[] = Array.from({ length: 7 }, (_, i) => ({
  src: `/logos/logo${i + 1}.png`,
  alt: `Partener Farmavet ${i + 1}`,
}));

export default function Partners() {
  return (
    <section className={styles.partners} aria-label="Parteneri Farmavet">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.loopReveal}>
          <div className={styles.loopWrap}>
            <LogoLoop
              logos={partnerLogos}
              speed={45}
              direction="left"
              logoHeight={64}
              gap={72}
              pauseOnHover
              fadeOut
              fadeOutColor="#EFEDD3"
              scaleOnHover
              ariaLabel="Branduri partenere de încredere"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
