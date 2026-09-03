import logo from "../img/logo.png";
import styles from "./Logo.module.css";

type LogoProps = {
  variant?: "dark" | "light";
};

export default function Logo({ variant = "dark" }: LogoProps) {
  return (
    <span className={`${styles.logo} ${variant === "light" ? styles.light : styles.dark}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="" aria-hidden="true" className={styles.image} />
      <span className={styles.wordmark}>
        <strong>Farmavet</strong>
        <small>Sănătate animală</small>
      </span>
    </span>
  );
}
