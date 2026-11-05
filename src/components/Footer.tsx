"use client";

import Link from "next/link";
import Logo from "./Logo";
import Reveal from "./Reveal";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "./icons";
import { useI18n } from "@/i18n/provider";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t, list } = useI18n();

  const productLinks = list("footer.productLinks");
  const speciesLinks = list("footer.speciesLinks");

  const informationLinks = [
    { label: t("footer.infoAbout"), href: "/#about" },
    { label: t("footer.infoBrands"), href: "/#brands" },
    { label: t("footer.infoTools"), href: "/instrumente" },
    { label: t("footer.infoContact"), href: "/#contact" },
  ];

  const socials = [
    { icon: FacebookIcon, label: t("contact.socialFacebook"), href: "https://www.facebook.com/farmavet.md/about/" },
    { icon: InstagramIcon, label: t("contact.socialInstagram"), href: "https://www.instagram.com/farmavet_moldova/" },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <Reveal className={styles.brand}>
            <Link href="/#home" aria-label={t("nav.brandAria")}>
              <Logo variant="light" />
            </Link>
            <p className={styles.brandText}>{t("footer.blurb")}</p>
            <div className={styles.socials}>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.social}
                  aria-label={social.label}
                >
                  <social.icon className={styles.socialIcon} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <nav className={styles.col} aria-label={t("footer.colProducts")}>
              <h2 className={styles.colTitle}>{t("footer.colProducts")}</h2>
              <ul className={styles.linkList}>
                {productLinks.map((label) => (
                  <li key={label}>
                    <Link href="/produse" className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal delay={140}>
            <nav className={styles.col} aria-label={t("footer.colSpecies")}>
              <h2 className={styles.colTitle}>{t("footer.colSpecies")}</h2>
              <ul className={styles.linkList}>
                {speciesLinks.map((label) => (
                  <li key={label}>
                    <Link href="/produse" className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal delay={200}>
            <nav className={styles.col} aria-label={t("footer.colInfo")}>
              <h2 className={styles.colTitle}>{t("footer.colInfo")}</h2>
              <ul className={styles.linkList}>
                {informationLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal delay={260}>
            <div className={styles.col}>
              <h2 className={styles.colTitle}>{t("footer.colContact")}</h2>
              <ul className={styles.contactList}>
                <li>
                  <MapPinIcon className={styles.contactIcon} />
                  <span>{t("common.address")}</span>
                </li>
                <li>
                  <PhoneIcon className={styles.contactIcon} />
                  <span>
                    <a
                      href={`tel:${site.contact.phones.pharmacy.tel}`}
                      className={styles.link}
                    >
                      {t("contact.labelPhonePharmacy")}: {site.contact.phones.pharmacy.value}
                    </a>
                    <br />
                    <a
                      href={`tel:${site.contact.phones.warehouse.tel}`}
                      className={styles.link}
                    >
                      {t("contact.labelPhoneWarehouse")}: {site.contact.phones.warehouse.value}
                    </a>
                  </span>
                </li>
                <li>
                  <MailIcon className={styles.contactIcon} />
                  <a href="mailto:farmavet.mariana@yahoo.com" className={styles.link}>
                    farmavet.mariana@yahoo.com
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottom}`}>
          <p>{t("footer.copyright")}</p>
          <div className={styles.legal}>
            <a href="#" className={styles.link}>
              {t("footer.privacy")}
            </a>
            <a href="#" className={styles.link}>
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
