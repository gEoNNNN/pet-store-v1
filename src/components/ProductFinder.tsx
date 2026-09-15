"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProductSummary } from "@/data/products";
import styles from "./PetTools.module.css";

type Species = "dog" | "cat" | "bovine";
type Goal = "daily" | "growth" | "energy" | "health";
type Age = "junior" | "adult" | "senior";

const ageTerms: Record<Age, string[]> = {
  junior: ["puppy", "puppies", "kitten", "junior", "growth", "growing", "1-12 months"],
  adult: ["adult", "mature"],
  senior: ["senior", "ageing", "aging", "7+", "mature"],
};

const goalTerms: Record<Goal, string[]> = {
  daily: ["complete feed", "complete food", "complete", "dry food", "canned", "pouch"],
  growth: ["puppy", "puppies", "kitten", "junior", "growth", "growing", "development"],
  energy: ["active", "energy", "performance", "sport", "working", "endurance", "vitality"],
  health: ["immunity", "digestion", "sensitive", "steril", "weight", "dental", "teeth", "joint", "mobility", "skin", "coat", "hairball", "urinary", "hypoallergenic"],
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function scoreTerms(name: string, searchable: string, terms: string[]) {
  return terms.reduce((score, term) => {
    const normalizedTerm = normalize(term);
    if (name.includes(normalizedTerm)) return score + 3;
    if (searchable.includes(normalizedTerm)) return score + 1;
    return score;
  }, 0);
}

export default function ProductFinder({ products }: { products: ProductSummary[] }) {
  const [species, setSpecies] = useState<Species>("dog");
  const [goal, setGoal] = useState<Goal>("daily");
  const [age, setAge] = useState<Age>("adult");

  const recommendations = useMemo(() => {
    if (species === "bovine") return [];
    const category = species === "dog" ? "Câini" : "Pisici";

    return products
      .filter((product) => product.category === category)
      .map((product) => {
        const name = normalize(product.name);
        const searchable = normalize(`${product.name} ${product.description} ${product.labels.join(" ")}`);
        let score = 10 + scoreTerms(name, searchable, ageTerms[age]) + scoreTerms(name, searchable, goalTerms[goal]);
        const isSnack = /snack|treat|jerky|reward|complementary/.test(searchable);
        if (goal === "daily") score += isSnack ? -8 : 3;
        if (age === "adult" && !/puppy|kitten|junior|senior/.test(searchable)) score += 1;
        return { product, score };
      })
      .sort((first, second) => second.score - first.score || first.product.name.localeCompare(second.product.name, "ro"))
      .slice(0, 6)
      .map(({ product }) => product);
  }, [age, goal, products, species]);

  return (
    <div>
      <div className={styles.quiz}>
        <fieldset className={styles.quizStep}>
          <legend><span className={styles.quizNumber}>01</span>Pentru ce animal?</legend>
          <div className={styles.options}>
            {(["dog", "cat", "bovine"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="quiz-species" checked={species === value} onChange={() => setSpecies(value)} />
                <span>{{ dog: "Câine", cat: "Pisică", bovine: "Bovine" }[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.quizStep}>
          <legend><span className={styles.quizNumber}>02</span>Care este scopul?</legend>
          <div className={styles.options}>
            {(["daily", "growth", "energy", "health"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="quiz-goal" checked={goal === value} onChange={() => setGoal(value)} />
                <span>{{ daily: "Hrană zilnică", growth: "Creștere", energy: "Energie", health: "Sănătate" }[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.quizStep}>
          <legend><span className={styles.quizNumber}>03</span>Ce vârstă are?</legend>
          <div className={styles.options}>
            {(["junior", "adult", "senior"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="quiz-age" checked={age === value} onChange={() => setAge(value)} />
                <span>{{ junior: "Junior", adult: "Adult", senior: "Senior" }[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <section className={styles.products} aria-live="polite">
        <div className={styles.productsHeader}>
          <h2>Produse recomandate</h2>
          <span className={styles.hint}>Potrivire orientativă după denumirea și descrierea produselor.</span>
        </div>
        {recommendations.length ? (
          <div className={styles.productGrid}>
            {recommendations.map((product) => (
              <article className={styles.productCard} key={product.id}>
                <Link href={product.href}>
                  <span className={styles.productImage}>
                    <Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
                  </span>
                  <span className={styles.productCopy}>
                    <small>{product.brand} · {product.category}</small>
                    <strong>{product.name}</strong>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            Catalogul actual conține produse Brit și Carnilove pentru câini, pisici și rozătoare, dar încă nu include produse pentru bovine. Contactează echipa Farmavet pentru informații despre gama disponibilă în magazin.
          </div>
        )}
      </section>
    </div>
  );
}
