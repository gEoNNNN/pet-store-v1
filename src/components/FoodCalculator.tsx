"use client";

import { useMemo, useState } from "react";
import styles from "./PetTools.module.css";

type Species = "dog" | "cat";
type Activity = "low" | "normal" | "high";

function getFactor(species: Species, age: number, activity: Activity) {
  if (age < 1) {
    if (species === "dog") return age < 0.34 ? 3 : 2;
    return 2.5;
  }

  const isSenior = species === "dog" ? age >= 8 : age >= 10;
  if (isSenior) {
    return species === "dog"
      ? { low: 1.1, normal: 1.2, high: 1.4 }[activity]
      : { low: 1, normal: 1.1, high: 1.3 }[activity];
  }

  return species === "dog"
    ? { low: 1.2, normal: 1.6, high: 2 }[activity]
    : { low: 1, normal: 1.2, high: 1.4 }[activity];
}

export default function FoodCalculator() {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState(10);
  const [age, setAge] = useState(3);
  const [activity, setActivity] = useState<Activity>("normal");
  const [energyDensity, setEnergyDensity] = useState(380);

  const result = useMemo(() => {
    const safeWeight = Math.min(120, Math.max(0.5, weight || 0.5));
    const safeAge = Math.min(25, Math.max(0.1, age || 0.1));
    const safeDensity = Math.min(700, Math.max(100, energyDensity || 380));
    const rer = 70 * safeWeight ** 0.75;
    const calories = rer * getFactor(species, safeAge, activity);
    const grams = (calories / safeDensity) * 100;
    const meals = safeAge < 1 ? 3 : 2;
    return {
      calories: Math.round(calories),
      grams: Math.round(grams),
      meals,
      gramsPerMeal: Math.round(grams / meals),
    };
  }, [activity, age, energyDensity, species, weight]);

  return (
    <div className={styles.calculator}>
      <div className={styles.panel}>
        <h2>Datele animalului</h2>
        <div className={styles.form}>
          <fieldset className={`${styles.field} ${styles.options} ${styles.optionsTwo}`}>
            <legend>Animal</legend>
            {(["dog", "cat"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="species" value={value} checked={species === value} onChange={() => setSpecies(value)} />
                <span>{value === "dog" ? "Câine" : "Pisică"}</span>
              </label>
            ))}
          </fieldset>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>Greutate (kg)</span>
              <input type="number" min="0.5" max="120" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
            </label>

            <label className={styles.field}>
              <span>Vârstă (ani)</span>
              <input type="number" min="0.1" max="25" step="0.1" value={age} onChange={(event) => setAge(Number(event.target.value))} />
              <small className={styles.hint}>Ex: 0,5 ani pentru 6 luni</small>
            </label>
          </div>

          <fieldset className={`${styles.field} ${styles.options}`}>
            <legend>Nivel de activitate</legend>
            {(["low", "normal", "high"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="activity" value={value} checked={activity === value} onChange={() => setActivity(value)} />
                <span>{{ low: "Scăzută", normal: "Normală", high: "Ridicată" }[value]}</span>
              </label>
            ))}
          </fieldset>

          <label className={styles.field}>
            <span>Energia hranei (kcal/100 g)</span>
            <input type="number" min="100" max="700" step="1" value={energyDensity} onChange={(event) => setEnergyDensity(Number(event.target.value))} />
            <small className={styles.hint}>Valoarea se găsește pe ambalaj. Am completat orientativ 380 kcal/100 g.</small>
          </label>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <span className={styles.resultLabel}>Necesar zilnic estimat</span>
        <strong className={styles.resultValue}>{result.grams} <small>grame/zi</small></strong>
        <div className={styles.resultGrid}>
          <div><span>Energie</span><strong>{result.calories} kcal/zi</strong></div>
          <div><span>Porționare</span><strong>{result.meals} mese × {result.gramsPerMeal} g</strong></div>
        </div>
        <p className={styles.disclaimer}>
          Estimarea pornește de la formula RER = 70 × kg⁰·⁷⁵ și este un punct de plecare. Necesarul real poate varia considerabil în funcție de sterilizare, rasă, stare corporală și sănătate. Ajustează porția împreună cu medicul veterinar.
        </p>
        <div className={styles.sourceLinks}>
          <a href="https://vmc.vet.osu.edu/services/companion-animal-nutrition-support-service" target="_blank" rel="noreferrer">Sursa formulei RER</a>
          <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="noreferrer">Ghidurile WSAVA</a>
        </div>
      </aside>
    </div>
  );
}
