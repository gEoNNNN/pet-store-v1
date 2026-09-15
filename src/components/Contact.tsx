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
import styles from "./Contact.module.css";

const MAPS_LINK = "https://maps.app.goo.gl/zbrmi44MwjviSwvc6";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Farmavet+SA,Petricani+198,Chi%C8%99in%C4%83u&output=embed";

const contactDetails = [
  {
    icon: MapPinIcon,
    label: "Adresă",
    value: "Petricani 198, Chișinău, Moldova",
    href: MAPS_LINK,
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
  { icon: FacebookIcon, label: "Farmavet pe Facebook", href: "https://www.facebook.com/farmavet.md/about/" },
  { icon: InstagramIcon, label: "Farmavet pe Instagram", href: "https://www.instagram.com/farmavet_moldova/" },
];

export default function Contact() {
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 className={styles.title} id="contact-heading">
            Discută cu echipa <em>Farmavet</em>
          </h2>
          <p className={styles.sub}>
            Ai întrebări despre un produs sau dieta potrivită
            pentru animalul tău? Echipa noastră îți stă la
            dispoziție cu informații și recomandări.
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
              <iframe
                src={MAPS_EMBED}
                title="Locația Farmavet pe Google Maps"
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
