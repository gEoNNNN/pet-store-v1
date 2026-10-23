"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";
import styles from "./Hero.module.css";

const heroImages = [
  { src: "/catanddog.jpg", alt: "Câine și pisică - animale de companie", size: "cover", position: "69% center" },
  { src: "/hero/img3.png", alt: "Viței - bovine", size: "70% auto", position: "center 95%" },
  { src: "/hero/img5.png", alt: "Iepure - rozătoare", size: "auto 100%", position: "center 99%" },
  { src: "/hero/img4.png", alt: "Oaie - ovine", size: "55% auto", position: "center 95%" },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycle images every 3 seconds (no text, no buttons, only the image changes)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-heading">
      {/* Background Image Carousel (Pure image transitions, no text badges, no buttons) */}
      <div className={styles.bg} aria-hidden="true">
        {heroImages.map((img, idx) => (
          <div
            key={img.src}
            className={`${styles.bgSlide} ${idx === activeIndex ? styles.bgSlideActive : ""}`}
            style={{
              backgroundImage: `url("${img.src}")`,
              backgroundSize: img.size,
              backgroundPosition: img.position,
            }}
          />
        ))}
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <Reveal delay={120}>
            <span className={styles.overline}>Farmacie & Nutriție Veterinară</span>
            <h1 className={styles.title} id="hero-heading">
              Excelență în
              <br />
              <em>sănătatea animalelor.</em>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className={styles.lede}>
              Catalog online cu produse veterinare certificate și nutriție
              echilibrată — pentru animalele de fermă și companionii de acasă.
              Răsfoiește portofoliul complet de branduri internaționale, cu
              informații detaliate pentru fiecare produs.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className={styles.actions}>
              <Link href="/produse" className={styles.btnPrimary}>
                Descoperă portofoliul
                <ArrowRightIcon className={styles.btnIcon} />
              </Link>
              <a href="#about" className={styles.btnLink}>
                Despre Farmavet
                <ChevronRightIcon className={styles.btnLinkIcon} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
