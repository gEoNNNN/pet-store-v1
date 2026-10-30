"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/provider";
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
  const { t } = useI18n();

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
        <h2>{t("foodTool.panelTitle")}</h2>
        <div className={styles.form}>
          <fieldset className={`${styles.field} ${styles.options} ${styles.optionsTwo}`}>
            <legend>{t("foodTool.animal")}</legend>
            {(["dog", "cat"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="species" value={value} checked={species === value} onChange={() => setSpecies(value)} />
                <span>{value === "dog" ? t("foodTool.dog") : t("foodTool.cat")}</span>
              </label>
            ))}
          </fieldset>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>{t("foodTool.weight")}</span>
              <input type="number" min="0.5" max="120" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
            </label>

            <label className={styles.field}>
              <span>{t("foodTool.age")}</span>
              <input type="number" min="0.1" max="25" step="0.1" value={age} onChange={(event) => setAge(Number(event.target.value))} />
              <small className={styles.hint}>{t("foodTool.ageHint")}</small>
            </label>
          </div>

          <fieldset className={`${styles.field} ${styles.options}`}>
            <legend>{t("foodTool.activity")}</legend>
            {(["low", "normal", "high"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="activity" value={value} checked={activity === value} onChange={() => setActivity(value)} />
                <span>{{ low: t("foodTool.low"), normal: t("foodTool.normal"), high: t("foodTool.high") }[value]}</span>
              </label>
            ))}
          </fieldset>

          <label className={styles.field}>
            <span>{t("foodTool.energy")}</span>
            <input type="number" min="100" max="700" step="1" value={energyDensity} onChange={(event) => setEnergyDensity(Number(event.target.value))} />
            <small className={styles.hint}>{t("foodTool.energyHint")}</small>
          </label>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <span className={styles.resultLabel}>{t("foodTool.resultLabel")}</span>
        <strong className={styles.resultValue}>{result.grams} <small>{t("foodTool.gramsPerDay")}</small></strong>
        <div className={styles.resultGrid}>
          <div><span>{t("foodTool.energyShort")}</span><strong>{result.calories} {t("foodTool.kcalPerDay")}</strong></div>
          <div><span>{t("foodTool.portioning")}</span><strong>{t("foodTool.mealsX", { meals: result.meals, grams: result.gramsPerMeal })}</strong></div>
        </div>
        <p className={styles.disclaimer}>{t("foodTool.disclaimer")}</p>
        <div className={styles.sourceLinks}>
          <a href="https://vmc.vet.osu.edu/services/companion-animal-nutrition-support-service" target="_blank" rel="noreferrer">{t("foodTool.sourceRer")}</a>
          <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="noreferrer">{t("foodTool.sourceWsava")}</a>
        </div>
      </aside>
    </div>
  );
}
