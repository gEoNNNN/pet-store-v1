import type { Metadata } from "next";
import ToolsHero from "@/components/ToolsHero";
import ToolsSection from "@/components/ToolsSection";
import FoodCalculator from "@/components/FoodCalculator";
import HealthLevelCalculator from "@/components/HealthLevelCalculator";
import ProductFinder from "@/components/ProductFinder";
import Reveal from "@/components/Reveal";
import { getProductSummaries } from "@/data/productCatalog.server";
import styles from "./InstrumentePage.module.css";

export const metadata: Metadata = {
  title: "Instrumente pentru îngrijirea animalelor | Farmavet",
  description: "Calculatoare orientative de hrană și greutate corporală, plus recomandări de produse din catalogul Farmavet.",
};

export default function ToolsPage() {
  const products = getProductSummaries();

  return (
    <main id="main">
      <ToolsHero />

      <div id="instrumente-list">
        <ToolsSection isPage={false} useAnchorLinks={true} />
      </div>

      <div className={styles.toolsWrapper}>
        {/* Tool 1: Calculator de hrană */}
        <section
          id="calculator-hrana"
          className={styles.toolSection}
          aria-labelledby="calculator-hrana-heading"
        >
          <div className="container">
            <Reveal className={styles.toolHeader}>
              <span className={styles.kicker}>Calculator nutrițional</span>
              <h2 className={styles.title} id="calculator-hrana-heading">
                Calculator de hrană
              </h2>
              <p className={styles.description}>
                Introdu greutatea, vârsta, nivelul de activitate și conținutul caloric al hranei pentru a estima porția optimă zilnică.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <FoodCalculator />
            </Reveal>

            <div className={styles.divider} />
          </div>
        </section>

        {/* Tool 2: Nivel de sănătate */}
        <section
          id="nivel-sanatate"
          className={styles.toolSection}
          aria-labelledby="nivel-sanatate-heading"
        >
          <div className="container">
            <Reveal className={styles.toolHeader}>
              <span className={styles.kicker}>Evaluare corporală</span>
              <h2 className={styles.title} id="nivel-sanatate-heading">
                Nivel de sănătate (Scor BCS)
              </h2>
              <p className={styles.description}>
                Evaluează condiția corporală actuală a animalului tău, greutatea recomandată și primește sfaturi orientative de nutriție.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <HealthLevelCalculator />
            </Reveal>

            <div className={styles.divider} />
          </div>
        </section>

        {/* Tool 3: Găsește produsul potrivit */}
        <section
          id="recomandare-produse"
          className={styles.toolSection}
          aria-labelledby="recomandare-produse-heading"
        >
          <div className="container">
            <Reveal className={styles.toolHeader}>
              <span className={styles.kicker}>Ghid de recomandare</span>
              <h2 className={styles.title} id="recomandare-produse-heading">
                Găsește produsul potrivit
              </h2>
              <p className={styles.description}>
                Răspunde la trei întrebări simple pentru a descoperi recomandări personalizate din catalogul real Farmavet.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ProductFinder products={products} />
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  );
}
