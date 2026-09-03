import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import Reveal from "./Reveal";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XSocialIcon,
} from "./icons";
import styles from "./Footer.module.css";

const productLinks = [
  "Produse veterinare",
  "Nutriție animală",
  "Suplimente",
  "Îngrijire și prevenție",
];

const speciesLinks = ["Animale de companie", "Bovine", "Ovine", "Păsări", "Porcine"];

const informationLinks = [
  { label: "Despre noi", href: "/#about" },
  { label: "Branduri", href: "/#brands" },
  { label: "Profesioniști", href: "/#professionals" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  { icon: FacebookIcon, label: "Farmavet pe Facebook", href: "#" },
  { icon: InstagramIcon, label: "Farmavet pe Instagram", href: "#" },
  { icon: XSocialIcon, label: "Farmavet pe X", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <Reveal className={styles.newsletter}>
          <div>
            <p className={styles.newsletterKicker}>Rămâi informat</p>
            <h2>Informații utile pentru sănătatea animalelor.</h2>
          </div>
          <NewsletterForm />
        </Reveal>

        <div className={styles.top}>
          <Reveal className={styles.brand}>
            <Link href="/#home" aria-label="Farmavet — pagina principală">
              <Logo variant="light" />
            </Link>
            <p className={styles.brandText}>
              Produse veterinare certificate, consultanță profesională și servicii construite în
              jurul sănătății animalelor.
            </p>
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
            <nav className={styles.col} aria-label="Produse">
              <h2 className={styles.colTitle}>Produse</h2>
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
            <nav className={styles.col} aria-label="Specii animale">
              <h2 className={styles.colTitle}>Specii animale</h2>
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
            <nav className={styles.col} aria-label="Informații">
              <h2 className={styles.colTitle}>Informații</h2>
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
              <h2 className={styles.colTitle}>Contact</h2>
              <ul className={styles.contactList}>
                <li>
                  <MapPinIcon className={styles.contactIcon} />
                  <span>Petricani 198, Chișinău, Moldova</span>
                </li>
                <li>
                  <PhoneIcon className={styles.contactIcon} />
                  <a href="tel:+37379536508" className={styles.link}>
                    0795 36 508
                  </a>
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
          <p>© 2026 Farmavet. Toate drepturile rezervate.</p>
          <div className={styles.legal}>
            <a href="#" className={styles.link}>
              Politica de confidențialitate
            </a>
            <a href="#" className={styles.link}>
              Termeni și condiții
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
