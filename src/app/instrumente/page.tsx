import type { Metadata } from "next";
import ToolsHero from "@/components/ToolsHero";
import ToolsSection from "@/components/ToolsSection";
import FoodCalculator from "@/components/FoodCalculator";
import HealthLevelCalculator from "@/components/HealthLevelCalculator";
import ProductFinder from "@/components/ProductFinder";
import Reveal from "@/components/Reveal";
import T from "@/i18n/T";
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
              <span className={styles.kicker}><T k="instrumente.food.kicker" /></span>
              <h2 className={styles.title} id="calculator-hrana-heading">
                <T k="instrumente.food.title" />
              </h2>
              <p className={styles.description}>
                <T k="instrumente.food.description" />
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
              <span className={styles.kicker}><T k="instrumente.health.kicker" /></span>
              <h2 className={styles.title} id="nivel-sanatate-heading">
                <T k="instrumente.health.title" />
              </h2>
              <p className={styles.description}>
                <T k="instrumente.health.description" />
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
              <span className={styles.kicker}><T k="instrumente.finder.kicker" /></span>
              <h2 className={styles.title} id="recomandare-produse-heading">
                <T k="instrumente.finder.title" />
              </h2>
              <p className={styles.description}>
                <T k="instrumente.finder.description" />
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
