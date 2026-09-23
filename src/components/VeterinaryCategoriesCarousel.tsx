"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import styles from "./VeterinaryCategoriesCarousel.module.css";

interface VeterinaryCategory {
  id: string;
  number: string;
  tag1: string;
  tag2: string;
  title: string;
  imageUrl: string;
  href: string;
}

const categories: VeterinaryCategory[] = [
  {
    id: "antibacteriene",
    number: "01",
    tag1: "FARMA",
    tag2: "TRATAMENTE",
    title: "Antibacteriene și antifungice",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "antiparazitare",
    number: "02",
    tag1: "PREVENȚIE",
    tag2: "PARAZITOLOGIE",
    title: "Antiparazitare interne și externe",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "antiinflamatoare",
    number: "03",
    tag1: "TERAPIE",
    tag2: "RECUPERARE",
    title: "Antiinflamatoare și analgezice",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "antiseptice",
    number: "04",
    tag1: "CHIRURGIE",
    tag2: "CICATRIZARE",
    title: "Antiseptice și produse pentru îngrijirea rănilor",
    imageUrl: "https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "tonice",
    number: "05",
    tag1: "METABOLISM",
    tag2: "HIDRATARE",
    title: "Tonice și produse pentru rehidratare",
    imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "reproductie",
    number: "06",
    tag1: "ZOOTEHNIE",
    tag2: "REPRODUCȚIE",
    title: "Produse pentru reproducție și sănătatea glandei mamare",
    imageUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "vaccinuri",
    number: "07",
    tag1: "IMUNOLOGIE",
    tag2: "BIOLOGICE",
    title: "Vaccinuri și alte produse biologice",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "imunostimulatoare",
    number: "08",
    tag1: "PROFILAXIE",
    tag2: "IMUNITATE",
    title: "Imunostimulatoare",
    imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "vitamine",
    number: "09",
    tag1: "NUTRIȚIE",
    tag2: "PREMIXURI",
    title: "Vitamine, minerale și premixuri",
    imageUrl: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "igiena",
    number: "10",
    tag1: "BIOSECURITATE",
    tag2: "DEZINFECȚIE",
    title: "Curățare, igienă și dezinfecție",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
  {
    id: "dezinsectie",
    number: "11",
    tag1: "PROTECȚIE",
    tag2: "DERATIZARE",
    title: "Dezinsecție și deratizare",
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=700&q=80",
    href: "/produse",
  },
];

export default function VeterinaryCategoriesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollBy = (offset: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Auto-scroll every 3 seconds to reveal the next category
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;

      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 16 : 300;

      // When reaching near the end, loop back to the start
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className={styles.section} id="produse-veterinare" aria-labelledby="vet-categories-heading">
      <div className="container">
        <div
          className={styles.board}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Top Header */}
          <Reveal className={styles.header}>
            <div>
              <h2 className={styles.title} id="vet-categories-heading">
                Soluții veterinare
                <br />
                <em>și produse autorizate</em>
              </h2>
            </div>

            <div className={styles.headerAside}>
              <p className={styles.sub}>
                Portofoliu autorizat de medicamente de uz veterinar, antiparazitare, dezinfectanți,
                suplimente și produse biologice. Asigurăm trasabilitate completă și suport de specialitate
                pentru cabinete, farmacii și ferme.
              </p>

              <div className={styles.actionsRow}>
                <div className={styles.pillsGroup}>
                  <Link href="/produse" className={styles.primaryPill}>
                    Vezi toate produsele
                    <ArrowUpRight />
                  </Link>
                  <Link href="/#contact" className={styles.secondaryPill}>
                    Consultanță veterinară
                    <ArrowUpRight />
                  </Link>
                </div>

                {/* Carousel Arrows */}
                <div className={styles.controls} aria-label="Navigare carusel">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(true);
                      scrollBy(-320);
                    }}
                    disabled={!canScrollLeft}
                    className={styles.controlButton}
                    aria-label="Derulează înapoi"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(true);
                      scrollBy(320);
                    }}
                    disabled={!canScrollRight}
                    className={styles.controlButton}
                    aria-label="Derulează înainte"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Carousel Track */}
          <Reveal delay={100} className={styles.carouselContainer}>
            <div ref={trackRef} className={styles.carouselTrack}>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className={styles.card}
                  title={cat.title}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={cat.imageUrl}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 600px) 80vw, 310px"
                      className={styles.cardImage}
                    />
                    <span className={styles.cardNumber}>{cat.number}</span>
                  </div>

                  <div className={styles.content}>
                    <div>
                      <div className={styles.metaRow}>
                        <span className={styles.metaItem}>{cat.tag1}</span>
                        <span className={styles.metaDivider}>|</span>
                        <span className={styles.metaItem}>{cat.tag2}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{cat.title}</h3>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardButton}>
                        Vezi produse
                        <ArrowUpRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
