"use client";

import { useMemo, useState } from "react";
import styles from "./PetTools.module.css";

type Species = "dog" | "cat";

type HealthLevel = {
  label: string;
  tone: "low" | "mid" | "high";
  color: string;
  advice: string;
};

const bcsToHealth: Record<number, HealthLevel> = {
  1: { label: "Risc ridicat — subponderal sever", tone: "low", color: "#d56955", advice: "Animalul necesită suplimentare nutritivă și evaluare veterinară urgentă." },
  2: { label: "Risc ridicat — subponderal", tone: "low", color: "#d56955", advice: "Animalul necesită un plan de câștig ponderal supravegheat." },
  3: { label: "Atenție — subponderal", tone: "low", color: "#d3a541", advice: "Crește ușor porția și monitorizează greutatea săptămânal." },
  4: { label: "Aproape de ideal", tone: "mid", color: "#3ea66b", advice: "Menține rutina actuală și verifică periodic condiția corporală." },
  5: { label: "Nivel de sănătate optim", tone: "high", color: "#2f8b61", advice: "Condiție corporală ideală. Continuă cu rutina și exercițiul actual." },
  6: { label: "Aproape de ideal — ușor peste", tone: "mid", color: "#d3a541", advice: "Reduce ușor porția și crește activitatea fizică." },
  7: { label: "Atenție — supraponderal", tone: "low", color: "#d3a541", advice: "Implementează un plan de reducere ponderală treptată." },
  8: { label: "Risc ridicat — obezitate", tone: "low", color: "#d56955", advice: "Necesită plan nutrițional structurat și evaluare veterinară." },
  9: { label: "Risc ridicat — obezitate severă", tone: "low", color: "#d56955", advice: "Consultă medicul veterinar pentru un plan de slăbire supervizat." },
};

export default function HealthLevelCalculator() {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState(24);
  const [bcs, setBcs] = useState(5);

  const result = useMemo(() => {
    const safeWeight = Math.min(120, Math.max(0.5, weight || 0.5));
    const ideal = safeWeight / (1 + (bcs - 5) * 0.1);
    const minimum = ideal * 0.95;
    const maximum = ideal * 1.05;
    const difference = safeWeight - ideal;
    const health = bcsToHealth[bcs];
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
        <h2>Datele animalului</h2>
        <div className={styles.form}>
          <fieldset className={`${styles.field} ${styles.options} ${styles.optionsTwo}`}>
            <legend>Animal</legend>
            {(["dog", "cat"] as const).map((value) => (
              <label className={styles.option} key={value}>
                <input type="radio" name="species" checked={species === value} onChange={() => setSpecies(value)} />
                <span>{value === "dog" ? "Câine" : "Pisică"}</span>
              </label>
            ))}
          </fieldset>

          <label className={styles.field}>
            <span>Greutate actuală (kg)</span>
            <input type="number" min="0.5" max="120" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
          </label>

          <label className={styles.field}>
            <span className={styles.rangeHeader}><span>Scor corporal BCS (1–9)</span><strong>{bcs}/9</strong></span>
            <input type="range" min="1" max="9" step="1" value={bcs} onChange={(event) => setBcs(Number(event.target.value))} />
            <small className={styles.hint}>La 4–5/9 coastele se simt ușor, talia este vizibilă de sus, iar abdomenul este ridicat lateral.</small>
          </label>
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <span className={styles.resultLabel}>{species === "dog" ? "Evaluare câine" : "Evaluare pisică"}</span>

        <div className={styles.healthScore}>
          <span className={styles.healthRing} style={{ borderColor: result.health.color }}>
            <strong>{result.score}</strong>
            <small>/100</small>
          </span>
          <div className={styles.healthCopy}>
            <strong style={{ color: result.health.color }}>{result.health.label}</strong>
            <span>{result.health.advice}</span>
          </div>
        </div>

        <div className={styles.conditionBar} aria-hidden="true" />
        <div className={styles.conditionMarker} style={{ marginLeft: `${result.marker}%` }} aria-hidden="true" />
        <div className={styles.conditionLabels}><span>Subponderal</span><span>Ideal</span><span>Supraponderal</span></div>

        <div className={styles.resultGrid}>
          <div><span>Greutate ideală</span><strong>{result.ideal.toFixed(1)} kg</strong></div>
          <div><span>Interval recomandat</span><strong>{result.minimum.toFixed(1)}–{result.maximum.toFixed(1)} kg</strong></div>
        </div>

        <div className={styles.resultGrid}>
          <div><span>Diferență estimată</span><strong>{Math.abs(result.difference).toFixed(1)} kg {result.difference > 0.1 ? "de redus" : result.difference < -0.1 ? "de câștigat" : "de menținut"}</strong></div>
          <div><span>Scor BCS</span><strong>{bcs}/9</strong></div>
        </div>

        <p className={styles.disclaimer}>
          Aceasta nu este o diagnoză. Estimarea folosește scorul corporal BCS, unde fiecare punct față de 5/9 reprezintă aproximativ 10%. Confirmă evaluarea prin examinare veterinară, mai ales la pui, animale gestante sau cu afecțiuni.
        </p>
        <div className={styles.sourceLinks}>
          <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="noreferrer">Scala BCS WSAVA</a>
          <a href="https://vcahospitals.com/know-your-pet/body-condition-scores" target="_blank" rel="noreferrer">Explicația BCS</a>
        </div>
      </aside>
    </div>
  );
}
