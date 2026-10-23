"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Stethoscope } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";
import { vetCategories } from "@/data/vetCategories";
import styles from "./VeterinaryCategoriesGrid.module.css";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function VeterinaryCategoriesGrid() {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      transform: prefersReduced ? "translateY(0px)" : "translateY(24px)",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: {
        duration: prefersReduced ? 0.15 : 0.5,
        ease: EASE_OUT,
      },
    },
  };

  const hoverLift = prefersReduced
    ? {}
    : { transform: "translateY(-6px)", transition: { type: "spring" as const, stiffness: 400, damping: 26 } };

  return (
    <section className={styles.section} id="categorii-veterinare" aria-labelledby="vet-categories-title">
      <div className="container">
        {/* Header */}
        <Reveal className={styles.header}>
          <div>
            <h2 className={styles.title} id="vet-categories-title">
              11 categorii esențiale
              <br />
              <em>pentru sănătatea animalelor</em>
            </h2>
            <p className={styles.sub}>
              Gama completă de produse veterinare autorizate, tratamente profilactice și soluții profesionale de igienă —
              structurate compact și accesibile direct în catalog.
            </p>
          </div>

          <div className={styles.headerAside}>
            <div className={styles.headerActions}>
              <Link href="/produse" className={styles.primaryBtn}>
                Vezi toate produsele
                <ArrowUpRight />
              </Link>
              <Link href="/#contact" className={styles.secondaryBtn}>
                Consultanță veterinară
                <ArrowUpRight />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* The 12-Card Uniform Grid with Entrance & Hover Animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className={styles.grid}
        >
          {vetCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                className={styles.cardWrapper}
                whileHover={hoverLift}
              >
                <Link href={cat.href} className={styles.card} title={cat.title}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconWrap}>
                      <Icon aria-hidden="true" />
                    </div>
                    <span className={styles.cardNumber}>{cat.number}</span>
                  </div>

                  <div className={styles.cardContent}>
                    <span className={styles.cardTag}>{cat.tag}</span>
                    <h3 className={styles.cardTitle}>{cat.title}</h3>
                    <p className={styles.cardDesc}>{cat.description}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.cardCta}>
                      Vezi gama
                      <ArrowUpRight />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Card 12: Special Direct Consultation Card */}
          <motion.div
            variants={cardVariants}
            className={styles.cardWrapper}
            whileHover={hoverLift}
          >
            <div className={`${styles.card} ${styles.featuredCard}`}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconWrap}>
                  <Stethoscope aria-hidden="true" />
                </div>
                <span className={styles.cardNumber}>12</span>
              </div>

              <div className={styles.cardContent}>
                <span className={styles.cardTag}>Suport Specializat</span>
                <h3 className={styles.cardTitle}>Consultanță și rețete</h3>
                <p className={styles.cardDesc}>
                  Ai nevoie de o schemă terapeutică sau verificarea unui stoc? Medicii noștri îți oferă asistență directă.
                </p>
              </div>

              <div className={styles.cardFooter}>
                <Link href="/#contact" className={styles.cardCta}>
                  Discută cu un medic
                  <ArrowUpRight />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
