import Reveal from "./Reveal";
import { ShieldCheckIcon, StethoscopeIcon, TruckIcon } from "./icons";
import styles from "./TrustStrip.module.css";

const benefits = [
  {
    icon: StethoscopeIcon,
    title: "Expertiză veterinară",
    text: "Recomandări responsabile pentru profesioniști și proprietari.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Produse certificate",
    text: "Portofoliu verificat, provenit de la branduri de încredere.",
  },
  {
    icon: TruckIcon,
    title: "Parteneriate profesionale",
    text: "Livrare rapidă și suport dedicat, oriunde în țară.",
  },
];

export default function TrustStrip() {
  return (
    <section className={styles.section} id="professionals" aria-label="Beneficiile Farmavet">
      <div className={`container ${styles.grid}`}>
        {benefits.map((benefit, index) => (
          <Reveal className={styles.item} delay={index * 100} key={benefit.title}>
            <span className={styles.iconWrap}>
              <benefit.icon className={styles.icon} />
            </span>
            <div>
              <span className={styles.line} />
              <h2>{benefit.title}</h2>
              <p>{benefit.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
