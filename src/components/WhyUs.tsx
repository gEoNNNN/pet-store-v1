"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon, CheckCircleIcon } from "./icons";
import { useI18n } from "@/i18n/provider";
import styles from "./WhyUs.module.css";

export default function WhyUs() {
  const { t } = useI18n();
  return (
    <section className={styles.whyUs} id="about" aria-labelledby="whyus-heading">
      <div className={`container ${styles.layout}`}>
        <Reveal className={styles.visual}>
          <figure className={styles.mainImage}>
            <Image
              src="/magazin.jpeg"
              alt={t("why.imgAlt")}
              fill
              sizes="(max-width: 840px) 100vw, 52vw"
              className={styles.mainImageAsset}
            />
          </figure>
          <div className={styles.visualLabel}>
            <span>Farmavet</span>
            <strong>{t("why.visualLabel")}</strong>
          </div>
        </Reveal>

        <Reveal className={styles.content} delay={120}>
          <h2 className={styles.title} id="whyus-heading">
            {t("why.titleTop")} <em>{t("why.titleEm")}</em>
          </h2>
          <p className={styles.lede}>{t("why.lede")}</p>

          <div className={styles.assurances}>
            <div>
              <CheckCircleIcon className={styles.assuranceIcon} />
              <span>
                <strong>{t("why.assurance1Title")}</strong>
                {t("why.assurance1Text")}
              </span>
            </div>
            <div>
              <CheckCircleIcon className={styles.assuranceIcon} />
              <span>
                <strong>{t("why.assurance2Title")}</strong>
                {t("why.assurance2Text")}
              </span>
            </div>
          </div>

          <Link href="/#contact" className={styles.cta}>
            {t("why.cta")}
            <ArrowRightIcon className={styles.ctaIcon} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
