import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import styles from "./ToolsHero.module.css";

export default function ToolsHero() {
  return (
    <section className={styles.hero} aria-labelledby="tools-hero-title">
      <div className="container">
        <div className={styles.grid}>
          {/* Left Content */}
          <Reveal className={styles.content}>
            <h1 className={styles.title} id="tools-hero-title">
              Instrumente
              <br />
              <span className={styles.titleHighlight}>pentru sănătate</span>
            </h1>

            <p className={styles.sub}>
              Am creat o suită de instrumente inteligente pentru a vă ajuta să monitorizați și să optimizați starea de bine a animalului dumneavoastră de companie.
            </p>

            <div className={styles.actions}>
              <a href="#instrumente-list" className={styles.primaryButton}>
                Descopera instrumentele
                <ArrowDown />
              </a>

              <Link href="/#about" className={styles.secondaryLink}>
                Află mai multe
                <ChevronRight />
              </Link>
            </div>
          </Reveal>

          {/* Right Visual Image */}
          <Reveal delay={120} className={styles.visual}>
            <div className={styles.imageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80"
                alt="Îngrijire și evaluare veterinară pentru animale de companie"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
                className={styles.image}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
