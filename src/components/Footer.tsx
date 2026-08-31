import Logo from "./Logo";
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

const exploreLinks = [
  { label: "Acasă", href: "#home" },
  { label: "Produse", href: "#products" },
  { label: "Despre Noi", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const categoryLinks = [
  { label: "Nutriție pentru Animale", href: "#products" },
  { label: "Îngrijire Veterinară", href: "#products" },
  { label: "Suplimente pentru Animale", href: "#products" },
  { label: "Toate Produsele", href: "#products" },
];

const socials = [
  { icon: FacebookIcon, label: "NovaVet pe Facebook", href: "#" },
  { icon: InstagramIcon, label: "NovaVet pe Instagram", href: "#" },
  { icon: XSocialIcon, label: "NovaVet pe X", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <Reveal>
          <div className={styles.brand}>
            <Logo variant="light" />
            <p className={styles.brandText}>
              O farmacie veterinară modernă ce oferă produse certificate,
              consultanță profesională și servicii pline de grijă pentru
              animale și oamenii care le iubesc.
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
          </div>
        </Reveal>

        <Reveal delay={120}>
          <nav className={styles.col} aria-label="Navigare subsol">
            <h2 className={styles.colTitle}>Explorează</h2>
            <ul className={styles.linkList}>
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal delay={200}>
          <nav className={styles.col} aria-label="Categorii de produse">
            <h2 className={styles.colTitle}>Produse</h2>
            <ul className={styles.linkList}>
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal delay={280}>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>Contact</h2>
            <ul className={styles.contactList}>
              <li>
                <MapPinIcon className={styles.contactIcon} />
                <span>Bulevardul Muncii 124, Cluj-Napoca</span>
              </li>
              <li>
                <PhoneIcon className={styles.contactIcon} />
                <a href="tel:+40745123456" className={styles.link}>
                  +40 745 123 456
                </a>
              </li>
              <li>
                <MailIcon className={styles.contactIcon} />
                <a href="mailto:hello@novavet.com" className={styles.link}>
                  hello@novavet.com
                </a>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottom}`}>
          <p>© 2026 NovaVet. Toate drepturile rezervate.</p>
          <div className={styles.legal}>
            <a href="#" className={styles.link}>
              Politica de Confidențialitate
            </a>
            <a href="#" className={styles.link}>
              Termeni și Condiții
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
