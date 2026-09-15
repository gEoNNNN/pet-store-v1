"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CloseIcon, MenuIcon } from "./icons";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Acasa", href: "/#home" },
  { label: "Despre noi", href: "/#about" },
  { label: "Produse", href: "/produse" },
  { label: "Instrumente", href: "/instrumente" },
];

type NavbarProps = {
  activeItem?: "home" | "products" | "tools";
};

export default function Navbar({ activeItem = "home" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      const pastTop = window.scrollY > 16;
      // Shrink while scrolling…
      setScrolled(pastTop);
      // …and expand back after 1s without scrolling.
      if (idleTimer) clearTimeout(idleTimer);
      if (pastTop) {
        idleTimer = setTimeout(() => setScrolled(false), 1000);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a href="#main" className="skip-link">
        Sari la conținut
      </a>
      <header className={`${styles.navbar} ${scrolled || menuOpen ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          <Link href="/#home" className={styles.brand} aria-label="Farmavet — pagina principală" onClick={closeMenu}>
            <Logo />
          </Link>

          <nav className={styles.desktopNav} aria-label="Navigare principală">
            <ul>
              {navLinks.map((link) => {
                const isActive =
                  (activeItem === "products" && link.href === "/produse") ||
                  (activeItem === "tools" && link.href === "/instrumente");
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href="/#contact" className={styles.cta}>
            Contactează-ne
          </Link>

          <button
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon className={styles.burgerIcon} /> : <MenuIcon className={styles.burgerIcon} />}
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileMenu} id="mobile-nav" aria-label="Navigare mobilă">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.mobileLink} onClick={closeMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/#contact" className={styles.mobileCta} onClick={closeMenu}>
                  Contactează-ne
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
