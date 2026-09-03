import Image from "next/image";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XSocialIcon,
} from "./icons";
import styles from "./Contact.module.css";

const contactDetails = [
  {
    icon: MapPinIcon,
    label: "Adresă",
    value: "Petricani 198, Chișinău, Moldova",
  },
  {
    icon: PhoneIcon,
    label: "Telefon",
    value: "0795 36 508",
    href: "tel:+37379536508",
  },
  {
    icon: MailIcon,
    label: "Email",
    value: "farmavet.mariana@yahoo.com",
    href: "mailto:farmavet.mariana@yahoo.com",
  },
  {
    icon: ClockIcon,
    label: "Program",
    value: "Luni – Sâmbătă: 9:00 – 19:00",
  },
];

const socials = [
  { icon: FacebookIcon, label: "Farmavet pe Facebook", href: "#" },
  { icon: InstagramIcon, label: "Farmavet pe Instagram", href: "#" },
  { icon: XSocialIcon, label: "Farmavet pe X", href: "#" },
];

export default function Contact() {
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <Reveal className={styles.head}>
          <p className={styles.kicker}>Contact & consultanță</p>
          <h2 className={styles.title} id="contact-heading">
            Discută cu echipa <em>Farmavet</em>
          </h2>
          <p className={styles.sub}>
            Ai întrebări despre un produs, o comandă sau dieta potrivită
            pentru animalul tău? Specialiștii noștri veterinari îți stau la
            dispoziție.
          </p>
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
              <Image
                src="/left.jpg"
                alt="Peisaj rural într-o zi însorită"
                fill
                sizes="(max-width: 980px) 100vw, 55vw"
                className={styles.cardImage}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
