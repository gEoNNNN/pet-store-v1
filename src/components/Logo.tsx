"use client";

import logo from "../img/logo.png";
import { useI18n } from "@/i18n/provider";
import styles from "./Logo.module.css";

type LogoProps = {
  variant?: "dark" | "light";
  size?: "md" | "lg";
};

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const { t } = useI18n();
  return (
    <span className={`${styles.logo} ${variant === "light" ? styles.light : styles.dark} ${size === "lg" ? styles.lg : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="" aria-hidden="true" className={styles.image} />
      <span className={styles.wordmark}>
        <strong>Farmavet</strong>
        <small>{t("logo.tagline")}</small>
      </span>
    </span>
  );
}
