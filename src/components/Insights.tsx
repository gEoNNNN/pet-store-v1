import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon } from "./icons";
import styles from "./Insights.module.css";

const articles = [
  {
    tag: "Expertiză",
    title: "Cum alegi produsele veterinare potrivite",
    description: "Repere simple pentru alegeri responsabile, adaptate fiecărei specii.",
    image: "/news1.jpg",
  },
  {
    tag: "Nutriție",
    title: "O alimentație echilibrată începe cu nevoile reale",
    description: "Descoperă ce contează atunci când construiești o rutină de nutriție.",
    image: "/news2.jpg",
  },
  {
    tag: "Prevenție",
    title: "Îngrijirea constantă susține sănătatea pe termen lung",
    description: "Prevenția și monitorizarea atentă fac diferența în fiecare etapă.",
    image: "/news3.jpg",
  },
];

export default function Insights() {
  return (
    <section className={styles.section} aria-labelledby="insights-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <div>
            <p>Noutăți și informații</p>
            <h2 id="insights-heading">Resurse pentru o îngrijire mai bună</h2>
          </div>
          <Link href="/produse" className={styles.headerLink}>
            Vezi portofoliul
            <ArrowRightIcon />
          </Link>
        </Reveal>

        <div className={styles.grid}>
          {articles.map((article, index) => (
            <Reveal delay={index * 100} key={article.title}>
              <article className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 720px) 100vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.content}>
                  <span className={styles.tag}>{article.tag}</span>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <Link href="/produse" className={styles.link}>
                    Citește mai mult
                    <ArrowRightIcon />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
