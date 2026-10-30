"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/provider";
import styles from "./PetTools.module.css";

type Species = "dog" | "cat";

// Tonusul și culoarea rămân în cod; textele vine din dicționar (bcsTool.levels).
const bcsToTone: Record<number, { tone: "low" | "mid" | "high"; color: string }> = {
  1: { tone: "low", color: "#d56955" },
  2: { tone: "low", color: "#d56955" },
  3: { tone: "low", color: "#d3a541" },
  4: { tone: "mid", color: "#3ea66b" },
  5: { tone: "high", color: "#2f8b61" },
  6: { tone: "mid", color: "#d3a541" },
  7: { tone: "low", color: "#d3a541" },
  8: { tone: "low", color: "#d56955" },
  9: { tone: "low", color: "#d56955" },
};

export default function HealthLevelCalculator() {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState(24);
  const [bcs, setBcs] = useState(5);
  const { t } = useI18n();

  const result = useMemo(() => {
    const safeWeight = Math.min(120, Math.max(0.5, weight || 0.5));
    const ideal = safeWeight / (1 + (bcs - 5) * 0.1);
    const minimum = ideal * 0.95;
    const maximum = ideal * 1.05;
    const difference = safeWeight - ideal;
    const health = bcsToTone[bcs];
    const score = Math.round(100 - Math.abs(bcs - 5) * 12);
    return {
      ideal,
      minimum,
      maximum,
      difference,
      marker: ((bcs - 1) / 8) * 100,
      health,
      score: Math.max(20, score),
    };
  }, [bcs, weight]);

  return (
    <div className={styles.calculator}>
      <div className={styles.panel}>
        <h2>{t("foodTool.panelTitle")}</h2>
        <div className={styles.form}>
          <fieldset className={`${styles.field} ${styles.options} ${styles.optionsTwo}`}>
            <legend>{t("foodTool.animal")}</legend>
            {(["dog", "cat"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="species" checked={species === value} onChange={() => setSpecies(value)} />
                <span>{value === "dog" ? t("foodTool.dog") : t("foodTool.cat")}</span>
              </label>
            ))}
          </fieldset>

          <label className={styles.field}>
            <span>{t("bcsTool.weightNow")}</span>
            <input type="number" min="0.5" max="120" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
          </label>

          <label className={styles.field}>
            <span className={styles.rangeHeader}><span>{t("bcsTool.bcsLegend")}</span><strong>{bcs}/9</strong></span>
            <input type="range" min="1" max="9" step="1" value={bcs} onChange={(event) => setBcs(Number(event.target.value))} />
            <small className={styles.hint}>{t("bcsTool.bcsHint")}</small>
          </label>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <span className={styles.resultLabel}>{species === "dog" ? t("bcsTool.evalDog") : t("bcsTool.evalCat")}</span>

        <div className={styles.healthScore}>
          <span className={styles.healthRing} style={{ borderColor: result.health.color }}>
            <strong>{result.score}</strong>
            <small>/100</small>
          </span>
          <div className={styles.healthCopy}>
            <strong style={{ color: result.health.color }}>{t(["bcsTool", "levels", String(bcs), "label"])}</strong>
            <span>{t(["bcsTool", "levels", String(bcs), "advice"])}</span>
          </div>
        </div>

        <div className={styles.conditionBar} aria-hidden="true" />
        <div className={styles.conditionMarker} style={{ marginLeft: `${result.marker}%` }} aria-hidden="true" />
        <div className={styles.conditionLabels}><span>{t("bcsTool.underweight")}</span><span>{t("bcsTool.ideal")}</span><span>{t("bcsTool.overweight")}</span></div>

        <div className={styles.resultGrid}>
          <div><span>{t("bcsTool.idealWeight")}</span><strong>{result.ideal.toFixed(1)} kg</strong></div>
          <div><span>{t("bcsTool.recommendedRange")}</span><strong>{result.minimum.toFixed(1)}–{result.maximum.toFixed(1)} kg</strong></div>
        </div>

        <div className={styles.resultGrid}>
          <div><span>{t("bcsTool.difference")}</span><strong>{Math.abs(result.difference).toFixed(1)} kg {result.difference > 0.1 ? t("bcsTool.toLose") : result.difference < -0.1 ? t("bcsTool.toGain") : t("bcsTool.toMaintain")}</strong></div>
          <div><span>{t("bcsTool.bcsScore")}</span><strong>{bcs}/9</strong></div>
        </div>

        <p className={styles.disclaimer}>{t("bcsTool.disclaimer")}</p>
        <div className={styles.sourceLinks}>
          <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="noreferrer">{t("bcsTool.sourceScale")}</a>
          <a href="https://vcahospitals.com/know-your-pet/body-condition-scores" target="_blank" rel="noreferrer">{t("bcsTool.sourceExpl")}</a>
        </div>
      </aside>
    </div>
  );
}
