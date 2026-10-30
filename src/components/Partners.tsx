"use client";

import LogoLoop, { type LogoItem } from "./LogoLoop";
import Reveal from "./Reveal";
import { useI18n } from "@/i18n/provider";
import styles from "./Partners.module.css";

/**
 * Siglele din /logos/partners sunt generate de `node scripts/partner-logos.mjs`
 * pornind de la fișierele urcate în public/logos.
 *
 * `className: "logo-mare"` marchează siglele cerute mai mari: scriptul le pune
 * pe un canvas strâns pe ea (fără aer pierdut pe lateral), iar
 * Partners.module.css le dă mai multă înălțime. Cardul rămâne la fel de mare și
 * cu exact aceeași marjă interioară ca restul cardurilor.
 */
const partnerLogoSrcs: Array<Omit<LogoItem, "alt">> = [
  { src: "/logos/partners/biopharm.png", className: "logo-mare" },
  { src: "/logos/partners/brit.png" },
  { src: "/logos/partners/ol-kar.png", className: "logo-mare" },
  { src: "/logos/partners/versele-laga.png", className: "logo-mare" },
  { src: "/logos/partners/partener-verde.png" },
  { src: "/logos/partners/vetsintez.png" },
  { src: "/logos/partners/carnilove.png" },
  { src: "/logos/partners/antibiotice.png" },
  { src: "/logos/partners/promvetservis.png" },
  { src: "/logos/partners/cargill.png" },
  { src: "/logos/partners/dyntec.png" },
  { src: "/logos/partners/purina.png", className: "logo-mare" },
  { src: "/logos/partners/tekro.png", className: "logo-mare" },
  { src: "/logos/partners/natura.png", className: "logo-mare" },
  { src: "/logos/partners/vanelli.png", className: "logo-mare" },
  { src: "/logos/partners/icb-pharma.png" },
];

const partnerLogoAlts = [
  "Biopharm",
  "Brit",
  "O.L.KAR Animal Health",
  "Versele-Laga",
  null, // „Partener Farmavet” — text localizat
  "Vetsintez",
  "Carnilove",
  "Antibiotice Iași",
  "Promvetservis",
  "Cargill",
  "Dyntec",
  "Purina",
  "Tekro",
  "Natura",
  "Vanelli Group",
  "ICB Pharma",
];

export default function Partners() {
  const { t } = useI18n();
  const partnerLogos: LogoItem[] = partnerLogoSrcs.map((logo, index) => ({
    ...logo,
    alt: partnerLogoAlts[index] ?? t("partners.altPartner"),
  }));

  return (
    <section className={styles.partners} id="professionals" aria-labelledby="brands-heading">
      <span className={styles.anchor} id="brands" aria-hidden="true" />
      <div className="container">
        <Reveal className={styles.header}>
          <p>{t("partners.kicker")}</p>
          <h2 id="brands-heading">{t("partners.title")}</h2>
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
              ariaLabel={t("partners.loopAria")}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
