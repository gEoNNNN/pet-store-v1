import styles from "./Logo.module.css";

type LogoProps = {
  variant?: "dark" | "light";
};

export default function Logo({ variant = "dark" }: LogoProps) {
  return (
    <span className={`${styles.logo} ${variant === "light" ? styles.light : styles.dark}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Farmavet — Sănătate Animală" className={styles.image} />
    </span>
  );
}
