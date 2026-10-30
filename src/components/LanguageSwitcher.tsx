"use client";

import { LOCALE_LABELS, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import styles from "./LanguageSwitcher.module.css";

type LanguageSwitcherProps = {
  /** Variante compactă pentru meniul mobil. */
  stacked?: boolean;
  onPick?: () => void;
};

export default function LanguageSwitcher({ stacked = false, onPick }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={`${styles.switcher} ${stacked ? styles.stacked : ""}`}
      role="group"
      aria-label={t("nav.languageLabel")}
    >
      {locales.map((code: Locale) => (
        <button
          key={code}
          type="button"
          className={`${styles.option} ${locale === code ? styles.optionActive : ""}`}
          aria-pressed={locale === code}
          onClick={() => {
            setLocale(code);
            onPick?.();
          }}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
