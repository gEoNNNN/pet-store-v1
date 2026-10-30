"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";
import { useI18n } from "@/i18n/provider";
import styles from "./ToolPageShell.module.css";

type ToolPageShellProps = {
  /** Prefix de chei în dicționar, ex. „toolPages.food”. */
  k: string;
  children: ReactNode;
};

export default function ToolPageShell({ k, children }: ToolPageShellProps) {
  const { t } = useI18n();
  const eyebrow = t(`${k}.eyebrow`);

  return (
    <main className={styles.main} id="main">
      <header className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label={t("toolPages.breadcrumbsAria")}>
            <Link href="/">{t("toolPages.home")}</Link><ChevronRightIcon />
            <Link href="/instrumente">{t("toolPages.tools")}</Link><ChevronRightIcon />
            <span>{eyebrow}</span>
          </nav>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{t(`${k}.title`)}</h1>
          <p className={styles.description}>{t(`${k}.description`)}</p>
        </div>
      </header>
      <section className={styles.workspace}>
        <div className="container">{children}</div>
      </section>
    </main>
  );
}
