"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/provider";
import styles from "./testimonials-columns-1.module.css";

export type Testimonial = {
  text: string;
  name: string;
  role: string;
  date: string;
  initials: string;
  image: string;
};

type TestimonialsColumnProps = {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
};

function Stars() {
  const { t } = useI18n();
  return (
    <span className={styles.stars} aria-label={t("common.starsAria")}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.3 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function TestimonialsColumn({
  className = "",
  testimonials,
  duration = 16,
}: TestimonialsColumnProps) {
  const reduceMotion = useReducedMotion();
  const repetitions = reduceMotion ? [0] : [0, 1];

  return (
    <div className={`${styles.column} ${className}`}>
      <motion.div
        animate={reduceMotion ? undefined : { translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className={styles.track}
      >
        {repetitions.map((copyIndex) => (
          <div className={styles.list} key={copyIndex} aria-hidden={copyIndex > 0}>
            {testimonials.map((testimonial) => (
              <article className={styles.card} key={`${copyIndex}-${testimonial.name}`}>
                <div className={styles.cardHead}>
                  <span className={styles.source}>Recenzie Google</span>
                  <Stars />
                </div>
                <blockquote>„{testimonial.text}”</blockquote>
                <footer className={styles.author}>
                  <span className={styles.avatar} aria-hidden="true">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="42px"
                        className={styles.avatarImage}
                      />
                    ) : (
                      testimonial.initials
                    )}
                  </span>
                  <span className={styles.authorCopy}>
                    <strong>{testimonial.name}</strong>
                    <small>{testimonial.role}</small>
                    <time>{testimonial.date}</time>
                  </span>
                </footer>
              </article>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
