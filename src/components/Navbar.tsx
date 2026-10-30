"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { CloseIcon, MenuIcon } from "./icons";
import { vetCategories } from "@/data/vetCategories";
import { useI18n } from "@/i18n/provider";
import styles from "./Navbar.module.css";

const navHrefs = ["/#home", "/#about", "/produse", "/instrumente"];

type NavbarProps = {
  activeItem?: "home" | "products" | "tools";
};

export default function Navbar({ activeItem = "home" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  const navLinks = navHrefs.map((href) => ({
    href,
    label:
      href === "/#home"
        ? t("nav.home")
        : href === "/#about"
          ? t("nav.about")
          : href === "/produse"
            ? t("nav.products")
            : t("nav.tools"),
  }));

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
        {t("common.skipToContent")}
      </a>
      <header className={`${styles.navbar} ${scrolled || menuOpen ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          <Link href="/#home" className={styles.brand} aria-label={t("nav.brandAria")} onClick={closeMenu}>
            <Logo size="lg" />
          </Link>

          <nav className={styles.desktopNav} aria-label={t("nav.mainNav")}>
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
                      onClick={(event) => {
                        // Suntem deja pe pagina asta fara filtre — du-te sus in loc sa ramai jos.
                        if (link.href === pathname && window.location.search === "") {
                          event.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                    {link.href === "/produse" && (
                      <div className={styles.dropdown}>
                        <div className={styles.dropdownPanel}>
                          <span className={styles.dropdownLabel}>{t("nav.categoriesLabel")}</span>
                          <div className={styles.dropdownGrid}>
                            {vetCategories.map((cat) => {
                              const Icon = cat.icon;
                              return (
                                <Link key={cat.id} href={cat.href} className={styles.dropdownItem}>
                                  <span className={styles.dropdownIcon} aria-hidden="true">
                                    <Icon />
                                  </span>
                                  <span className={styles.dropdownText}>
                                    <strong>{t(["vetCard", cat.id, "title"])}</strong>
                                    <small>{t(["vetCard", cat.id, "tag"])}</small>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                          <Link href="/produse" className={styles.dropdownAll}>
                            {t("nav.viewAllProducts")}
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <LanguageSwitcher />

            <Link href="/#contact" className={styles.cta}>
              {t("nav.contact")}
            </Link>
          </div>

          <button
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon className={styles.burgerIcon} /> : <MenuIcon className={styles.burgerIcon} />}
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileMenu} id="mobile-nav" aria-label={t("nav.mobileNav")}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.mobileLink} onClick={closeMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <LanguageSwitcher stacked onPick={closeMenu} />
              </li>
              <li>
                <Link href="/#contact" className={styles.mobileCta} onClick={closeMenu}>
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
