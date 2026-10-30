"use client";

import Reveal from "./Reveal";
import {
  TestimonialsColumn,
  type Testimonial,
} from "./ui/testimonials-columns-1";
import { useI18n } from "@/i18n/provider";
import styles from "./Testimonials.module.css";

const reviewMeta = [
  {
    name: "Ștefan Crețu",
    initials: "ȘC",
    image: "/img/reviews/client1.png",
  },
  {
    name: "Veaceslav",
    initials: "V",
    image: "/img/reviews/client2.png",
  },
  {
    name: "Victor Pîslaru",
    initials: "VP",
    image: "/img/reviews/client3.png",
  },
  {
    name: "Nicolai Demeaniuc",
    initials: "ND",
    image: "/img/reviews/client4.png",
  },
  {
    name: "Constantin Sirbu",
    initials: "CS",
    image: "/img/reviews/client5.png",
  },
  {
    name: "Evghenia Zeleniuc",
    initials: "EZ",
    image: "/img/reviews/client6.png",
  },
  {
    name: "Mihail Amurov",
    initials: "MA",
    image: "/img/reviews/client7.png",
  },
  {
    name: "Veaceslav Grigoriev",
    initials: "VG",
    image: "/img/reviews/client8.png",
  },
];

export default function Testimonials() {
  const { t } = useI18n();

  const testimonials: Testimonial[] = reviewMeta.map((meta, index) => ({
    ...meta,
    role: t(["testimonials", "reviews", String(index), "role"]),
    date: t(["testimonials", "reviews", String(index), "date"]),
    text: t(["testimonials", "reviews", String(index), "text"]),
  }));

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6);

  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <h2 id="testimonials-heading">
            {t("testimonials.titleTop")} <em>{t("testimonials.titleEm")}</em>
          </h2>
          <div className={styles.rating}>
            <span className={styles.ratingScore}>4,8</span>
            <span className={styles.ratingStars} aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} viewBox="0 0 24 24">
                  <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.3 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
                </svg>
              ))}
            </span>
            <span className={styles.ratingLabel}>{t("testimonials.ratingLabel")}</span>
          </div>
          <p className={styles.intro}>{t("testimonials.intro")}</p>
          <a
            href="https://maps.app.goo.gl/zbrmi44MwjviSwvc6"
            target="_blank"
            rel="noreferrer"
            className={styles.googleLink}
          >
            {t("testimonials.mapLink")}
          </a>
        </Reveal>

        <div className={styles.columns}>
          <TestimonialsColumn testimonials={firstColumn} duration={17} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={21}
            className={styles.secondColumn}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={18}
            className={styles.thirdColumn}
          />
        </div>
      </div>
    </section>
  );
}
