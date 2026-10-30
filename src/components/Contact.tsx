"use client";

import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "./icons";
import { useI18n } from "@/i18n/provider";
import styles from "./Contact.module.css";

const MAPS_LINK = "https://maps.app.goo.gl/zbrmi44MwjviSwvc6";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Farmavet+SA,Petricani+198,Chi%C8%99in%C4%83u&output=embed";

export default function Contact() {
  const { t } = useI18n();

  const contactDetails = [
    {
      icon: MapPinIcon,
      label: t("contact.labelAddress"),
      value: t("common.address"),
      href: MAPS_LINK,
    },
    {
      icon: PhoneIcon,
      label: t("contact.labelPhone"),
      value: "0795 36 508",
      href: "tel:+37379536508",
    },
    {
      icon: MailIcon,
      label: t("contact.labelEmail"),
      value: "farmavet.mariana@yahoo.com",
      href: "mailto:farmavet.mariana@yahoo.com",
    },
    {
      icon: ClockIcon,
      label: t("contact.labelProgram"),
      value: t("contact.program"),
    },
  ];

  const socials = [
    { icon: FacebookIcon, label: t("contact.socialFacebook"), href: "https://www.facebook.com/farmavet.md/about/" },
    { icon: InstagramIcon, label: t("contact.socialInstagram"), href: "https://www.instagram.com/farmavet_moldova/" },
  ];

  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 className={styles.title} id="contact-heading">
            {t("contact.titleTop")} <em>{t("contact.titleEm")}</em>
          </h2>
          <p className={styles.sub}>{t("contact.sub")}</p>
          <ul className={styles.details}>
            {contactDetails.map((item) => (
              <li key={item.label} className={styles.detail}>
                <span className={styles.detailIcon}>
                  <item.icon className={styles.icon} />
                </span>
                <div>
                  <span className={styles.detailLabel}>{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className={styles.detailValueLink}>
                      {item.value}
                    </a>
                  ) : (
                    <span className={styles.detailValue}>{item.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.cardReveal} delay={120}>
          <div className={styles.card}>
            <div className={styles.formSide}>
              <ContactForm />
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
            </div>
            <div className={styles.imageSide}>
              <iframe
                src={MAPS_EMBED}
                title={t("contact.mapsTitle")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className={styles.mapFrame}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
